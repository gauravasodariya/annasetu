import React, { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaDonate,
  FaClipboardList,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaEnvelope,
  FaBars,
} from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (location.state && location.state.fromProfile) {
      navigate("/admin", { replace: true });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`admin-container ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <div className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h3>{!sidebarCollapsed && "Annasetu"}</h3>
          {!sidebarCollapsed && <p>Admin Panel</p>}
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === "/admin" ? "active" : ""}>
              <Link to="/admin">
                <FaChartBar /> {!sidebarCollapsed && "Dashboard"}
              </Link>
            </li>
            <li
              className={
                location.pathname.includes("/admin/donations") ? "active" : ""
              }
            >
              <Link to="/admin/donations">
                <FaDonate /> {!sidebarCollapsed && "Donations"}
              </Link>
            </li>
            <li
              className={
                location.pathname.includes("/admin/inquiries") ? "active" : ""
              }
            >
              <Link to="/admin/inquiries">
                <FaEnvelope /> {!sidebarCollapsed && "Inquiries"}
              </Link>
            </li>
            <li
              className={
                location.pathname.includes("/admin/agents") ? "active" : ""
              }
            >
              <Link to="/admin/agents">
                <FaUsers /> {!sidebarCollapsed && "Volunteer"}
              </Link>
            </li>
            <li
              className={
                location.pathname.includes("/admin/ngos") ? "active" : ""
              }
            >
              <Link to="/admin/ngos">
                <FaUsers /> {!sidebarCollapsed && "NGOs"}
              </Link>
            </li>
            <li
              className={location.pathname === "/admin/profile" ? "active" : ""}
            >
              <Link to="/admin/profile">
                <FaUser /> {!sidebarCollapsed && "Profile"}
              </Link>
            </li>
            <li>
              <a href="#" onClick={handleLogout}>
                <FaSignOutAlt /> {!sidebarCollapsed && "Log Out"}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
