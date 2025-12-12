import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AdminAddProperty.css"; 
import MusakafatNavbar from "./MusakafatNavbar";

const API_URL = "https://localhost:7182/api/Properties";

const AdminEditProperty = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    region: "",
    realEstateNumber: "",
    ownerName: "",
  });

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setForm({
          name: res.data.name,
          region: res.data.region,
          realEstateNumber: res.data.realEstateNumber,
          ownerName: res.data.ownerName,
        });
      } catch (err) {
        console.error("Error loading property", err);
        alert("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/${id}`, form);
      alert("Property updated successfully ✅");
      navigate("/admin/services/musakafat");
    } catch (err) {
      console.error(err);
      alert("Error while updating property");
    }
  };

  if (loading) {
    return <div className="add-property-container">Loading...</div>;
  }

  return (
    <div className="add-property-container">
         <MusakafatNavbar />
      <h2 className="title">Edit Property</h2>

      <form className="add-property-form" onSubmit={handleSubmit}>
        <label>Property Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Government Region</label>
        <input
          type="text"
          name="region"
          value={form.region}
          onChange={handleChange}
          required
        />

        <label>Real Estate Number</label>
        <input
          type="text"
          name="realEstateNumber"
          value={form.realEstateNumber}
          onChange={handleChange}
          required
        />

        <label>Owner / Tax Payer Name</label>
        <input
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          required
        />

        <button type="submit" className="save-btn">
          Save Changes
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/admin/services/musakafat")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminEditProperty;