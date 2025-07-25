import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/authContext';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  useEffect(() => {
    loadUser();
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('/api/donations/donor', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      const sortedDonations = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setDonations(sortedDonations);
      setLoading(false);
    } catch (err) {
      setError('Failed to load donations');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'ASSIGNED':
        return <Badge bg="info">Assigned</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      case 'REJECTED':
        return <Badge bg="danger">Rejected</Badge>;
      case 'CANCELLED':
      case 'CANCELED':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  <Card.Text className="mb-1">
    <strong>Pickup:</strong> {donation.pickupTime ? 
      new Date(donation.pickupTime).toLocaleDateString() : 
      new Date(donation.createdAt).toLocaleDateString()}
  </Card.Text>
  
  if (loading) return <div className="text-center py-5">Loading...</div>;
  
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 style={{ color: "#2d3748", fontWeight: "700" }}>Your Donations</h2>
          <p className="text-muted">Track the status of your food donations</p>
        </Col>
        <Col xs="auto">
          <Button 
            href="/donate" 
            variant="outline-primary"
          >
            + New Donation
          </Button>
        </Col>
      </Row>
      
      {donations.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <h4>No donations yet</h4>
            <p className="text-muted">You haven't made any food donations yet.</p>
            <Button 
              href="/donate" 
              variant="primary"
              style={{
                backgroundColor: "#00bcd4",
                border: "none",
                borderRadius: "50px",
                padding: "10px 30px"
              }}
            >
              Donate Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {donations.map(donation => (
            <Col md={6} lg={4} className="mb-4" key={donation._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{donation.foodType}</h5>
                    {getStatusBadge(donation.status)}
                  </div>
                  
                  <Card.Text className="mb-1">
                    <strong>Quantity:</strong> {donation.quantity}
                  </Card.Text>
                  
                  <Card.Text className="mb-1">
                    <strong>Pickup:</strong> {new Date(donation.pickupDate).toLocaleDateString()} at {donation.pickupTime}
                  </Card.Text>
                  
                  <Card.Text className="mb-1">
                    <strong>Address:</strong> {donation.pickupAddress}
                  </Card.Text>
                  
                  <Card.Text className="text-muted mt-3 small">
                    Submitted on {new Date(donation.createdAt).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DonationHistory;
