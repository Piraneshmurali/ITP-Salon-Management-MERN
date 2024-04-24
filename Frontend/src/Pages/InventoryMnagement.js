import React, { useEffect, useState } from "react";
import "./inventoryMnagement.css";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import logo from "./images/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSearch } from "react-icons/fa";

export default function InventoryMnagement() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [originalInventory, setOriginalInventory] = useState([]); // Store original inventory data

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/Product/products")
      .then((items) => {
        setInventory(items.data);
        setOriginalInventory(items.data); // Set original inventory data
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (confirmDelete) {
      axios
        .delete("http://localhost:8000/api/Product/delete/" + id)
        .then((res) => {
          console.log("Delete successful:", res);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const addProductClick = () => {
    navigate("/AddProduct");
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    filterInventory(event.target.value);
  };

  const filterInventory = (query) => {
    if (query === "") {
      // If search query is empty, display original inventory
      setInventory(originalInventory);
    } else {
      const filtered = originalInventory.filter((item) =>
        Object.keys(item).some(
          (key) =>
          key !== "rquantity" &&
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .startsWith(query.toLowerCase())
        )
      );
      setInventory(filtered);
    }
  };
  

  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/Product/products"
      );
      const inventoryData = response.data;

      const doc = new jsPDF();

      doc.addImage(logo, "PNG", 10, 5, 40, 40);

      const headerX = doc.internal.pageSize.width - 20;

      doc.setFontSize(14);
      doc.text("SALON OLEX", headerX, 20, { align: "right" });

      doc.setFontSize(12);
      doc.text("A9 Road, Chavakacheri, Jaffna", headerX, 27, {
        align: "right",
      });
      doc.setFontSize(10);
      doc.text("077-1234567/071-7654321", headerX, 32, {
        align: "right",
      });

      doc.setLineWidth(0.5);
      doc.line(8, 42, 200, 42);

      doc.setFont("bold");
      doc.setFontSize(20);
      doc.text("Inventory Report", 80, 60);
      doc.setFont("normal");

      doc.setDrawColor(0);

      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Name", dataKey: "name" },
        { header: "Type", dataKey: "type" },
        { header: "Category", dataKey: "category" },
        { header: "Date", dataKey: "date" },
        { header: "Remaining qty", dataKey: "remaning" },
        // { header: "Used qty", dataKey: "used" },
        { header: "Price", dataKey: "price" },
      ];

      const rows = inventoryData.map((inventory, index) => ({
        id: index + 1,
        name: inventory.name,
        type: inventory.type,
        category: inventory.category,
        date: inventory.date,
        remaning: inventory.rquantity,
        used: inventory.uquantity,
        price: inventory.totalPrice,
      }));

      autoTable(doc, { columns, body: rows, startY: 70 });

      doc.save("Inventory Report.pdf");
    } catch (error) {
      console.error("Error fetching or generating PDF:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="inventoryManagement">
        <div className="inventoryManagement-header">
          <div className="inventoryManagement-header-left">
            <Sidebar />
            <h1>Inventory Management</h1>
          </div>
          <div className="inventoryManagement-header-right">
            <button
              onClick={addProductClick}
              className="add-new-product-button"
            >
              Add new product
            </button>
            <button onClick={downloadPDF} className="report-button">
              Report
            </button>
          </div>
        </div>
        <div className="inventoryManagement-body">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Products Through Prices, Category And Names"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
             {/* <FaSearch className="search-icon" /> */}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Remaining qty</th>
                <th>Image</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inventory, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{inventory.name}</td>
                    <td>{inventory.type}</td>
                    <td>{inventory.category}</td>
                    <td>{inventory.date}</td>
                    <td className="inventory-cell">
                      <span
                        className="inventory-quantity"
                        style={{
                          color:
                            inventory.rquantity < 10 ? "red" : "inherit",
                        }}
                      >
                        {inventory.rquantity}
                      </span>
                      {inventory.rquantity < 10 && (
                        <span className="low-stock-message">Low Stock</span>
                      )}
                    </td>
                    <td>
                      <img
                        src={inventory.uquantity}
                        alt="Used Quantity"
                        width={100}
                        height={75}
                      />
                    </td>
                    <td>{inventory.totalPrice}</td>
                    <td>
                      <Link to={`/UpdateProduct/${inventory._id}`}>
                        <button className="inventory-table-edit-button">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={(e) =>
                          handleDelete(inventory._id, inventory.name)
                        }
                        className="inventory-table-delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
