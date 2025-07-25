import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import DonorDashboard from "./DonorDashboard";
import NGODashboard from "./NGODashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user, loadUser } = authContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading || !user) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" style={{ color: "#fff" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  switch (user.role) {
    case "donor":
      return <DonorDashboard />;
    case "ngo":
      return <NGODashboard />;
    case "volunteer":
      return <VolunteerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />;
  }
};

export default Dashboard;
