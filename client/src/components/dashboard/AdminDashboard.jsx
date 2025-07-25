import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Spinner,
  Image,
  Pagination,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import { Alert } from "react-bootstrap";

const AdminDashboard = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert: setGlobalAlert } = alertContext;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [donations, setDonations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [modalAction, setModalAction] = useState("");
  // Add these state variables for image handling
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalNGOs: 0,
    totalAgents: 0,
    totalDonations: 0,
    pendingDonations: 0,
    assignedDonations: 0,
    completedDonations: 139,
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailDonation, setDetailDonation] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastDonation = currentPage * itemsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - itemsPerPage;
  const currentDonations = donations.slice(
    indexOfFirstDonation,
    indexOfLastDonation,
  );

  useEffect(() => {
    console.log("AdminDashboard mounted");
    fetchDonations();
    fetchAgents();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      console.log("Fetching donations...");
      const config = {
        headers: { "x-auth-token": localStorage.getItem("token") },
      };
      const res = await axios.get("/api/donations", config);
      const sortedDonations = res.data.sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
      );
      setDonations(sortedDonations);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  const fetchAgents = async () => {
    try {
      console.log("Fetching agents...");
      const config = {
        headers: { "x-auth-token": localStorage.getItem("token") },
      };
      const res = await axios.get("/api/agents", config);
      const activeAgents = res.data.filter(
        (agent) => agent.status === "active",
      );
      setAgents(activeAgents);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const fetchStats = async () => {
    try {
      console.log("Fetching stats for admin dashboard...");

      const config = {
        headers: { "x-auth-token": localStorage.getItem("token") },
      };
      const res = await axios.get("/api/stats", config);
      console.log("Stats received:", res.data);

      setStats({
        totalDonors: res.data.donors || 0,
        totalNGOs: res.data.ngos || 0,
        totalAgents: res.data.volunteers || 0,
        totalDonations: res.data.totalDonations || 0,
        pendingDonations: res.data.pendingDonations || 0,
        assignedDonations: res.data.assignedDonations || 0,
        completedDonations: res.data.completedDonations || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({
        totalDonors: donations
          .filter((d) => d.donor)
          .filter(
            (d, i, arr) =>
              arr.findIndex(
                (t) => (t.donor && t.donor._id) === (d.donor && d.donor._id),
              ) === i,
          ).length,
        totalNGOs: 8,
        totalAgents: agents.length,
        totalDonations: donations.length,
        pendingDonations: donations.filter((d) => d.status === "PENDING")
          .length,
        assignedDonations: donations.filter((d) => d.status === "ASSIGNED")
          .length,
        completedDonations: donations.filter((d) => d.status === "COMPLETED")
          .length,
      });
    }
  };

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedAgentId("");
  };

  const handleAssignAgent = async () => {
    if (!currentDonation || !selectedAgentId) {
      setAlert({
        show: true,
        message: "Please select an Volunteer",
        type: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };

      const body = JSON.stringify({
        status: "ASSIGNED",
        assignedAgent: selectedAgentId,
      });

      const res = await axios.put(
        `/api/donations/${currentDonation._id}/status`,
        body,
        config,
      );

      if (res.data) {
        await axios.post("/api/notifications", {
          user: currentDonation.donor._id,
          title: "Donation Assigned",
          message: "Your donation has been accepted and assigned to an agent.",
          type: "donation",
        });

        await axios.post("/api/notifications", {
          user: selectedAgentId,
          title: "New Donation Assignment",
          message: "You have been assigned a new donation to pick up.",
          type: "donation",
        });

        setAlert({
          show: true,
          message: "Donation assigned successfully",
          type: "success",
        });
        setShowAssignModal(false);
        setSelectedAgentId("");
        fetchDonations();
        fetchStats();
      }
    } catch (err) {
      console.error(
        "Error assigning donation:",
        err.response ? err.response.data : err.message,
      );
      setAlert({
        show: true,
        message:
          "Failed to assign agent to donation: " +
          (err.response?.data?.msg || err.message),
        type: "danger",
      });
    }
  };

  const handleStatusChange = async () => {
    if (!currentDonation) return;

    try {
      let updateData = {};
      let notificationMessage = "";
      let successMessage = "";

      switch (modalAction) {
        case "accept":
          if (!selectedAgent) {
            setAlert({
              show: true,
              message: "Please select an agent",
              type: "warning",
            });
            return;
          }
          updateData = {
            status: "ASSIGNED",
            assignedAgent: selectedAgent,
          };
          notificationMessage =
            "Your donation has been accepted and assigned to an agent.";
          successMessage = "Donation assigned successfully";
          break;
        case "reject":
          updateData = { status: "REJECTED" };
          notificationMessage = "Your donation request has been rejected.";
          successMessage = "Donation rejected successfully";
          break;
        case "complete":
          updateData = {
            status: "COMPLETED",
            availability: "available", 
          };
          notificationMessage = "Your donation has been marked as completed.";
          successMessage = "Donation completed successfully";
          break;
        default:
          break;
      }

      await axios.put(
        `/api/donations/${currentDonation._id}/status`,
        updateData,
      );

      await axios.post("/api/notifications", {
        user: currentDonation.donor._id,
        title: `Donation ${updateData.status}`,
        message: notificationMessage,
        type: "donation",
      });

      if (modalAction === "accept") {
        await axios.post("/api/notifications", {
          user: selectedAgent,
          title: "New Donation Assignment",
          message: "You have been assigned a new donation to pick up.",
          type: "donation",
        });
      }

      setAlert({ show: true, message: successMessage, type: "success" });

      fetchDonations();
      fetchStats();
      handleCloseModal();
    } catch (err) {
      console.error("Error updating donation:", err);
      setAlert({
        show: true,
        message:
          "Failed to update donation status: " +
          (err.response?.data?.msg || err.message),
        type: "danger",
      });
    }
  };

  const handleActionClick = (donation, action) => {
    setCurrentDonation(donation);
    setModalAction(action);

    if (action === "accept") {
      setShowAssignModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDonation(null);
    setSelectedAgent("");
    setModalAction("");
  };

  const handleImageClick = (imageUrl) => {
    const formattedImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `/uploads/${imageUrl.split("/").pop()}`;

    setSelectedImage(formattedImageUrl);
    setShowImageModal(true);
  };

  const handleOpenDetails = async (donation) => {
    try {
      setDetailsError("");
      setDetailsLoading(true);
      setShowDetailsModal(true);
      setDetailDonation(donation);
    } catch (err) {
      console.error("Error fetching donation details:", err);
      setDetailsError("Failed to load donation details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setDetailDonation(null);
    setDetailsError("");
  };

  const toggleAvailability = async (donationId, currentAvailability) => {
    try {
      const newAvailability =
        currentAvailability === "available" ? "notavailable" : "available";
      await axios.put(`/api/donations/${donationId}/availability`, {
        availability: newAvailability,
      });
      fetchDonations();
    } catch (err) {
      console.error("Error updating availability:", err);
      alert("Failed to update availability status");
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
      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
          className="mt-3 mb-3"
        >
          {alert.message}
        </Alert>
      )}

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || "Admin"}</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.totalDonors}</div>
          <div className="stat-label">Total Donors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalNGOs}</div>
          <div className="stat-label">Total NGOs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalAgents}</div>
          <div className="stat-label">Total Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalDonations}</div>
          <div className="stat-label">Total Donations</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Donations</h2>
          <Link to="/admin/donations" className="view-all">
            View All
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>DONOR</th>
              <th>FOOD TYPE</th>
              <th>FOOD CATEGORY</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>AVAILABILITY</th>
              <th>IMAGE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentDonations.length > 0 ? (
              currentDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>
                    <div className="donor-name">
                      {donation.donor?.name || "Unknown"}
                    </div>
                  </td>
                  <td>{donation.foodType || "N/A"}</td>
                  <td>{donation.foodCategory || "N/A"}</td>
                  <td>
                    {new Date(donation.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td>{getStatusBadge(donation.status)}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        donation.status === "COMPLETED" ||
                        donation.availability === "available"
                          ? "status-completed"
                          : "status-rejected"
                      }`}
                    >
                      {donation.availability ||
                        (donation.status === "COMPLETED"
                          ? "AVAILABLE"
                          : "NOTAVAILABLE")}
                    </span>
                  </td>
                  <td>
                    {donation.image ? (
                      <img
                        src={
                          donation.image.startsWith("http")
                            ? donation.image
                            : `/uploads/${donation.image.replace(/^.*[\\\/]/, "")}`
                        }
                        alt="Donation"
                        className="donation-image-thumbnail"
                        onClick={() =>
                          handleImageClick(
                            donation.image.startsWith("http")
                              ? donation.image
                              : `/uploads/${donation.image.replace(/^.*[\\\/]/, "")}`,
                          )
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/80x60?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="no-image-placeholder">No image</div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleOpenDetails(donation)}
                      >
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {[...Array(Math.ceil(donations.length / itemsPerPage))].map(
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ),
            )}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(donations.length / itemsPerPage)
              }
            />
          </Pagination>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "accept" && "Accept Donation"}
            {modalAction === "reject" && "Reject Donation"}
            {modalAction === "complete" && "Complete Donation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === "accept" && (
            <>
              <p>Assign this donation to an Volunteer:</p>
              <Form.Group>
                <Form.Label>Select Volunteer</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">Select an Volunteer</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} - {agent.address}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </>
          )}
          {modalAction === "reject" && (
            <p>Are you sure you want to reject this donation?</p>
          )}
          {modalAction === "complete" && (
            <p>Are you sure you want to mark this donation as completed?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={
              modalAction === "accept"
                ? "success"
                : modalAction === "reject"
                  ? "danger"
                  : "primary"
            }
            onClick={handleStatusChange}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAssignModal} onHide={handleCloseAssignModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Volunteer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {agents.length > 0 ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Volunteer</Form.Label>
                <Form.Select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  required
                >
                  <option value="">Select an Volunteer</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} -{" "}
                      {agent.address || agent.email || "No address"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          ) : (
            <p className="text-center">No active agents available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignAgent}
            disabled={!selectedAgentId}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Donation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsLoading && (
            <div className="text-center py-3">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "#fff" }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {detailsError && (
            <Alert variant="danger" className="mb-2">
              {detailsError}
            </Alert>
          )}
          {detailDonation && (
            <div className="donation-details">
              <div className="mb-3 d-flex align-items-center">
                {detailDonation.image && (
                  <img
                    src={
                      detailDonation.image.startsWith("http")
                        ? detailDonation.image
                        : `/uploads/${detailDonation.image.replace(/^.*[\\\/]/, "")}`
                    }
                    alt="Donation"
                    className="donation-image-thumbnail me-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/160x120?text=No+Image";
                    }}
                  />
                )}
                <div>
                  <div>
                    <strong>Donor:</strong>{" "}
                    {detailDonation.donor?.name || "Unknown"}
                  </div>
                  <div>
                    <strong>Food Type:</strong>{" "}
                    {detailDonation.foodType || "N/A"}
                  </div>
                  <div>
                    <strong>Category:</strong>{" "}
                    {detailDonation.foodCategory ||
                      detailDonation.category ||
                      "N/A"}
                  </div>
                  <div>
                    <strong>Quantity:</strong>{" "}
                    {detailDonation.quantity || "N/A"}
                  </div>
                  <div>
                    <strong>Pickup Address:</strong>{" "}
                    {detailDonation.pickupAddress ||
                      detailDonation.address ||
                      "N/A"}
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {detailDonation.createdAt
                      ? new Date(detailDonation.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Expiry Date:</strong>{" "}
                    {detailDonation.expiryDate
                      ? new Date(detailDonation.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Pickup Time:</strong>{" "}
                    {detailDonation.pickupTime || "N/A"}
                  </div>
                  <div>
                    <strong>Status:</strong> {detailDonation.status}
                  </div>
                  {detailDonation.assignedAgent && (
                    <div>
                      <strong>Assigned Volunteer:</strong>{" "}
                      {detailDonation.assignedAgent.name}
                    </div>
                  )}
                </div>
              </div>
              {detailDonation.description && (
                <div className="mt-2">
                  <strong>Description:</strong>
                  <div>{detailDonation.description}</div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
