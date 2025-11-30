import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="search-form">
      <InputGroup size="lg">
        <InputGroup.Text className="bg-primary text-white">
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Digite o nome do jogo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          Buscar
        </Button>
      </InputGroup>
    </Form>
  );
}

