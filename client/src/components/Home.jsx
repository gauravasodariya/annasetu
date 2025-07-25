import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [stats, setStats] = useState({
    mealsDonated: 0,
    volunteers: 0,
    ngos: 0,
    donors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("Fetching stats for home page...");
        const res = await axios.get("/api/stats");
        console.log("Stats received:", res.data);
        setStats({
          mealsDonated: res.data.mealsDonated || 0,
          volunteers: res.data.volunteers || 0,
          ngos: res.data.ngos || 0,
          donors: res.data.donors || 0,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ paddingTop: "0px", overflow: "hidden" }}>
      <Container
        fluid
        className="p-0"
        style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
      >
        <Carousel
          fade
          indicators={true}
          interval={4000}
          className="shadow-lg"
          style={{
            width: "100%",
            marginLeft: "0",
            marginRight: "0",
          }}
        >
          <Carousel.Item>
            <div
              style={{
                height: "90vh",
                background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                position: "relative",
                width: "100%",
                margin: "0",
              }}
            >
              <img
                src="/images/food-donation-1.jpg"
                alt="Food Donation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: -1,
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              />
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "80%",
                  padding: "20px",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    fontSize: "2.2rem",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  "One Meal, One Hope"
                </h2>
                <p
                  style={{
                    color: "white",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    marginBottom: "20px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                  }}
                >
                  Every meal you donate can inspire hope
                  <br />
                  and provide nourishment to those who need it most.
                </p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{
                height: "90vh",
                background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                position: "relative",
                width: "100%",
                margin: "0",
              }}
            >
              <img
                src="/images/food-donation-2.jpg"
                alt="Food Donation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: -1,
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              />
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "80%",
                  padding: "20px",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    fontSize: "2.2rem",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  "Share the Love, Share the Food"
                </h2>
                <p
                  style={{
                    color: "white",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    marginBottom: "20px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                  }}
                >
                  Your food donation can spread love and warmth,
                  <br />
                  reminding us that we're all in this together.
                </p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{
                height: "90vh",
                background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                position: "relative",
                width: "100%",
                margin: "0",
              }}
            >
              <img
                src="/images/food-donation-3.jpg"
                alt="Food Donation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: -1,
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              />
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "80%",
                  padding: "20px",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    fontSize: "2.2rem",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  "Feed the Future"
                </h2>
                <p
                  style={{
                    color: "white",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    marginBottom: "20px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                  }}
                >
                  By donating food, you are not just feeding someone today;
                  <br />
                  you are helping to build a better tomorrow.
                </p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* What We Do Section - MOVED BEFORE IMPACT SECTION */}
      <Container className="py-5">
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
              What We Do
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)",
                  borderRadius: "2px",
                }}
              ></div>
            </h2>
          </Col>
        </Row>

        <Row className="align-items-center mb-5">
          <Col md={6} className="mb-4 mb-md-0">
            <h3
              style={{
                color: "#2d3748",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Connecting Food Donors with Those in Need
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                lineHeight: "1.8",
              }}
            >
              AnnaSetu serves as a bridge between food donors and recipients. We
              collect surplus food from restaurants, events, and individuals,
              and distribute it to shelters, community kitchens, and families
              facing food insecurity.
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                lineHeight: "1.8",
              }}
            >
              Our network of dedicated volunteers ensures that good food doesn't
              go to waste and instead reaches those who need it most, creating a
              more sustainable and compassionate community.
            </p>
          </Col>
          <Col md={6}>
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                height: "400px",
              }}
            >
              <img
                src="/images/food-donation-3.jpg"
                alt="Food donation volunteers"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>
        </Row>

        <Row className="align-items-center mb-5">
          <Col md={6} className="order-md-2">
            <h3
              style={{
                color: "#2d3748",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Reducing Food Waste, Fighting Hunger
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                lineHeight: "1.8",
              }}
            >
              Every day, tons of perfectly good food is wasted while many go
              hungry. AnnaSetu works to solve both problems simultaneously by
              redirecting surplus food to where it's needed most.
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                lineHeight: "1.8",
              }}
            >
              Through our technology platform, we make food donation simple,
              efficient, and impactful. Donors can easily schedule pickups, and
              our volunteers ensure timely collection and distribution,
              maintaining food safety standards.
            </p>
          </Col>
          <Col md={6} className="order-md-1 mb-4 mb-md-0">
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                height: "400px",
              }}
            >
              <img
                src="/images/food-donation-7.jpg"
                alt="Food distribution"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Recent Donations Section - MOVED BEFORE IMPACT SECTION */}
        <Container
          fluid
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Container>
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
                  Recent Donations
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)",
                      borderRadius: "2px",
                    }}
                  ></div>
                </h2>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#4a5568",
                    maxWidth: "700px",
                    margin: "0 auto",
                    lineHeight: "1.6",
                  }}
                >
                  See how people are making a difference through food donations
                </p>
              </Col>
            </Row>

            <Row>
              <Col md={3} sm={6} className="mb-4">
                <Card
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    border: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src="/images/food-1.jpg"
                      alt="Cooked Meals"
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "600", color: "#2d3748" }}>
                      Cooked Meals
                    </Card.Title>
                    <Card.Text>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: "#e6fffa",
                          color: "#319795",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        Vegetarian
                      </span>
                      <div className="mt-2" style={{ color: "#4a5568" }}>
                        Quantity: Multiple servings
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-4">
                <Card
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    border: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src="/images/food-5.jpg"
                      alt="Fresh Produce"
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "600", color: "#2d3748" }}>
                      Fresh Produce
                    </Card.Title>
                    <Card.Text>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: "#e6fffa",
                          color: "#319795",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        Fruits & Vegetables
                      </span>
                      <div className="mt-2" style={{ color: "#4a5568" }}>
                        Quantity: Multiple servings
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-4">
                <Card
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    border: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src="/images/food-3.jpg"
                      alt="Packaged Food"
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "600", color: "#2d3748" }}>
                      Packaged Food
                    </Card.Title>
                    <Card.Text>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: "#e6fffa",
                          color: "#319795",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        Non-perishable
                      </span>
                      <div className="mt-2" style={{ color: "#4a5568" }}>
                        Quantity: Multiple servings
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-4">
                <Card
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    border: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src="/images/food-4.jpg"
                      alt="Bakery Items"
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "600", color: "#2d3748" }}>
                      Bakery Items
                    </Card.Title>
                    <Card.Text>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: "#e6fffa",
                          color: "#319795",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        Bread & Pastries
                      </span>
                      <div className="mt-2" style={{ color: "#4a5568" }}>
                        Quantity: Multiple servings
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </Container>
        </Container>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Container
          fluid
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Container>
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
                  Our Impact
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)",
                      borderRadius: "2px",
                    }}
                  ></div>
                </h2>
              </Col>
            </Row>

            <Row>
              <Col md={3} className="mb-4">
                <div
                  className="text-center p-4"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <i
                    className="fas fa-utensils"
                    style={{
                      fontSize: "2.5rem",
                      color: "#38f9d7",
                      marginBottom: "15px",
                    }}
                  ></i>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3
                      className="display-5 mb-2"
                      style={{ fontWeight: "700", color: "#2d3748" }}
                    >
                      34+
                    </h3>
                  )}
                  <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                    Meals Donated
                  </p>
                </div>
              </Col>
              <Col md={3} className="mb-4">
                <div
                  className="text-center p-4"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <i
                    className="fas fa-hands-helping"
                    style={{
                      fontSize: "2.5rem",
                      color: "#38f9d7",
                      marginBottom: "15px",
                    }}
                  ></i>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3
                      className="display-5 mb-2"
                      style={{ fontWeight: "700", color: "#2d3748" }}
                    >
                      {stats.volunteers.toLocaleString()}
                    </h3>
                  )}
                  <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                    Active Volunteers
                  </p>
                </div>
              </Col>
              <Col md={3} className="mb-4">
                <div
                  className="text-center p-4"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <i
                    className="fas fa-building"
                    style={{
                      fontSize: "2.5rem",
                      color: "#38f9d7",
                      marginBottom: "15px",
                    }}
                  ></i>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3
                      className="display-5 mb-2"
                      style={{ fontWeight: "700", color: "#2d3748" }}
                    >
                      {stats.ngos.toLocaleString()}
                    </h3>
                  )}
                  <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                    Partner NGOs
                  </p>
                </div>
              </Col>
              <Col md={3} className="mb-4">
                <div
                  className="text-center p-4"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <i
                    className="fas fa-heart"
                    style={{
                      fontSize: "2.5rem",
                      color: "#38f9d7",
                      marginBottom: "15px",
                    }}
                  ></i>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3
                      className="display-5 mb-2"
                      style={{ fontWeight: "700", color: "#2d3748" }}
                    >
                      {stats.donors.toLocaleString()}
                    </h3>
                  )}
                  <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                    Regular Donors
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </motion.div>
    </div>
  );
};
export default Home;
