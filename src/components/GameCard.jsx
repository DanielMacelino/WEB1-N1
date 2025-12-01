import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaTrash, FaCalendarAlt, FaUsers, FaSteam, FaWindows, FaApple, FaLinux, FaGamepad, FaStar, FaThumbsUp } from 'react-icons/fa';
import { GiGamepad } from 'react-icons/gi';

export default function GameCard({ game, onFavoritar, onRemover, isFavorito = false }) {
  const img = game.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  
  // Formatar data de lançamento
  const releaseDate = game.release_date
    ? (() => {
        try {
          // Tentar parsear se for timestamp
          if (typeof game.release_date === 'number') {
            return new Date(game.release_date * 1000).toLocaleDateString('pt-BR');
          }
          // Se for string, tentar parsear
          const date = new Date(game.release_date);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR');
          }
          return game.release_date; // Retornar string original se não conseguir parsear
        } catch {
          return game.release_date;
        }
      })()
    : 'Data indisponível';
  
  const players = game.players_recent ? game.players_recent.toLocaleString('pt-BR') : null;

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/460x215?text=Imagem+Indisponível';
  };

  // Informações de preço
  const isFree = game.is_free || false;
  const priceFormatted = game.price_formatted || (isFree ? 'Grátis' : 'Preço indisponível');
  const originalPrice = game.original_price_formatted;
  const discountPercent = game.discount_percent || 0;

  // Plataformas
  const platforms = game.platforms || {};
  const hasWindows = platforms.windows;
  const hasMac = platforms.mac;
  const hasLinux = platforms.linux;

  // Metacritic
  const metacriticScore = game.metacritic?.score;

  // Recomendações
  const recommendations = game.recommendations?.total;

  // Cor do badge de desconto
  const getDiscountBadgeVariant = (discount) => {
    if (discount >= 50) return 'danger';
    if (discount >= 25) return 'warning';
    return 'success';
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
        {discountPercent > 0 && (
          <Badge bg={getDiscountBadgeVariant(discountPercent)} className="position-absolute top-0 start-0 m-2 fs-6">
            -{discountPercent}%
          </Badge>
        )}
        {isFree && (
          <Badge bg="success" className="position-absolute top-0 start-0 m-2 fs-6">
            GRÁTIS
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-light mb-3">
          <GiGamepad className="me-2 text-warning" />
          {game.name}
        </Card.Title>
        
        <Card.Text className="text-light flex-grow-1">
          {/* Preço */}
          <div className="mb-3">
            {isFree ? (
              <Badge bg="success" className="p-2 fs-6">
                <FaStar className="me-1" />
                {priceFormatted}
              </Badge>
            ) : (
              <div>
                {originalPrice && (
                  <div>
                    <small className="text-muted text-decoration-line-through me-2">
                      {originalPrice}
                    </small>
                  </div>
                )}
                <Badge bg="primary" className="p-2 fs-6">
                  {priceFormatted}
                </Badge>
              </div>
            )}
          </div>

          {/* Data de lançamento */}
          <div className="mb-2">
            <Badge bg="info" className="me-2">
              <FaCalendarAlt className="me-1" />
            </Badge>
            <small>{releaseDate}</small>
          </div>

          {/* Plataformas */}
          {(hasWindows || hasMac || hasLinux) && (
            <div className="mb-2">
              <Badge bg="secondary" className="me-2">
                <FaGamepad className="me-1" />
              </Badge>
              <small>
                {hasWindows && <FaWindows className="me-1 text-primary" title="Windows" />}
                {hasMac && <FaApple className="me-1 text-secondary" title="macOS" />}
                {hasLinux && <FaLinux className="me-1 text-warning" title="Linux" />}
              </small>
            </div>
          )}

          {/* Metacritic Score */}
          {metacriticScore && (
            <div className="mb-2">
              <Badge bg={metacriticScore >= 75 ? 'success' : metacriticScore >= 50 ? 'warning' : 'danger'} className="me-2">
                <FaStar className="me-1" />
                Metacritic
              </Badge>
              <small className="fw-bold">{metacriticScore}/100</small>
            </div>
          )}

          {/* Recomendações */}
          {recommendations && (
            <div className="mb-2">
              <Badge bg="success" className="me-2">
                <FaThumbsUp className="me-1" />
              </Badge>
              <small>{recommendations.toLocaleString('pt-BR')} recomendações</small>
            </div>
          )}

          {/* Jogadores recentes */}
          {players && (
            <div>
              <Badge bg="info" className="me-2">
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

