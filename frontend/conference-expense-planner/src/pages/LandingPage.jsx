
import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import LoginModal from "../components/LoginModal";
import '../Style/LandingPage.css';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing-background">
    <Container className="text-center mt-5">
      <h1 className="fw-bold">Conference Expense Planner-BudgetEase Solutions</h1>
      <p className="lead" style={{ color: "grey", fontWeight: "bold" }}>
        Plan your next major event with us!
      </p>
      <div>
      <p className="paragraph-blue">
          Welcome to <strong>BudgetEase Solutions</strong>, your trusted partner in simplifying budget management and financial solutions. At BudgetEase, we understand the importance of effective budget planning and strive to provide intuitive, user-friendly solutions to meet the diverse needs of our clients.
        </p>
      </div>
      <Button variant="warning" onClick={() => setShowLogin(true)}>
        Get Started
      </Button>

      {/* Login Modal */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </Container>
    </div>
  );
};

export default LandingPage;
