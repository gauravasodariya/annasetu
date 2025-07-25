import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Image,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./AdminStyles.css";

const DonationDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Check if we should hide certain details
  const searchParams = new URLSearchParams(location.search);
  const hideDetails = searchParams.get("hideDetails") === "true";

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        const res = await axios.get(`/api/donations/${id}`, config);
        setDonation(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching donation details:", err);
        setError("Failed to load donation details");
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  if (loading)
    return (
      <Container className="py-4">
        <div className="text-center py-3">
          <Spinner animation="border" role="status" style={{ color: "#fff" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  if (error)
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  if (!donation)
    return (
      <Container className="py-4">
        <Alert variant="warning">Donation not found</Alert>
      </Container>
    );

  return (
    <Container className="py-4">
      {alert.show && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert({ ...alert, show: false })}
          className="mb-3"
        >
          {alert.message}
        </Alert>
      )}

      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </Button>

      <Card className="donation-details-card">
        <Card.Header className="donation-card-header">
          <h4 className="mb-0">Donation Details</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Donor Information</h5>
              <p>
                <strong>Name:</strong> {donation.donor?.name || "Anonymous"}
              </p>
              <p>
                <strong>Email:</strong> {donation.donor?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {donation.contactNumber || "N/A"}
              </p>

              <h5 className="mt-4">Food Information</h5>
              <p>
                <strong>Food Type:</strong> {donation.foodType || "N/A"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {donation.foodCategory || "Uncategorized"}
              </p>
              <p>
                <strong>Quantity:</strong> {donation.quantity || "N/A"}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {donation.expiryDate
                  ? new Date(donation.expiryDate).toLocaleDateString()
                  : "Not specified"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {donation.description || "No description provided"}
              </p>
            </Col>
            <Col md={6}>
              <h5>Status Information</h5>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    donation.status === "PENDING"
                      ? "warning"
                      : donation.status === "ASSIGNED"
                        ? "info"
                        : donation.status === "COMPLETED"
                          ? "success"
                          : donation.status === "REJECTED"
                            ? "danger"
                            : "secondary"
                  }
                >
                  {donation.status}
                </Badge>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(donation.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Pickup Address:</strong>{" "}
                {donation.pickupAddress || "No address provided"}
              </p>
              <p>
                <strong>Agent Name:</strong>{" "}
                {donation.assignedAgent?.name || "Not assigned yet"}
              </p>

              {donation.image && (
                <div className="mt-4">
                  <h5>Donation Image</h5>
                  <Image
                    src={
                      donation.image.startsWith("http")
                        ? donation.image
                        : `/api/uploads/${donation.image.split("/").pop()}`
                    }
                    alt="Donation"
                    className="donation-detail-image"
                    fluid
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationDetails;
