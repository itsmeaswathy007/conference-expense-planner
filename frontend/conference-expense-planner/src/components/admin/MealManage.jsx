import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const MealManage = () => {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null); // Edit mode
  const [mealForm, setMealForm] = useState({ name: "", price: "" });

  // Fetch meals
  const fetchMeals = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/meals");
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Handle Add / Edit Meal Save
  const handleSave = async () => {
    try {
      const method = editingMeal ? "PUT" : "POST";
      const url = editingMeal
        ? `http://localhost:4000/api/meals/update/${editingMeal._id}`
        : "http://localhost:4000/api/meals/create";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealForm),
      });

      if (!res.ok) {
        throw new Error("Failed to save meal");
      }

      fetchMeals();
      setShowModal(false);
      setMealForm({ name: "", price: "" });
      setEditingMeal(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save meal. Try again!");
    }
  };

  // Handle Delete Meal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/meals/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete meal");
      }

      fetchMeals();
    } catch (error) {
      console.error(error);
      alert("Failed to delete meal. Try again!");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Manage Meals</h2>
        <Button onClick={() => { setEditingMeal(null); setMealForm({ name: "", price: "" }); setShowModal(true); }}>
          Add Meal
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Meal Name</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal._id}>
              <td>{meal.name}</td>
              <td>{meal.price}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditingMeal(meal);
                    setMealForm({ name: meal.name, price: meal.price });
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(meal._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMeal ? "Edit Meal" : "Add Meal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Meal Name</Form.Label>
              <Form.Control
                type="text"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                placeholder="Enter meal name"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={mealForm.price}
                onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })}
                placeholder="Enter price"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingMeal ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MealManage;
