import React from "react";
import { Spinner as BootstrapSpinner, Container } from "react-bootstrap";

const Spinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <BootstrapSpinner
        animation="border"
        role="status"
        variant="primary"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </BootstrapSpinner>
    </Container>
  );
};

export default Spinner;
