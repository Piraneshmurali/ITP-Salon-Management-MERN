const express = require("express");
const router = express.Router();
const Product = require("../models/inventoryModel");

// Validation function to check if a string is empty
const isEmpty = (str) => {
  return !str || str.trim() === '';
};

// Validation function to check if a number is valid
const isValidNumber = (num) => {
  return !isNaN(Number(num));
};

// Create API route for Create method in CRUD Operations with validation
router.post("/add", async (req, res) => {
  try {
    const { name, type, category, date, rquantity, uquantity, totalPrice } = req.body;
    // Check if required fields are present and not empty
    if (isEmpty(name) || isEmpty(type) || isEmpty(category) || isEmpty(date) || !isValidNumber(rquantity) || !isValidNumber(uquantity) || !isValidNumber(totalPrice)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const createdProduct = await Product.create({
      name,
      type,
      category,
      date,
      rquantity,
      uquantity,
      totalPrice,
    });

    console.log(createdProduct);
    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
});

// Create API route for Read method in CRUD Operations with validation
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Create API route to fetch a product by its ID with validation
router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId || !isValidNumber(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create API route for Delete method in CRUD Operations with validation
router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId || !isValidNumber(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log(deletedProduct);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Create a review for a product
router.post("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.reviews.push({ rating, comment });
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;
    await product.save();
    res.status(201).json({ success: true, message: 'Review created successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a review for a product
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    product.reviews.splice(reviewIndex, 1);
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
    product.numReviews = product.reviews.length;
    await product.save();
    res.status(200).json({ success: true, message: 'Review deleted successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create API route for get data in Update method in CRUD Operations
router.get("/update/:id", async (req, res) => {
  try {
    const upProduct = await Product.findById(req.params.id);
    if (!upProduct) {
      return res.status(404).json({ error: "Update Product not found" });
    }
    res.status(200).json(upProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        type: req.body.type,
        category: req.body.category,
        date: req.body.date,
        rquantity: req.body.rquantity,
        uquantity: req.body.uquantity,
        totalPrice: req.body.totalPrice,
      },
      { new: true } // To return the updated document
    );

    console.log(updatedProduct);
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
});

module.exports = router;
