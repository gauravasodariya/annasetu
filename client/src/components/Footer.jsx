import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext, { AlertContext } from "../context/authContext";

const Footer = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  const handleDonateClick = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAlert('Please login to donate food', 'info');
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'donor') {
      setAlert('Only donors can access the donation page', 'warning');
      return;
    }
    
    navigate('/donate');
  };

  return (
    <footer style={{ 
      background: "#2d3748", 
      color: "white",
      padding: "30px 0 20px" 
    }}>
      <Container>
        <Row className="mb-4"> 
          <Col lg={4} md={6} className="mb-3 mb-lg-0">
            <h5 style={{ 
              fontWeight: "700", 
              marginBottom: "15px", 
              fontSize: "1.1rem"
            }}>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li className="mb-2">
                <Link to="/" style={{ 
                  color: "#cbd5e0", 
                  textDecoration: "none",
                  transition: "color 0.3s ease, padding-left 0.3s ease",
                  display: "inline-block",
                  paddingLeft: "0",
                  position: "relative"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#38f9d7";
                  e.currentTarget.style.paddingLeft = "8px";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#cbd5e0";
                  e.currentTarget.style.paddingLeft = "0";
                }}>
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: "0.8rem" }}></i>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" style={{ 
                  color: "#cbd5e0", 
                  textDecoration: "none",
                  transition: "color 0.3s ease, padding-left 0.3s ease",
                  display: "inline-block",
                  paddingLeft: "0",
                  position: "relative"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#38f9d7";
                  e.currentTarget.style.paddingLeft = "8px";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#cbd5e0";
                  e.currentTarget.style.paddingLeft = "0";
                }}>
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: "0.8rem" }}></i>
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" style={{ 
                  color: "#cbd5e0", 
                  textDecoration: "none",
                  transition: "color 0.3s ease, padding-left 0.3s ease",
                  display: "inline-block",
                  paddingLeft: "0",
                  position: "relative"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#38f9d7";
                  e.currentTarget.style.paddingLeft = "8px";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#cbd5e0";
                  e.currentTarget.style.paddingLeft = "0";
                }}>
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: "0.8rem" }}></i>
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" 
                  onClick={handleDonateClick}
                  style={{ 
                    color: "#cbd5e0", 
                    textDecoration: "none",
                    transition: "color 0.3s ease, padding-left 0.3s ease",
                    display: "inline-block",
                    paddingLeft: "0",
                    position: "relative"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#38f9d7";
                    e.currentTarget.style.paddingLeft = "8px";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#cbd5e0";
                    e.currentTarget.style.paddingLeft = "0";
                  }}>
                    <i className="fas fa-chevron-right me-2" style={{ fontSize: "0.8rem" }}></i>
                    Donate Food
                  </a>
                </li>
            </ul>
          </Col>
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 style={{ 
              fontWeight: "700", 
              marginBottom: "20px",
              fontSize: "1.1rem"
            }}>Contact</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li className="mb-3" style={{ color: "#cbd5e0" }}>
                <a href="mailto:info@annasetu.org" style={{ 
                  color: "#cbd5e0", 
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#38f9d7"}
                onMouseOut={(e) => e.currentTarget.style.color = "#cbd5e0"}>
                  <div style={{ 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    backgroundColor: "#38f9d7", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <i className="fas fa-envelope" style={{ color: "#2d3748" }}></i>
                  </div>
                  <span>info@annasetu.org</span>
                </a>
              </li>
              <li className="mb-3" style={{ color: "#cbd5e0" }}>
                <a href="https://wa.me/919876543210" style={{ 
                  color: "#cbd5e0", 
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#38f9d7"}
                onMouseOut={(e) => e.currentTarget.style.color = "#cbd5e0"}>
                  <div style={{ 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    backgroundColor: "#38f9d7", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <i className="fab fa-whatsapp" style={{ color: "#2d3748" }}></i>
                  </div>
                  <span>WhatsApp Us</span>
                </a>
              </li>
            </ul>
          </Col>
          <Col lg={4} md={6}>
            <h5 style={{ 
              fontWeight: "700", 
              marginBottom: "15px",
              fontSize: "1.1rem"
            }}>Connect With Us</h5>
            <div className="d-flex flex-wrap mb-3"> 
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />              <a href="https://facebook.com" className="me-3 mb-2" style={{ 
                color: "#3b5998",
                background: "rgba(255, 255, 255, 0.1)",
                width: "36px", 
                height: "36px", 
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }} 
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#3b5998";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-5px)";
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#3b5998";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <i className="fab fa-facebook-f" style={{ fontSize: "16px" }}></i> 
              </a>
              <a href="https://twitter.com" className="me-3 mb-3" style={{ 
                color: "#1da1f2",
                background: "rgba(255, 255, 255, 0.1)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#1da1f2";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-5px)";
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#1da1f2";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <i className="fab fa-twitter" style={{ fontSize: "18px" }}></i>
              </a>
              <a href="https://instagram.com" className="me-3 mb-3" style={{ 
                color: "#e1306c",
                background: "rgba(255, 255, 255, 0.1)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e1306c";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-5px)";
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#e1306c";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <i className="fab fa-instagram" style={{ fontSize: "18px" }}></i>
              </a>
              <a href="mailto:info@annasetu.org" className="me-3 mb-3" style={{ 
                color: "#d44638",
                background: "rgba(255, 255, 255, 0.1)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#d44638";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-5px)";
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#d44638";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <i className="fas fa-envelope" style={{ fontSize: "18px" }}></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "20px 0" }} /> 
        <Row>
          <Col md={6} className="mb-2 mb-md-0"> 
            <p className="mb-0" style={{ color: "#a0aec0", fontSize: "0.9rem" }}> 
              © 2025 AnnaSetu. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link to="/privacy" style={{ color: "#a0aec0", textDecoration: "none", marginRight: "20px", fontSize: "0.9rem" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: "#a0aec0", textDecoration: "none", fontSize: "0.9rem" }}>Terms of Service</Link> 
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
