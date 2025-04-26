import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Carousel } from 'react-bootstrap';
import VenueRoom from './VenueRoom';
import AddOns from './AddOns';
import Meals from './Meals';
import ExpenseSummary from './ExpenseSummary';

const ProductPage = () => {
  const [selectedTab, setSelectedTab] = useState('');
  const [username, setUsername] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [venueCost, setVenueCost] = useState(0);
  const [addonsCost, setAddonsCost] = useState(0);
  const [mealsCost, setMealsCost] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUsername(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.clear();
    window.location.href = '/';
  };

  const handleShowSummary = () => {
    setSelectedTab('summary');
  };

  return (
    <Container fluid style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <Navbar bg="light" expand="lg" className="mb-4 d-flex justify-content-between">
        <Navbar.Brand
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setSelectedTab('')}
        >
          BudgetEase Solutions
        </Navbar.Brand>
      </Navbar>

      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand>Welcome, {username}!</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          <Button variant="info" className="me-2" onClick={handleShowSummary}>
            Expense Summary
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar>

      {/* Navigation Tabs */}
      <Nav className="justify-content-center mt-4">
        <Nav.Item>
          <Nav.Link onClick={() => setSelectedTab('venue')}>Venue Room</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setSelectedTab('addons')}>Add-ons</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setSelectedTab('meals')}>Meals</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Conditional Rendering */}
      <div className="mt-4">
        {selectedTab === 'venue' && (
          <VenueRoom setBookingDate={setBookingDate} setVenueCost={setVenueCost} />
        )}
        {selectedTab === 'addons' && (
          <AddOns bookingDate={bookingDate} setAddonsCost={setAddonsCost} />
        )}
        {selectedTab === 'meals' && (
          <Meals bookingDate={bookingDate} setMealsCost={setMealsCost} />
        )}
        {selectedTab === 'summary' && (
          <ExpenseSummary
            venueCost={venueCost}
            addonsCost={addonsCost}
            mealsCost={mealsCost}
          />
        )}
      </div>

      {/* Carousel when nothing selected */}
      {!selectedTab && (
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src="\src\assets\conference1.jpg" alt="Conference 1" style={{ width: '90%', height: '450px', objectFit: 'cover' }} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="\src\assets\conference2.jpg" alt="Conference 2" style={{ width: '90%', height: '450px', objectFit: 'cover' }} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="\src\assets\conference3.jpg" alt="Conference 3" style={{ width: '90%', height: '450px', objectFit: 'cover' }} />
          </Carousel.Item>
        </Carousel>
      )}
    </Container>
  );
};

export default ProductPage;
