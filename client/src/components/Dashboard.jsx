import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user, loading, loadUser } = authContext;

  useEffect(() => {
    loadUser();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>Welcome, {user.username}</h2>
          <p className="text-muted">Dashboard</p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Your Profile</Card.Title>
              <Card.Text>View and update your profile information.</Card.Text>
              <Link to="/profile" className="mt-auto">
                <Button variant="outline-primary" className="w-100">
                  View Profile
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Donate Food</Card.Title>
              <Card.Text>Schedule a food donation pickup.</Card.Text>
              <Link to="/donate" className="mt-auto">
                <Button variant="outline-success" className="w-100">
                  Donate Now
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Your Donations</Card.Title>
              <Card.Text>View your donation history and status.</Card.Text>
              <Link to="/donations" className="mt-auto">
                <Button variant="outline-info" className="w-100">
                  View History
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
