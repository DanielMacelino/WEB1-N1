import React, { useState, useEffect } from 'react';
import { Container, Alert, Badge } from 'react-bootstrap';
import { useFavoritos } from '../hooks/useFavoritos';
import { buscarJogo, buscarJogosRecomendados } from '../services/api';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import { FaSpinner, FaCode, FaHeart, FaSteam, FaTrophy, FaStar } from 'react-icons/fa';
import { GiJoystick, GiGamepad } from 'react-icons/gi';

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [jogosRecomendados, setJogosRecomendados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { adicionarFavorito, isFavorito } = useFavoritos();

  // Carregar jogos recomendados ao montar o componente
  useEffect(() => {
    const carregarRecomendados = async () => {
      try {
        const recomendados = await buscarJogosRecomendados();
        setJogosRecomendados(recomendados);
      } catch (err) {
        console.error('Erro ao carregar jogos recomendados:', err);
      }
    };
    
    carregarRecomendados();
  }, []);

  // Atualizar quando favoritos mudarem
  useEffect(() => {
    const handleFavoritosAtualizados = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('favoritosAtualizados', handleFavoritosAtualizados);
    
    return () => {
      window.removeEventListener('favoritosAtualizados', handleFavoritosAtualizados);
    };
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setJogos([]);

    try {
      const resultados = await buscarJogo(query);
      if (resultados.length === 0) {
        setError('Nenhum jogo encontrado');
      } else {
        setJogos(resultados);
      }
    } catch (err) {
      console.error('Erro ao buscar jogos:', err);
      setError('Erro ao buscar jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritar = (jogo) => {
    const sucesso = adicionarFavorito(jogo);
    if (sucesso) {
      alert('Jogo favoritado!');
    } else {
      alert('Este jogo já está nos favoritos.');
    }
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Navbar />
      
      <section className="hero-section py-5">
        <Container className="text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="mb-4">
                <GiJoystick size={64} className="text-warning mb-3" />
                <h1 className="display-3 fw-bold mb-3">
                  <span className="text-primary">GAME</span>
                  <span className="text-warning">HUB</span>
                </h1>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <Badge bg="danger" className="p-2">
                    <FaSteam className="me-1" />
                    STEAM
                  </Badge>
                  <Badge bg="primary" className="p-2">
                    <GiGamepad className="me-1" />
                    JOGOS
                  </Badge>
                  <Badge bg="success" className="p-2">
                    <FaTrophy className="me-1" />
                    TOP
                  </Badge>
                </div>
              </div>
              <p className="lead mb-4 text-light">
                Descubra e gerencie seus jogos favoritos da Steam
              </p>
              
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </Container>
      </section>

      {loading && (
        <Container>
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary" size={48} />
            <p className="mt-3 text-light fs-5">
              <Badge bg="info" className="p-2">
                Buscando jogos na Steam...
              </Badge>
            </p>
          </div>
        </Container>
      )}

      {error && (
        <Container>
          <Alert variant="danger" className="text-center">
            <GiGamepad size={32} className="mb-2" />
            <Alert.Heading>Ops! Nenhum jogo encontrado</Alert.Heading>
            <p>{error}</p>
            <p className="mb-0">
              <small>Tente buscar por: Counter-Strike, Dota 2, GTA V, Cyberpunk 2077, etc.</small>
            </p>
          </Alert>
        </Container>
      )}

      {!loading && !error && jogos.length > 0 && (
        <Container>
          <div className="mb-4 text-center">
            <Badge bg="success" className="p-3 fs-6">
              <FaTrophy className="me-2" />
              {jogos.length} {jogos.length === 1 ? 'Jogo Encontrado' : 'Jogos Encontrados'}
            </Badge>
          </div>
          <div className="games-grid">
            {jogos.map((jogo, index) => (
              <GameCard
                key={jogo.steam_appid || index}
                game={jogo}
                onFavoritar={handleFavoritar}
                isFavorito={isFavorito(jogo)}
              />
            ))}
          </div>
        </Container>
      )}

      {!loading && !error && jogos.length === 0 && jogosRecomendados.length > 0 && (
        <Container className="py-5">
          <div className="mb-4 text-center">
            <h2 className="display-5 fw-bold mb-3">
              <FaStar className="text-warning me-2" />
              <span className="text-primary">Recomendações</span>
            </h2>
            <Badge bg="warning" text="dark" className="p-2 fs-6 mb-4">
              <GiGamepad className="me-2" />
              Jogos Populares da Steam
            </Badge>
            <p className="text-light lead mb-4">
              Confira estes jogos incríveis recomendados para você!
            </p>
          </div>
          <div className="games-grid">
            {jogosRecomendados.map((jogo, index) => (
              <GameCard
                key={jogo.steam_appid || index}
                game={jogo}
                onFavoritar={handleFavoritar}
                isFavorito={isFavorito(jogo)}
              />
            ))}
          </div>
        </Container>
      )}

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

