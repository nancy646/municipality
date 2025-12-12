import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPropertiesList.css";
import MusakafatNavbar from "./MusakafatNavbar";

const API_URL = "https://localhost:7182/api/Properties";

const AdminPropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setProperties(res.data);
    } catch (err) {
      console.error("GET properties error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="musakafat-page">
         <MusakafatNavbar />
      <div className="musakafat-topbar">
        <div>
          <h2>Property Portfolio</h2>
          <div className="subtitle">
            View all registered properties and their basic information.
          </div>
        </div>

        <div className="btn-group">
          <button className="btn-secondary" onClick={loadProperties}>
            Refresh
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/admin/services/musakafat/add")}
          >
            + Add New Property
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          No properties found. Click "Add New Property" to register the first one.
        </div>
      ) : (
        <table className="properties-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Property Name</th>
              <th>Region</th>
              <th>Real Estate No.</th>
              <th>Owner / Tax Payer</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {properties.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>{p.region}</td>
                <td>{p.realEstateNumber}</td>
                <td>{p.ownerName}</td>
                <td>
                    <button 
                    className="btn-link"
                    onClick={ () =>
                        navigate(`/admin/services/musakafat/edit/${p.id}`)
                    }
                >
                    Edit
                </button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default AdminPropertiesList;