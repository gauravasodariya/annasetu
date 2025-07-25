import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

const VolunteerDashboard = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;
  const location = useLocation();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlertState] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [stats, setStats] = useState({
    assigned: 0,
    completed: 0,
    pending: 0,
    total: 0,
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Fetching volunteer assignments...");

      const res = await axios.get("/api/volunteers/assignments", {
        headers: {
          "x-auth-token": token,
        },
      });

      console.log("Assignments data:", res.data);

      const allAssignments = Array.isArray(res.data) ? res.data : [];
      setAssignments(allAssignments);

      const assigned = allAssignments.filter(
        (d) => d.status === "ASSIGNED"
      ).length;
      const completed = allAssignments.filter(
        (d) => d.status === "COMPLETED"
      ).length;
      const pending = allAssignments.filter(
        (d) => d.status === "PENDING"
      ).length;

      setStats({
        assigned,
        completed,
        pending,
        total: allAssignments.length,
      });
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching assignments:",
        err.response?.data || err.message
      );
      setAlertState({
        show: true,
        message: "Failed to load assignments. Please try again later.",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      console.log(`Updating donation ${id} status to ${status}`);

      let endpoint = "";
      if (status === "ASSIGNED") {
        endpoint = `/api/volunteers/accept/${id}`;
      } else if (status === "COMPLETED") {
        endpoint = `/api/volunteers/complete/${id}`;
      }

      const response = await axios.put(
        endpoint,
        {},
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status update response:", response.data);
      setAlert(`Status updated to ${status}`, "success");
      fetchAssignments();
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message
      );
      setAlert("Failed to update status. Please try again.", "danger");
    }
  };

  const getStatusBadge = (status) => {
    let badgeClass = "";

    switch (status.toLowerCase()) {
      case "pending":
        badgeClass = "status-pending";
        break;
      case "assigned":
        badgeClass = "status-assigned";
        break;
      case "rejected":
        badgeClass = "status-rejected";
        break;
      case "completed":
        badgeClass = "status-completed";
        break;
      default:
        badgeClass = "status-assigned";
    }

    return (
      <span className={`status-badge ${badgeClass}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Volunteer Dashboard</h1>
        <p>Welcome back, {user?.name || "Volunteer"}</p>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlertState({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.assigned}</div>
          <div className="stat-label">Assigned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Assignments</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Assignments</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>DONOR</th>
              <th>FOOD TYPE</th>
              <th>PICKUP ADDRESS</th>
              <th>DELIVERY ADDRESS (NGO)</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>IMAGE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr key={assignment._id} style={{ height: "20px" }}>
                  <td>
                    <div className="donor-name" style={{ fontSize: "15px" }}>
                      {assignment.donor?.name || "Unknown"}
                    </div>
                  </td>
                  <td style={{ fontSize: "15px" }}>
                    {assignment.foodType || "N/A"}
                  </td>
                  <td style={{ fontSize: "15px" }}>
                    {assignment.pickupAddress || "N/A"}
                  </td>
                  <td style={{ fontSize: "15px" }}>
                    {assignment.ngoName ? (
                      <>
                        <div>{assignment.ngoName}</div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {new Date(assignment.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td>{getStatusBadge(assignment.status)}</td>
                  <td>
                    {assignment.image ? (
                      <img
                        src={
                          assignment.image.startsWith("http")
                            ? assignment.image
                            : `/uploads/${assignment.image.split("/").pop()}`
                        }
                        alt="Donation"
                        className="donation-image-thumbnail"
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <div
                        className="no-image-placeholder"
                        style={{ fontSize: "15px", height: "35px" }}
                      >
                        No image
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {assignment.status === "PENDING" && (
                        <button
                          className="action-btn accept-btn"
                          onClick={() =>
                            updateStatus(assignment._id, "ASSIGNED")
                          }
                          style={{ padding: "4px 8px", fontSize: "15px" }}
                        >
                          Accept
                        </button>
                      )}
                      {assignment.status === "PENDING" && (
                        <Link
                          to={`/volunteer/assignments/${assignment._id}`}
                          className="btn btn-info"
                          style={{
                            backgroundColor: "#00bcd4",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "15px",
                            fontWeight: "400",
                            lineHeight: "1.5",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                            cursor: "pointer",
                            border: "1px solid transparent",
                            marginLeft: "6px",
                          }}
                          state={{
                            assignment: assignment,
                            ngoName: assignment.ngoName,
                            ngoAddress: assignment.ngoAddress,
                          }}
                        >
                          View Details
                        </Link>
                      )}
                      {assignment.status === "ASSIGNED" && (
                        <button
                          className="action-btn complete-btn"
                          onClick={() =>
                            updateStatus(assignment._id, "COMPLETED")
                          }
                          style={{ padding: "4px 8px", fontSize: "15px" }}
                        >
                          Mark Completed
                        </button>
                      )}
                      {assignment.status === "COMPLETED" && (
                        <Link
                          to={`/volunteer/assignments/${assignment._id}`}
                          className="btn btn-info"
                          style={{
                            backgroundColor: "#00bcd4",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "15px",
                            fontWeight: "400",
                            lineHeight: "1.5",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                            cursor: "pointer",
                            border: "1px solid transparent",
                          }}
                          state={{
                            assignment: assignment,
                            ngoName: assignment.ngoName,
                            ngoAddress: assignment.ngoAddress,
                          }}
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
