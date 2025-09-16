import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import './Home.css';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <Container className="py-5">
      {currentUser && (
        <Alert variant="success" className="welcome-alert mb-4">
          <h4>Welcome, {currentUser.fullName || currentUser.username}!</h4>
          <p className="mb-0">
            You are logged in as {currentUser.roles.includes('ROLE_ADMIN') ? 'Administrator' : 
                                 currentUser.roles.includes('ROLE_MANAGER') ? 'Manager' : 'Employee'}
          </p>
        </Alert>
      )}
      
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="display-4">Smart Inventory Management</h1>
          <p className="lead">
            A comprehensive solution for managing your inventory efficiently and effectively.
          </p>
          <p className="mb-4">
            Track inventory, manage orders, receive alerts, and generate reports all in one place.
            Our system helps you optimize stock levels and streamline your operations.
          </p>
          <div className="action-buttons">
            {!currentUser ? (
              <Link to="/login">
                <Button variant="light" size="lg">
                  <i className="bi bi-box-arrow-in-right"></i> Get Started
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/items">
                  <Button variant="light" size="lg">
                    <i className="bi bi-box"></i> View Inventory
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline-light" size="lg">
                    <i className="bi bi-tags"></i> Manage Categories
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="section-title">Key Features</h2>
      
      <Row>
        <Col lg={4} md={6} className="mb-4">
          <Card className="feature-card">
            <Card.Body>
              <div className="card-icon">
                <i className="bi bi-box-seam"></i>
              </div>
              <Card.Title>Inventory Management</Card.Title>
              <Card.Text>
                Add, update, and delete inventory items. Categorize items, track stock levels, and manage product details with ease.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/items">
                <Button variant="outline-primary" className="w-100">
                  <i className="bi bi-arrow-right"></i> View Inventory
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4} md={6} className="mb-4">
          <Card className="feature-card">
            <Card.Body>
              <div className="card-icon">
                <i className="bi bi-cart-check"></i>
              </div>
              <Card.Title>Order Management</Card.Title>
              <Card.Text>
                Manage incoming and outgoing orders. Track order status, update inventory automatically, and maintain supplier relationships.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/orders">
                <Button variant="outline-primary" className="w-100">
                  <i className="bi bi-arrow-right"></i> View Orders
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4} md={6} className="mb-4">
          <Card className="feature-card">
            <Card.Body>
              <div className="card-icon">
                <i className="bi bi-bell"></i>
              </div>
              <Card.Title>Stock Alerts</Card.Title>
              <Card.Text>
                Receive alerts for low stock items and items approaching expiry date. Never miss critical inventory updates again.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/alerts">
                <Button variant="outline-primary" className="w-100">
                  <i className="bi bi-arrow-right"></i> View Alerts
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col lg={6} className="mb-4">
          <h2 className="section-title">Why Choose Smart Inventory?</h2>
          <ul className="list-group benefits-list">
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> Real-time inventory tracking
            </li>
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> Automated stock alerts
            </li>
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> Comprehensive order management
            </li>
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> User-friendly interface
            </li>
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> Secure authentication
            </li>
            <li className="list-group-item">
              <i className="bi bi-check-circle-fill"></i> Detailed reporting and analytics
            </li>
          </ul>
        </Col>
        
        <Col lg={6}>
          <h2 className="section-title">System Statistics</h2>
          <Row>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-value">5,000+</div>
                <div className="stat-label">Items Managed</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <div className="text-center mt-5 pt-3">
        <h3>Ready to optimize your inventory management?</h3>
        <p className="lead mb-4">Join thousands of businesses that trust Smart Inventory</p>
        {!currentUser ? (
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login">
              <Button variant="primary" size="lg">
                <i className="bi bi-box-arrow-in-right me-2"></i> Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline-primary" size="lg">
                <i className="bi bi-person-plus me-2"></i> Register
              </Button>
            </Link>
          </div>
        ) : (
          <Link to="/items">
            <Button variant="primary" size="lg">
              <i className="bi bi-box me-2"></i> Go to Inventory
            </Button>
          </Link>
        )}
      </div>
    </Container>
  );
};

export default Home; 