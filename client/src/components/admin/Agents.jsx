import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./AdminStyles.css";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    assignedArea: "",
    isActive: true,
    status: "active", 
  });

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { "x-auth-token": localStorage.getItem("token") },
      };
      const res = await axios.get("/api/agents", config);
      setAgents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setLoading(false);
      setAlert({
        show: true,
        message:
          "Error fetching agents: " + (err.response?.data?.msg || err.message),
        type: "danger",
      });
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name || "",
      email: agent.email || "",
      phone: agent.phone || "",
      address: agent.address || "",
      assignedArea: agent.assignedArea || "",
      isActive: agent.isActive !== false,
      status: agent.status || "active",
      password: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      setAlert({
        show: true,
        message: "Phone number must be exactly 10 digits",
        type: "danger",
      });
      return;
    }

    if (!selectedAgent && formData.password.length < 6) {
      setAlert({
        show: true,
        message: "Password must be at least 6 characters long",
        type: "danger",
      });
      return;
    }
    if (selectedAgent && formData.password && formData.password.length < 6) {
      setAlert({
        show: true,
        message: "Password must be at least 6 characters long",
        type: "danger",
      });
      return;
    }

    try {
      if (selectedAgent) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          assignedArea: formData.assignedArea,
          isActive: formData.isActive,
          status: formData.status, 
          role: "volunteer",
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        const response = await axios.put(
          `/api/agents/${selectedAgent._id}`,
          updateData,
          config,
        );
        console.log("Update response:", response.data);

        setAlert({
          show: true,
          message: "Volunteer updated successfully",
          type: "success",
        });
      } else {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        const response = await axios.post(
          "/api/agents",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            assignedArea: formData.assignedArea,
            role: "volunteer",
            isActive: formData.isActive,
            status: formData.status,
          },
          config,
        );

        console.log("Create response:", response.data);

        setAlert({
          show: true,
          message: "Volunteer added successfully",
          type: "success",
        });
      }

      resetForm();
      setShowModal(false);
      fetchAgents();
    } catch (err) {
      console.error("Error saving volunteer:", err);
      let errorMessage =
        "Error saving volunteer. Please check the form and try again.";
      if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setAlert({
        show: true,
        message: errorMessage,
        type: "danger",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      try {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        await axios.delete(`/api/agents/${id}`, config);
        setAlert({
          show: true,
          message: "Volunteer deleted successfully",
          type: "success",
        });
        fetchAgents();
      } catch (err) {
        console.error("Error deleting volunteer:", err);
        setAlert({
          show: true,
          message:
            "Error deleting volunteer: " +
            (err.response?.data?.msg || err.message),
          type: "danger",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      assignedArea: "",
      isActive: true,
      status: "active",
    });
    setSelectedAgent(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Volunteer Management</h2>
        <Button variant="primary" onClick={handleAddNew}>
          <i className="fas fa-plus me-2"></i> Add New Volunteer
        </Button>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <Card className="donation-management-card">
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "#2d2c2c" }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-users fa-3x text-muted"></i>
              </div>
              <h5 className="text-muted">No Agents Found</h5>
              <p className="text-muted mb-4">
                There are no agents in the system yet.
              </p>
              <Button variant="primary" onClick={handleAddNew}>
                <i className="fas fa-plus me-2"></i> Add Your First Agent
              </Button>
            </div>
          ) : (
            <Table responsive hover className="donation-table">
              <thead className="table-header">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assigned Area</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id} className="donation-row">
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone || "N/A"}</td>
                    <td>{agent.assignedArea || "Not Assigned"}</td>
                    <td>
                      <Badge
                        bg={
                          agent.status === "active"
                            ? "success"
                            : agent.status === "inactive"
                              ? "secondary"
                              : "warning"
                        }
                      >
                        {agent.status || "Active"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(agent)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(agent._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Agent Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: "#f8f9fa" }}>
          <Modal.Title>
            {selectedAgent ? "Edit Agent" : "Add New Agent"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter volunteer full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,10}$/.test(val)) {
                        setFormData({ ...formData, phone: val });
                      }
                    }}
                    placeholder="Enter phone number"
                    required
                  />
                  <Form.Text className="text-muted">
                    Must be exactly 10 digits.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password {selectedAgent && "(Leave blank to keep current)"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!selectedAgent}
                    minLength={6}
                    placeholder={
                      selectedAgent
                        ? "Enter new password (optional)"
                        : "Enter password (min 6 chars)"
                    }
                  />
                  <Form.Text className="text-muted">
                    Minimum 6 characters required.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    value="volunteer"
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Assigned Area</Form.Label>
              <Form.Control
                type="text"
                name="assignedArea"
                value={formData.assignedArea}
                onChange={handleChange}
                placeholder="Enter assigned area"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedAgent ? "Update Agent" : "Add Agent"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminAgents;
