import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Button, Card } from "react-bootstrap";
import VenueRoomManage from "./VenueRoomManage";
import AddOnManage from "./AddOnManage";
import MealManage from "./MealManage";
import AdminReports from "./AdminReports";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [venueCount, setVenueCount] = useState(0);
  const [addonCount, setAddonCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/api/rooms/count")
      .then(res => res.json())
      .then(data => setVenueCount(data.count));

    fetch("http://localhost:4000/api/addons/count")
      .then(res => res.json())
      .then(data => setAddonCount(data.count));

    fetch("http://localhost:4000/api/meals/count")
      .then(res => res.json())
      .then(data => setMealCount(data.count));

    fetch("http://localhost:4000/api/rooms/bookingcount")
      .then(res => res.json())
      .then(data => setBookingCount(data.count));

    fetch("http://localhost:4000/api/auth/count")
      .then(res => res.json())
      .then(data => setUserCount(data.count));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light min-vh-100 p-3">
          <h4 className="text-center mb-4">Admin Panel</h4>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveTab("dashboard")}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => setActiveTab("venue")}>Manage Venue Rooms</Nav.Link>
            <Nav.Link onClick={() => setActiveTab("addons")}>Manage Add-ons</Nav.Link>
            <Nav.Link onClick={() => setActiveTab("meals")}>Manage Meals</Nav.Link>
            <Nav.Link onClick={() => setActiveTab("reports")}>Reports</Nav.Link>
            <Button variant="danger" className="mt-4" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Col>

        <Col md={10} className="p-4">
          {activeTab === "dashboard" && (
            <>
              <h2 className="mb-4">Welcome, Admin!</h2>
              <Row>
                <Col md={4}>
                  <Card bg="primary" text="white" className="mb-3">
                    <Card.Body>
                      <h5>Total Venue Rooms</h5>
                      <h3>{venueCount}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="success" text="white" className="mb-3">
                    <Card.Body>
                      <h5>Total Add-ons</h5>
                      <h3>{addonCount}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="warning" text="white" className="mb-3">
                    <Card.Body>
                      <h5>Total Meals</h5>
                      <h3>{mealCount}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="info" text="white" className="mb-3">
                    <Card.Body>
                      <h5>Total Bookings</h5>
                      <h3>{bookingCount}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="dark" text="white" className="mb-3">
                    <Card.Body>
                      <h5>Total Users</h5>
                      <h3>{userCount}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {activeTab === "venue" && <VenueRoomManage />}
          {activeTab === "addons" && <AddOnManage />}
          {activeTab === "meals" && <MealManage />}
          {activeTab ==="reports" && <AdminReports/>}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
