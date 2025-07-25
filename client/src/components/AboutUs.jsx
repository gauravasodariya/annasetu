import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <div className="about-page">
      <Container className="mb-5 mt-5">
        <Row className="mb-5 align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div>
              <h2 style={{ 
                color: "#2d3748", 
                fontWeight: "700", 
                marginBottom: "25px",
                position: "relative",
                paddingBottom: "15px"
              }}>
                Who We Are
                <span style={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  width: "80px", 
                  height: "4px", 
                  background: "#38f9d7" 
                }}></span>
              </h2>
              <p style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.8", 
                color: "#4a5568",
                marginBottom: "20px"
              }}>
             <p> AnnaSetu, we believe that no one should go hungry while perfectly good food goes to waste. Our platform is dedicated to bridging the gap between surplus food and those in need by connecting donors, NGOs, and volunteers. With the power of technology and a community-driven approach, we ensure that excess food is collected, redistributed, and delivered to the right hands. By streamlining the donation process, we aim to foster a culture of sharing, responsibility, and sustainability, ultimately making a real difference in the fight against hunger.</p>
<p>
The journey began when we witnessed firsthand the impact of food wastage at large events, restaurants, and households. Seeing untouched, nutritious meals being thrown away while people nearby suffered from hunger was heartbreaking. What if there was a way to rescue, repurpose, and redistribute this surplus? We realized that technology could serve as a powerful bridge, linking donors, NGOs, and volunteers in a seamless process that ensured no food went to waste. And thus, Annasetu was born—not just as a solution to food wastage, but as a movement to spread kindness, reduce hunger, and create a more sustainable world.</p>

              </p>
              <p style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.8", 
                color: "#4a5568" 
              }}>
                With the power of technology and a community-driven approach, we ensure that excess food is collected, redistributed, and delivered to the right hands. By streamlining the donation process, we aim to foster a culture of sharing, responsibility, and sustainability, ultimately making a real difference in the fight against hunger.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
              }}
            >
              <img 
                src="/images/food-donation-4.jpg" 
                alt="Food donation" 
                style={{ 
                  width: "100%", 
                  height: "400px", 
                  objectFit: "cover",
                  borderRadius: "10px"
                }} 
              />
            </div>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="mt-5">
          <Col>
            <Card style={{ 
              borderRadius: "10px", 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              marginBottom: "30px"
            }}>
              <Card.Body style={{ padding: "2rem" }}>
                <Card.Title style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  marginBottom: "20px",
                  color: "#2d3748",
                  position: "relative",
                  paddingBottom: "15px"
                }}>
                  Our Mission
                  <span style={{ 
                    position: "absolute", 
                    bottom: 0, 
                    left: 0, 
                    width: "60px", 
                    height: "3px", 
                    background: "#38f9d7" 
                  }}></span>
                </Card.Title>
                <Card.Text style={{ 
                  fontSize: "1.05rem", 
                  lineHeight: "1.8", 
                  color: "#4a5568" 
                }}>
                  Our mission is to create a world where food is valued and shared, not wasted. We are committed to reducing food wastage by facilitating seamless connections between food donors and organizations that serve the underprivileged. Through our platform, we aim to simplify and optimize food donation logistics, making it easier for individuals, businesses, and institutions to contribute to hunger relief efforts.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Vision Section */}
        <Row>
          <Col>
            <Card style={{ 
              borderRadius: "10px", 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
            }}>
              <Card.Body style={{ padding: "2rem" }}>
                <Card.Title style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  marginBottom: "20px",
                  color: "#2d3748",
                  position: "relative",
                  paddingBottom: "15px"
                }}>
                  Our Vision
                  <span style={{ 
                    position: "absolute", 
                    bottom: 0, 
                    left: 0, 
                    width: "60px", 
                    height: "3px", 
                    background: "#38f9d7" 
                  }}></span>
                </Card.Title>
                <Card.Text style={{ 
                  fontSize: "1.05rem", 
                  lineHeight: "1.8", 
                  color: "#4a5568" 
                }}>
                  We envision a future where every individual has access to nutritious food, and no meal goes to waste. Our goal is to create a sustainable ecosystem that transforms food surplus into an opportunity to nourish the underprivileged. By raising awareness, building strong partnerships, and leveraging technology, we aim to reshape the way people think about food waste and hunger.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;