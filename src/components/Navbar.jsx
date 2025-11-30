import React from 'react';
import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGamepad, FaHeart, FaHome, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="gradient-primary" variant="dark" expand="lg" className="shadow-lg">
      <Container fluid>
        <BootstrapNavbar.Brand className="d-flex align-items-center">
          <FaGamepad className="me-2" />
          <span className="fw-bold">Steam Games</span>
        </BootstrapNavbar.Brand>
        
        <div className="d-flex align-items-center ms-auto">
          {location.pathname !== '/favoritos' && location.pathname !== '/' && (
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate('/favoritos')}
            >
              <FaHeart className="me-2" />
              Favoritos
            </Button>
          )}
          {location.pathname !== '/home' && location.pathname !== '/' && (
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate('/home')}
            >
              <FaHome className="me-2" />
              Home
            </Button>
          )}
          {location.pathname !== '/' && (
            <Button
              variant="outline-light"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Sair
            </Button>
          )}
        </div>
      </Container>
    </BootstrapNavbar>
  );
}

