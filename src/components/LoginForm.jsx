import React, { useState } from 'react';
import { Form, Button, Alert, Badge, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaSpinner, FaInfoCircle, FaSteam } from 'react-icons/fa';
import { GiGamepad } from 'react-icons/gi';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);
    
    // Simula um pequeno delay para mostrar o loading
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="login-container bg-light rounded shadow-lg p-4" style={{ position: 'relative', zIndex: 2 }}>
      <Form onSubmit={handleSubmit} className="login-form">
        {error && (
          <Alert variant="danger" className="mb-3">
            <GiGamepad className="me-2" />
            {error}
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-dark">
            <FaUser className="me-2 text-primary" />
            Usuário
          </Form.Label>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-primary text-white">
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold text-dark">
            <FaLock className="me-2 text-danger" />
            Senha
          </Form.Label>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-danger text-white">
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button
          type="submit"
          variant="danger"
          size="lg"
          className="w-100 mb-3 fw-bold"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="me-2 fa-spin" />
              Entrando...
            </>
          ) : (
            <>
              <FaSignInAlt className="me-2" />
              Entrar no GameHub
            </>
          )}
        </Button>

        <div className="text-center">
          <Badge bg="info" className="p-2">
            <FaInfoCircle className="me-1" />
            <small>Apenas demonstração - qualquer usuário/senha funciona</small>
          </Badge>
          <div className="mt-2">
            <Badge bg="primary" className="p-2">
              <FaSteam className="me-1" />
              <small>Powered by Steam</small>
            </Badge>
          </div>
        </div>
      </Form>
    </div>
  );
}

