import React from 'react';
import { Container, Badge, Alert } from 'react-bootstrap';
import { useFavoritos } from '../hooks/useFavoritos';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import { FaHeart, FaCode, FaSteam, FaTrophy } from 'react-icons/fa';
import { GiJoystick, GiGamepad } from 'react-icons/gi';

export default function Favoritos() {
  const { favoritos, removerFavorito } = useFavoritos();

  const handleRemover = (appid, name) => {
    removerFavorito(appid, name);
    alert('Jogo removido dos favoritos!');
  };

  const getImageUrl = (jogo) => {
    const appid = Number(jogo.appid);
    const hasValidAppid = Number.isFinite(appid) && appid > 0;
    
    if (hasValidAppid) {
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`;
    }
    return jogo.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Navbar />
      
      <section className="py-5">
        <Container className="text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="mb-4">
                <FaHeart size={64} className="text-danger mb-3" />
                <h1 className="display-3 fw-bold mb-3">
                  <span className="text-danger">Meus</span>
                  <span className="text-warning"> Favoritos</span>
                </h1>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <Badge bg="danger" className="p-2">
                    <FaHeart className="me-1" />
                    {favoritos.length} {favoritos.length === 1 ? 'Jogo' : 'Jogos'}
                  </Badge>
                  <Badge bg="primary" className="p-2">
                    <FaSteam className="me-1" />
                    STEAM
                  </Badge>
                  <Badge bg="success" className="p-2">
                    <FaTrophy className="me-1" />
                    COLECÇÃO
                  </Badge>
                </div>
              </div>
              <p className="lead mb-5 text-light">Gerencie sua coleção de jogos favoritos</p>
            </div>
          </div>
        </Container>
      </section>

      <main className="container flex-grow-1 py-4">
        {favoritos.length === 0 ? (
          <Container>
            <Alert variant="warning" className="text-center">
              <GiJoystick size={64} className="mb-3 text-warning" />
              <Alert.Heading className="text-dark">Nenhum favorito ainda</Alert.Heading>
              <p className="text-dark">
                Adicione jogos aos favoritos na página inicial para vê-los aqui.
              </p>
              <Badge bg="info" className="p-2 mt-2">
                <GiGamepad className="me-1" />
                Vá para Home e comece a favoritar!
              </Badge>
            </Alert>
          </Container>
        ) : (
          <>
            <div className="mb-4 text-center">
              <Badge bg="success" className="p-3 fs-6">
                <FaTrophy className="me-2" />
                {favoritos.length} {favoritos.length === 1 ? 'Jogo Favoritado' : 'Jogos Favoritados'}
              </Badge>
            </div>
            <div className="games-grid">
              {favoritos.map((jogo, index) => (
                <GameCard
                  key={jogo.appid || index}
                  game={{
                    ...jogo,
                    header_image: getImageUrl(jogo),
                    steam_appid: jogo.appid,
                  }}
                  onRemover={handleRemover}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-dark text-center py-4 mt-auto border-top border-secondary">
        <Container>
          <p className="text-muted mb-0">
            <FaCode className="me-2 text-primary" />
            Desenvolvido com <FaHeart className="text-danger mx-1" /> para amantes de jogos
            <Badge bg="primary" className="ms-2">
              <FaSteam className="me-1" />
              Steam Games
            </Badge>
          </p>
        </Container>
      </footer>
    </div>
  );
}

