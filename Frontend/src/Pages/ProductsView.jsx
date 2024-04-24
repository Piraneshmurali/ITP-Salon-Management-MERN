import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { FaSearch } from "react-icons/fa";
import ProductCard from "../Components/ProductCard";
import "./ProductsView.css";

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/Product/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    Object.entries(product).some(
      ([key, value]) =>
        typeof value === "string" &&
        key !== "id" && // Exclude the product ID
        (key === "name" || key === "type" || key === "totalPrice") && // Include only name, type, and price fields
        value.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  ).filter((product) => product.category !== "Equipment");

  return (
    <>
      <Navbar />
      <div className="products-view">
        <div className="search--bar">
          <input
            type="text"
            placeholder="Search Products Through Prices, Category And Names"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <FaSearch className="search--icon" />
        </div>
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
