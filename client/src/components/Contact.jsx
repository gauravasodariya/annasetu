import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { name, email, message } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const body = JSON.stringify(formData);
      
      const res = await axios.post('/api/contact', body, config);
      
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
    } catch (err) {
      console.error('Error sending message:', err.response?.data?.msg || err.message);
      setSubmitStatus({ 
        type: 'error', 
        message: err.response?.data?.msg || 'Failed to send message. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card style={{ 
            borderRadius: "15px", 
            border: "none", 
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            overflow: "hidden",
            backgroundColor: "#f8fafc"
          }}>
            <Card.Body className="p-0">
              <Row className="g-0">
                <Col md={6} className="p-4 p-md-5">
                  <h2 style={{ 
                    color: "#2d3748", 
                    fontWeight: "700", 
                    marginBottom: "25px",
                    textAlign: "center"
                  }}>
                    Contact us
                  </h2>
                  
                  {submitStatus && (
                    <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mb-4`}>
                      {submitStatus.message}
                    </div>
                  )}
                  
                  <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                        style={{ 
                          padding: "12px 15px",
                          backgroundColor: "#edf2f7",
                          border: "none",
                          borderRadius: "8px"
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        style={{ 
                          padding: "12px 15px",
                          backgroundColor: "#edf2f7",
                          border: "none",
                          borderRadius: "8px"
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Message"
                        name="message"
                        value={message}
                        onChange={onChange}
                        required
                        style={{ 
                          padding: "12px 15px",
                          backgroundColor: "#edf2f7",
                          border: "none",
                          borderRadius: "8px",
                          resize: "none"
                        }}
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      style={{
                        backgroundColor: "#00bcd4",
                        border: "none",
                        padding: "12px 0",
                        borderRadius: "50px",
                        fontWeight: "600",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => {
                        if (!loading) {
                          e.currentTarget.style.backgroundColor = "#00a5bb";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#00bcd4";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Col>
                
                <Col md={6} className="d-flex align-items-center justify-content-center" style={{ 
                  backgroundColor: "#e6f7fb",
                  padding: "20px"
                }}>
                  <div className="text-center">
                    <img 
                      src="/images/food-donation-5.webp" 
                      alt="Food Donation" 
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;