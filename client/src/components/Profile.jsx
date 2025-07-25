import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import AuthContext, { AlertContext } from '../context/authContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert, alerts } = alertContext;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      
      });
    }
  }, [user]);

  const { name, email, phone, address
    
  } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authContext.updateProfile(formData);
      setAlertMessage('Profile updated successfully');
      setAlertType('success');
      setShowAlert(true);
      setAlert('Profile updated successfully', 'success');
      setIsEditing(false);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (err) {
      setAlertMessage('Failed to update profile');
      setAlertType('danger');
      setShowAlert(true);
      setAlert('Failed to update profile', 'danger');
    }
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        minHeight: "calc(100vh - 160px)",
      }}
    >
      <Container>
        {showAlert && (
          <Alert 
            variant={alertType} 
            onClose={() => setShowAlert(false)} 
            dismissible
            className="mb-4"
          >
            {alertMessage}
          </Alert>
        )}
        
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <h2
              style={{
                color: "#2d3748",
                fontWeight: "bold",
                position: "relative",
                paddingBottom: "15px",
                marginBottom: "20px",
                fontSize: "2.5rem",
              }}
            >
              My Profile
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  background:
                    "linear-gradient(135deg,rgb(34, 165, 247) 0%, #38f9d7 100%)",
                  borderRadius: "2px",
                }}
              ></div>
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col
                    md={4}
                    className="bg-primary text-white p-4"
                    style={{
                      background:
                        "linear-gradient(135deg,rgb(34, 165, 247) 0%, #38f9d7 100%)",
                    }}
                  >
                    <div className="text-center mb-4 mt-4">
                      <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.2)",
                          border: "4px solid rgba(255,255,255,0.5)",
                        }}
                      >
                        <i
                          className="fas fa-user"
                          style={{ fontSize: "50px", color: "white" }}
                        ></i>
                      </div>
                      <h5 className="text-white-60 mb-4">@{name}</h5>
                     
                      </div>
                    </Col>

                    <Col md={8} className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0" style={{ color: "#2d3748" }}>
                          Personal Information
                        </h4>
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            style={{
                              background:
                                "linear-gradient(135deg,rgb(34, 165, 247) 0%, #38f9d7 100%)",
                              border: "none",
                              padding: "0.5rem 1.5rem",
                              borderRadius: "50px",
                            }}
                          >
                            <i className="fas fa-edit me-2"></i> Edit
                          </Button>
                        ) : null}
                      </div>

                      <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "600", color: "#4a5568" }}
                          >
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-light border-0" : ""}
                            style={{
                              padding: "0.75rem",
                              borderRadius: "8px",
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "600", color: "#4a5568" }}
                          >
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-light border-0" : ""}
                            style={{
                              padding: "0.75rem",
                              borderRadius: "8px",
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "600", color: "#4a5568" }}
                          >
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-light border-0" : ""}
                            style={{
                              padding: "0.75rem",
                              borderRadius: "8px",
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "600", color: "#4a5568" }}
                          >
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={address}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-light border-0" : ""}
                            style={{
                              padding: "0.75rem",
                              borderRadius: "8px",
                            }}
                          />
                        </Form.Group>

                        {isEditing && (
                          <div className="d-flex justify-content-end mt-4">
                            <Button
                              variant="light"
                              className="me-2"
                              onClick={() => setIsEditing(false)}
                              style={{
                                padding: "0.5rem 1.5rem",
                                borderRadius: "50px",
                                fontWeight: "600",
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              style={{
                                background:
                                  "linear-gradient(135deg,rgb(34, 165, 247) 0%, #38f9d7 100%)",
                                border: "none",
                                padding: "0.5rem 1.5rem",
                                borderRadius: "50px",
                                fontWeight: "600",
                              }}
                            >
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </Form>
                    </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Profile;
