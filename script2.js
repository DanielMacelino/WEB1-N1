// ✅ Cria um card de jogo
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';

  const img = game.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  const releaseDate = game.release_date
    ? new Date(game.release_date).toLocaleDateString('pt-BR')
    : 'Data não disponível';
  const players = game.players_recent ? `👥 Jogadores recentes: ${game.players_recent.toLocaleString('pt-BR')}` : '';

  card.innerHTML = `
    <img src="${img}" alt="${game.name}" class="card-img-top"
         onerror="this.src='https://placehold.co/460x215?text=Imagem+Indisponível'">
    <div class="card-body">
      <h5 class="card-title">${game.name}</h5>
      <p>📅 ${releaseDate}</p>
      <p>${players}</p>
    </div>
  `;

  // Cria botão sem usar inline onclick (evita problemas de aspas)
  const btn = document.createElement('button');
  btn.className = 'btn btn-outline-danger';
  btn.innerHTML = '<i class="fas fa-heart me-2"></i>Favoritar';
  btn.addEventListener('click', () => favoritarJogo(game.steam_appid, game.name, game.header_image));
  card.querySelector('.card-body').appendChild(btn);
  return card;
}

// ✅ Busca jogos na API IsThereAnyDeal
async function searchGames(query, resultsDiv, loadingDiv) {
  const API_KEY = '2db55b86de202e21ba8f60d1783044d66c5d408c'; // coloque a sua chave aqui
  const url = `https://api.isthereanydeal.com/games/search/v1?key=${API_KEY}&title=${encodeURIComponent(query)}&limit=6`;

  // Helper: fetch com timeout e fallback de CORS proxies
  async function fetchWithCors(urlToFetch, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(urlToFetch, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      clearTimeout(timeout);
      // Tentar proxies CORS
      const proxies = [
        (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        (u) => `https://cors.isomorphic-git.org/${u}`,
      ];
      for (const make of proxies) {
        try {
          const proxied = make(urlToFetch);
          const res2 = await fetch(proxied, options);
          if (res2.ok) return res2;
        } catch (_) {
          // tenta próximo proxy
        }
      }
      throw err;
    }
  }

  resultsDiv.innerHTML = '';
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetchWithCors(url);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const raw = await response.json();
    console.log('[ITAD] Resposta bruta da busca:', raw);

    const items = Array.isArray(raw)
      ? raw
      : (Array.isArray(raw?.list) ? raw.list
        : (Array.isArray(raw?.results) ? raw.results
          : (Array.isArray(raw?.data) ? raw.data : [])));

    if (!Array.isArray(items) || items.length === 0) {
      resultsDiv.innerHTML = `<div class="empty-state"><p>😕 Nenhum jogo encontrado</p></div>`;
      return;
    }

    // Buscar detalhes individuais
    const detailedGames = await Promise.all(
      items.slice(0, 6).map(async (g) => {
        const gameId = g.id ?? g.gameID ?? g.plain ?? g.appid ?? g.app_id;
        const gameTitle = g.title ?? g.name ?? g.game ?? g.plain ?? `Jogo ${gameId}`;
        if (!gameId) {
          return { steam_appid: 0, name: gameTitle, header_image: '' };
        }
        try {
          const infoUrl = `https://api.isthereanydeal.com/games/info/v2?key=${API_KEY}&id=${gameId}`;
          const infoRes = await fetchWithCors(infoUrl);
          if (!infoRes.ok) throw new Error(`Info HTTP: ${infoRes.status}`);
          const infoRaw = await infoRes.json();
          console.log('[ITAD] Info bruto para', gameId, infoRaw);
          const info = infoRaw?.data ?? infoRaw;
          return {
            steam_appid: gameId,
            name: gameTitle,
            header_image: info?.assets?.banner || info?.assets?.boxart || info?.assets?.icon || '',
            release_date: info?.releaseDate || info?.release_date || info?.released || '',
            players_recent: info?.players?.recent ?? info?.players_recent ?? null,
          };
        } catch (e) {
          console.warn('[ITAD] Falha ao obter info de', gameId, e);
          return { steam_appid: gameId, name: gameTitle, header_image: '' };
        }
      })
    );

    resultsDiv.innerHTML = '';
    detailedGames.forEach((game) => resultsDiv.appendChild(createGameCard(game)));
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
    // Fallback para lista pública (xpaw) quando a API principal falhar/timeout
    try {
      console.warn('[Fallback] Tentando fonte pública xpaw...');
      const xpawRes = await fetchWithCors('https://steamapi.xpaw.me/list.json');
      if (!xpawRes.ok) throw new Error(`Fallback HTTP: ${xpawRes.status}`);
      const xpawData = await xpawRes.json();
      const filtered = Object.values(xpawData).filter((j) =>
        j.name && j.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);

      if (filtered.length === 0) {
        resultsDiv.innerHTML = `<div class="empty-state"><p>😕 Nenhum jogo encontrado</p></div>`;
        return;
      }

      resultsDiv.innerHTML = '';
      filtered.forEach((j) => {
        const game = {
          steam_appid: j.appid || j.app_id,
          name: j.name || 'Nome não disponível',
          header_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid || j.app_id}/capsule_616x353.jpg`,
          release_date: '',
          players_recent: null,
        };
        resultsDiv.appendChild(createGameCard(game));
      });
    } catch (fallbackErr) {
      console.error('[Fallback] Falhou também:', fallbackErr);
      resultsDiv.innerHTML = `<div class="empty-state"><p>❌ Erro ao buscar jogos</p></div>`;
    }
  } finally {
    loadingDiv.classList.add('hidden');
  }
}

// ✅ Favoritar jogo (não depende de appid numérico)
function favoritarJogo(appid, name, headerImage) {
  const normalizedAppid = Number(appid);
  const safeAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0 ? normalizedAppid : null;

  console.log('Favoritando jogo:', { appid: safeAppid, name, headerImage });

  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  console.log('Favoritos atuais:', favoritos);

  const exists = favoritos.some((j) => {
    const jApp = Number(j.appid);
    if (safeAppid) return Number.isFinite(jApp) && jApp === safeAppid;
    return (j.name || '').toLowerCase() === (name || '').toLowerCase();
  });

  if (!exists) {
    favoritos.push({ appid: safeAppid, name, header_image: headerImage || '' });
    localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
    console.log('Jogo salvo! Novo array:', favoritos);
    alert('Jogo favoritado!');
  } else {
    alert('Este jogo já está nos favoritos.');
  }

  // Redireciona para a página de favoritos
  window.location.href = 'favoritos.html';
}

// ✅ Renderizar lista de favoritos
function renderizarFavoritos() {
  const favDiv = document.getElementById('favoritosList');
  if (!favDiv) {
    console.error('Elemento favoritosList não encontrado!');
    return;
  }

  console.log('Renderizando favoritos...');
  const favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  console.log('Favoritos encontrados no localStorage:', favoritos);
  
  favDiv.innerHTML = '';

  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    favDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <h3>Nenhum favorito ainda</h3>
        <p>Adicione jogos aos favoritos na página inicial para vê-los aqui.</p>
      </div>`;
    return;
  }

  favoritos.forEach((jogo) => {
    const appid = Number(jogo.appid);
    const hasValidAppid = Number.isFinite(appid) && appid > 0;
    const imgUrl = hasValidAppid
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`
      : (jogo.header_image || 'https://placehold.co/184x69?text=Sem+Imagem');

    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${imgUrl}" class="card-img-top" alt="${jogo.name || 'Sem nome'}" 
           onerror="this.src='https://placehold.co/184x69?text=Sem+Imagem'">
      <div class="card-body">
        <h5 class="card-title">${jogo.name || 'Nome não disponível'}</h5>
        <button class="btn btn-outline-secondary">
          <i class="fas fa-trash me-2"></i>Remover
        </button>
      </div>
    `;

    const removeBtn = card.querySelector('button');
    removeBtn.addEventListener('click', () => removerFavorito(hasValidAppid ? appid : null, jogo.name));

    favDiv.appendChild(card);
  });
  
  console.log('Favoritos renderizados:', favoritos.length);
}

// ✅ Remover favorito
function removerFavorito(appid, name) {
  const normalizedAppid = Number(appid);
  const hasAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0;
  console.log('Removendo favorito:', { appid: hasAppid ? normalizedAppid : null, name });
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  favoritos = favoritos.filter((j) => {
    const jApp = Number(j.appid);
    if (hasAppid) return !(Number.isFinite(jApp) && jApp === normalizedAppid);
    return (j.name || '').toLowerCase() !== (name || '').toLowerCase();
  });
  localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
  renderizarFavoritos();
  alert('Jogo removido dos favoritos!');
}

// ==========================================================
// 🔹 FUNÇÕES DE INICIALIZAÇÃO POR PÁGINA
// ==========================================================

function initLoginPage() {
  const loginBtn = document.getElementById('loginBtn');
  const loginForm = document.querySelector('.login-form');

  if (!loginBtn) return;

  const handleLogin = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Entrando...';
    loginBtn.disabled = true;

    setTimeout(() => (window.location.href = 'home.html'), 1000);
  };

  loginBtn.addEventListener('click', handleLogin);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
}

function initHomePage() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) await searchGames(query, resultsDiv, loadingDiv);
  });
}

function initFavoritosPage() {
  renderizarFavoritos();
}

// ==========================================================
// 🔹 INICIALIZAÇÃO AUTOMÁTICA (detecta página atual)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - Inicializando página...');
  // Detecta pela presença de elementos da página em vez do path
  if (document.getElementById('loginBtn')) {
    console.log('Inicializando página de login');
    initLoginPage();
  }
  if (document.getElementById('searchForm')) {
    console.log('Inicializando página home');
    initHomePage();
  }
  if (document.getElementById('favoritosList')) {
    console.log('Inicializando página de favoritos');
    initFavoritosPage();
  }
});