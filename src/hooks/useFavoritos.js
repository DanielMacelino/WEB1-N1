import { useState, useEffect, useCallback } from 'react';

// Função auxiliar para ler favoritos do localStorage
const lerFavoritos = () => {
  try {
    return JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  } catch (e) {
    console.error('Erro ao ler favoritos do localStorage:', e);
    return [];
  }
};

// Função auxiliar para salvar favoritos no localStorage
const salvarFavoritos = (favoritos) => {
  try {
    localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new Event('favoritosAtualizados'));
  } catch (e) {
    console.error('Erro ao salvar favoritos no localStorage:', e);
  }
};

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(() => lerFavoritos());

  // Carregar favoritos do localStorage ao montar e quando o evento for disparado
  useEffect(() => {
    const atualizarFavoritos = () => {
      const favoritosSalvos = lerFavoritos();
      setFavoritos(favoritosSalvos);
    };

    // Carregar ao montar
    atualizarFavoritos();

    // Ouvir eventos de atualização de outros componentes
    window.addEventListener('favoritosAtualizados', atualizarFavoritos);

    return () => {
      window.removeEventListener('favoritosAtualizados', atualizarFavoritos);
    };
  }, []);

  const adicionarFavorito = useCallback((jogo) => {
    const normalizedAppid = Number(jogo.steam_appid);
    const safeAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0 ? normalizedAppid : null;

    // Sempre ler do localStorage para ter a versão mais atualizada
    const favoritosAtuais = lerFavoritos();
    
    const exists = favoritosAtuais.some((j) => {
      const jApp = Number(j.appid);
      if (safeAppid) return Number.isFinite(jApp) && jApp === safeAppid;
      return (j.name || '').toLowerCase() === (jogo.name || '').toLowerCase();
    });

    if (exists) {
      console.log('Jogo já está nos favoritos');
      return false; // Já existe
    }

    // Adicionar o novo favorito
    const novoFavorito = {
      appid: safeAppid,
      name: jogo.name || 'Nome não disponível',
      header_image: jogo.header_image || '',
    };
    
    const novosFavoritos = [...favoritosAtuais, novoFavorito];
    
    // Salvar no localStorage primeiro
    salvarFavoritos(novosFavoritos);
    
    // Atualizar estado local
    setFavoritos(novosFavoritos);
    
    console.log('Favorito adicionado com sucesso:', novoFavorito);
    console.log('Total de favoritos:', novosFavoritos.length);
    
    return true; // Adicionado com sucesso
  }, []);

  const removerFavorito = useCallback((appid, name) => {
    const normalizedAppid = Number(appid);
    const hasAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0;
    
    // Sempre ler do localStorage para ter a versão mais atualizada
    const favoritosAtuais = lerFavoritos();
    
    const novosFavoritos = favoritosAtuais.filter((j) => {
      const jApp = Number(j.appid);
      if (hasAppid) return !(Number.isFinite(jApp) && jApp === normalizedAppid);
      return (j.name || '').toLowerCase() !== (name || '').toLowerCase();
    });
    
    // Salvar no localStorage primeiro
    salvarFavoritos(novosFavoritos);
    
    // Atualizar estado local
    setFavoritos(novosFavoritos);
    
    console.log('Favorito removido. Total:', novosFavoritos.length);
  }, []);

  const isFavorito = useCallback((jogo) => {
    const normalizedAppid = Number(jogo.steam_appid);
    const safeAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0 ? normalizedAppid : null;

    // Sempre verificar no localStorage para ter a versão mais atualizada
    const favoritosAtuais = lerFavoritos();

    return favoritosAtuais.some((j) => {
      const jApp = Number(j.appid);
      if (safeAppid) return Number.isFinite(jApp) && jApp === safeAppid;
      return (j.name || '').toLowerCase() === (jogo.name || '').toLowerCase();
    });
  }, []);

  return {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
  };
}

