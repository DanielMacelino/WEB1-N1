import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaTrash } from 'react-icons/fa';

export default function GameCard({ game, onFavoritar, onRemover, isFavorito = false }) {
  const img = game.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  const releaseDate = game.release_date
    ? new Date(game.release_date).toLocaleDateString('pt-BR')
    : 'Data indisponível';
  const players = game.players_recent ? `👥 Jogadores recentes: ${game.players_recent.toLocaleString('pt-BR')}` : '';

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/460x215?text=Imagem+Indisponível';
  };

  return (
    <Card className="game-card text-light">
      <Card.Img
        variant="top"
        src={img}
        alt={game.name}
        onError={handleImageError}
        className="card-img-top"
      />
      <Card.Body>
        <Card.Title className="text-light">{game.name}</Card.Title>
        <Card.Text className="text-light">
          <div>📅 {releaseDate}</div>
          {players && <div>{players}</div>}
        </Card.Text>
        {onFavoritar && !isFavorito && (
          <Button
            variant="outline-danger"
            onClick={() => onFavoritar(game)}
            className="w-100"
          >
            <FaHeart className="me-2" />
            Favoritar
          </Button>
        )}
        {onRemover && (
          <Button
            variant="outline-secondary"
            onClick={() => onRemover(game.steam_appid || game.appid || null, game.name)}
            className="w-100"
          >
            <FaTrash className="me-2" />
            Remover
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

