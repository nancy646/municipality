import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminRecordPayments.css";
import MusakafatNavbar from "./MusakafatNavbar";

const API_PROPERTIES = "https://localhost:7182/api/Properties";
const API_TAXES = "https://localhost:7182/api/Taxes";
const API_PAYMENTS = "https://localhost:7182/api/Payments";

const AdminRecordPayments = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedTax, setSelectedTax] = useState(null);

  const [form, setForm] = useState({
    taxId: "",
    paymentDate: "",
    amount: "",
    method: "",
    reference: "",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const res = await axios.get(API_PROPERTIES);
    setProperties(res.data);
  };

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value;
    setSelectedPropertyId(propertyId);
    setSelectedTax(null);
    setForm({ ...form, taxId: "" });

    if (!propertyId) {
      setTaxes([]);
      return;
    }

    const res = await axios.get(`${API_TAXES}/property/${propertyId}`);
    setTaxes(res.data);
  };

  const handleTaxChange = (e) => {
    const taxId = e.target.value;
    const found = taxes.find((t) => t.id === parseInt(taxId));
    setSelectedTax(found || null);
    setForm({ ...form, taxId });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      taxId: parseInt(form.taxId),
      paymentDate: form.paymentDate,
      amount: parseFloat(form.amount),
      method: form.method,
      reference: form.reference,
    };

    try {
      await axios.post(API_PAYMENTS, payload);
      alert("Payment recorded successfully ✅");
      navigate("/admin/services/musakafat");
    } catch (err) {
      console.error(err);
      alert("Error while recording payment");
    }
  };

  return (
    <div className="record-container">
       <MusakafatNavbar />
      <h2>Record Tax Payment</h2>

      <form className="record-form" onSubmit={handleSubmit}>
        <label>Property</label>
        <select
          value={selectedPropertyId}
          onChange={handlePropertyChange}
          required
        >
          <option value="">Select property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.realEstateNumber}
            </option>
          ))}
        </select>

        <label>Tax Obligation (Year)</label>
        <select name="taxId" value={form.taxId} onChange={handleTaxChange} required>
          <option value="">Select year</option>
          {taxes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.taxYear} — Total: {t.totalTax}
            </option>
          ))}
        </select>

        {selectedTax && (
          <div className="tax-info">
            <div>Tax Year: {selectedTax.taxYear}</div>
            <div>Taxable Value: {selectedTax.taxableValue}</div>
            <div>Total Tax: {selectedTax.totalTax}</div>
          </div>
        )}

        <label>Payment Date</label>
        <input
          type="date"
          name="paymentDate"
          value={form.paymentDate}
          onChange={handleChange}
          required
        />

        <label>Amount Paid</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <label>Payment Method</label>
        <input
          type="text"
          name="method"
          value={form.method}
          onChange={handleChange}
          placeholder="Cash, Bank, OMT..."
        />

        <label>Reference / Receipt No.</label>
        <input
          type="text"
          name="reference"
          value={form.reference}
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">
          Save Payment
        </button>
      </form>
      
    </div>
  );
};

export default AdminRecordPayments;