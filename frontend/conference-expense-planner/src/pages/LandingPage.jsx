
import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import LoginModal from "../components/LoginModal";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Container className="text-center mt-5">
      <h1 className="fw-bold">Conference Expense Planner</h1>
      <p className="lead" style={{ color: "grey", fontWeight: "bold" }}>
        Plan your next major event with us!
      </p>
      <Button variant="warning" onClick={() => setShowLogin(true)}>
        Get Started
      </Button>

      {/* Login Modal */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </Container>
  );
};

export default LandingPage;
