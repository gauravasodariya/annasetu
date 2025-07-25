import React, { useState, useContext, useEffect } from "react";
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
import "./auth.css";
import AuthContext, { AlertContext } from "../../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { login, googleLogin, error, clearErrors, isAuthenticated } =
    authContext;
  const { setAlert } = alertContext;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
      setAlert("Login successful", "success");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }

    if (error) {
      if (
        error.toLowerCase().includes("password") ||
        error.toLowerCase().includes("invalid credentials")
      ) {
        setAlert(
          "Wrong password. Try again or click Forgot password to reset it.",
          "danger"
        );
      } else if (error.toLowerCase().includes("invalid")) {
        setAlert(
          "Invalid email or password. Please check your credentials.",
          "danger"
        );
      } else {
        setAlert(error, "danger");
      }
      setLoading(false);
      clearErrors();
    }
  }, [error, isAuthenticated, navigate]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please fill in all fields", "danger");
    } else {
      setLoading(true);
      login({
        email,
        password,
      });
    }
  };

  const googleSuccess = async (res) => {
    const token = res?.credential;
    try {
      setLoading(true);
      await googleLogin(token);
    } catch (err) {
      console.error(err);
      setAlert("Google Sign In was unsuccessful. Try again later", "danger");
      setLoading(false);
    }
  };

  const googleFailure = (err) => {
    console.error(err);
    setAlert("Google Sign In was unsuccessful. Try again later", "danger");
  };

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.log("Google Client ID:", clientId);

    if (!clientId) {
      console.warn(
        "Google Client ID not found. Please set REACT_APP_GOOGLE_CLIENT_ID in your environment variables."
      );
      setAlert(
        "Google Sign-In not configured. Please set REACT_APP_GOOGLE_CLIENT_ID.",
        "warning"
      );
      return;
    }

    const renderGoogleButton = () => {
      const googleButtonDiv = document.getElementById("googleSignInDiv");
      console.log("Google button div:", googleButtonDiv);

      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        try {
          console.log("Initializing Google Sign-In with client ID:", clientId);
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: googleSuccess,
          });

          if (googleButtonDiv) {
            console.log("Rendering Google button");
            window.google.accounts.id.renderButton(googleButtonDiv, {
              type: "standard",
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular",
              locale: "en_US",
            });
          } else {
            console.error("googleSignInDiv not found in DOM");
          }
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
          setAlert(
            "Google Sign-In initialization failed. Please try again later.",
            "danger"
          );
        }
      } else {
        console.warn("Google accounts API not yet loaded, retrying...");
        setTimeout(renderGoogleButton, 500);
      }
    };

    if (!document.getElementById("google-identity")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-identity";
      script.onload = () => {
        console.log("Google script loaded");
        renderGoogleButton();
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services script");
        setAlert(
          "Failed to load Google Sign-In. Please check your internet connection.",
          "danger"
        );
      };
      document.body.appendChild(script);
      console.log("Google script appended to DOM");
    } else {
      console.log("Google script already loaded, rendering button");
      renderGoogleButton();
    }

  }, []);

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
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>
                {alertContext.alerts && alertContext.alerts.length > 0 && (
                  <Alert variant={alertContext.alerts[0].type} className="mb-3">
                    {alertContext.alerts[0].msg}
                  </Alert>
                )}
                <Form onSubmit={onSubmit}>
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

                  <Form.Group className="mb-2">
                    <Form.Control
                      className="auth-input"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      required
                    />
                  </Form.Group>

                  <div className="auth-actions">
                    <Link to="/forgot-password" className="auth-link">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="mt-3 auth-button"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>

                <div className="auth-divider" />
                <div className="mt-4">
                  <p className="text-center text-muted mb-3">
                    Or continue with
                  </p>
                  <div className="d-flex justify-content-center">
                    <div
                      id="googleSignInDiv"
                      className="google-signin-container"
                    />
                  </div>
                </div>

                <p className="auth-alt mt-3">
                  Don’t have an account?{" "}
                  <Link to="/register" className="auth-link">
                    Sign up
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
