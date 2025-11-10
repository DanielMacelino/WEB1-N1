// ============================================
// FUNÇÃO: criarCardJogo
// OBJETIVO: Cria um elemento visual (card) para exibir informações de um jogo
// PARÂMETRO: game - objeto contendo dados do jogo (nome, imagem, data, etc.)
// RETORNO: elemento HTML (div) pronto para ser inserido na página
// ============================================
function criarCardJogo(game) {
  // Cria um novo elemento <div> no DOM (Document Object Model)
  const card = document.createElement('div');
  
  // Define a classe CSS do card para aplicar estilos predefinidos
  card.className = 'game-card';

  // Verifica se o jogo tem uma imagem de cabeçalho
  // Se não tiver, usa uma imagem placeholder (imagem de substituição)
  const img = game.header_image || 'https://placehold.co/460x215?text=Sem+Imagem';
  
  // Processa a data de lançamento do jogo
  // Se existir uma data, converte para formato brasileiro (dd/mm/aaaa)
  // Se não existir, define como "Data indisponível"
  const releaseDate = game.release_date
    ? new Date(game.release_date).toLocaleDateString('pt-BR')
    : 'Data indisponível';
  
  // Verifica se há informação sobre jogadores recentes
  // Se existir, formata o número com separadores de milhar (ex: 1.234)
  // Se não existir, deixa vazio
  const players = game.players_recent ? `👥 Jogadores recentes: ${game.players_recent.toLocaleString('pt-BR')}` : '';

  // Preenche o conteúdo HTML interno do card com as informações do jogo
  card.innerHTML = `
    <img src="${img}" alt="${game.name}" class="card-img-top"
         onerror="this.src='https://placehold.co/460x215?text=Imagem+Indisponível'">
    <div class="card-body">
      <h5 class="card-title">${game.name}</h5>
      <p>📅 ${releaseDate}</p>
      <p>${players}</p>
    </div>
  `;
  // Nota: onerror é um evento que dispara se a imagem não carregar
  // Nesse caso, substitui automaticamente por uma imagem placeholder

  // Cria um botão de favoritar dinamicamente (sem usar onclick inline)
  // Isso evita problemas com aspas e é uma prática mais segura
  const btn = document.createElement('button');
  
  // Define as classes CSS do botão (Bootstrap: btn = botão, btn-outline-danger = borda vermelha)
  btn.className = 'btn btn-outline-danger';
  
  // Define o conteúdo HTML do botão (ícone de coração + texto)
  btn.innerHTML = '<i class="fas fa-heart me-2"></i>Favoritar';
  
  // Adiciona um "ouvinte" de evento: quando o botão for clicado, executa a função favoritarJogo
  // Passa os dados do jogo (ID, nome, imagem) como parâmetros
  btn.addEventListener('click', () => favoritarJogo(game.steam_appid, game.name, game.header_image));
  
  // Encontra a div com classe "card-body" dentro do card e adiciona o botão nela
  card.querySelector('.card-body').appendChild(btn);
  
  // Retorna o card completo e pronto para ser exibido na página
  return card;
}

// ============================================
// FUNÇÃO: buscarJogo
// OBJETIVO: Busca jogos na API IsThereAnyDeal baseado no termo de pesquisa
// PARÂMETROS:
//   - query: termo de busca digitado pelo usuário
//   - resultsDiv: elemento HTML onde os resultados serão exibidos
//   - loadingDiv: elemento HTML que mostra/oculta o indicador de carregamento
// ============================================
async function buscarJogo(query, resultsDiv, loadingDiv) { 
  // Define a chave de API necessária para autenticar as requisições
  const API_KEY = '2db55b86de202e21ba8f60d1783044d66c5d408c'; 
  
  // Monta a URL da API com o termo de busca codificado (encodeURIComponent)
  // encodeURIComponent garante que caracteres especiais sejam tratados corretamente
  // limit=6 limita os resultados a 6 jogos
  const url = `https://api.isthereanydeal.com/games/search/v1?key=${API_KEY}&title=${encodeURIComponent(query)}&limit=6`;

  // ============================================
  // FUNÇÃO AUXILIAR: fetchWithCors
  // OBJETIVO: Faz requisições HTTP com tratamento de CORS e timeout
  // CORS (Cross-Origin Resource Sharing): política de segurança dos navegadores
  // que bloqueia requisições entre domínios diferentes
  // ============================================
  async function fetchWithCors(urlToFetch, options = {}) {
    // AbortController permite cancelar uma requisição em andamento
    const controller = new AbortController();
    
    // Define um timeout de 10 segundos - se a requisição demorar mais, será cancelada
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    try {
      // Faz a requisição HTTP com o sinal de aborto (para poder cancelar se necessário)
      const res = await fetch(urlToFetch, { ...options, signal: controller.signal });
      
      // Se chegou aqui, a requisição terminou - cancela o timeout
      clearTimeout(timeout);
      
      // Verifica se a resposta foi bem-sucedida (status 200-299)
      if (res.ok) return res;
      
      // Se não foi bem-sucedida, lança um erro com o código HTTP
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      // Se deu erro (timeout, CORS, etc.), cancela o timeout
      clearTimeout(timeout);
      
      // Lista de proxies CORS alternativos para tentar contornar bloqueios
      // Proxies são servidores intermediários que fazem a requisição por você
      const proxies = [
        // Proxy 1: AllOrigins - adiciona cabeçalhos CORS à resposta
        (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        // Proxy 2: Isomorphic Git CORS - outro serviço de proxy
        (u) => `https://cors.isomorphic-git.org/${u}`,
      ];
      
      // Tenta cada proxy na lista até encontrar um que funcione
      for (const make of proxies) {
        try {
          // Gera a URL do proxy com a URL original
          const proxied = make(urlToFetch);
          
          // Tenta fazer a requisição através do proxy
          const res2 = await fetch(proxied, options);
          
          // Se funcionou, retorna a resposta
          if (res2.ok) return res2;
        } catch (_) {
          // Se este proxy falhou, tenta o próximo (não faz nada aqui)
        }
      }
      
      // Se todos os proxies falharam, lança o erro original
      throw err;
    }
  }

  // Limpa qualquer resultado anterior na div de resultados
  resultsDiv.innerHTML = '';
  
  // Mostra o indicador de carregamento (remove a classe 'hidden' que oculta o elemento)
  loadingDiv.classList.remove('hidden');

  try {
    // Faz a requisição para buscar jogos usando a função auxiliar com CORS
    const response = await fetchWithCors(url);
    
    // Verifica se a resposta foi bem-sucedida, senão lança erro
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    // Converte a resposta de JSON para objeto JavaScript
    const raw = await response.json();
    
    // Log para debug: mostra a resposta bruta no console do navegador
    console.log('[ITAD] Resposta bruta da busca:', raw);

    // Tenta extrair o array de jogos da resposta
    // A API pode retornar em formatos diferentes, então testa várias possibilidades
    const items = Array.isArray(raw)
      ? raw // Se já é um array, usa direto
      : (Array.isArray(raw?.list) ? raw.list // Se tem propriedade 'list' que é array
        : (Array.isArray(raw?.results) ? raw.results // Se tem propriedade 'results' que é array
          : (Array.isArray(raw?.data) ? raw.data : []))); // Se tem propriedade 'data' que é array, senão array vazio

    // Verifica se conseguiu extrair um array válido com pelo menos um item
    if (!Array.isArray(items) || items.length === 0) {
      // Se não encontrou jogos, exibe mensagem amigável
      resultsDiv.innerHTML = `<div class="empty-state"><p>😕 Nenhum jogo encontrado</p></div>`;
      return; // Para a execução da função aqui
    }

    // Busca informações detalhadas de cada jogo encontrado
    // Promise.all executa todas as requisições em paralelo e espera todas terminarem
    const detailedGames = await Promise.all(
      // Pega apenas os 6 primeiros jogos (slice(0, 6))
      // map transforma cada item do array em uma promessa (requisição assíncrona)
      items.slice(0, 6).map(async (g) => {
        // Tenta extrair o ID do jogo de várias propriedades possíveis
        // O operador ?? (nullish coalescing) usa o primeiro valor que não seja null/undefined
        const gameId = g.id ?? g.gameID ?? g.plain ?? g.appid ?? g.app_id;
        
        // Tenta extrair o nome/título do jogo de várias propriedades possíveis
        const gameTitle = g.title ?? g.name ?? g.game ?? g.plain ?? `Jogo ${gameId}`;
        
        // Se não conseguiu um ID válido, retorna um objeto básico
        if (!gameId) {
          return { steam_appid: 0, name: gameTitle, header_image: '' };
        }
        
        try {
          // Monta a URL para buscar informações detalhadas do jogo específico
          const infoUrl = `https://api.isthereanydeal.com/games/info/v2?key=${API_KEY}&id=${gameId}`;
          
          // Faz a requisição para obter informações detalhadas
          const infoRes = await fetchWithCors(infoUrl);
          
          // Verifica se a resposta foi bem-sucedida
          if (!infoRes.ok) throw new Error(`Info HTTP: ${infoRes.status}`);
          
          // Converte a resposta JSON em objeto JavaScript
          const infoRaw = await infoRes.json();
          
          // Log para debug
          console.log('[ITAD] Info bruto para', gameId, infoRaw);
          
          // Tenta extrair os dados do jogo (pode estar em infoRaw.data ou direto em infoRaw)
          const info = infoRaw?.data ?? infoRaw;
          
          // Retorna um objeto padronizado com as informações do jogo
          return {
            steam_appid: gameId, // ID do jogo na Steam
            name: gameTitle, // Nome do jogo
            // Tenta pegar a imagem do banner, se não tiver pega boxart, se não tiver pega ícone
            header_image: info?.assets?.banner || info?.assets?.boxart || info?.assets?.icon || '',
            // Tenta pegar a data de lançamento de várias propriedades possíveis
            release_date: info?.releaseDate || info?.release_date || info?.released || '',
            // Tenta pegar o número de jogadores recentes
            players_recent: info?.players?.recent ?? info?.players_recent ?? null,
          };
        } catch (e) {
          // Se falhar ao buscar informações de um jogo específico, não quebra tudo
          // Apenas registra o erro e retorna um objeto básico
          console.warn('[ITAD] Falha ao obter info de', gameId, e);
          return { steam_appid: gameId, name: gameTitle, header_image: '' };
        }
      })
    );

    // Limpa a div de resultados antes de adicionar os novos
    resultsDiv.innerHTML = ''; 
    
    // Para cada jogo detalhado, cria um card e adiciona na div de resultados
    detailedGames.forEach((game) => resultsDiv.appendChild(criarCardJogo(game)));
    
  } catch (err) {
    // Se a busca principal falhar, registra o erro
    console.error('Erro ao buscar jogos:', err);
    
    // Tenta usar uma fonte alternativa (fallback) quando a API principal falhar
    try {
      console.warn('[Fallback] Tentando fonte pública xpaw...');
      
      // Faz requisição para uma API pública alternativa que lista jogos da Steam
      const xpawRes = await fetchWithCors('https://steamapi.xpaw.me/list.json');
      
      // Verifica se a resposta foi bem-sucedida
      if (!xpawRes.ok) throw new Error(`Fallback HTTP: ${xpawRes.status}`);
      
      // Converte a resposta JSON em objeto JavaScript
      const xpawData = await xpawRes.json();
      
      // Filtra os jogos que contêm o termo de busca no nome (case-insensitive)
      // Converte tudo para minúsculas para comparar sem diferenciar maiúsculas/minúsculas
      // Pega apenas os 6 primeiros resultados
      const filtered = Object.values(xpawData).filter((j) =>
        j.name && j.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);

      // Se não encontrou nenhum jogo, exibe mensagem
      if (filtered.length === 0) {
        resultsDiv.innerHTML = `<div class="empty-state"><p>😕 Nenhum jogo encontrado</p></div>`;
        return;
      }

      // Limpa a div de resultados
      resultsDiv.innerHTML = '';
      
      // Para cada jogo filtrado, cria um objeto padronizado e exibe o card
      filtered.forEach((j) => {
        // Monta objeto com dados do jogo no formato esperado
        const game = {
          steam_appid: j.appid || j.app_id, // ID do jogo
          name: j.name || 'Nome não disponível', // Nome do jogo
          // URL da imagem do jogo na CDN da Steam (servidor de conteúdo)
          header_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid || j.app_id}/capsule_616x353.jpg`,
          release_date: '', // API alternativa não fornece data
          players_recent: null, // API alternativa não fornece jogadores
        };
        
        // Cria e adiciona o card do jogo na página
        resultsDiv.appendChild(criarCardJogo(game));
      });
    } catch (fallbackErr) {
      // Se o fallback também falhar, exibe mensagem de erro
      console.error('[Fallback] Falhou também:', fallbackErr);
      resultsDiv.innerHTML = `<div class="empty-state"><p>❌ Erro ao buscar jogos</p></div>`;
    }
  } finally {
    // Sempre executa: esconde o indicador de carregamento, independente de sucesso ou erro
    loadingDiv.classList.add('hidden');
  }
}

// ============================================
// FUNÇÃO: favoritarJogo
// OBJETIVO: Salva um jogo na lista de favoritos do usuário no navegador
// PARÂMETROS:
//   - appid: ID do jogo na Steam
//   - name: Nome do jogo
//   - headerImage: URL da imagem do jogo
// ============================================
function favoritarJogo(appid, name, headerImage) {
  // Tenta converter o appid para número
  const normalizedAppid = Number(appid);
  
  // Verifica se o appid é um número válido e maior que zero
  // Number.isFinite verifica se é um número finito (não é Infinity, NaN, etc.)
  const safeAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0 ? normalizedAppid : null;

  // Log para debug: mostra o que está sendo favoritado
  console.log('Favoritando jogo:', { appid: safeAppid, name, headerImage });

  // Lê a lista de favoritos do localStorage (armazenamento local do navegador)
  // localStorage.getItem retorna uma string JSON ou null se não existir
  // JSON.parse converte a string JSON em array JavaScript
  // Se não existir, usa array vazio []
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  
  // Log para debug: mostra os favoritos atuais
  console.log('Favoritos atuais:', favoritos);

  // Verifica se o jogo já existe na lista de favoritos
  const exists = favoritos.some((j) => {
    // Converte o appid do favorito salvo para número
    const jApp = Number(j.appid);
    
    // Se temos um appid válido, compara pelos IDs numéricos
    if (safeAppid) return Number.isFinite(jApp) && jApp === safeAppid;
    
    // Se não temos appid válido, compara pelos nomes (case-insensitive)
    return (j.name || '').toLowerCase() === (name || '').toLowerCase();
  });

  // Se o jogo ainda não está nos favoritos, adiciona
  if (!exists) {
    // Adiciona o novo jogo ao array de favoritos
    favoritos.push({ appid: safeAppid, name, header_image: headerImage || '' });
    
    // Salva o array atualizado de volta no localStorage
    // JSON.stringify converte o array JavaScript em string JSON
    localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
    
    // Log para debug
    console.log('Jogo salvo! Novo array:', favoritos);
    
    // Exibe alerta confirmando que o jogo foi favoritado
    alert('Jogo favoritado!');
  } else {
    // Se já está nos favoritos, informa o usuário
    alert('Este jogo já está nos favoritos.');
  }

  // Linha comentada: redirecionaria para a página de favoritos após favoritar
  //window.location.href = 'favoritos.html';
}

// ============================================
// FUNÇÃO: renderizarFavoritos
// OBJETIVO: Exibe todos os jogos favoritados na página
// ============================================
function renderizarFavoritos() {
  // Busca o elemento HTML onde os favoritos serão exibidos
  const favDiv = document.getElementById('favoritosList');
  
  // Se o elemento não existir na página, registra erro e para a execução
  if (!favDiv) {
    console.error('Elemento favoritosList não encontrado!');
    return;
  }

  // Log para debug
  console.log('Renderizando favoritos...');
  
  // Lê a lista de favoritos do localStorage
  const favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  
  // Log para debug
  console.log('Favoritos encontrados no localStorage:', favoritos);
  
  // Limpa qualquer conteúdo anterior na div de favoritos
  favDiv.innerHTML = '';

  // Verifica se há favoritos para exibir
  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    // Se não há favoritos, exibe uma mensagem amigável
    favDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <h3>Nenhum favorito ainda</h3>
        <p>Adicione jogos aos favoritos na página inicial para vê-los aqui.</p>
      </div>`;
    return; // Para a execução aqui
  }

  // Para cada jogo favoritado, cria e exibe um card
  favoritos.forEach((jogo) => {
    // Converte o appid para número
    const appid = Number(jogo.appid);
    
    // Verifica se o appid é válido
    const hasValidAppid = Number.isFinite(appid) && appid > 0;
    
    // Se tem appid válido, usa a URL da imagem da CDN da Steam
    // Se não tem, usa a imagem salva ou um placeholder
    const imgUrl = hasValidAppid
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`
      : (jogo.header_image || 'https://placehold.co/184x69?text=Sem+Imagem');

    // Cria um novo elemento div para o card
    const card = document.createElement('div');
    
    // Define a classe CSS do card
    card.className = 'game-card';
    
    // Preenche o conteúdo HTML do card
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

    // Encontra o botão de remover dentro do card
    const removeBtn = card.querySelector('button');
    
    // Adiciona evento de clique no botão para remover o favorito
    // Passa o appid (se válido) ou null, e o nome do jogo
    removeBtn.addEventListener('click', () => removerFavorito(hasValidAppid ? appid : null, jogo.name));

    // Adiciona o card completo na div de favoritos
    favDiv.appendChild(card);
  });
  
  // Log para debug: mostra quantos favoritos foram renderizados
  console.log('Favoritos renderizados:', favoritos.length);
}

// ============================================
// FUNÇÃO: removerFavorito
// OBJETIVO: Remove um jogo da lista de favoritos
// PARÂMETROS:
//   - appid: ID do jogo (pode ser null)
//   - name: Nome do jogo
// ============================================
function removerFavorito(appid, name) {
  // Converte o appid para número
  const normalizedAppid = Number(appid);
  
  // Verifica se o appid é válido
  const hasAppid = Number.isFinite(normalizedAppid) && normalizedAppid > 0;
  
  // Log para debug
  console.log('Removendo favorito:', { appid: hasAppid ? normalizedAppid : null, name });
  
  // Lê a lista atual de favoritos
  let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
  
  // Filtra o array, removendo o jogo que corresponde ao appid ou nome
  favoritos = favoritos.filter((j) => {
    // Converte o appid do favorito para número
    const jApp = Number(j.appid);
    
    // Se temos appid válido, remove se os IDs coincidirem
    if (hasAppid) return !(Number.isFinite(jApp) && jApp === normalizedAppid);
    
    // Se não temos appid válido, remove se os nomes coincidirem (case-insensitive)
    return (j.name || '').toLowerCase() !== (name || '').toLowerCase();
  });
  
  // Salva a lista atualizada (sem o jogo removido) no localStorage
  localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
  
  // Re-renderiza a lista de favoritos para atualizar a exibição
  renderizarFavoritos();
  
  // Exibe alerta confirmando a remoção
  alert('Jogo removido dos favoritos!');
}

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO POR PÁGINA
// Cada função inicializa os eventos e comportamentos específicos de uma página
// ============================================

// ============================================
// FUNÇÃO: initLoginPage
// OBJETIVO: Configura os eventos da página de login
// ============================================
function initLoginPage() {
  // Busca o botão de login no HTML
  const loginBtn = document.getElementById('loginBtn');
  
  // Busca o formulário de login no HTML
  const loginForm = document.querySelector('.login-form');

  // Se o botão não existir, a página não é de login, então para aqui
  if (!loginBtn) return;

  // Define a função que será executada quando o usuário tentar fazer login
  const handleLogin = (e) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();
    
    // Obtém o valor do campo de usuário, removendo espaços em branco (trim)
    const username = document.getElementById('username').value.trim();
    
    // Obtém o valor do campo de senha, removendo espaços em branco
    const password = document.getElementById('password').value.trim();

    // Valida se ambos os campos foram preenchidos
    if (!username || !password) {
      alert('Por favor, preencha todos os campos!');
      return; // Para a execução se faltar algum campo
    }

    // Altera o texto do botão para mostrar que está processando
    // Adiciona um ícone de spinner (roda girando) para feedback visual
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Entrando...';
    
    // Desabilita o botão para evitar múltiplos cliques
    loginBtn.disabled = true;

    // Simula um processo de login (após 1 segundo, redireciona para a página home)
    // Em um sistema real, aqui faria uma requisição ao servidor para validar credenciais
    setTimeout(() => (window.location.href = 'home.html'), 1000);
  };

  // Adiciona o evento de clique no botão de login
  loginBtn.addEventListener('click', handleLogin);
  
  // Adiciona o evento de submit no formulário (para quando o usuário pressionar Enter)
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
}

// ============================================
// FUNÇÃO: initHomePage
// OBJETIVO: Configura os eventos da página inicial (busca de jogos)
// ============================================
function initHomePage() {
  // Busca o formulário de busca no HTML
  const searchForm = document.getElementById('searchForm');
  
  // Busca o campo de input onde o usuário digita a busca
  const searchInput = document.getElementById('searchInput');
  
  // Busca a div onde os resultados serão exibidos
  const resultsDiv = document.getElementById('results');
  
  // Busca a div do indicador de carregamento
  const loadingDiv = document.getElementById('loading');

  // Se o formulário ou input não existirem, a página não é a home, então para aqui
  if (!searchForm || !searchInput) return;

  // Adiciona evento de submit no formulário (quando o usuário pressiona Enter ou clica em buscar)
  searchForm.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();
    
    // Obtém o termo de busca digitado pelo usuário, removendo espaços em branco
    const query = searchInput.value.trim();
    
    // Se houver um termo de busca, executa a função de busca
    // await espera a função assíncrona terminar antes de continuar
    if (query) await buscarJogo(query, resultsDiv, loadingDiv);
  });
}

// ============================================
// FUNÇÃO: initFavoritosPage
// OBJETIVO: Configura a página de favoritos, exibindo os jogos salvos
// ============================================
function initFavoritosPage() {
  // Chama a função que renderiza (exibe) todos os favoritos na página
  renderizarFavoritos();
}

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// Detecta qual página está sendo carregada e inicializa as funções apropriadas
// ============================================

// Adiciona um evento que é disparado quando o HTML da página termina de carregar
// DOMContentLoaded garante que todos os elementos HTML já existem antes de tentar acessá-los
document.addEventListener('DOMContentLoaded', () => {
  // Log para debug
  console.log('DOMContentLoaded - Inicializando página...');
  
  // Detecta qual página está sendo carregada verificando a presença de elementos-chave
  // Isso é mais confiável que verificar o caminho da URL
  
  // Se existe o botão de login, é a página de login
  if (document.getElementById('loginBtn')) {
    console.log('Inicializando página de login');
    initLoginPage(); // Inicializa as funções da página de login
  }
  
  // Se existe o formulário de busca, é a página home
  if (document.getElementById('searchForm')) {
    console.log('Inicializando página home');
    initHomePage(); // Inicializa as funções da página home
  }
  
  // Se existe a lista de favoritos, é a página de favoritos
  if (document.getElementById('favoritosList')) {
    console.log('Inicializando página de favoritos');
    initFavoritosPage(); // Inicializa as funções da página de favoritos
  }
});
