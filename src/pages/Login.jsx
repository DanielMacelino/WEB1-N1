import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { FaGamepad } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="login-bg">
      <Container fluid className="h-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <div className="text-center mb-4" style={{ position: 'relative', zIndex: 2 }}>
              <FaGamepad size={48} className="text-primary mb-3" />
            </div>
            <LoginForm onLogin={handleLogin} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

