import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AssignmentDetails.css";

const AssignmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(
    location.state?.assignment || null,
  );
  const [loading, setLoading] = useState(!assignment);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assignment) {
      fetchAssignmentDetails();
    }
  }, [id, assignment]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/volunteers/assignments/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setAssignment(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assignment details:", err);
      setError("Failed to load assignment details. Please try again.");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let badgeClass = "";

    switch (status?.toLowerCase()) {
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
        {status?.toUpperCase()}
      </span>
    );
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!assignment) {
    return <Alert variant="warning">Assignment not found</Alert>;
  }

  return (
    <div className="assignment-details-container">
      <div className="back-button-container">
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
          className="mb-3"
        >
          &larr; Back to Assignments
        </Button>
      </div>

      <h2 className="page-title">Assignment Details</h2>

      <Card className="assignment-details-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Donation Information</h3>
            {getStatusBadge(assignment.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="detail-item">
                <div className="detail-label">Food Type:</div>
                <div className="detail-value">
                  {assignment.foodType || "N/A"}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Food Category:</div>
                <div className="detail-value">
                  {assignment.foodCategory || "N/A"}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Quantity:</div>
                <div className="detail-value">
                  {assignment.quantity || "N/A"}
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="detail-item">
                <div className="detail-label">Expiry Date:</div>
                <div className="detail-value">
                  {assignment.expiryDate
                    ? new Date(assignment.expiryDate).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Pickup Address:</div>
                <div className="detail-value">
                  {assignment.pickupAddress || "N/A"}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Date Created:</div>
                <div className="detail-value">
                  {new Date(assignment.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Col>
          </Row>

          <div className="donor-section mt-4">
            <h4>Donor Information</h4>
            <div className="donor-details">
              <div className="donor-avatar">
                {assignment.donor?.name?.charAt(0) || "U"}
              </div>
              <div className="donor-name">
                {assignment.donor?.name || "Unknown"} :{" "}
              </div>
              <div className="donor-contact">
                {assignment.contactNumber ||
                  assignment.donor?.contactNumber ||
                  "No contact information"}{" "}
              </div>
            </div>
          </div>

          {assignment.image && (
            <div className="image-section mt-4">
              <h4>Donation Image</h4>
              <div className="donation-image-container">
                <img
                  src={
                    assignment.image.startsWith("http")
                      ? assignment.image
                      : `/uploads/${assignment.image.split("/").pop()}`
                  }
                  alt="Donation"
                  className="donation-image"
                />
              </div>
            </div>
          )}

          {(assignment.ngoName || assignment.ngo?.name) && (
            <div className="ngo-section mt-4">
              <h4>NGO Information</h4>
              <div className="ngo-details">
                <div>
                  <strong>Name:</strong>{" "}
                  {assignment.ngoName || assignment.ngo?.name}
                </div>
                <div>
                  <strong>Address:</strong>{" "}
                  {assignment.ngoAddress || assignment.ngo?.address || "N/A"}
                </div>
              </div>
            </div>
          )}

          {assignment.notes && (
            <div className="notes-section mt-4">
              <h4>Notes</h4>
              <div className="notes-content">{assignment.notes}</div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AssignmentDetails;
