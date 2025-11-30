import React from 'react';
import { Container } from 'react-bootstrap';
import { useFavoritos } from '../hooks/useFavoritos';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import { FaHeart, FaCode, FaHome } from 'react-icons/fa';

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
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`;
    }
    return jogo.header_image || 'https://placehold.co/184x69?text=Sem+Imagem';
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column">
      <Navbar />
      
      <section className="py-5">
        <Container className="text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                <FaHeart className="text-danger me-3" />
                Meus Favoritos
              </h1>
              <p className="lead mb-5">Gerencie sua coleção de jogos favoritos</p>
            </div>
          </div>
        </Container>
      </section>

      <main className="container flex-grow-1 py-4">
        {favoritos.length === 0 ? (
          <div className="empty-state">
            <FaHeart size={64} className="mb-3" />
            <h3>Nenhum favorito ainda</h3>
            <p>Adicione jogos aos favoritos na página inicial para vê-los aqui.</p>
          </div>
        ) : (
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
        )}
      </main>

      <footer className="bg-dark text-center py-3 mt-auto">
        <Container>
          <p className="text-muted mb-0">
            <FaCode className="me-2" />
            Desenvolvido com <FaHeart className="text-danger" /> para amantes de jogos
          </p>
        </Container>
      </footer>
    </div>
  );
}

