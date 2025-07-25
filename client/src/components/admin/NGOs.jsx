import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Card,
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const AdminNGOs = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    verified: false,
    role: "ngo",
    password: "",
    status: "active",
  });

  const handleEdit = (ngo) => {
    setSelectedNGO(ngo);
    setFormData({
      name: ngo.name || "",
      email: ngo.email || "",
      phone: ngo.phone || "",
      address: ngo.address || "",
      verified: ngo.verified || false,
      role: "ngo",
      status: ngo.status || "active",
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

    if (!selectedNGO && formData.password.length < 5) {
      setAlert({
        show: true,
        message: "Password must be at least 6 characters long",
        type: "danger",
      });
      return;
    }

    if (selectedNGO && formData.password && formData.password.length < 5) {
      setAlert({
        show: true,
        message: "Password must be at least 6 characters long",
        type: "danger",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      if (selectedNGO) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          status: formData.status,
        };
        if (formData.password) updateData.password = formData.password;

        try {
          await axios.put(`/api/ngos/${selectedNGO._id}`, updateData, config);
        } catch (ngoError) {
          await axios.put(`/api/users/${selectedNGO._id}`, updateData, config);
        }

        setAlert({
          show: true,
          message: "NGO updated successfully",
          type: "success",
        });
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          status: formData.status,
          role: "ngo",
        };

        await axios.post("/api/users/ngo", userData, config);

        setAlert({
          show: true,
          message: "NGO added successfully",
          type: "success",
        });
      }

      setShowModal(false);
      fetchNGOs();
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.msg || "Error saving NGO",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { "x-auth-token": localStorage.getItem("token") },
      };
      try {
        const res = await axios.get("/api/ngos", config);
        setNgos(res.data);
      } catch {
        const res = await axios.get("/api/admin/ngos", config);
        setNgos(res.data);
      }
      setLoading(false);
    } catch (err) {
      setAlert({
        show: true,
        message:
          "Error fetching NGOs: " + (err.response?.data?.msg || err.message),
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddNew = () => {
    setSelectedNGO(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      verified: false,
      role: "ngo",
      password: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this NGO?")) {
      try {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        try {
          await axios.delete(`/api/ngos/${id}`, config);
        } catch {
          await axios.delete(`/api/admin/ngos/${id}`, config);
        }
        setNgos(ngos.filter((ngo) => ngo._id !== id));
        setAlert({
          show: true,
          message: "NGO deleted successfully",
          type: "success",
        });
      } catch (err) {
        setAlert({
          show: true,
          message: err.response?.data?.msg || "Failed to delete NGO",
          type: "danger",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, phone: value });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <Container fluid className="py-4">
      {alert.show && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h2>NGO Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddNew}>
            <i className="fas fa-plus me-2"></i> Add New NGO
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form className="mb-4">
            <InputGroup>
              <Form.Control
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            </InputGroup>
          </Form>

          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="text-center py-3">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#2d2c2c" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </td>
                </tr>
              ) : filteredNGOs.length > 0 ? (
                filteredNGOs.map((ngo) => (
                  <tr key={ngo._id}>
                    <td>{ngo.name}</td>
                    <td>{ngo.email}</td>
                    <td>{ngo.phone}</td>
                    <td>{ngo.address}</td>
                    <td>
                      <Badge
                        bg={
                          ngo.status === "active"
                            ? "success"
                            : ngo.status === "inactive"
                              ? "secondary"
                              : "warning"
                        }
                      >
                        {ngo.status || "Active"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(ngo)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(ngo._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No NGOs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: "#f8f9fa" }}>
          <Modal.Title>{selectedNGO ? "Edit NGO" : "Add New NGO"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NGO Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter NGO name"
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
                    placeholder="Enter email"
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
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    maxLength={10}
                  />
                  <Form.Text className="text-muted">
                    Must be exactly 10 digits.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password {selectedNGO && "(Leave blank to keep current)"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!selectedNGO}
                    minLength={6}
                    placeholder={
                      selectedNGO
                        ? "Enter new password (optional)"
                        : "Enter password (min 5 chars)"
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
                  <Form.Control type="text" value="ngo" disabled readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Form.Control>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedNGO ? "Update NGO" : "Add NGO"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminNGOs;
