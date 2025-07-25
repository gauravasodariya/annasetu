import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./AdminStyles.css";

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/contact");
      setInquiries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError("Failed to load inquiries");
      setLoading(false);
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/contact/${id}`, { read: true });
      fetchInquiries(); // Refresh the list
    } catch (err) {
      console.error("Error marking inquiry as read:", err);
    }
  };

  if (loading)
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: "#2d2c2c" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  if (error)
    return (
      <Container fluid className="py-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );

  return (
    <Container fluid className="py-4">
      <div className="admin-section-header">
        <h2>Inquiries</h2>
      </div>

      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message Preview</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <tr key={inquiry._id}>
                <td>{inquiry.name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.message.substring(0, 50)}</td>
                <td>{new Date(inquiry.date).toLocaleDateString()}</td>
                <td>
                  <Badge bg={inquiry.read ? "success" : "warning"}>
                    {inquiry.read ? "Read" : "Unread"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewInquiry(inquiry)}
                  >
                    View
                  </Button>
                  {!inquiry.read && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkAsRead(inquiry._id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No inquiries found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for viewing inquiry details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Inquiry from {selectedInquiry?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInquiry && (
            <>
              <p>
                <strong>Email:</strong> {selectedInquiry.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedInquiry.date).toLocaleString()}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div className="inquiry-message p-3 bg-light rounded">
                {selectedInquiry.message}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {selectedInquiry && !selectedInquiry.read && (
            <Button
              variant="success"
              onClick={() => {
                handleMarkAsRead(selectedInquiry._id);
                handleCloseModal();
              }}
            >
              Mark as Read
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InquiryList;
