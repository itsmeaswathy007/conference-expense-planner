// src/components/admin/VenueRoomManage.jsx

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

const VenueRoomManage = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    rate:"",
    location: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/rooms/all");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  //  Open Modal
  const handleOpenModal = (room = null) => {
    if (room) {
      // Edit Mode
      setEditingRoom(room);
      setFormData({
        name: room.name,
        capacity: room.capacity,
        rate:room.rate,
        location: room.location,
        image: null, // No existing image editing for now
      });
    } else {
      // Add Mode
      setEditingRoom(null);
      setFormData({ name: "", capacity: "",rate: "", location: "", image: null });
    }
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", capacity: "",rate: "", location: "", image: null });
    setEditingRoom(null);
    setMessage("");
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add or Update Room
  const handleSave = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("capacity", formData.capacity);
    form.append("rate", formData.rate);
    form.append("location", formData.location);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      let url = "http://localhost:4000/api/rooms/add";
      let method = "POST";

      if (editingRoom) {
        url = `http://localhost:4000/api/rooms/update/${editingRoom._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: form,
      });

      if (!res.ok) throw new Error("Failed to save room");

      setMessage("Saved successfully!");
      fetchRooms();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Error occurred while saving");
    }
  };

  // Delete Room
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/rooms/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete room");

      fetchRooms();
      alert("Room deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Venue Room Management</h3>
        <Button onClick={() => handleOpenModal()}>Add New Room</Button>
      </div>

      {/* Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Rate</th>
            <th>Location</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.name}</td>
              <td>{room.capacity}</td>
              <td>{room.rate}</td>
              <td>{room.location}</td>
              <td>
                {room.imageUrl && (
                  <img
                    src={`http://localhost:4000/images/${room.imageUrl}`}
                    alt="room"
                    style={{ width: "60px", height: "50px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleOpenModal(room)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(room._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/*  Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRoom ? "Edit Room" : "Add Room"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="info">{message}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingRoom ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VenueRoomManage;
