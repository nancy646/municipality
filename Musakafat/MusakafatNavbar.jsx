import React from "react";
import { NavLink } from "react-router-dom";
import "./MusakafatNavbar.css";

const MusakafatNavbar = () => {
  return (
    <div className="musakafat-navbar">
      <NavLink
        to="/admin/services/musakafat"
        className={({ isActive }) =>
          "musakafat-nav-item" + (isActive ? " active" : "")
        }
      >
        Properties
      </NavLink>

      <NavLink
        to="/admin/services/musakafat/add"
        className={({ isActive }) =>
          "musakafat-nav-item" + (isActive ? " active" : "")
        }
      >
        Add Property
      </NavLink>

      <NavLink
        to="/admin/services/musakafat/tax/add"
        className={({ isActive }) =>
          "musakafat-nav-item" + (isActive ? " active" : "")
        }
      >
        Add Tax
      </NavLink>

      <NavLink
        to="/admin/services/musakafat/payments/add"
        className={({ isActive }) =>
          "musakafat-nav-item" + (isActive ? " active" : "")
        }
      >
        Record Payment
      </NavLink>

      <NavLink
        to="/admin/services/musakafat/summary"
        className={({ isActive }) =>
          "musakafat-nav-item" + (isActive ? " active" : "")
        }
      >
        Portfolio Summary
      </NavLink>
    </div>
  );
};

export default MusakafatNavbar;