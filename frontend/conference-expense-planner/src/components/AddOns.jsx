import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";

const AddOns = ({ bookingDate, setAddonsCost }) => {   // Corrected props
  const [addons, setAddons] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/addons")
      .then((res) => res.json())
      .then((data) => {
        setAddons(data);
        const initialQuantities = {};
        data.forEach(addon => { initialQuantities[addon._id] = 0; });
        setSelectedQuantities(initialQuantities);
      })
      .catch(err => console.error("Error fetching addons:", err));
  }, []);

  const handleQuantityChange = (addonId, type) => {
    setSelectedQuantities(prev => {
      const currentQty = prev[addonId] || 0;
      const addon = addons.find(a => a._id === addonId);
      if (!addon) return prev;

      if (type === "inc") {
        if (currentQty >= addon.totalQuantity) {
          setErrorMessage(`No more stock available for ${addon.itemName}`);
          setTimeout(() => setErrorMessage(""), 3000);
          return prev;
        }
        return { ...prev, [addonId]: currentQty + 1 };
      } else {
        return { ...prev, [addonId]: Math.max(currentQty - 1, 0) };
      }
    });
  };

  const totalAddOnCost = addons.reduce((total, addon) => {
    const qty = selectedQuantities[addon._id] || 0;
    return total + qty * addon.unitPrice;
  }, 0);

  useEffect(() => {
    setAddonsCost(totalAddOnCost);  // Correct passing to parent
  }, [totalAddOnCost, setAddonsCost]);

  const handleBookAddOns = async () => {
    if (!bookingDate) {
      alert("Please select booking date first.");
      return;
    }

    try {
      for (const addon of addons) {
        const qty = selectedQuantities[addon._id];
        if (qty > 0) {
          await fetch(`http://localhost:4000/api/addons/book/${addon._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: bookingDate, quantity: qty }),
          });
        }
      }

      alert("🎉 Add-ons booked successfully!");
      setSuccessMessage("Add-ons booked successfully!");
      setAddonsCost(totalAddOnCost);
      //setSelectedQuantities({});
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error(err);
      alert("Booking failed! Try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold" }}>Add-ons Selection</h3>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {addons.map((addon) => (
          <Col key={addon._id}>
            <Card className="shadow-sm">
              <Card.Img variant="top" src={`http://localhost:4000/images/${addon.imageUrl}`} style={{ height: "200px", objectFit: "cover" }} />
              <Card.Body>
                <Card.Title>{addon.itemName}</Card.Title>
                <Card.Text>Price: ₹{addon.unitPrice}</Card.Text>

                <div className="d-flex align-items-center justify-content-center">
                  <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(addon._id, "dec")}>-</Button>
                  <span className="mx-3 fs-5">{selectedQuantities[addon._id] || 0}</span>
                  <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(addon._id, "inc")}>+</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {addons.length > 0 && (
        <div className="text-center mt-5">
          <h4 style={{ color: "#28a745", fontWeight: "bold" }}>
            Total Add-ons Cost: ₹{totalAddOnCost}
          </h4>
          <Button variant="success" size="lg" className="mt-3" onClick={handleBookAddOns}>
            Book Add-ons
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddOns;
