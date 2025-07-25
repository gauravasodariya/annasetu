import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Badge,
  Button,
  Tabs,
  Tab,
  Form,
  Card,
  Modal,
  Image,
  Alert,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../admin/AdminStyles.css";

const NGODonations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get("/api/donations");
      const sortedDonations = res.data.sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
      setDonations(sortedDonations);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get("/api/agents");
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const handleActionClick = (donation, action) => {
    setCurrentDonation(donation);
    setModalAction(action);
    if (action === 'accept') {
      fetchAgents();
      setShowAssignModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleAssignAgent = async () => {
    if (!currentDonation || !selectedAgentId) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };

      const body = JSON.stringify({ assignedAgent: selectedAgentId });

      await axios.put(
        `/api/donations/${currentDonation._id}/assign`,
        body,
        config
      );

      setAlert({
        show: true,
        message: "Donation assigned successfully",
        type: "success",
      });

      setShowAssignModal(false);
      fetchDonations();
    } catch (err) {
      console.error("Error assigning agent:", err);
      setAlert({
        show: true,
        message: "Failed to assign agent",
        type: "danger",
      });
    }
  };

  const handleStatusChange = async () => {
    if (!currentDonation) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };

      let status;
      switch (modalAction) {
        case "complete":
          status = "COMPLETED";
          break;
        case "reject":
          status = "REJECTED";
          break;
        default:
          return;
      }

      const body = JSON.stringify({ status });

      await axios.put(
        `/api/donations/${currentDonation._id}/status`,
        body,
        config
      );

      setAlert({
        show: true,
        message: `Donation ${status.toLowerCase()} successfully`,
        type: "success",
      });

      setShowModal(false);
      fetchDonations();
    } catch (err) {
      console.error("Error updating donation status:", err);
      setAlert({
        show: true,
        message: "Failed to update donation status",
        type: "danger",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDonation(null);
    setModalAction('');
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setCurrentDonation(null);
    setSelectedAgentId('');
  };

  const allDonations = donations.filter(
    (donation) =>
      donation.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingDonations = allDonations.filter(
    (donation) => donation.status === "PENDING"
  );
  const assignedDonations = allDonations.filter(
    (donation) => donation.status === "ASSIGNED"
  );
  const completedDonations = allDonations.filter(
    (donation) => donation.status === "COMPLETED"
  );
  const rejectedDonations = allDonations.filter(
    (donation) => donation.status === "REJECTED"
  );

  const getFilteredDonations = () => {
    switch (activeTab) {
      case "pending":
        return pendingDonations;
      case "assigned":
        return assignedDonations;
      case "completed":
        return completedDonations;
      case "rejected":
        return rejectedDonations;
      default:
        return allDonations;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="warning">PENDING</Badge>;
      case "ASSIGNED":
        return <Badge bg="info">ASSIGNED</Badge>;
      case "COMPLETED":
        return <Badge bg="success">COMPLETED</Badge>;
      case "REJECTED":
        return <Badge bg="danger">REJECTED</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredDonations = getFilteredDonations();

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const indexOfLastDonation = currentPage * itemsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - itemsPerPage;
  const currentDonations = filteredDonations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const DonationTable = ({ donations, onActionClick }) => {
    const handleImageClick = (imagePath) => {
      setSelectedImage(imagePath);
      setShowImageModal(true);
    };

    return (
      <>
        <Table responsive hover className="donation-table">
          <thead className="table-header">
            <tr>
              <th>Donor</th>
              <th>Food Type</th>
              <th>Food Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>AVAILABILITY</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.donor?.name || "Unknown"}</td>
                <td>{donation.foodType}</td>
                <td>{donation.category}</td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td>{getStatusBadge(donation.status)}</td>
                <td>{donation.availability}</td>
                <td>
                  {donation.imagePath && (
                    <img
                      src={`/${donation.imagePath}`}
                      alt={donation.foodType}
                      style={{ width: "50px", cursor: "pointer" }}
                      onClick={() => handleImageClick(`/${donation.imagePath}`)}
                    />
                  )}
                </td>
                <td>
                  <Link to={`/ngo/donations/${donation._id}`}>
                    <Button variant="info" size="sm" className="me-2">
                      View Details
                    </Button>
                  </Link>
                  {donation.status === "PENDING" && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleActionClick(donation, "accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleActionClick(donation, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {donation.status === "ASSIGNED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleActionClick(donation, "complete")}
                    >
                      Mark as Complete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Donations Management</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="mb-4">
        <Card.Header>
          <Tabs
            id="donation-tabs"
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setCurrentPage(1);
            }}
            className="mb-3"
          >
            <Tab eventKey="all" title={`All (${allDonations.length})`}>
              <DonationTable donations={currentDonations} onActionClick={handleActionClick} />
            </Tab>
            <Tab eventKey="pending" title={`Pending (${pendingDonations.length})`}>
              <DonationTable donations={currentDonations} onActionClick={handleActionClick} />
            </Tab>
            <Tab eventKey="assigned" title={`Assigned (${assignedDonations.length})`}>
              <DonationTable donations={currentDonations} onActionClick={handleActionClick} />
            </Tab>
            <Tab eventKey="completed" title={`Completed (${completedDonations.length})`}>
              <DonationTable donations={currentDonations} onActionClick={handleActionClick} />
            </Tab>
            <Tab eventKey="rejected" title={`Rejected (${rejectedDonations.length})`}>
              <DonationTable donations={currentDonations} onActionClick={handleActionClick} />
            </Tab>
          </Tabs>
        </Card.Header>
        <Card.Body>
          <Pagination>
            {[...Array(totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "complete" ? "Complete Donation" : "Reject Donation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {modalAction} this donation?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={modalAction === "complete" ? "success" : "danger"}
            onClick={handleStatusChange}
          >
            {modalAction === "complete" ? "Complete" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAssignModal} onHide={handleCloseAssignModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Agent</Form.Label>
            <Form.Control
              as="select"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignAgent}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Donation Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={selectedImage} fluid />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default NGODonations;

