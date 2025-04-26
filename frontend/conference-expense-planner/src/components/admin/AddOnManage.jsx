import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const AddOnManage = () => {
  const [addons, setAddons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAddon, setNewAddon] = useState({
    itemName: "",
    unitPrice: "",
    totalQuantity: "",
    image: null,
  });
  const [editingAddonId, setEditingAddonId] = useState(null);

  // Fetch all addons
  const fetchAddons = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/addons");
      const data = await res.json();
      setAddons(data);
    } catch (err) {
      console.error("Failed to fetch addons", err);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewAddon({ ...newAddon, image: files[0] });
    } else {
      setNewAddon({ ...newAddon, [name]: value });
    }
  };

  // Save new or edited addon
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("itemName", newAddon.itemName);
    formData.append("unitPrice", newAddon.unitPrice);
    formData.append("totalQuantity", newAddon.totalQuantity);
    if (newAddon.image) {
      formData.append("image", newAddon.image);
    }

    try {
      if (editingAddonId) {
        // Update existing addon
        await fetch(`http://localhost:4000/api/addons/${editingAddonId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Create new addon
        await fetch("http://localhost:4000/api/addons", {
          method: "POST",
          body: formData,
        });
      }
      fetchAddons();  // Refresh list
      setShowModal(false);
      setNewAddon({ itemName: "", unitPrice: "", totalQuantity: "", image: null });
      setEditingAddonId(null);
    } catch (err) {
      console.error("Failed to save addon", err);
      alert("Failed to save addon!");
    }
  };

  // Open Modal to Edit
  const handleEdit = (addon) => {
    setEditingAddonId(addon._id);
    setNewAddon({
      itemName: addon.itemName,
      unitPrice: addon.unitPrice,
      totalQuantity: addon.totalQuantity,
      image: null,  // Not showing existing image
    });
    setShowModal(true);
  };

  // Delete addon
  const handleDelete = async (addonId) => {
    if (window.confirm("Are you sure you want to delete this addon?")) {
      try {
        await fetch(`http://localhost:4000/api/addons/${addonId}`, {
          method: "DELETE",
        });
        fetchAddons();
      } catch (err) {
        console.error("Failed to delete addon", err);
        alert("Failed to delete addon!");
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add-ons Management</h2>
        <Button onClick={() => { setShowModal(true); setEditingAddonId(null); }}>
          Add New Add-on
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Item Name</th>
            <th>Unit Price</th>
            <th>Total Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addons.map((addon) => (
            <tr key={addon._id}>
              <td>
                {addon.imageUrl && (
                  <img
                    src={`http://localhost:4000/images/${addon.imageUrl}`}
                    alt={addon.itemName}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{addon.itemName}</td>
              <td>₹{addon.unitPrice}</td>
              <td>{addon.totalQuantity}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(addon)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(addon._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAddonId ? "Edit Add-on" : "Add New Add-on"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName" className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                value={newAddon.itemName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formUnitPrice" className="mb-3">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={newAddon.unitPrice}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTotalQuantity" className="mb-3">
              <Form.Label>Total Quantity</Form.Label>
              <Form.Control
                type="number"
                name="totalQuantity"
                value={newAddon.totalQuantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingAddonId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddOnManage;
