import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useFavoritos } from '../hooks/useFavoritos';
import { buscarJogo } from '../services/api';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import { FaSpinner, FaPuzzlePiece, FaCode, FaHeart } from 'react-icons/fa';

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { adicionarFavorito, isFavorito } = useFavoritos();

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
    <div className="bg-dark text-light min-vh-100 d-flex flex-column">
      <Navbar />
      
      <section className="hero-section py-5">
        <Container className="text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                <FaPuzzlePiece className="me-2" />
                Descubra Jogos Incríveis
              </h1>
              <p className="lead mb-5">Encontre e gerencie seus jogos favoritos da Steam</p>
              
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </Container>
      </section>

      {loading && (
        <div className="text-center text-muted py-4">
          <FaSpinner className="fa-spin" size={32} />
          <p className="mt-3">Buscando jogos...</p>
        </div>
      )}

      {error && (
        <Container>
          <div className="empty-state">
            <p>😕 {error}</p>
          </div>
        </Container>
      )}

      {!loading && !error && jogos.length > 0 && (
        <Container>
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

