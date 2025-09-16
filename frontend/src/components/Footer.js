import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand">
              <h5>
                <i className="bi bi-box-seam"></i>
                Smart Inventory
              </h5>
              <p>
                A comprehensive solution for managing your inventory efficiently. 
                Track stock, manage orders, and optimize your business operations.
              </p>
              <div className="footer-social">
                <a href="#" title="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" title="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" title="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" title="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-links">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/">
                    <i className="bi bi-chevron-right"></i> Home
                  </Link>
                </li>
                <li>
                  <Link to="/items">
                    <i className="bi bi-chevron-right"></i> Inventory
                  </Link>
                </li>
                <li>
                  <Link to="/categories">
                    <i className="bi bi-chevron-right"></i> Categories
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    <i className="bi bi-chevron-right"></i> Orders
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-links">
              <h5>Resources</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/alerts">
                    <i className="bi bi-chevron-right"></i> Alerts
                  </Link>
                </li>
                <li>
                  <Link to="/transactions">
                    <i className="bi bi-chevron-right"></i> Transactions
                  </Link>
                </li>
                <li>
                  <a href="#">
                    <i className="bi bi-chevron-right"></i> Help Center
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="bi bi-chevron-right"></i> Documentation
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-contact">
              <h5 className="footer-links">Contact Us</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt"></i>
                  123 Inventory Street, Suite 456
                </li>
                <li>
                  <i className="bi bi-envelope"></i>
                  info@smartinventory.com
                </li>
                <li>
                  <i className="bi bi-telephone"></i>
                  +1 (123) 456-7890
                </li>
                <li>
                  <i className="bi bi-clock"></i>
                  Mon-Fri: 9:00 AM - 5:00 PM
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Smart Inventory Management. All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> &middot; <a href="#">Terms of Service</a> &middot; <a href="#">Sitemap</a>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 