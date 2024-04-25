import React from 'react';

import heroing from "../assets/images/product.png";  // Replace with the actual file path
import "./Products.css";

const Products = () => {
  return (
    <div className="products-container">
      <div className="container">
        <div className="product-info">
          <div className="product-image">
            <img
              src={heroing}
              alt="Bruno's Hair Wax"
              className="product-img"
            />
          </div>
          <div className="product-details">
            <h1 className="product-title">Olex's in your hands.</h1>
            <p className="product-description">
              For premium styling and hair care products, shop at Olex's Barbers. We have everything you need to look good.
            </p>
            <div className="product-buttons">
              <a href="#" className="view-products-btn">View products</a>
              <a href="#" className="corporate-sales-btn">Corporate Sales</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
