import React, { useState, useContext, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../context/authContext";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const DeliveryHistory = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchCompletedDeliveries();
  }, []);

  const fetchCompletedDeliveries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/volunteers/assignments", {
        headers: {
          "x-auth-token": token,
        },
      });

      const completed = Array.isArray(res.data)
        ? res.data.filter((d) => d.status === "COMPLETED")
        : [];

      setCompletedDeliveries(completed);
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching completed deliveries:",
        err.response?.data || err.message,
      );
      setAlert({
        show: true,
        message: "Failed to load delivery history. Please try again later.",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className="status-badge status-completed">
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Delivery History</h1>
        <p>View your completed deliveries</p>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Completed Deliveries</h2>
        </div>

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
                <th>COMPLETION DATE</th>
                <th>STATUS</th>
                <th>IMAGE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {completedDeliveries.length > 0 ? (
                completedDeliveries.map((delivery) => (
                  <tr key={delivery._id}>
                    <td>
                      <div className="donor-name">
                        {delivery.donor?.name || "Unknown"}
                      </div>
                    </td>
                    <td>{delivery.foodType || "N/A"}</td>
                    <td>{delivery.pickupAddress || "N/A"}</td>
                    <td>
                      {new Date(
                        delivery.updatedAt || delivery.createdAt,
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>{getStatusBadge(delivery.status)}</td>
                    <td>
                      {delivery.image ? (
                        <img
                          src={
                            delivery.image.startsWith("http")
                              ? delivery.image
                              : `/uploads/${encodeURIComponent(delivery.image.split("/").pop())}`
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
                        <Link
                          to={`/volunteer/assignments/${delivery._id}`}
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
                          state={{ assignment: delivery }}
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No completed deliveries found
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

export default DeliveryHistory;
