// Lista de jogos populares da Steam para fallback
const jogosPopulares = [
  { steam_appid: 730, name: 'Counter-Strike 2', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg' },
  { steam_appid: 570, name: 'Dota 2', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg' },
  { steam_appid: 1174180, name: 'Red Dead Redemption 2', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg' },
  { steam_appid: 271590, name: 'Grand Theft Auto V', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg' },
  { steam_appid: 1091500, name: 'Cyberpunk 2077', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg' },
  { steam_appid: 1245620, name: 'ELDEN RING', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg' },
  { steam_appid: 1938090, name: 'Call of Duty®', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/capsule_616x353.jpg' },
  { steam_appid: 1086940, name: 'Baldur\'s Gate 3', header_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg' },
];

// Buscar jogos recomendados (jogos populares)
export async function buscarJogosRecomendados() {
  return jogosPopulares.slice(0, 6).map(jogo => ({
    ...jogo,
    release_date: '',
    players_recent: null,
  }));
}

// Buscar jogos usando a API pública da Steam Store
export async function buscarJogo(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();

  // Primeiro, tentar buscar na lista de jogos populares (fallback rápido)
  const jogosEncontrados = jogosPopulares.filter(jogo => 
    jogo.name.toLowerCase().includes(queryLower)
  );

  if (jogosEncontrados.length > 0) {
    return jogosEncontrados.slice(0, 6).map(jogo => ({
      ...jogo,
      release_date: '',
      players_recent: null,
    }));
  }

  // Tentar buscar na API da Steam Store
  try {
    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=portuguese&cc=BR`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(searchUrl)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(proxyUrl, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // A API da Steam retorna os resultados em data.items
    const items = data?.items || data?.results || [];
    
    if (Array.isArray(items) && items.length > 0) {
      const jogos = items.slice(0, 6).map((item) => {
        const appid = item.id || item.appid || item.app_id;
        const name = item.name || 'Nome não disponível';
        
        // Formatar preço
        const price = item.price || 0;
        const finalPrice = item.final_price || price;
        const discountPercent = item.discount_percent || 0;
        const currency = item.currency || 'BRL';
        const isFree = item.is_free || false;
        
        // Formatar preço para exibição
        const formatPrice = (priceInCents) => {
          if (isFree) return 'Grátis';
          const priceInReais = priceInCents / 100;
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
          }).format(priceInReais);
        };
        
        return {
          steam_appid: appid,
          name: name,
          header_image: item.tiny_image || item.capsule_image || item.header_image || 
                       `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`,
          release_date: item.release_date || item.released || '',
          players_recent: null,
          // Novos campos
          price: price,
          final_price: finalPrice,
          price_formatted: formatPrice(finalPrice),
          original_price_formatted: discountPercent > 0 ? formatPrice(price) : null,
          discount_percent: discountPercent,
          is_free: isFree,
          currency: currency,
          platforms: item.platforms || {},
          metacritic: item.metacritic || null,
          recommendations: item.recommendations || null,
          controller_support: item.controller_support || null,
        };
      });

      return jogos;
    }
    
    // Se não encontrou na API, retornar lista filtrada de jogos populares
    return jogosPopulares.slice(0, 6).map(jogo => ({
      ...jogo,
      release_date: '',
      players_recent: null,
    }));
    
  } catch (err) {
    console.error('Erro ao buscar jogos na API:', err);
    
    // Em caso de erro, retornar jogos populares como fallback
    console.log('Usando lista de jogos populares como fallback');
    return jogosPopulares.slice(0, 6).map(jogo => ({
      ...jogo,
      release_date: '',
      players_recent: null,
    }));
  }
}

