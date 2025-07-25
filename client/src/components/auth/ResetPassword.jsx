import React, { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "./auth.css";
import axios from "axios";
import { AlertContext } from "../../context/authContext";

const ResetPassword = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [success, setSuccess] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.get(`/api/auth/reset-password/${token}`);
        setTokenValid(true);
        setTokenChecked(true);
      } catch (err) {
        console.error("Invalid or expired token:", err);
        setTokenValid(false);
        setTokenChecked(true);
      }
    };

    checkToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setAlert("Passwords do not match", "danger");
      return;
    }

    if (password.length < 6) {
      setAlert("Password must be at least 6 characters", "danger");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`/api/auth/reset-password/${token}`, { password });

      setSuccess(true);
      setAlert("Password has been reset successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setAlert(
        err.response?.data?.msg ||
          "Failed to reset password. Please try again.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <Container className="py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <Spinner
            animation="border"
            role="status"
            style={{ color: "#4dd0e1" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card
              style={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Body
                className="p-4 text-center"
                style={{ backgroundColor: "#2c3e50", color: "white" }}
              >
                <Alert variant="danger">
                  Invalid or expired password reset link.
                </Alert>
                <Link
                  to="/forgot-password"
                  className="btn btn-primary mt-3"
                  style={{
                    backgroundColor: "#4dd0e1",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "4px",
                  }}
                >
                  Request New Reset Link
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5 auth-page">
      <Row className="justify-content-center">
        <Col md={7} lg={6} xl={5}>
          <Card className="auth-card">
            <Card.Body className="p-4">
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">
                Enter and confirm your new password
              </p>

              {alertContext.alerts && alertContext.alerts.length > 0 && (
                <Alert variant={alertContext.alerts[0].type} className="mb-3">
                  {alertContext.alerts[0].msg}
                </Alert>
              )}

              {success ? (
                <div className="text-center">
                  <Alert variant="success">
                    Password reset successfully. You can now{" "}
                    <Link to="/login" className="auth-link">
                      Login
                    </Link>
                    .
                  </Alert>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      className="auth-input"
                      type="password"
                      name="password"
                      placeholder="New Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Control
                      className="auth-input"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="auth-button"
                  >
                    {loading ? "Saving..." : "Reset Password"}
                  </Button>

                  <div className="auth-divider" />
                  <p className="auth-alt">
                    Remember your password?{" "}
                    <Link to="/login" className="auth-link">
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
