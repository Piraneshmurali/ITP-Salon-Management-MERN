import React, { useState } from "react";
import "./addProduct.css";
import close from "./images/close.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [rquantity, setRquantity] = useState("");
  const [uquantity, setUquantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inventoryData = {
      name,
      type,
      category,
      date,
      rquantity,
      uquantity,
      totalPrice,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/Product/add",
        inventoryData
      );

      console.log(inventoryData);

      if (response.status === 201) {
        console.log(response);
        navigate("/InventoryMnagement");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const navigteBack = () => {
    navigate(-1);
  };
  return (
    <div className="addProduct-page">
      <div className="addProduct-container">
        <form onSubmit={handleSubmit}>
          <button className="close-button">
            <img onClick={navigteBack} className="close-icon" src={close} />
          </button>

          <h1>Add Products</h1>

          <div className="addProduct-input-box">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className="addProduct-select-box">
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Not Selected">Select type</option>
              <option value="Mens">Mens</option>
              <option value="Womens">Womens</option>
              <option value="Kids">Kids</option>
              <option value="Hair coloring products">
                Hair coloring products
              </option>
              <option value="Furniture">Furniture</option>
              <option value="Brushes">Brushes</option>
            </select>
          </div>

          <div className="addProduct-select-box">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Not Selected">Select Category</option>
              <option value="Product">Product</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="addProduct-date-input">
            <label htmlFor="date">Date</label> <br />
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="addProduct-input-box">
            <input
              type="text"
              id="rquantity"
              name="rquantity"
              value={rquantity}
              onChange={(e) => setRquantity(e.target.value)}
              required
            />
            <label htmlFor="rquantity">Remaining quantity</label>
          </div>

          <div className="addProduct-input-box">
            <input
              type="text"
              id="uquantity"
              name="uquantity"
              value={uquantity}
              onChange={(e) => setUquantity(e.target.value)}
              required
            />
            <label htmlFor="uquantity">Used quantity</label>
          </div>

          <div className="addProduct-input-box">
            <input
              type="text"
              id="totalPrice"
              name="totalPrice"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
            />
            <label htmlFor="totalPrice">Total Price</label>
          </div>

          <button type="submit" className="addProduct-button">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
