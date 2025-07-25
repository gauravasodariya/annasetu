import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../admin/AdminStyles.css';

const NGORequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/requests/${id}`);
        setRequest(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('Failed to load request details. Please try again.');
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">PENDING</Badge>;
      case 'accepted':
        return <Badge bg="success">ACCEPTED</Badge>;
      case 'rejected':
        return <Badge bg="danger">REJECTED</Badge>;
      case 'completed':
        return <Badge bg="info">COMPLETED</Badge>;
      case 'canceled':
        return <Badge bg="secondary">CANCELED</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
      try {
        await axios.put(`/api/requests/cancel/${id}`);
        const res = await axios.get(`/api/requests/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error('Error cancelling request:', err);
        setError('Failed to cancel request. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/ngo/requests')}>
          Back to Requests
        </Button>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Request not found</Alert>
        <Button variant="primary" onClick={() => navigate('/ngo/requests')}>
          Back to Requests
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#4dd0e1' }}>Request Details</h2>
        <Button variant="outline-primary" onClick={() => navigate('/ngo/requests')}>
          Back to Requests
        </Button>
      </div>

      <Card className="donation-management-card mb-4">
        <Card.Header className="donation-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Request Information</h4>
            <div>{getStatusBadge(request.status)}</div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Food Type:</Col>
            <Col md={9}>{request.foodType}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Food Category:</Col>
            <Col md={9}>{request.foodCategory || 'N/A'}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Quantity:</Col>
            <Col md={9}>{request.quantity}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Notes:</Col>
            <Col md={9}>{request.notes || 'N/A'}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Status:</Col>
            <Col md={9}>{getStatusBadge(request.status)}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={3} className="fw-bold">Created Date:</Col>
            <Col md={9}>{new Date(request.createdAt).toLocaleString()}</Col>
          </Row>
          
          {/* Add food image display */}
          {request.donation && request.donation.image && (
            <Row className="mb-3">
              <Col md={3} className="fw-bold">Food Image:</Col>
              <Col md={9}>
                <img
                  src={
                    request.donation.image.startsWith("http")
                      ? request.donation.image
                      : `/uploads/${request.donation.image.split("/").pop()}`
                  }
                  alt="Donated Food"
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                />
              </Col>
            </Row>
          )}
          
          {request.updatedAt && (
            <Row className="mb-3">
              <Col md={3} className="fw-bold">Last Updated:</Col>
              <Col md={9}>{new Date(request.updatedAt).toLocaleString()}</Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-end">
            {request.status.toLowerCase() === 'pending' && (
              <Button 
                variant="danger" 
                onClick={handleCancel}
              >
                Cancel Request
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>

      {request.adminNotes && (
        <Card className="donation-management-card">
          <Card.Header className="donation-card-header">
            <h4 className="mb-0">Admin Notes</h4>
          </Card.Header>
          <Card.Body>
            <p>{request.adminNotes}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default NGORequestDetails;
