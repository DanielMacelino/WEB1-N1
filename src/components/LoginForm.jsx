import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaSpinner, FaInfoCircle } from 'react-icons/fa';

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
    <div className="login-container">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">Steam Games</h2>
        <p className="text-muted">Descubra e gerencie seus jogos favoritos</p>
      </div>

      <Form onSubmit={handleSubmit} className="login-form">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label>
            <FaUser className="me-2" />
            Usuário
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            size="lg"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            <FaLock className="me-2" />
            Senha
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="lg"
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 mb-3"
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
              Entrar
            </>
          )}
        </Button>

        <div className="text-center">
          <small className="text-muted">
            <FaInfoCircle className="me-1" />
            Apenas demonstração - qualquer usuário/senha funciona
          </small>
        </div>
      </Form>
    </div>
  );
}

