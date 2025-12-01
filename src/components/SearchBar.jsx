import React, { useState } from 'react';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { FaSearch, FaSteam } from 'react-icons/fa';
import { GiJoystick } from 'react-icons/gi';

export default function SearchBar({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-100">
      <div className="text-center mb-3">
        <Badge bg="primary" className="p-2 mb-2">
          <GiJoystick className="me-2" size={20} />
          <FaSteam className="me-2" />
          Buscar Jogos da Steam
        </Badge>
      </div>
      <Form onSubmit={handleSubmit} className="search-form">
        <InputGroup size="lg" className="shadow-lg">
          <InputGroup.Text className="bg-danger text-white border-danger">
            <FaSearch size={20} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Digite o nome do jogo (ex: Counter-Strike, Dota 2, GTA V)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="border-danger"
            style={{ fontSize: '1.1rem' }}
          />
          <Button 
            variant="danger" 
            type="submit" 
            disabled={loading}
            className="px-4"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Buscando...
              </>
            ) : (
              <>
                <FaSearch className="me-2" />
                Buscar
              </>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

