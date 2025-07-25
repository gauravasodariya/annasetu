import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/authContext";

function DonationForm() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;
  const location = useLocation();
  const { id } = useParams();
  const editMode = location.pathname.includes("/edit");
  const donationToEdit = location.state?.donation;

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [formData, setFormData] = useState({
    foodType: editMode && donationToEdit ? donationToEdit.foodType : "",
    foodCategory: editMode && donationToEdit ? donationToEdit.foodCategory : "",
    quantity: editMode && donationToEdit ? donationToEdit.quantity : "",
    expiryDate:
      editMode && donationToEdit && donationToEdit.expiryDate
        ? new Date(donationToEdit.expiryDate).toISOString().split("T")[0]
        : "",
    pickupAddress:
      editMode && donationToEdit ? donationToEdit.pickupAddress : "",
    description: editMode && donationToEdit ? donationToEdit.description : "",
    contactNumber:
      editMode && donationToEdit ? donationToEdit.contactNumber : "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Destructure fields from formData for easier access and to avoid 'not defined' errors
  const {
    foodType,
    foodCategory,
    quantity,
    expiryDate,
    pickupAddress,
    description,
    contactNumber,
    image,
  } = formData;

  useEffect(() => {
    if (editMode && id) {
      const fetchDonation = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await axios.get(`/api/donations/${id}`, {
            headers: {
              // ...existing code...
            },
          });
          // ...existing code...
        } catch (err) {
          // ...existing code...
        } finally {
          setLoading(false);
        }
      };
      fetchDonation();
    }
  }, [editMode, id]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
  };

  const handleAddressSearch = () => {
    if (!pickupAddress) return;
    setMarkerPosition(mapCenter);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setAlert({
        show: true,
        message: "Please log in to submit a donation",
        type: "danger",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate required fields
    if (!foodType || !quantity || !pickupAddress) {
      setAlert({
        show: true,
        message:
          "Please fill in all required fields (Food Type, Quantity, Pickup Address)",
        type: "danger",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      setAlert({
        show: true,
        message: "Contact number must be exactly 10 digits",
        type: "danger",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      setLoading(true);

      const formDataObj = new FormData();

      formDataObj.append("foodType", foodType);
      formDataObj.append("quantity", quantity);
      formDataObj.append("pickupAddress", pickupAddress);

      if (foodCategory) formDataObj.append("foodCategory", foodCategory);

      if (expiryDate && expiryDate.trim() !== "") {
        formDataObj.append("expiryDate", new Date(expiryDate).toISOString());
      }

      if (description && description.trim() !== "") {
        formDataObj.append("description", description);
      }

      if (contactNumber) formDataObj.append("contactNumber", contactNumber);

      if (formData.image) {
        formDataObj.append("image", formData.image);
      } else if (editMode && donationToEdit && donationToEdit.image) {
        formDataObj.append("keepExistingImage", "true");
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      let res;
      if (editMode && id) {
        res = await axios.put(`/api/donations/${id}`, formDataObj, config);
        setAlert({
          show: true,
          message: "Donation updated successfully!",
          type: "success",
        });
      } else {
        res = await axios.post("/api/donations", formDataObj, config);
        setAlert({
          show: true,
          message: "Donation submitted successfully!",
          type: "success",
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });

      setFormData({
        foodType: "",
        foodCategory: "",
        quantity: "",
        expiryDate: "",
        pickupAddress: "",
        description: "",
        contactNumber: "",
        image: null,
      });

      setImagePreview(null);
      setMarkerPosition(null);
    } catch (err) {
      console.error("Error details:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);

        const errorMessage =
          err.response.data?.msg ||
          err.response.data?.message ||
          err.response.data?.error ||
          "Error submitting donation. Please check your input and try again.";

        setAlert({
          show: true,
          message: errorMessage,
          type: "danger",
        });
      } else if (err.request) {
        console.error("No response received:", err.request);
        console.error("Request details:", {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          timeout: err.config?.timeout,
        });
        setAlert({
          show: true,
          message:
            "No response from server. Please check if the server is running at " +
            axios.defaults.baseURL,
          type: "danger",
        });
      } else {
        console.error("Error message:", err.message);
        console.error("Error config:", err.config);
        setAlert({
          show: true,
          message:
            "Network error. Please check your connection and try again. Error: " +
            err.message,
          type: "danger",
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={7}>
          {alert.show && (
            <Alert
              variant={alert.type}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Card.Header
              style={{
                background: "linear-gradient(135deg, #2c3e50, #4dd0e1)",
                padding: "2.5rem",
                borderBottom: "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.4,
                }}
              ></div>
              <div className="position-relative">
                <h2
                  className="text-center mb-3 text-white"
                  style={{
                    fontWeight: "700",
                    fontSize: "2.2rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Donate Food
                </h2>
                <p
                  className="text-center text-white mb-0"
                  style={{ opacity: "0.9", fontSize: "1.1rem" }}
                >
                  Your contribution can make someone's day brighter
                </p>
              </div>
            </Card.Header>
            <Card.Body
              className="p-5"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                borderTop: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Form onSubmit={onSubmit} style={{ width: "100%" }}>
                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Food Type
                  </Form.Label>
                  <Form.Select
                    name="foodType"
                    value={foodType}
                    onChange={onChange}
                    required
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      cursor: "pointer",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "16px 12px",
                    }}
                  >
                    <option value="">Select Food Type</option>
                    <option value="cooked">Cooked Food</option>
                    <option value="raw">Raw Food</option>
                    <option value="packaged">Packaged Food</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Food Category
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Vegetables, Rice, Bread, Dairy"
                    name="foodCategory"
                    value={foodCategory}
                    onChange={onChange}
                    required
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      borderLeft: "4px solid #4dd0e1",
                    }}
                  />
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: "#2c3e50",
                          fontSize: "1.05rem",
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        Quantity
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 5kg, 10 packets"
                        name="quantity"
                        value={quantity}
                        onChange={onChange}
                        required
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          width: "100%",
                          borderColor: "#e0e0e0",
                          fontSize: "15px",
                          boxShadow: "none",
                          transition: "all 0.3s ease",
                          backgroundColor: "white",
                          borderLeft: "4px solid #4dd0e1",
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: "#2c3e50",
                          fontSize: "1.05rem",
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        Expiry Date (if applicable)
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={onChange}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          width: "100%",
                          borderColor: "#e0e0e0",
                          fontSize: "15px",
                          boxShadow: "none",
                          transition: "all 0.3s ease",
                          backgroundColor: "white",
                          borderLeft: "4px solid #4dd0e1",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Add Image Upload Field */}
                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Food Image
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      borderLeft: "4px solid #4dd0e1",
                    }}
                  />
                  <Form.Text className="text-muted">
                    Upload an image of the food you're donating
                  </Form.Text>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Pickup Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address for pickup"
                    name="pickupAddress"
                    value={pickupAddress}
                    onChange={onChange}
                    required
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      borderLeft: "4px solid #4dd0e1",
                    }}
                  />
                  <div style={{ marginTop: 12 }}>
                    <Button
                      variant="light"
                      className="d-flex align-items-center"
                      style={{
                        borderRadius: "999px",
                        border: "1px solid #dbeafe",
                        background: "#e8f0fe",
                        color: "#2563eb",
                        fontWeight: 600,
                        fontSize: "1rem",
                        padding: "10px 20px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease-in-out",
                        minWidth: 220,
                        cursor: "pointer",
                        gap: 8,
                      }}
                      onClick={async () => {
                        if (!navigator.geolocation) {
                          setAlert({
                            show: true,
                            message:
                              "Geolocation is not supported by your browser.",
                            type: "danger",
                          });
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            const { latitude, longitude } = position.coords;
                            try {
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                              );
                              const data = await response.json();
                              setFormData((prev) => ({
                                ...prev,
                                pickupAddress:
                                  data.display_name ||
                                  `${latitude},${longitude}`,
                              }));
                            } catch (err) {
                              setAlert({
                                show: true,
                                message:
                                  "Failed to fetch address from location.",
                                type: "danger",
                              });
                            }
                          },
                          () => {
                            setAlert({
                              show: true,
                              message: "Unable to retrieve your location.",
                              type: "danger",
                            });
                          },
                        );
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#dbeafe";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#e8f0fe";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#2563eb"
                        viewBox="0 0 24 24"
                        style={{ marginRight: 8, flexShrink: 0 }}
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                      </svg>
                      Use My Current Location
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional details about the food"
                    name="description"
                    value={description}
                    onChange={onChange}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      borderLeft: "4px solid #4dd0e1",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Contact Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Contact number"
                    name="contactNumber"
                    value={contactNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,10}$/.test(val)) {
                        setFormData({ ...formData, contactNumber: val });
                      }
                    }}
                    required
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      width: "100%",
                      borderColor: "#e0e0e0",
                      fontSize: "15px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      borderLeft: "4px solid #4dd0e1",
                    }}
                  />
                  <Form.Text className="text-muted">
                    Must be exactly 10 digits.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2 mt-5">
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "linear-gradient(to right, #2c3e50, #4dd0e1)",
                      border: "none",
                      padding: "16px 0",
                      borderRadius: "8px",
                      fontWeight: "600",
                      width: "100%",
                      boxShadow: "0 4px 15px rgba(44, 62, 80, 0.3)",
                      transition: "all 0.3s ease",
                      fontSize: "1.1rem",
                      letterSpacing: "0.5px",
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(44, 62, 80, 0.4)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(44, 62, 80, 0.3)";
                    }}
                  >
                    {loading
                      ? "Submitting..."
                      : editMode
                        ? "Update Donation"
                        : "Submit Donation"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default DonationForm;
