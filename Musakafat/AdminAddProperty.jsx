import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminAddProperty.css";
import MusakafatNavbar from "./MusakafatNavbar";

const API_URL = "https://localhost:7182/api/Properties";

const AdminAddProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    region: "",
    realEstateNumber: "",
    ownerName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      await axios.post(API_URL, form);

      alert("Property added successfully ✅");
      
      navigate("/admin/services");
    } catch (err) {
      console.error(err);
      alert("Error while adding property");
    }
  };

  return (
    <div className="add-property-container">
         <MusakafatNavbar />
      <h2 className="title">Add New Property</h2>

      <form className="add-property-form" onSubmit={handleSubmit}>
        <label>Property Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter property name"
          required
        />

        <label>Government Region</label>
        <input
          type="text"
          name="region"
          value={form.region}
          onChange={handleChange}
          placeholder="Beirut, Tripoli..."
          required
        />

        <label>Real Estate Number</label>
        <input
          type="text"
          name="realEstateNumber"
          value={form.realEstateNumber}
          onChange={handleChange}
          placeholder="12345"
          required
        />

        <label>Owner / Tax Payer Name</label>
        <input
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          placeholder="Owner name"
          required
        />

        <button type="submit" className="save-btn">
          Save Property
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/admin/services")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminAddProperty;