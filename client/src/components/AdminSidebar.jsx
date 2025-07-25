import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import AuthContext from "../context/authContext";
import axios from "axios";

const AdminSidebar = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { logout } = authContext;

  const onLogout = () => {
    logout();
  };

  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get("/api/requests/count/pending");
        setPendingRequests(res.data.count);
      } catch (err) {
        console.error("Error fetching pending requests count:", err);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark vh-100 p-3">
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/admin/requests"
          className={`text-white ${
            location.pathname.includes("/admin/requests") ? "bg-primary" : ""
          }`}
        >
          <i className="fas fa-hand-holding-heart me-2"></i> NGO Requests
          {pendingRequests > 0 && (
            <span className="badge bg-danger ms-2">{pendingRequests}</span>
          )}
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/agents"
          className={`text-white ${
            location.pathname.includes("/admin/agents") ? "bg-primary" : ""
          }`}
        >
          <i className="fas fa-users me-2"></i> Agents
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/ngos"
          className={`text-white ${
            location.pathname.includes("/admin/ngos") ? "bg-primary" : ""
          }`}
        >
          <i className="fas fa-building me-2"></i> NGOs
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/profile"
          className={`text-white ${
            location.pathname.includes("/admin/profile") ? "bg-primary" : ""
          }`}
        >
          <i className="fas fa-user me-2"></i> Profile
        </Nav.Link>

        <Nav.Link
          onClick={onLogout}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
