import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });

      setLoading(false);
      setSuccessMessage(
        "Password reset link has been sent to your email."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      const errorMsg =
        error.response?.data?.msg ||
        "Failed to send reset link. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <Container className="py-5 auth-page">
      <Row className="justify-content-center">
        <Col md={7} lg={6} xl={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="auth-card">
              <Card.Body className="p-4">
                <h1 className="auth-title">Forgot Password</h1>
                <p className="auth-subtitle">
                  Enter your email to receive a reset link
                </p>

                {successMessage && (
                  <Alert variant="success" className="mb-3">
                    {successMessage}
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="danger" className="mb-3">
                    {errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      className="auth-input"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || !!successMessage}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading || !!successMessage}
                    className="auth-button"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="auth-divider" />
                  <p className="auth-alt">
                    Remember your password?{" "}
                    <Link to="/login" className="auth-link">
                      Login
                    </Link>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
