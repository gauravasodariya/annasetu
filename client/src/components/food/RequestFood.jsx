import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import AuthContext, { AlertContext } from "../../context/authContext";
import { format } from "date-fns";

const customStyles = `
  .custom-badge.badge {
    background-color: rgb(35, 184, 173) !important;
    color: white !important;
  }
`;

const RequestFood = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user } = authContext;
  const { setAlert } = alertContext;

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    foodType: "",
    foodCategory: "",
  });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const defaultFoodCategories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Protein",
    "Snacks",
    "Beverages",
    "Other",
  ];
  const [foodCategories, setFoodCategories] = useState([]);
  const [localAlert, setLocalAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/api/donations/available");
        console.log("API Response:", res.data);
        setFoods(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food items:", err);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    const fetchFoodCategories = async () => {
      try {
        const res = await axios.get("/api/donations/categories");
        console.log("Categories API Response:", res.data);
        if (res.data && Array.isArray(res.data)) {
          setFoodCategories(res.data);
        } else {
          setFoodCategories([
            "Vegetables",
            "Fruits",
            "Grains",
            "Dairy",
            "Protein",
            "Snacks",
            "Beverages",
            "Other",
          ]);
        }
      } catch (err) {
        console.error("Error fetching food categories:", err);
        setFoodCategories([
          "Vegetables",
          "Fruits",
          "Grains",
          "Dairy",
          "Protein",
          "Snacks",
          "Beverages",
          "Other",
        ]);
      }
    };

    fetchFoodCategories();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      foodType: "",
      foodCategory: "",
    });
  };

  const filteredFoods = foods.filter((food) => {
    if (
      filters.foodType &&
      food.foodType.toLowerCase() !== filters.foodType.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.foodCategory &&
      food.foodCategory &&
      food.foodCategory.toLowerCase() !== filters.foodCategory.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleRequestFood = async () => {
    try {
      await axios.post("/api/requests", {
        donationId: selectedFood._id,
        foodType: selectedFood.foodType,
        foodCategory: selectedFood.foodCategory,
        quantity: selectedFood.quantity,
        notes: `Requesting food item: ${selectedFood.foodType}`,
      });

      setAlert("Food request submitted successfully", "success");
      setLocalAlert({
        show: true,
        message: "Food request submitted successfully",
        type: "success",
      });
      setShowModal(false);

      const res = await axios.get("/api/donations/available");
      setFoods(res.data);
    } catch (err) {
      console.error("Error submitting request:", err);
      setAlert("Failed to submit request", "danger");
      setLocalAlert({
        show: true,
        message: "Failed to submit request: " + (err.response?.data?.msg || ""),
        type: "danger",
      });
    }
  };

  const addToSelectedList = (food) => {
    // Get current cart items from localStorage
    const currentCart = JSON.parse(
      localStorage.getItem("selectedFoods") || "[]",
    );

    // Check if food is already in the cart
    if (!currentCart.some((item) => item._id === food._id)) {
      const updatedCart = [...currentCart, food];
      localStorage.setItem("selectedFoods", JSON.stringify(updatedCart));
      setSelectedFoods(updatedCart);
      setAlert("Food added to cart", "success");
      // Add local alert
      setLocalAlert({
        show: true,
        message: "Food added to cart",
        type: "success",
      });
    } else {
      setAlert("This food is already in your cart", "info");
      // Add local alert
      setLocalAlert({
        show: true,
        message: "This food is already in your cart",
        type: "info",
      });
    }
  };

  const removeFromSelectedList = (foodId) => {
    setSelectedFoods(selectedFoods.filter((food) => food._id !== foodId));
    setAlert("Food removed from your selection", "info");
    // Add local alert
    setLocalAlert({
      show: true,
      message: "Food removed from your selection",
      type: "info",
    });
  };

  console.log("Extracted food categories:", foodCategories);

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

  const saveSelectedFoods = () => {
    if (selectedFoods.length > 0) {
      localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
      setAlert("Food items saved to your selection list", "success");
      setLocalAlert({
        show: true,
        message: "Food items saved to your selection list",
        type: "success",
      });
    } else {
      setAlert("No food items selected to save", "info");
      setLocalAlert({
        show: true,
        message: "No food items selected to save",
        type: "info",
      });
    }
  };

  return (
    <>
      <style>
        {`
          .custom-badge.badge {
            background-color: rgb(35, 184, 173) !important;
            color: white !important;
          }
        `}
      </style>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={12} className="px-4">
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

            <Card
              className="mb-4 shadow"
              style={{ borderRadius: "10px", border: "none" }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#2c3e50",
                  color: "white",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  padding: "15px 20px",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Find Food</h5>
                </div>
              </Card.Header>

              <Card.Body style={{ padding: "20px" }}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "600" }}>
                        Food Type
                      </Form.Label>
                      <Form.Select
                        name="foodType"
                        value={filters.foodType}
                        onChange={handleFilterChange}
                        style={{
                          borderRadius: "8px",
                          padding: "10px",
                          boxShadow: "none",
                          borderColor: "#ddd",
                        }}
                      >
                        <option value="">Select Food Type</option>
                        <option value="cooked">Cooked Food</option>
                        <option value="raw">Raw Food</option>
                        <option value="packaged">Packaged Food</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "600" }}>
                        Food Category
                      </Form.Label>
                      <Form.Select
                        name="foodCategory"
                        value={filters.foodCategory}
                        onChange={handleFilterChange}
                        style={{
                          borderRadius: "8px",
                          padding: "10px",
                          boxShadow: "none",
                          borderColor: "#ddd",
                        }}
                      >
                        <option value="">All Categories</option>
                        {foodCategories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      variant="outline-secondary"
                      onClick={clearFilters}
                      style={{
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontWeight: "500",
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        width: "auto",
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <Col md={3} sm={6} xs={12} className="mb-4" key={food._id}>
                    <Card
                      className="h-100 shadow"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "12px",
                        border: "none",
                        overflow: "hidden",
                        height: "100%",
                      }}
                      onClick={() => handleFoodClick(food)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.1)";
                      }}
                    >
                      <div
                        style={{
                          height: "220px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {food.image ? (
                          <Card.Img
                            variant="top"
                            src={
                              food.image
                                ? food.image.startsWith("http")
                                  ? food.image
                                  : `/uploads/${food.image.split("/").pop()}`
                                : ""
                            }
                            alt={food.foodType}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height: "100%",
                              backgroundColor: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i
                              className="fas fa-utensils"
                              style={{ fontSize: "2.5rem", color: "#adb5bd" }}
                            ></i>
                          </div>
                        )}
                        <Badge
                          className="custom-badge"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            backgroundColor: "rgb(35, 184, 173)",
                            color: "white",
                            fontWeight: "500",
                          }}
                        >
                          {food.foodCategory}
                        </Badge>
                      </div>
                      <Card.Body style={{ padding: "25px" }}>
                        <Card.Title
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            color: "#2c3e50",
                            marginBottom: "15px",
                          }}
                        >
                          {food.foodType}
                        </Card.Title>
                        <Card.Text
                          style={{
                            color: "#6c757d",
                            fontSize: "0.9rem",
                            marginBottom: "10px",
                          }}
                        >
                          <i className="fas fa-calendar-alt me-2"></i>
                          Expires:{" "}
                          {format(new Date(food.expiryDate), "MMM dd, yyyy")}
                          {new Date(food.expiryDate) <=
                            new Date(
                              new Date().setDate(new Date().getDate() + 2),
                            ) && (
                            <Badge
                              bg="danger"
                              className="ms-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Expiring Soon
                            </Badge>
                          )}
                        </Card.Text>
                        <Card.Text
                          style={{ color: "#6c757d", fontSize: "0.9rem" }}
                        >
                          <i className="fas fa-box me-2"></i>
                          Quantity: {food.quantity}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer
                        style={{
                          backgroundColor: "transparent",
                          borderTop: "1px solid #eee",
                          padding: "12px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToSelectedList(food);
                          }}
                          style={{
                            borderRadius: "20px",
                            padding: "8px 12px",
                            fontSize: "0.90rem",
                            width: "100%",
                            backgroundColor: "rgb(12 175 169)",
                            borderColor: "rgb(12 175 169)",
                          }}
                        >
                          <i className="fas fa-cart-plus me-1"></i> Add to Cart
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center py-5">
                  <div
                    style={{
                      padding: "40px 20px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "10px",
                    }}
                  >
                    <i
                      className="fas fa-search mb-3"
                      style={{ fontSize: "2rem", color: "#6c757d" }}
                    ></i>
                    <p style={{ fontSize: "1.1rem", color: "#495057" }}>
                      No food items available matching your filters.
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          {selectedFood && (
            <>
              <Modal.Header
                closeButton
                style={{
                  backgroundColor: "#2c3e50",
                  color: "white",
                  border: "none",
                  padding: "20px",
                }}
              >
                <Modal.Title>{selectedFood.foodType}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ padding: "25px" }}>
                <Row>
                  <Col md={6}>
                    {selectedFood?.image ? (
                      <img
                        src={
                          selectedFood.image.startsWith("http")
                            ? selectedFood.image
                            : `/uploads/${selectedFood.image.split("/").pop()}`
                        }
                        alt={selectedFood.foodType}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "300px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    ) : (
                      <img
                        src="/images/default-food.jpg"
                        alt={selectedFood.foodType}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "300px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    )}
                  </Col>
                  <Col md={6}>
                    <h5
                      className="mb-4"
                      style={{ color: "#2c3e50", fontWeight: "600" }}
                    >
                      Food Details
                    </h5>
                    <div
                      className="mb-3 pb-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <p>
                        <strong>Food Type:</strong> {selectedFood.foodType}
                      </p>
                    </div>
                    <div
                      className="mb-3 pb-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <p>
                        <strong>Category:</strong> {selectedFood.foodCategory}
                      </p>
                    </div>
                    <div
                      className="mb-3 pb-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <p>
                        <strong>Quantity:</strong> {selectedFood.quantity}
                      </p>
                    </div>
                    <div
                      className="mb-3 pb-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <p>
                        <strong>Expiry Date:</strong>{" "}
                        {format(
                          new Date(selectedFood.expiryDate),
                          "MMMM dd, yyyy",
                        )}
                      </p>
                    </div>

                    {selectedFood.description && (
                      <div className="mb-3">
                        <p>
                          <strong>Description:</strong>{" "}
                          {selectedFood.description}
                        </p>
                      </div>
                    )}
                    {/* Donor Info Section */}
                    {selectedFood.donor && (
                      <div
                        className="mb-3"
                        style={{
                          borderTop: "1px solid #eee",
                          paddingTop: "15px",
                        }}
                      >
                        <h6 style={{ color: "#2c3e50", fontWeight: 600 }}>
                          Donor Information
                        </h6>
                        <p>
                          <strong>Name:</strong>{" "}
                          {selectedFood.donor.name || "N/A"}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {selectedFood.donor.address ||
                            selectedFood.pickupAddress ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Contact Number:</strong>{" "}
                          {selectedFood.donor.phone ||
                            selectedFood.contactNumber ||
                            "N/A"}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer style={{ border: "none", padding: "0 25px 25px" }}>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 20px",
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRequestFood}
                  style={{
                    backgroundColor: "#4dd0e1",
                    borderColor: "#4dd0e1",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "500",
                  }}
                >
                  Request This Food
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </>
  );
};

export default RequestFood;
