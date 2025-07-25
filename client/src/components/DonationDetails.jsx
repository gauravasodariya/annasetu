import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../context/authContext";

const DonationDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const [donation, setDonation] = useState(location.state?.donation || null);
  const [loading, setLoading] = useState(!location.state?.donation);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!donation) {
      fetchDonation();
    }
  }, [id]);

  const fetchDonation = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/donations/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!res.data) {
        setError("Donation not found");
        setLoading(false);
        return;
      }

      if (
        res.data.assignedAgent &&
        typeof res.data.assignedAgent === "string"
      ) {
        try {
          const agentRes = await axios.get(
            `/api/users/${res.data.assignedAgent}`,
            {
              headers: {
                "x-auth-token": token,
              },
            }
          );

          setDonation({
            ...res.data,
            assignedAgent: {
              _id: res.data.assignedAgent,
              name: agentRes.data.name || "Unknown Agent",
              phone: agentRes.data.phone || "No phone available",
            },
          });
        } catch (err) {
          console.error("Error fetching agent details:", err);
          setDonation(res.data);
        }
      } else {
        setDonation(res.data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching donation:", err);
      setError(err.response?.data?.msg || "Failed to load donation details");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="warning">Pending</Badge>;
      case "ASSIGNED":
        return <Badge bg="info">Assigned</Badge>;
      case "COMPLETED":
        return <Badge bg="success">Completed</Badge>;
      case "REJECTED":
        return <Badge bg="danger">Rejected</Badge>;
      case "CANCELLED":
      case "CANCELED":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  if (!donation)
    return <div className="alert alert-warning m-5">Donation not found</div>;

  return (
    <div className="container py-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </Button>

      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h3 className="mb-0">Donation Details</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Food Information</h5>
              <p>
                <strong>Type:</strong> {donation.foodType}
              </p>
              <p>
                <strong>Category:</strong> {donation.foodCategory || "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong> {donation.quantity}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {donation.expiryDate
                  ? new Date(donation.expiryDate).toLocaleDateString()
                  : "N/A"}
              </p>
              {donation.description && (
                <p>
                  <strong>Description:</strong> {donation.description}
                </p>
              )}
            </Col>
            <Col md={6}>
              <h5>Pickup Information</h5>
              <p>
                <strong>Address:</strong> {donation.pickupAddress}
              </p>
              <p>
                <strong>Contact Number:</strong>{" "}
                {donation.contactNumber || user?.phone || "N/A"}
              </p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5>Status Information</h5>
              <p>
                <strong>Current Status:</strong>{" "}
                {getStatusBadge(donation.status)}
              </p>
              <p>
                <strong>Donation Date:</strong>{" "}
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </Col>
            <Col md={6}>
              <h5>Volunteer Information</h5>
              {donation.assignedAgent ? (
                <>
                  <p>
                    <strong>Name:</strong>{" "}
                    {typeof donation.assignedAgent === "object" &&
                    donation.assignedAgent.name
                      ? donation.assignedAgent.name
                      : typeof donation.assignedAgent === "string"
                      ? "Agent ID: " + donation.assignedAgent
                      : "Agent assigned"}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {typeof donation.assignedAgent === "object" &&
                    donation.assignedAgent.phone
                      ? donation.assignedAgent.phone
                      : "No contact information available"}
                  </p>
                </>
              ) : (
                <p>No Volunteer has been assigned yet.</p>
              )}
            </Col>
          </Row>
          {donation.image && (
            <Row className="mb-4">
              <Col>
                <h5>Food Image</h5>
                <img
                  src={
                    donation.image.startsWith("http")
                      ? donation.image
                      : donation.image.startsWith("/uploads/")
                      ? donation.image
                      : `/uploads/${donation.image.split("/").pop()}`
                  }
                  alt="Food Donation"
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px" }}
                  onError={(e) => {
                    console.log("Image failed to load:", donation.image);
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Image+Not+Available";
                  }}
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DonationDetails;
