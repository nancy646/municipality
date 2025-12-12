import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminAddTax.css";
import MusakafatNavbar from "./MusakafatNavbar";

const API_PROPERTIES = "https://localhost:7182/api/Properties";
const API_TAXES = "https://localhost:7182/api/Taxes";

const AdminAddTax = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    propertyId: "",
    taxYear: "",
    taxableValue: "",
    baseTax: 0,
    surcharge: 0,
    totalTax: 0
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const res = await axios.get(API_PROPERTIES);
    setProperties(res.data);
  };

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };

    
    const taxable = parseFloat(newForm.taxableValue || 0);
    const surcharge = parseFloat(newForm.surcharge || 0);

    newForm.baseTax = taxable * 0.10; 
    newForm.totalTax = newForm.baseTax + surcharge;

    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_TAXES, form);
      alert("Tax added successfully!");
      navigate("/admin/services/musakafat");
    } catch (err) {
      console.error(err);
      alert("Error while saving tax.");
    }
  };

  return (
    <div className="tax-container">
         <MusakafatNavbar />
      <h2>Add Tax Obligation</h2>

      <form onSubmit={handleSubmit} className="tax-form">
        <label>Property</label>
        <select
          name="propertyId"
          value={form.propertyId}
          onChange={handleChange}
          required
        >
          <option value="">Select property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.realEstateNumber}
            </option>
          ))}
        </select>

        <label>Tax Year</label>
        <input
          type="number"
          name="taxYear"
          value={form.taxYear}
          onChange={handleChange}
          required
        />

        <label>Taxable Value (L.L)</label>
        <input
          type="number"
          name="taxableValue"
          value={form.taxableValue}
          onChange={handleChange}
          required
        />

        <label>Base Tax (10%)</label>
        <input type="number" value={form.baseTax} disabled />

        <label>Surcharge (L.L)</label>
        <input
          type="number"
          name="surcharge"
          value={form.surcharge}
          onChange={handleChange}
        />

        <label>Total Tax (L.L)</label>
        <input type="number" value={form.totalTax} disabled />

        <button className="save-btn">Save Tax</button>
      </form>
    </div>
  );
};

export default AdminAddTax;