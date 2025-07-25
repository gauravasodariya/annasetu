import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Form,
  Modal,
  Tabs,
  Tab,
  Badge,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import "../admin/AdminStyles.css";

const NGODashboard = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    pendingRequests: 0,
    acceptedRequests: 0,
    totalRequests: 0,
    canceledRequests: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/requests");
      setRequests(res.data);

      const pending = res.data.filter((req) => req.status === "PENDING").length;
      const accepted = res.data.filter(
        (req) => req.status === "ACCEPTED",
      ).length;
      const canceled = res.data.filter(
        (req) => req.status === "CANCELED",
      ).length;

      setStats({
        pendingRequests: pending,
        acceptedRequests: accepted,
        totalRequests: res.data.length,
        canceledRequests: canceled,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge bg="warning">PENDING</Badge>;
      case "accepted":
        return <Badge bg="success">ACCEPTED</Badge>;
      case "rejected":
        return <Badge bg="danger">REJECTED</Badge>;
      case "completed":
        return <Badge bg="info">COMPLETED</Badge>;
      case "canceled":
        return <Badge bg="secondary">CANCELED</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const navigateToDetails = (requestId) => {
    navigate(`/ngo/requests/${requestId}`);
  };

  const handleCancel = async (requestId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this request? This action cannot be undone.",
      )
    ) {
      try {
        await axios.put(`/api/requests/cancel/${requestId}`);

        setRequests(
          requests.map((request) =>
            request._id === requestId
              ? { ...request, status: "CANCELED" }
              : request,
          ),
        );

        setStats((prevStats) => ({
          ...prevStats,
          pendingRequests: prevStats.pendingRequests - 1,
          canceledRequests: prevStats.canceledRequests + 1,
        }));

        setAlert("Request cancelled successfully", "success");
      } catch (err) {
        console.error("Error cancelling request:", err);
        setAlert("Failed to cancel request", "danger");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" style={{ color: "#fff" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0" style={{ color: "#4dd0e1" }}>
          Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card
            className="text-center mb-3"
            style={{ backgroundColor: "#2c3e50", color: "white" }}
          >
            <Card.Body>
              <h3>{stats.totalRequests}</h3>
              <p className="mb-0">Total Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="text-center mb-3"
            style={{ backgroundColor: "#2c3e50", color: "white" }}
          >
            <Card.Body>
              <h3>{stats.pendingRequests}</h3>
              <p className="mb-0">Pending Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="text-center mb-3"
            style={{ backgroundColor: "#2c3e50", color: "white" }}
          >
            <Card.Body>
              <h3>{stats.acceptedRequests}</h3>
              <p className="mb-0">Accepted Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="text-center mb-3"
            style={{ backgroundColor: "#2c3e50", color: "white" }}
          >
            <Card.Body>
              <h3>{stats.canceledRequests}</h3>
              <p className="mb-0">Canceled Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header className="donation-card-header">
          <h4 className="mb-0">My Recent Requests</h4>
        </Card.Header>
        <Card.Body>
          {requests.length > 0 ? (
            <Table responsive hover className="donation-table">
              <thead className="table-header">
                <tr>
                  <th>FOOD TYPE</th>
                  <th>FOOD CATEGORY</th>
                  <th>QUANTITY</th>
                  <th>NOTES</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((request) => (
                  <tr key={request._id} className="donation-row">
                    <td>{request.foodType}</td>
                    <td>{request.foodCategory || "N/A"}</td>
                    <td>{request.quantity}</td>
                    <td>{request.notes || "N/A"}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigateToDetails(request._id)}
                          style={{ backgroundColor: "#00bcd4", border: "none" }}
                        >
                          View Details
                        </button>
                        {request.status === "PENDING" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(request._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center py-3">No requests found.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NGODashboard;
