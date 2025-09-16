import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import './Header.css';

const Header = ({ currentUser, logOut }) => {
  const location = useLocation();
  const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes("ROLE_ADMIN");
  const isManager = currentUser && currentUser.roles && currentUser.roles.includes("ROLE_MANAGER");
  
  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-box-seam fs-4 me-2"></i>
          <span className="fw-bold">Smart Inventory</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`d-flex align-items-center mx-1 ${isActive('/') ? 'active' : ''}`}
            >
              <i className="bi bi-house-door me-1"></i> Home
            </Nav.Link>
            
            {currentUser && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/items" 
                  className={`d-flex align-items-center mx-1 ${isActive('/items') ? 'active' : ''}`}
                >
                  <i className="bi bi-box me-1"></i> Inventory
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/categories" 
                  className={`d-flex align-items-center mx-1 ${isActive('/categories') ? 'active' : ''}`}
                >
                  <i className="bi bi-tags me-1"></i> Categories
                </Nav.Link>
                
                {/* Orders - Only visible to managers and admins */}
                {(isManager || isAdmin) && (
                  <Nav.Link 
                    as={Link} 
                    to="/orders" 
                    className={`d-flex align-items-center mx-1 ${isActive('/orders') ? 'active' : ''}`}
                  >
                    <i className="bi bi-cart me-1"></i> Orders
                  </Nav.Link>
                )}
                
                {/* Alerts - Visible to all but with different permissions */}
                <Nav.Link 
                  as={Link} 
                  to="/alerts" 
                  className={`d-flex align-items-center mx-1 ${isActive('/alerts') ? 'active' : ''}`}
                >
                  <i className="bi bi-bell me-1"></i> Alerts
                </Nav.Link>
                
                {/* Transactions - Only visible to managers and admins */}
                {(isManager || isAdmin) && (
                  <Nav.Link 
                    as={Link} 
                    to="/transactions" 
                    className={`d-flex align-items-center mx-1 ${isActive('/transactions') ? 'active' : ''}`}
                  >
                    <i className="bi bi-clock-history me-1"></i> Transactions
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          {currentUser ? (
            <Nav>
              <NavDropdown 
                title={
                  <div className="d-inline-flex align-items-center">
                    <i className="bi bi-person-circle me-2"></i>
                    <span>{currentUser.username}</span>
                    {isAdmin && <Badge bg="danger" pill className="ms-2">Admin</Badge>}
                    {isManager && <Badge bg="info" pill className="ms-2">Manager</Badge>}
                    {!isAdmin && !isManager && <Badge bg="secondary" pill className="ms-2">Employee</Badge>}
                  </div>
                } 
                id="basic-nav-dropdown"
                align="end"
                className="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                  <i className="bi bi-person me-2"></i> Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logOut} className="d-flex align-items-center text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="d-flex gap-2">
              <Nav.Link 
                as={Link} 
                to="/login" 
                className={`d-flex align-items-center ${isActive('/login') ? 'active' : ''}`}
              >
                <button className="btn btn-sm btn-outline-light d-flex align-items-center">
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login
                </button>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/register" 
                className={`d-flex align-items-center ${isActive('/register') ? 'active' : ''}`}
              >
                <button className="btn btn-sm btn-primary d-flex align-items-center">
                  <i className="bi bi-person-plus me-2"></i> Register
                </button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 