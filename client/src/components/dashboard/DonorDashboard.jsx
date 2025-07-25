import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Form,
  Modal,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    expiryDate: "",
    pickupAddress: "",
    pickupTime: "",
    image: null,
  });
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 0,
    completed: 0,
    rejected: 0,
  });

  const { foodType, quantity, expiryDate, pickupAddress, pickupTime } =
    formData;

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleCancelDonation = async (donationId) => {
    if (window.confirm("Are you sure you want to cancel this donation?")) {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.put(
          `/api/donations/${donationId}/cancel`,
          {},
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        setAlert("Donation cancelled successfully", "success");

        setDonations(
          donations.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "CANCELLED" }
              : donation
          )
        );

        fetchDonations();
      } catch (err) {
        console.error("Error cancelling donation:", err);
        setAlert(
          err.response?.data?.msg ||
            "Error cancelling donation. Please try again.",
          "danger"
        );
      }
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/donations/donor", {
        headers: {
          "x-auth-token": token,
        },
      });
      setDonations(res.data);
      const nextStats = res.data.reduce(
        (acc, d) => {
          const status = (d.status || "").toUpperCase();
          if (status === "PENDING") acc.pending += 1;
          else if (status === "ASSIGNED") acc.assigned += 1;
          else if (status === "COMPLETED") acc.completed += 1;
          else if (
            status === "REJECTED" ||
            status === "CANCELLED" ||
            status === "CANCELED"
          )
            acc.rejected += 1;
          return acc;
        },
        { pending: 0, assigned: 0, completed: 0, rejected: 0 }
      );
      setStats(nextStats);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setAlert(
        err.response?.data?.msg || "Error loading donations. Please try again.",
        "danger"
      );
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
      case "canceled":
      case "cancelled":
        badgeClass = "status-rejected";
        break;
      case "completed":
        badgeClass = "status-completed";
        break;
      default:
        badgeClass = "status-pending";
    }

    return (
      <span className={`status-badge ${badgeClass}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const onChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [editMode, setEditMode] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);

  const handleEditDonation = (donation) => {
    navigate(`/donor/donations/${donation._id}/edit`, {
      state: { donation: donation },
    });
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        const token = localStorage.getItem("token");
        console.log("Attempting to delete donation with ID:", donationId);

        const response = await axios({
          method: "DELETE",
          url: `/api/donations/${donationId}`,
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        });

        console.log("Delete response:", response.data);

        setDonations(
          donations.filter((donation) => donation._id !== donationId)
        );

        setAlert("Donation deleted successfully", "success");

        fetchDonations();
      } catch (err) {
        console.error("Error deleting donation:", err);
        console.error("Error response:", err.response?.data);
        setAlert(
          err.response?.data?.msg ||
            "Error deleting donation. Please try again.",
          "danger"
        );
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("foodType", foodType);
    formDataObj.append("quantity", quantity);
    if (expiryDate) formDataObj.append("expiryDate", expiryDate);
    formDataObj.append("pickupAddress", pickupAddress);
    if (pickupTime) formDataObj.append("pickupTime", pickupTime);
    if (formData.foodCategory)
      formDataObj.append("foodCategory", formData.foodCategory);
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }

    try {
      const token = localStorage.getItem("token");

      if (editMode && currentDonation) {
        console.log("Updating donation:", currentDonation._id);
        const res = await axios.put(
          `/api/donations/${currentDonation._id}`,
          formDataObj,
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update response:", res.data);
        setAlert("Donation updated successfully", "success");
      } else {
        await axios.post("/api/donations", formDataObj, {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert("Donation added successfully", "success");
      }

      setShowModal(false);
      setEditMode(false);
      setCurrentDonation(null);
      setFormData({
        foodType: "",
        foodCategory: "",
        quantity: "",
        expiryDate: "",
        pickupAddress: "",
        pickupTime: "",
        image: null,
      });
      fetchDonations();
    } catch (err) {
      console.error("Error details:", err);
      setAlert(
        err.response?.data?.msg || "Error processing donation",
        "danger"
      );
    }
  };

  return (
    <div className="donor-dashboard">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Donor Dashboard</h2>
              <p>Welcome, {user && user.name}!</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.assigned}</div>
          <div className="stat-label">Assigned Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected Donations</div>
        </div>
      </div>

      <Card>
        <Card.Body>
          <h3>Your Donations</h3>
          {donations.length === 0 ? (
            <p>
              No donations yet. Click "Donate Food" to make your first donation.
            </p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>FOOD TYPE</th>
                  <th>FOOD CATEGORY</th>
                  <th>QUANTITY</th>
                  <th>PICKUP DATE</th>
                  <th>STATUS</th>
                  <th>IMAGE</th>
                  <th>ASSIGNED AGENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.foodType}</td>
                    <td>{donation.foodCategory || "N/A"}</td>
                    <td>{donation.quantity}</td>
                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(donation.status)}</td>
                    <td>
                      {donation.image ? (
                        <img
                          src={
                            donation.image.startsWith("http")
                              ? donation.image
                              : `/uploads/${donation.image.replace(
                                  /^.*[\\\/]/,
                                  ""
                                )}`
                          }
                          alt="Donation"
                          className="donation-image-thumbnail"
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
                      {donation.assignedAgent ? (
                        <div className="agent-info">
                          <div className="agent-name">
                            {donation.assignedAgent &&
                            typeof donation.assignedAgent === "object" &&
                            donation.assignedAgent.name
                              ? donation.assignedAgent.name
                              : typeof donation.assignedAgent === "string"
                              ? "Agent ID: " + donation.assignedAgent
                              : "Agent assigned"}
                          </div>
                          <div className="agent-phone">
                            {donation.assignedAgent &&
                            typeof donation.assignedAgent === "object" &&
                            donation.assignedAgent.phone
                              ? `Phone: ${donation.assignedAgent.phone}`
                              : ""}
                          </div>
                        </div>
                      ) : (
                        <span className="no-agent">
                          {[
                            "PENDING",
                            "REJECTED",
                            "CANCELLED",
                            "CANCELED",
                          ].includes(donation.status.toUpperCase())
                            ? "Not assigned yet"
                            : "Not assigned yet"}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/donor/donations/${donation._id}`}
                          className="btn btn-sm btn-info text-white"
                          state={{ donation: donation }}
                        >
                          View Details
                        </Link>

                        {donation.status === "PENDING" && (
                          <>
                            <button
                              className="btn btn-sm btn-primary ms-2"
                              onClick={() => handleEditDonation(donation)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => handleCancelDonation(donation._id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditMode(false);
          setCurrentDonation(null);
          setFormData({
            foodType: "",
            foodCategory: "",
            quantity: "",
            expiryDate: "",
            pickupAddress: "",
            pickupTime: "",
            image: null,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Donation" : "Donate Food"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Food Type</Form.Label>
              <Form.Control
                type="text"
                name="foodType"
                value={foodType}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Food Category</Form.Label>
              <Form.Control
                type="text"
                name="foodCategory"
                value={formData.foodCategory || ""}
                onChange={onChange}
                placeholder="e.g., Vegetarian, Non-Vegetarian, Vegan"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                name="quantity"
                value={quantity}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={expiryDate}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Address</Form.Label>
              <Form.Control
                type="text"
                name="pickupAddress"
                value={pickupAddress}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="pickupTime"
                value={pickupTime}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control type="file" name="image" onChange={onChange} />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setCurrentDonation(null);
                  setFormData({
                    foodType: "",
                    foodCategory: "",
                    quantity: "",
                    expiryDate: "",
                    pickupAddress: "",
                    pickupTime: "",
                    image: null,
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? "Update Donation" : "Submit Donation"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DonorDashboard;
