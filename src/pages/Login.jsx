import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { FaSteam, FaTrophy } from 'react-icons/fa';
import { GiJoystick, GiGamepad } from 'react-icons/gi';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="login-bg" style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh'
    }}>
      <Container fluid className="h-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <div className="text-center mb-4" style={{ position: 'relative', zIndex: 2 }}>
              <div className="mb-3">
                <GiJoystick size={72} className="text-warning mb-2" />
              </div>
              <h1 className="display-4 fw-bold mb-3">
                <span className="text-primary">GAME</span>
                <span className="text-warning">HUB</span>
              </h1>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <Badge bg="danger" className="p-2">
                  <FaSteam className="me-1" size={18} />
                  STEAM
                </Badge>
                <Badge bg="primary" className="p-2">
                  <GiGamepad className="me-1" size={18} />
                  JOGOS
                </Badge>
                <Badge bg="success" className="p-2">
                  <FaTrophy className="me-1" size={18} />
                  TOP
                </Badge>
              </div>
              <p className="text-light lead">Entre para descobrir jogos incríveis</p>
            </div>
            <LoginForm onLogin={handleLogin} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

