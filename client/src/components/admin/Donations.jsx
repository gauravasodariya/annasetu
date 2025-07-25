import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Tabs,
  Tab,
  Form,
  InputGroup,
  Card,
  Modal,
  Image,
  Alert,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminStyles.css";

const AdminDonations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailDonation, setDetailDonation] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/donations");
      const sortedDonations = res.data.sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
      );
      setDonations(sortedDonations);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setLoading(false);
    }
  };

  const allDonations = donations.filter(
    (donation) =>
      donation.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pendingDonations = allDonations.filter(
    (donation) => donation.status === "PENDING",
  );
  const assignedDonations = allDonations.filter(
    (donation) => donation.status === "ASSIGNED",
  );
  const completedDonations = allDonations.filter(
    (donation) => donation.status === "COMPLETED",
  );
  const rejectedDonations = allDonations.filter(
    (donation) => donation.status === "REJECTED",
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
    indexOfLastDonation,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDetails = async (donation) => {
    try {
      setDetailsError("");
      setDetailsLoading(true);
      const { data } = await axios.get(`/api/donations/${donation._id}`);
      setDetailDonation(data?.donation || donation);
      setShowDetailsModal(true);
    } catch (err) {
      setDetailDonation(donation);
      setShowDetailsModal(true);
      setDetailsError("Failed to load latest details; showing cached data.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setDetailDonation(null);
    setDetailsError("");
  };

  const DonationTable = ({ donations }) => {
    const handleImageClick = (imagePath) => {
      setSelectedImage(imagePath);
      setShowImageModal(true);
    };

    if (loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

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
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr key={donation._id} className="donation-row">
                  <td>{donation.donor?.name || "Anonymous"}</td>
                  <td>{donation.foodType || "N/A"}</td>
                  <td>{donation.foodCategory || "Uncategorized"}</td>

                  <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
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
                    {donation?.image ? (
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
                      />
                    ) : (
                      <div className="no-image-placeholder">No image</div>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleOpenDetails(donation)}
                      >
                        View Details
                      </button>
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
        </Table>

        {filteredDonations.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))
              ) : (
                <>
                  {currentPage > 2 && (
                    <Pagination.Item onClick={() => handlePageChange(1)}>
                      1
                    </Pagination.Item>
                  )}
                  {currentPage > 3 && <Pagination.Ellipsis />}

                  {currentPage > 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Pagination.Item>
                  )}
                  <Pagination.Item active>{currentPage}</Pagination.Item>
                  {currentPage < totalPages && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Pagination.Item>
                  )}

                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Pagination.Item>
                  )}
                </>
              )}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}

        <div className="d-flex justify-content-center mt-2">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Items per page:</Form.Label>
            <Form.Select
              style={{ width: "80px" }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Form.Select>
          </Form.Group>
        </div>
      </>
    );
  };

  return (
    <Container fluid className="py-4">
      {alert.show && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <Card className="mb-4 donation-management-card">
        <Card.Header className="donation-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Donations Management</h4>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by donor, food type, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </InputGroup>
            </Form.Group>
          </div>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setCurrentPage(1);
            }}
            className="mb-3"
          >
            <Tab eventKey="all" title={`All (${allDonations.length})`}>
              <DonationTable donations={currentDonations} />
            </Tab>
            <Tab
              eventKey="pending"
              title={`Pending (${pendingDonations.length})`}
            >
              <DonationTable donations={currentDonations} />
            </Tab>
            <Tab
              eventKey="assigned"
              title={`Assigned (${assignedDonations.length})`}
            >
              <DonationTable donations={currentDonations} />
            </Tab>
            <Tab
              eventKey="completed"
              title={`Completed (${completedDonations.length})`}
            >
              <DonationTable donations={currentDonations} />
            </Tab>
            <Tab
              eventKey="rejected"
              title={`Rejected (${rejectedDonations.length})`}
            >
              <DonationTable donations={currentDonations} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Donation Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center image-preview-container">
          <Image src={selectedImage} className="modal-image" fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {showDetailsModal && detailDonation && (
        <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Donation Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsLoading && (
              <div className="text-center py-3">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {detailsError && (
              <Alert variant="warning" className="mb-2">
                {detailsError}
              </Alert>
            )}
            <div className="d-flex align-items-start">
              {detailDonation.image && (
                <Image
                  src={
                    detailDonation.image.startsWith("http")
                      ? detailDonation.image
                      : `/uploads/${detailDonation.image.split("/").pop()}`
                  }
                  alt="Donation"
                  className="donation-image-thumbnail me-3"
                  style={{ maxWidth: "160px" }}
                  fluid
                />
              )}
              <div>
                <div>
                  <strong>Donor:</strong>{" "}
                  {detailDonation.donor?.name || "Unknown"}
                </div>
                <div>
                  <strong>Food Type:</strong> {detailDonation.foodType || "N/A"}
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  {detailDonation.foodCategory ||
                    detailDonation.category ||
                    "N/A"}
                </div>
                <div>
                  <strong>Quantity:</strong> {detailDonation.quantity || "N/A"}
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
                  <strong>Status:</strong> {detailDonation.status || "N/A"}
                </div>
                {detailDonation.assignedAgent && (
                  <div>
                    <strong>Assigned Volunteer:</strong>{" "}
                    {detailDonation.assignedAgent?.name}
                  </div>
                )}
                {detailDonation.description && (
                  <div className="mt-2">
                    <strong>Description:</strong> {detailDonation.description}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminDonations;
