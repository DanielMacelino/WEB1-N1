import React from 'react';
import { Navbar as BootstrapNavbar, Container, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGamepad, FaHeart, FaHome, FaSignOutAlt, FaTrophy, FaSteam } from 'react-icons/fa';
import { GiJoystick } from 'react-icons/gi';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-lg border-bottom border-bottom border-danger">
      <Container fluid>
        <BootstrapNavbar.Brand className="d-flex align-items-center">
          <FaSteam className="me-2 text-primary" size={28} />
          <GiJoystick className="me-2 text-warning" size={24} />
          <span className="fw-bold text-light">GAME</span>
          <span className="fw-bold text-primary">HUB</span>
          <Badge bg="danger" className="ms-2">STEAM</Badge>
        </BootstrapNavbar.Brand>
        
        <div className="d-flex align-items-center ms-auto">
          {location.pathname !== '/favoritos' && location.pathname !== '/' && (
            <Button
              variant="danger"
              className="me-2 d-flex align-items-center"
              onClick={() => navigate('/favoritos')}
            >
              <FaHeart className="me-2" />
              <span className="d-none d-md-inline">Favoritos</span>
              <Badge bg="light" text="dark" className="ms-2">❤️</Badge>
            </Button>
          )}
          {location.pathname !== '/home' && location.pathname !== '/' && (
            <Button
              variant="primary"
              className="me-2 d-flex align-items-center"
              onClick={() => navigate('/home')}
            >
              <FaHome className="me-2" />
              <span className="d-none d-md-inline">Home</span>
            </Button>
          )}
          {location.pathname !== '/' && (
            <Button
              variant="outline-warning"
              className="d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              <span className="d-none d-md-inline">Sair</span>
            </Button>
          )}
        </div>
      </Container>
    </BootstrapNavbar>
  );
}

