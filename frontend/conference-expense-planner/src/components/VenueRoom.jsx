import React, { useState, useEffect } from "react";
import { Form, Card, Button, Row, Col, Alert } from "react-bootstrap";

const VenueRoom = ({ setBookingDate, setVenueCost }) => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState([]);
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [quantities, setQuantities] = useState({});
  const [bookedRooms, setBookedRooms] = useState([]);
  const [warning, setWarning] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/rooms/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  useEffect(() => {
    if (location) {
      fetch(`http://localhost:4000/api/rooms/${location}`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          const initialQuantities = {};
          data.forEach((room) => {
            initialQuantities[room._id] = 0;
          });
          setQuantities(initialQuantities);
          setBookedRooms([]);
          setWarning("");
        })
        .catch((err) => console.error("Error fetching rooms:", err));
    }
  }, [location]);

  useEffect(() => {
    if (date && rooms.length > 0) {
      const booked = rooms.filter((room) =>
        room.bookings?.some((booking) => booking.date === date)
      );
      setBookedRooms(booked);
      if (booked.length > 0) {
        setWarning("⚠ Some rooms are already booked for this date. Please check!");
      } else {
        setWarning("");
      }
    }
  }, [date, rooms]);

  const handleQuantityChange = (roomId, type) => {
    setQuantities((prev) => {
      const current = prev[roomId] || 0;
      const newQty = type === "inc" ? current + 1 : Math.max(current - 1, 0);
      return { ...prev, [roomId]: newQty };
    });
  };

  const totalCost = rooms.reduce((total, room) => {
    const qty = quantities[room._id] || 0;
    return total + (qty * room.rate);
  }, 0);

  useEffect(() => {
    const selected = rooms
      .filter((room) => quantities[room._id] > 0)
      .map((room) => ({
        id: room._id,
        name: room.name,
        quantity: quantities[room._id],
        price: room.rate,
        total: quantities[room._id] * room.rate,
      }));

    setSelectedRooms(selected);
  }, [quantities, rooms]);

  const handleBookNow = async () => {
    if (!date || !fromTime || !toTime) {
      alert("Please select Date, From Time and To Time before booking.");
      return;
    }
    if (selectedRooms.length === 0) {
      alert("Please select at least one room to book.");
      return;
    }

    const timeRange = `${fromTime} - ${toTime}`;

    try {
      for (const room of selectedRooms) {
        const res = await fetch(`http://localhost:4000/api/rooms/book/${room.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            time: timeRange,
            quantity: room.quantity,
            rate: room.rate,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to book room: ${room.name}`);
        }
      }
      alert("🎉 Rooms booked successfully!");
      setSuccessMessage("🎉 Rooms booked successfully!");
      setVenueCost(totalCost); // pass venue cost
      setBookingDate(date); // pass booking date
      setQuantities({});
      setSelectedRooms([]);
      setDate("");
      setFromTime("");
      setToTime("");
      setLocation("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Booking failed! Try again.");
    }
  };

  return (
    <div className="container mt-4 p-4" style={{ backgroundColor: "#f7f9fc", borderRadius: "12px" }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>Venue Room Selection</h2>

      {/* Location Dropdown */}
      <Form.Select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="mb-4"
        style={{ fontSize: "1.1rem" }}
      >
        <option value="">-- Select Location --</option>
        {locations.map((loc, idx) => (
          <option key={idx} value={loc}>{loc}</option>
        ))}
      </Form.Select>

      {/* Date and Time */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Label style={{ fontWeight: "bold" }}>Select Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setBookingDate(e.target.value);
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Label style={{ fontWeight: "bold" }}>From Time</Form.Label>
          <Form.Control
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Label style={{ fontWeight: "bold" }}>To Time</Form.Label>
          <Form.Control
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </Col>
      </Row>

      {warning && <Alert variant="warning">{warning}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Room Cards */}
      {rooms.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {rooms.map((room) => (
            <Col key={room._id}>
              <Card className="shadow-sm" style={{ height: "100%" }}>
                <Card.Img variant="top" src={`http://localhost:4000/images/${room.imageUrl}`} style={{ height: "200px", objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{room.name}</Card.Title>
                  <Card.Text>Capacity: {room.capacity}<br />Cost: ₹{room.rate}</Card.Text>
                  {bookedRooms.some((r) => r._id === room._id) ? (
                    <Alert variant="danger" className="p-1 text-center">Booked</Alert>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(room._id, "dec")}>-</Button>
                      <span className="mx-3 fs-5">{quantities[room._id] || 0}</span>
                      <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(room._id, "inc")}>+</Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Total Cost and Book Now */}
      {selectedRooms.length > 0 && (
        <div className="text-center my-5">
          <h4 style={{ color: "#28a745", fontWeight: "bold" }}>Total Cost: ₹{totalCost}</h4>
          <Button variant="success" size="lg" className="mt-3" onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default VenueRoom;
