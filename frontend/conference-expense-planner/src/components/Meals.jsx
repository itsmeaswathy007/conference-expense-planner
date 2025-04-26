import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const Meals = ({ bookingDate, setMealsCost }) => {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/meals")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error("Error fetching meals:", err));
  }, []);

  const handleCheckboxChange = (mealId) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.includes(mealId)
        ? prevSelected.filter((id) => id !== mealId)
        : [...prevSelected, mealId]
    );
  };

  const totalCost = meals.reduce((total, meal) => {
    if (selectedMeals.includes(meal._id)) {
      const people = parseInt(numberOfPeople, 10) || 0;
      return total + (meal.price * people);
    }
    return total;
  }, 0);

  useEffect(() => {
    setMealsCost(totalCost);  // Correct pass to parent
  }, [totalCost, setMealsCost]);

  const handleBookMeals = async () => {
    if (!numberOfPeople || selectedMeals.length === 0) {
      setErrorMessage("Please enter number of people and select at least one meal type.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!bookingDate) {
      setErrorMessage("Please select Venue Room and Date first.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/meals/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedMeals,
          numberOfPeople,
          bookingDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();
      setSuccessMessage(`Meals booked successfully! Total Cost: ₹${data.totalCost}`);
      setMealsCost(totalCost);
      //setSelectedMeals([]);
      //setNumberOfPeople("");
      setTimeout(() => setSuccessMessage(""), 4000);

    } catch (err) {
      console.error(err);
      setErrorMessage("Booking failed. Try again!");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="container mt-4 p-4" style={{ backgroundColor: "#f7f9fc", borderRadius: "12px" }}>
      <h4 className="text-center mb-4" style={{ fontWeight: "bold", color: "#dc3545" }}>
        Only Buffet Service is Available
      </h4>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "bold" }}>Enter Number of People:</Form.Label>
        <Form.Control
          type="number"
          value={numberOfPeople}
          min="1"
          onChange={(e) => setNumberOfPeople(e.target.value)}
          placeholder="Number of People"
        />
      </Form.Group>

      <div className="mb-4">
        <h5>Select Meals:</h5>
        {meals.map((meal) => (
          <Form.Check
            key={meal._id}
            type="checkbox"
            label={`${meal.name} - ₹${meal.price} per person`}
            checked={selectedMeals.includes(meal._id)}
            onChange={() => handleCheckboxChange(meal._id)}
            className="mb-2"
          />
        ))}
      </div>

      <div className="text-center my-4">
        <h4 style={{ color: "#28a745", fontWeight: "bold" }}>
          Total Meal Cost: ₹{totalCost}
        </h4>
      </div>

      <div className="text-center">
        <Button variant="success" size="lg" onClick={handleBookMeals}>
          Book Meals
        </Button>
      </div>
    </div>
  );
};

export default Meals;
