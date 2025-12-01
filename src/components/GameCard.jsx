import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaTrash, FaCalendarAlt, FaUsers, FaSteam } from 'react-icons/fa';
import { GiGamepad } from 'react-icons/gi';

export default function GameCard({ game, onFavoritar, onRemover, isFavorito = false }) {
  const img = game.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  const releaseDate = game.release_date
    ? new Date(game.release_date).toLocaleDateString('pt-BR')
    : 'Data indisponível';
  const players = game.players_recent ? game.players_recent.toLocaleString('pt-BR') : null;

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/460x215?text=Imagem+Indisponível';
  };

  return (
    <Card className="game-card text-light bg-dark border border-secondary shadow-lg h-100">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={img}
          alt={game.name}
          onError={handleImageError}
          className="card-img-top"
          style={{ height: '250px', objectFit: 'cover' }}
        />
        <Badge bg="primary" className="position-absolute top-0 end-0 m-2">
          <FaSteam className="me-1" />
          STEAM
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-light mb-3">
          <GiGamepad className="me-2 text-warning" />
          {game.name}
        </Card.Title>
        <Card.Text className="text-light flex-grow-1">
          <div className="mb-2">
            <Badge bg="info" className="me-2">
              <FaCalendarAlt className="me-1" />
            </Badge>
            <small>{releaseDate}</small>
          </div>
          {players && (
            <div>
              <Badge bg="success" className="me-2">
                <FaUsers className="me-1" />
              </Badge>
              <small>{players} jogadores</small>
            </div>
          )}
        </Card.Text>
        {onFavoritar && !isFavorito && (
          <Button
            variant="danger"
            onClick={() => onFavoritar(game)}
            className="w-100 mt-auto"
            size="lg"
          >
            <FaHeart className="me-2" />
            Favoritar
          </Button>
        )}
        {onRemover && (
          <Button
            variant="outline-danger"
            onClick={() => onRemover(game.steam_appid || game.appid || null, game.name)}
            className="w-100 mt-auto"
            size="lg"
          >
            <FaTrash className="me-2" />
            Remover dos Favoritos
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

