import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext, { AlertContext } from "../../context/authContext";
import "./auth.css";

const customSelectStyle = `
  .custom-select option {
    background-color: #2c3e50;
    color: white;
  }
`;

const Register = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();

  const { register, isAuthenticated, error, clearErrors, logout } = authContext;
  const { setAlert, alerts } = alertContext;

  useEffect(() => {
    if (isAuthenticated) {
      setAlert("Registration successful. Please login to continue.", "success");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    }

    if (error) {
      if (error.includes("already exists")) {
        setAlert(
          "This email is already registered. Please use a different email or login.",
          "danger"
        );
      } else {
        setAlert(error, "danger");
      }
      clearErrors();
    }
  }, [error, isAuthenticated]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      setAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      const userData = {
        name,
        email,
        password,
        role: "donor",
        address: null,
        area: null,
        status: "Active",
      };

      register(userData);
    }
  };

  return (
    <>
      <style>{customSelectStyle}</style>
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
                  <h1 className="auth-title">Create Account</h1>
                  <p className="auth-subtitle"></p>
                  {alerts && alerts.length > 0 && (
                    <Alert variant={alerts[0].type} className="mb-3">
                      {alerts[0].msg}
                    </Alert>
                  )}
                  <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        className="auth-input"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        className="auth-input"
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Control
                        className="auth-input"
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        required
                        minLength="6"
                      />
                    </Form.Group>

                    <Button type="submit" className="mt-3 auth-button">
                      Create Account
                    </Button>
                  </Form>

                  <div className="auth-divider" />
                  <p className="auth-alt">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                      Sign in
                    </Link>
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
