import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminServices.css";

const API_URL = "https://localhost:7182/api/Services";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await axios.get(API_URL);
      setServices(res.data);
    } catch (err) {
      console.error("GET error:", err);
    }
  };

 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadServiceForEdit = (svc) => {
    setForm({
      id: svc.id,
      title: svc.title,
      description: svc.description,
      category: svc.category,
      status: svc.status,
    });
    setIsEditing(true);
    setMessage("");
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      loadServices();
    } catch (err) {
      console.error("DELETE error:", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id:form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      status: form.status,
      imageUrl: null 
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${form.id}`, data);
        setMessage("Service updated successfully.");
      } else {
        await axios.post(API_URL, data);
        setMessage("Service added successfully.");
      }

      loadServices();
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Failed to save service.");
    }
  };

  
  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      description: "",
      category: "",
      status: "Active",
    });
    setIsEditing(false);
  };

  return (
    <div className="page-wrapper">
      
      <div>
        <div className="top-bar">
          <div>
            <h2>Manage Services</h2>
            <div className="subtitle">
              View, edit or delete existing municipality services.
            </div>
          </div>

          <button className="btn-primary" onClick={loadServices}>
            Refresh
          </button>
        </div>

        <div className="table-header-row">
          <div>Name</div>
          <div>Description</div>
          <div>Category</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

      
        {services.map((svc) => (
          <div key={svc.id} className="service-row">
            <div>{svc.title}</div>
            <div>{svc.description}</div>
            <div>{svc.category}</div>
          
            <div>
              <span
                className={`status-badge ${
                  svc.status === "Active" ? "status-active" : "status-inactive"
                }`}
              >
                {svc.status}
              </span>
            </div>

            <div className="actions">
              <a className="edit" onClick={() => loadServiceForEdit(svc)}>
                Edit
              </a>
              <a className="delete" onClick={() => deleteService(svc.id)}>
                Delete
              </a>
            </div>
          </div>
        ))}
      </div>

      
      <div className="form-card">
        <h3>
          {isEditing ? "Edit Service" : "Add New Service"}
          {isEditing && <span className="badge-editing">Editing</span>}
        </h3>

        <form onSubmit={handleSubmit}>
          <input type="hidden" value={form.id} />

          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              className="form-input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter service name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service"
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Parks and Recreation">Parks and Recreation</option>
              <option value="Public Works">Public Works</option>
              <option value="Community Services">Community Services</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-label">Status</span>

            <div className="status-radio-group">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={form.status === "Active"}
                  onChange={handleChange}
                />
                Active
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={form.status === "Inactive"}
                  onChange={handleChange}
                />
                Inactive
              </label>
            </div>
          </div>

          <button type="submit" className="btn-save">
            {isEditing ? "Update Service" : "Save Service"}
          </button>

          <div className="small-muted">
            {isEditing
              ? "Saving will update the existing service."
              : "Fill the form to add a new service."}
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminServices;