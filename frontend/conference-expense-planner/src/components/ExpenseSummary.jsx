import React from "react";
import { Card, Button } from "react-bootstrap";

const ExpenseSummary = ({ venueCost=0, addonsCost=0, mealsCost=0 }) => {
  const totalCost = venueCost + addonsCost + mealsCost;

  const handlePayment = () => {
    alert("🛒 Dummy Payment Gateway\n\n✅ Payment Successful!\n\nThank you for booking with us!");
  };

  return (
    <div className="container mt-4 p-4" style={{ backgroundColor: "#f7f9fc", borderRadius: "12px" }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        Expense Summary
      </h2>

      <Card className="mb-3 shadow-sm p-3" style={{ fontSize: "1.2rem" }}>
        <h5>Venue Room Cost: <span style={{ color: "#007bff" }}>₹{venueCost}</span></h5>
        <h5>Add-ons Cost: <span style={{ color: "#007bff" }}>₹{addonsCost}</span></h5>
        <h5>Meals Cost: <span style={{ color: "#007bff" }}>₹{mealsCost}</span></h5>
        <hr />
        <h4 style={{ fontWeight: "bold", color: "#28a745" }}>
          Total Cost: ₹{totalCost}
        </h4>
      </Card>

      <div className="text-center mt-4">
        <Button variant="success" size="lg" onClick={handlePayment}>
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default ExpenseSummary;
