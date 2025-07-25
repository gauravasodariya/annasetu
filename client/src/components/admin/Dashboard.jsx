import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import axios from "axios";

const AdminDashboard = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const [donations, setDonations] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [agents, setAgents] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all donations with donor information
        const donationsRes = await axios.get("/api/donations");
        console.log("Donations data:", donationsRes.data);
        setDonations(donationsRes.data);

        // Fetch NGO requests
        const ngoRequestsRes = await axios.get("/api/requests");
        setNgoRequests(ngoRequestsRes.data);

        // Fetch agents
        const agentsRes = await axios.get("/api/agents");
        setAgents(agentsRes.data);

        // Fetch NGOs
        const ngosRes = await axios.get("/api/ngos");
        setNgos(ngosRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response) {
          console.error("Error response:", err.response);
        }
        setLoading(false);
      }
    };

    fetchData();

    // Set up interval to refresh data every minute
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Filter donations by status
  const pendingDonations = donations.filter(
    (donation) => donation.status === "PENDING",
  );
  const assignedDonations = donations.filter(
    (donation) => donation.status === "ASSIGNED",
  );
  const completedDonations = donations.filter(
    (donation) => donation.status === "COMPLETED",
  );

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
        return <Badge bg="secondary">Cancelled</Badge>;
      default:
        return <Badge bg="primary">{status || "Pending"}</Badge>;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Container fluid className="py-4">
      {alert.show && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert({ ...alert, show: false })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{donations.length}</h3>
              <p className="mb-0">Total Donations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{pendingDonations.length}</h3>
              <p className="mb-0">Pending Donations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{agents.length}</h3>
              <p className="mb-0">Volunteers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{ngos.length}</h3>
              <p className="mb-0">NGOs</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Donations */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Recent Donations</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Food Type</th>
                <th>Quantity</th>
                <th>Pickup Address</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.slice(0, 10).map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.donor?.name || "Unknown"}</td>
                    <td>{donation.foodType}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.pickupAddress}</td>
                    <td>{getStatusBadge(donation.status)}</td>
                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/donations/${donation._id}`}>
                        <Button variant="info" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
