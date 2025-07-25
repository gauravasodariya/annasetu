import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import { format } from "date-fns";

const FoodCart = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestNotes, setRequestNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [localAlert, setLocalAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const loadCartItems = () => {
      const items = JSON.parse(localStorage.getItem("selectedFoods") || "[]");
      setCartItems(items);
      setLoading(false);
    };

    loadCartItems();
  }, []);

  const removeFromCart = (foodId) => {
    const updatedCart = cartItems.filter((item) => item._id !== foodId);
    localStorage.setItem("selectedFoods", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setAlert("Item removed from cart", "info");
    setLocalAlert({
      show: true,
      message: "Item removed from cart",
      type: "info",
    });
  };

  const clearCart = () => {
    localStorage.removeItem("selectedFoods");
    setCartItems([]);
    setAlert("Cart cleared", "info");
    setLocalAlert({
      show: true,
      message: "Cart cleared",
      type: "info",
    });
  };

  const handleBulkRequest = async () => {
    if (cartItems.length === 0) {
      setAlert("Your cart is empty", "warning");
      setLocalAlert({
        show: true,
        message: "Your cart is empty",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);

    try {
      const successfulRequests = [];

      for (const food of cartItems) {
        try {
          await axios.post("/api/requests", {
            donationId: food._id,
            foodType: food.foodType,
            foodCategory: food.foodCategory || "Other",
            quantity: food.quantity,
            notes: requestNotes || `Requesting food item: ${food.foodType}`,
          });
          successfulRequests.push(food._id);
        } catch (err) {
          const backendMsg = err.response?.data?.msg || err.response?.data?.error || err.message || 'Unknown error';
          console.error(`Error requesting food item ${food.foodType}:`, backendMsg);
          if (!window.failedRequestErrors) window.failedRequestErrors = [];
          window.failedRequestErrors.push(`Food: ${food.foodType} - ${backendMsg}`);
        }
      }

      if (successfulRequests.length > 0) {
        const remainingItems = cartItems.filter(
          (item) => !successfulRequests.includes(item._id)
        );
        localStorage.setItem("selectedFoods", JSON.stringify(remainingItems));
        setCartItems(remainingItems);

        const message =
          successfulRequests.length === cartItems.length
            ? "All food requests submitted successfully!"
            : `${successfulRequests.length} out of ${cartItems.length} requests submitted successfully.`;

        setAlert(message, "success");
        setLocalAlert({
          show: true,
          message: message,
          type: "success",
        });

        if (remainingItems.length === 0) {
          setRequestNotes("");
        }
      } else {
        // Gather all error reasons
        let errorDetails = '';
        if (window.failedRequestErrors && window.failedRequestErrors.length > 0) {
          errorDetails = window.failedRequestErrors.join('\n');
        }
        setAlert("Failed to submit any requests. Please try again." + (errorDetails ? `\n${errorDetails}` : ''), "danger");
        setLocalAlert({
          show: true,
          message: "Failed to submit any requests. Please try again." + (errorDetails ? `\n${errorDetails}` : ''),
          type: "danger",
        });
        window.failedRequestErrors = [];
      }
    } catch (err) {
      console.error("Error in bulk request process:", err);
      setAlert("Failed to submit request. Please try again.", "danger");
      setLocalAlert({
        show: true,
        message:
          "Failed to submit request: " +
          (err.response?.data?.msg || err.message || ""),
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          {localAlert.show && (
            <Alert
              variant={localAlert.type}
              onClose={() => setLocalAlert({ ...localAlert, show: false })}
              dismissible
              className="mb-4"
            >
              {localAlert.message}
            </Alert>
          )}

          <Card className="shadow-sm border-0 mb-4">
            <Card.Header
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                padding: "15px 20px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i> Food Cart
                </h4>
                <Badge bg="light" text="dark" pill className="px-3 py-2">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {cartItems.length > 0 ? (
                <>
                  <div className="mb-4">
                    {cartItems.map((item) => (
                      <Card key={item._id} className="mb-3 border-0 shadow-sm">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col md={2}>
                              {item.image ? (
                                <img
                                  src={
                                    item.image.startsWith("http")
                                      ? item.image
                                      : `/uploads/${item.image
                                          .split("/")
                                          .pop()}`
                                  }
                                  alt={item.foodType}
                                  className="img-fluid rounded"
                                  style={{
                                    height: "80px",
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  className="d-flex justify-content-center align-items-center bg-light rounded"
                                  style={{ height: "80px" }}
                                >
                                  <i
                                    className="fas fa-utensils"
                                    style={{
                                      fontSize: "2rem",
                                      color: "#adb5bd",
                                    }}
                                  ></i>
                                </div>
                              )}
                            </Col>
                            <Col md={7}>
                              {/* Reduced size of food type */}
                              <h6 className="mb-1">{item.foodType}</h6>
                              <div className="d-flex flex-wrap gap-2 mb-2">
                                <Badge bg="info" className="me-1">
                                  {item.foodCategory}
                                </Badge>
                              </div>
                              <small className="text-muted d-block mb-1">
                                <i className="fas fa-box me-1"></i> Qty:{" "}
                                {item.quantity}
                              </small>
                              <small className="text-muted d-block">
                                <i className="fas fa-calendar-alt me-1"></i>
                                Expires:{" "}
                                {format(
                                  new Date(item.expiryDate),
                                  "MMM dd, yyyy"
                                )}
                              </small>
                            </Col>
                            <Col md={3} className="text-end">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeFromCart(item._id)}
                                className="rounded-pill px-3"
                              >
                                <i className="fas fa-trash-alt me-1"></i> Remove
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  <Form.Group className="mb-4">
                    <Form.Label>Request Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add any special instructions or notes for your request..."
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-secondary"
                      onClick={clearCart}
                      className="px-4"
                    >
                      <i className="fas fa-trash me-1"></i> Clear Cart
                    </Button>
                    <div>
                      <Link
                        to="/request-food"
                        className="btn btn-outline-primary me-2"
                      >
                        <i className="fas fa-arrow-left me-1"></i> Continue
                        Browsing
                      </Link>
                      <Button
                        variant="success"
                        onClick={handleBulkRequest}
                        disabled={submitting}
                        className="px-4"
                      >
                        {submitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Processing...
                          </>
                        ) : (
                          <>Submit Request</>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i
                    className="fas fa-shopping-cart mb-3"
                    style={{ fontSize: "3rem", color: "#adb5bd" }}
                  ></i>
                  <h4 className="mb-3">Your cart is empty</h4>
                  <p className="text-muted mb-4">
                    Browse available food items and add them to your cart.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodCart;
