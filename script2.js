// Configuração da API
const API_KEY = '2db55b86de202e21ba8f60d1783044d66c5d408c';

// Função para buscar com timeout e fallback de proxies CORS
async function fetchComCors(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) return response;
    throw new Error(`Erro HTTP: ${response.status}`);
  } catch (erro) {
    clearTimeout(timeoutId);
    
    // Tentar proxies CORS como fallback
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://cors.isomorphic-git.org/${url}`
    ];
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) return response;
      } catch (e) {
        // Continua para o próximo proxy
      }
    }
    throw erro;
  }
}

// Criar card de jogo
function criarCardJogo(jogo) {
  const card = document.createElement('div');
  card.className = 'game-card';
  
  const imagem = jogo.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  const dataLancamento = jogo.release_date 
    ? new Date(jogo.release_date).toLocaleDateString('pt-BR')
    : 'Data indisponível';
  const jogadoresRecentes = jogo.players_recent 
    ? `👥 Jogadores recentes: ${jogo.players_recent.toLocaleString('pt-BR')}` 
    : '';
  
  card.innerHTML = `
    <img src="${imagem}" 
         alt="${jogo.name}" 
         class="card-img-top"
         onerror="this.src='https://placehold.co/460x215?text=Imagem+Indisponível'">
    <div class="card-body">
      <h5 class="card-title">${jogo.name}</h5>
      <p>📅 ${dataLancamento}</p>
      ${jogadoresRecentes ? `<p>${jogadoresRecentes}</p>` : ''}
    </div>
  `;
  
  // Criar botão de favoritar
  const botaoFavoritar = document.createElement('button');
  botaoFavoritar.className = 'btn btn-outline-danger';
  botaoFavoritar.innerHTML = '<i class="fas fa-heart me-2"></i>Favoritar';
  botaoFavoritar.addEventListener('click', () => {
    favoritarJogo(jogo.steam_appid, jogo.name, jogo.header_image, jogo.release_date, jogo.players_recent);
  });
  
  card.querySelector('.card-body').appendChild(botaoFavoritar);
  return card;
}

// Buscar jogos na API IsThereAnyDeal
async function buscarJogos(termo, resultsDiv, loadingDiv) {
  const urlBusca = `https://api.isthereanydeal.com/games/search/v1?key=${API_KEY}&title=${encodeURIComponent(termo)}`;
  
  resultsDiv.innerHTML = '';
  loadingDiv.classList.remove('hidden');
  
  try {
    const response = await fetchComCors(urlBusca);
    const dados = await response.json();
    
    console.log('Resposta da busca:', dados);
    
    // Tratar diferentes formatos de resposta
    const jogos = Array.isArray(dados) ? dados : 
                  Array.isArray(dados?.list) ? dados.list :
                  Array.isArray(dados?.results) ? dados.results :
                  Array.isArray(dados?.data) ? dados.data : [];
    
    if (jogos.length === 0) {
      resultsDiv.innerHTML = `
        <div class="empty-state">
          <p>😕 Nenhum jogo encontrado</p>
        </div>
      `;
      return;
    }
    
    // Buscar informações detalhadas de cada jogo
    const jogosDetalhados = await Promise.all(
      jogos.slice(0, 12).map(async (jogo) => {
        const jogoId = jogo.id || jogo.gameID || jogo.plain;
        const jogoNome = jogo.title || jogo.name || `Jogo ${jogoId}`;
        
        if (!jogoId) {
          return { 
            steam_appid: 0, 
            name: jogoNome, 
            header_image: '' 
          };
        }
        
        try {
          const urlInfo = `https://api.isthereanydeal.com/games/info/v2?key=${API_KEY}&id=${jogoId}`;
          const responseInfo = await fetchComCors(urlInfo);
          const dadosInfo = await responseInfo.json();
          
          console.log('Info do jogo:', jogoId, dadosInfo);
          
          const info = dadosInfo?.data || dadosInfo;
          
          return {
            steam_appid: jogoId,
            name: jogoNome,
            header_image: info?.assets?.banner || info?.assets?.boxart || '',
            release_date: info?.releaseDate || info?.release_date || '',
            players_recent: info?.players?.recent || null
          };
        } catch (erro) {
          console.warn('Erro ao buscar info do jogo:', jogoId, erro);
          return { 
            steam_appid: jogoId, 
            name: jogoNome, 
            header_image: '' 
          };
        }
      })
    );
    
    resultsDiv.innerHTML = '';
    jogosDetalhados.forEach(jogo => {
      resultsDiv.appendChild(criarCardJogo(jogo));
    });
    
  } catch (erro) {
    console.error('Erro ao buscar jogos:', erro);
    
    // Tentar fallback com API alternativa
    try {
      console.log('Tentando API alternativa...');
      const response = await fetchComCors('https://steamapi.xpaw.me/list.json');
      const dados = await response.json();
      
      const jogosFiltrados = Object.values(dados)
        .filter(j => j.name && j.name.toLowerCase().includes(termo.toLowerCase()))
        .slice(0, 6);
      
      if (jogosFiltrados.length === 0) {
        resultsDiv.innerHTML = `
          <div class="empty-state">
            <p>😕 Nenhum jogo encontrado</p>
          </div>
        `;
        return;
      }
      
      resultsDiv.innerHTML = '';
      jogosFiltrados.forEach(j => {
        const jogo = {
          steam_appid: j.appid,
          name: j.name,
          header_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid}/capsule_616x353.jpg`,
          release_date: '',
          players_recent: null
        };
        resultsDiv.appendChild(criarCardJogo(jogo));
      });
    } catch (erroFallback) {
      console.error('Erro no fallback:', erroFallback);
      resultsDiv.innerHTML = `
        <div class="empty-state">
          <p>❌ Erro ao buscar jogos</p>
          <p>Tente novamente mais tarde</p>
        </div>
      `;
    }
  } finally {
    loadingDiv.classList.add('hidden');
  }
}

// Favoritar jogo (agora salva todas as informações)
function favoritarJogo(appid, nome, imagem, dataLancamento, jogadoresRecentes) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  
  console.log('Favoritando:', { appid, nome, imagem });
  
  // Verificar se já existe
  const jaExiste = favoritos.some(j => {
    if (appid) return j.appid === appid;
    return j.name.toLowerCase() === nome.toLowerCase();
  });
  
  if (jaExiste) {
    alert('Este jogo já está nos favoritos!');
    return;
  }
  
  // Adicionar aos favoritos com todas as informações
  favoritos.push({
    appid: appid,
    name: nome,
    header_image: imagem || '',
    release_date: dataLancamento || '',
    players_recent: jogadoresRecentes || null
  });
  
  localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
  console.log('Jogo favoritado! Total:', favoritos.length);
  
  alert('Jogo adicionado aos favoritos!');
}

// Renderizar favoritos (agora mostra todas as informações)
function renderizarFavoritos() {
  const favDiv = document.getElementById('favoritosList');
  
  if (!favDiv) {
    console.error('Elemento favoritosList não encontrado!');
    return;
  }
  
  const favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  console.log('Renderizando favoritos:', favoritos);
  
  favDiv.innerHTML = '';
  
  if (favoritos.length === 0) {
    favDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <h3>Nenhum favorito ainda</h3>
        <p>Adicione jogos aos favoritos na página inicial para vê-los aqui.</p>
      </div>
    `;
    return;
  }
  
  favoritos.forEach(jogo => {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const imagem = jogo.header_image || 
                   (jogo.appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/capsule_616x353.jpg` : 
                   'https://placehold.co/460x215?text=Sem+Imagem');
    
    const dataLancamento = jogo.release_date 
      ? new Date(jogo.release_date).toLocaleDateString('pt-BR')
      : 'Data indisponível';
    
    const jogadoresRecentes = jogo.players_recent 
      ? `👥 Jogadores recentes: ${jogo.players_recent.toLocaleString('pt-BR')}` 
      : '';
    
    card.innerHTML = `
      <img src="${imagem}" 
           class="card-img-top" 
           alt="${jogo.name}"
           onerror="this.src='https://placehold.co/460x215?text=Sem+Imagem'">
      <div class="card-body">
        <h5 class="card-title">${jogo.name}</h5>
        <p>📅 ${dataLancamento}</p>
        ${jogadoresRecentes ? `<p>${jogadoresRecentes}</p>` : ''}
      </div>
    `;
    
    // Botão de remover
    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'btn btn-outline-secondary';
    botaoRemover.innerHTML = '<i class="fas fa-trash me-2"></i>Remover';
    botaoRemover.addEventListener('click', () => removerFavorito(jogo.appid, jogo.name));
    
    card.querySelector('.card-body').appendChild(botaoRemover);
    favDiv.appendChild(card);
  });
  
  console.log('Total de favoritos renderizados:', favoritos.length);
}

// Remover favorito
function removerFavorito(appid, nome) {
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  
  console.log('Removendo favorito:', { appid, nome });
  
  favoritos = favoritos.filter(j => {
    if (appid) return j.appid !== appid;
    return j.name.toLowerCase() !== nome.toLowerCase();
  });
  
  localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
  renderizarFavoritos();
  
  alert('Jogo removido dos favoritos!');
}

// Inicializar página de login
function iniciarLogin() {
  const botaoLogin = document.getElementById('loginBtn');
  const formularioLogin = document.querySelector('.login-form');
  
  if (!botaoLogin) return;
  
  const fazerLogin = (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value.trim();
    const senha = document.getElementById('password').value.trim();
    
    if (!usuario || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    botaoLogin.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Entrando...';
    botaoLogin.disabled = true;
    
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  };
  
  botaoLogin.addEventListener('click', fazerLogin);
  if (formularioLogin) {
    formularioLogin.addEventListener('submit', fazerLogin);
  }
}

// Inicializar página home
function iniciarHome() {
  const formularioBusca = document.getElementById('searchForm');
  const inputBusca = document.getElementById('searchInput');
  const divResultados = document.getElementById('results');
  const divCarregando = document.getElementById('loading');
  
  if (!formularioBusca || !inputBusca) return;
  
  formularioBusca.addEventListener('submit', async (e) => {
    e.preventDefault();
    const termo = inputBusca.value.trim();
    if (termo) {
      await buscarJogos(termo, divResultados, divCarregando);
    }
  });
}

// Inicializar página de favoritos
function iniciarFavoritos() {
  renderizarFavoritos();
}

// Inicialização automática ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página carregada, inicializando...');
  
  // Detectar qual página está aberta pelos elementos presentes
  if (document.getElementById('loginBtn')) {
    console.log('Inicializando página de login');
    iniciarLogin();
  }
  
  if (document.getElementById('searchForm')) {
    console.log('Inicializando página home');
    iniciarHome();
  }
  
  if (document.getElementById('favoritosList')) {
    console.log('Inicializando página de favoritos');
    iniciarFavoritos();
  }
});