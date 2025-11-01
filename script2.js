// ✅ Cria um card de jogo
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';

  const img = game.header_image || 'https://via.placeholder.com/460x215/667eea/ffffff?text=Sem+Imagem';
  const releaseDate = game.release_date
    ? new Date(game.release_date).toLocaleDateString('pt-BR')
    : 'Data não disponível';
  const players = game.players_recent ? `👥 Jogadores recentes: ${game.players_recent.toLocaleString('pt-BR')}` : '';

  card.innerHTML = `
    <img src="${img}" alt="${game.name}" class="card-img-top"
         onerror="this.src='https://via.placeholder.com/460x215/667eea/ffffff?text=Imagem+Indisponível'">
    <div class="card-body">
      <h5 class="card-title">${game.name}</h5>
      <p>📅 ${releaseDate}</p>
      <p>${players}</p>
      <button class="btn btn-outline-danger" onclick="favoritarJogo(${game.steam_appid}, '${game.name.replace(/'/g, "\\'")}')">
        <i class="fas fa-heart me-2"></i>Favoritar
      </button>
    </div>
  `;
  return card;
}

// ✅ Busca jogos na API IsThereAnyDeal
async function searchGames(query, resultsDiv, loadingDiv) {
  const API_KEY = '2db55b86de202e21ba8f60d1783044d66c5d408c'; // coloque a sua chave aqui
  const url = `https://api.isthereanydeal.com/games/search/v1?key=${API_KEY}&title=${encodeURIComponent(query)}&limit=6`;

  resultsDiv.innerHTML = '';
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const games = await response.json();

    

    if (!Array.isArray(games) || games.length === 0) {
      resultsDiv.innerHTML = `<div class="empty-state"><p>😕 Nenhum jogo encontrado</p></div>`;
      return;
    }

    // Buscar detalhes individuais
    const detailedGames = await Promise.all(
      games.slice(0, 6).map(async (g) => { // Limitar a 12 resultados exibidos
        try {
          const infoUrl = `https://api.isthereanydeal.com/games/info/v2?key=${API_KEY}&id=${g.id}`;
          const infoRes = await fetch(infoUrl);
          const info = await infoRes.json();
          return {
            steam_appid: g.id,
            name: g.title,
            header_image: info.assets?.banner || info.assets?.boxart || '',
            release_date: info.releaseDate || '',
            players_recent: info.players?.recent || null,
          };
        } catch {
          return { steam_appid: g.id, name: g.title, header_image: '' };
        }
      })
    );

    resultsDiv.innerHTML = '';
    detailedGames.forEach((game) => resultsDiv.appendChild(createGameCard(game)));
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
    resultsDiv.innerHTML = `<div class="empty-state"><p>❌ Erro ao buscar jogos</p></div>`;
  } finally {
    loadingDiv.classList.add('hidden');
  }
}

// ✅ Favoritar jogo
function favoritarJogo(appid, name) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  if (!favoritos.some((j) => j.appid === appid)) {
    favoritos.push({ appid, name });
    localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
    alert('Jogo favoritado!');
  } else {
    alert('Este jogo já está nos favoritos.');
  }
}

// ✅ Renderizar lista de favoritos
function renderizarFavoritos() {
  const favDiv = document.getElementById('favoritosList');
  if (!favDiv) return;

  const favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  favDiv.innerHTML = '';

  if (favoritos.length === 0) {
    favDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <h3>Nenhum favorito ainda</h3>
        <p>Adicione jogos aos favoritos na página inicial para vê-los aqui.</p>
      </div>`;
    return;
  }

  favoritos.forEach((jogo) => {
    const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/capsule_184x69.jpg`;
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${imgUrl}" class="card-img-top" alt="${jogo.name}" 
           onerror="this.src='https://via.placeholder.com/184x69?text=Sem+Imagem'">
      <div class="card-body">
        <h5 class="card-title">${jogo.name}</h5>
        <button class="btn btn-outline-secondary" onclick="removerFavorito(${jogo.appid})">
          <i class="fas fa-trash me-2"></i>Remover
        </button>
      </div>
    `;
    favDiv.appendChild(card);
  });
}

// ✅ Remover favorito
function removerFavorito(appid) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  favoritos = favoritos.filter((j) => j.appid !== appid);
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
  const path = window.location.pathname;

  if (path.endsWith('index.html')) initLoginPage();
  if (path.endsWith('home.html')) {
    initHomePage();
  }
  if (path.endsWith('favoritos.html')) initFavoritosPage();
});