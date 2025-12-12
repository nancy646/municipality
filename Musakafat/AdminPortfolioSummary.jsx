import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPortfolioSummary.css";
import MusakafatNavbar from "./MusakafatNavbar";

const API_PROPERTIES = "https://localhost:7182/api/Properties";
const API_TAXES = "https://localhost:7182/api/Taxes";
const API_PAYMENTS = "https://localhost:7182/api/Payments";

const AdminPortfolioSummary = () => {
  const [properties, setProperties] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [pRes, tRes, payRes] = await Promise.all([
      axios.get(API_PROPERTIES),
      axios.get(API_TAXES),
      axios.get(API_PAYMENTS),
    ]);

    setProperties(pRes.data);
    setTaxes(tRes.data);
    setPayments(payRes.data);
  };

  const getTotalPaidForTax = (taxId) => {
    return payments
      .filter((p) => p.taxId === taxId)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getStatus = (tax) => {
    const totalPaid = getTotalPaidForTax(tax.id);
    const year = tax.taxYear;
    const nowYear = new Date().getFullYear();

    if (totalPaid >= tax.totalTax) return "Paid";
    if (year < nowYear) return "Overdue";
    if (totalPaid > 0 && totalPaid < tax.totalTax) return "Partial";
    return "Pending";
  };

  const filteredTaxes = taxes.filter((t) =>
    selectedYear ? t.taxYear === parseInt(selectedYear) : true
  );

  return (
    
    <div className="summary-container">
         <MusakafatNavbar />
      <div className="summary-header">
        <div>
          <h2>Portfolio Summary</h2>
          <p>Overview of tax obligations and payments per property.</p>
        </div>

        <div className="filters">
          <label>Filter by year:</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            placeholder="e.g. 2025"
          />
        </div>
      </div>

      <table className="summary-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Year</th>
            <th>Total Tax</th>
            <th>Total Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTaxes.map((t) => {
            const prop = properties.find((p) => p.id === t.propertyId);
            const totalPaid = getTotalPaidForTax(t.id);
            const status = getStatus(t);

            return (
              <tr key={t.id} className={`status-${status.toLowerCase()}`}>
                <td>{prop ? prop.name : "Unknown"}</td>
                <td>{t.taxYear}</td>
                <td>{t.totalTax}</td>
                <td>{totalPaid}</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminPortfolioSummary;