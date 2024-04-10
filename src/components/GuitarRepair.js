import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import img1 from "../img/gRepair.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/GuitarRepair.css";
import Footer from "./Footer";

function GuitarRepair() {
  return (
    <>
      <Container className="guitar-repair-container">
        <Row>
          <Col>
            <img src={img1} alt="Guitar repair" />
          </Col>
        </Row>
        <Row>
          <Col>
            {/* More detailed service descriptions here */}
          </Col>
        </Row>
        {/* Carousel or Gallery for before-and-after images */}
        <Row>
          <Col>
            <Carousel>{/* Carousel items */}</Carousel>
          </Col>
        </Row>
        {/* Testimonials and Contact Info */}
      </Container>
      <br/>
      <Footer />
    </>
  );
}

export default GuitarRepair;
