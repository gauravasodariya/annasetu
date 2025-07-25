import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import "./AdminDashboard.css";

const MyAssignments = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlertState] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/volunteers/assignments", {
        headers: {
          "x-auth-token": token,
        },
      });
      const filteredAssignments = Array.isArray(res.data)
        ? res.data.filter(
            (assignment) =>
              assignment.status === "ASSIGNED" ||
              assignment.status === "PENDING",
          )
        : [];
      setAssignments(filteredAssignments);
      setLoading(false);
    } catch (err) {
      setAlertState({
        show: true,
        message: "Failed to load assignments. Please try again later.",
        type: "danger",
      });
      setLoading(false);
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
      default:
        badgeClass = "status-assigned";
    }
    return (
      <span className={`status-badge ${badgeClass}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

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
        },
      );

      setAlert(`Status updated to ${status}`, "success");
      fetchAssignments();
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message,
      );
      setAlert("Failed to update status. Please try again.", "danger");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Assignments</h2>
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
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" role="status" style={{ color: "#fff" }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
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
                  <tr key={assignment._id}>
                    <td>
                      <div className="donor-name">
                        {assignment.donor?.name || "Unknown"}
                      </div>
                    </td>
                    <td>{assignment.foodType || "N/A"}</td>
                    <td>{assignment.pickupAddress || "N/A"}</td>
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
                        },
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
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <div className="no-image-placeholder">No image</div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {assignment.status === "ASSIGNED" && (
                          <button
                            className="action-btn complete-btn"
                            onClick={() =>
                              updateStatus(assignment._id, "COMPLETED")
                            }
                          >
                            Mark Completed
                          </button>
                        )}
                        {assignment.status === "PENDING" && (
                          <button
                            className="action-btn accept-btn"
                            onClick={() =>
                              updateStatus(assignment._id, "ASSIGNED")
                            }
                          >
                            Accept
                          </button>
                        )}
                        {assignment.status === "PENDING" && (
                          <button
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
                            onClick={() =>
                              navigate(
                                `/volunteer/assignments/${assignment._id}`,
                                {
                                  state: {
                                    assignment,
                                    ngoName: assignment.ngoName,
                                    ngoAddress: assignment.ngoAddress,
                                  },
                                },
                              )
                            }
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No assignments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;
