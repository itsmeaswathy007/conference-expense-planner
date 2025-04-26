import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    revenue: 0,
    mostBookedRooms: [],
    lowStockAddons: []
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/reports")
      .then(res => res.json())
      .then(data => setReportData(data))
      .catch(err => console.error("Report fetch failed", err));
  }, []);

  return (
    <div>
      <h2>📊 Reports</h2>

      <Row className="my-4">
        <Col md={4}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>₹{reportData.revenue}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5>🏆 Most Booked Rooms</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Room</th>
            <th>Bookings</th>
          </tr>
        </thead>
        <tbody>
          {reportData.mostBookedRooms.map((room, i) => (
            <tr key={i}>
              <td>{room.name}</td>
              <td>{room.totalBookings}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5 className="mt-5">⚠️ Low Stock Add-ons</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {reportData.lowStockAddons.map((addon, i) => (
            <tr key={i}>
              <td>{addon.itemName}</td>
              <td>{addon.remaining}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminReports;
