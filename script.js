document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Simplesmente redireciona para a Home
            window.location.href = 'home.html';
        });
    }

    // Configuração da API Steam
    const STEAM_API_KEY = 'A6574A77A70F54AAA2CE509114E2065F';
    const STEAM_API_BASE_URL = 'https://api.steampowered.com';

    // Função para buscar jogos na API do Steam
    async function buscarJogosSteam(query) {
        console.log('Buscando jogos para:', query);
        
        try {
            // Primeiro, tentar a API pública que sabemos que funciona
            console.log('Tentando API pública...');
            const response = await fetch('https://steamapi.xpaw.me/list.json');
            
            if (!response.ok) {
                throw new Error(`Erro na API pública: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos da API:', Object.keys(data).length, 'jogos');
            
            // Filtra jogos pelo nome
            const results = Object.values(data).filter(jogo => 
                jogo.name && jogo.name.toLowerCase().includes(query.toLowerCase())
            );
            
            console.log('Resultados encontrados:', results.length);
            return results.slice(0, 12); // Limita a 12 resultados
            
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            
            // Fallback: usar dados mockados para demonstração
            const jogosMockados = [
                { appid: 292030, name: "The Witcher 3: Wild Hunt" },
                { appid: 730, name: "Counter-Strike: Global Offensive" },
                { appid: 570, name: "Dota 2" },
                { appid: 440, name: "Team Fortress 2" },
                { appid: 271590, name: "Grand Theft Auto V" },
                { appid: 1172470, name: "Apex Legends" },
                { appid: 1091500, name: "Cyberpunk 2077" },
                { appid: 1244460, name: "Baldur's Gate 3" }
            ];
            
            const results = jogosMockados.filter(jogo => 
                jogo.name.toLowerCase().includes(query.toLowerCase())
            );
            
            console.log('Usando dados mockados, resultados:', results.length);
            return results.slice(0, 12);
        }
    }

    // Função para renderizar resultados na Home
    async function renderizarResultados(query) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;
        
        console.log('Iniciando renderização para query:', query);
        resultsDiv.innerHTML = '<div class="text-center w-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Buscando...</span></div><br>Buscando jogos...</div>';
        
        try {
            const jogos = await buscarJogosSteam(query);
            console.log('Jogos retornados:', jogos);
            
            if (jogos.length === 0) {
                console.log('Nenhum jogo encontrado');
                resultsDiv.innerHTML = '<div class="text-center w-100 text-muted">Nenhum jogo encontrado para "' + query + '".<br><small>Tente termos mais gerais como "witcher", "counter", "dota", etc.</small></div>';
                return;
            }
            
            console.log('Renderizando', jogos.length, 'jogos');
            resultsDiv.innerHTML = '';
            jogos.forEach((jogo, index) => {
                console.log(`Renderizando jogo ${index + 1}:`, jogo);
                const appid = jogo.appid || jogo.app_id;
                const name = jogo.name || 'Nome não disponível';
                const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`;
                
                const card = document.createElement('div');
                card.className = 'card text-dark bg-light mb-3';
                card.style.width = '14rem';
                card.innerHTML = `
                    <img src="${imgUrl}" class="card-img-top" alt="${name}" onerror="this.src='https://via.placeholder.com/184x69?text=Sem+Imagem'">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">${name}</h5>
                        <button class="btn btn-outline-danger mt-2" onclick="favoritarJogo(${appid}, '${name.replace(/'/g, "\\'")}')">Favoritar</button>
                    </div>
                `;
                resultsDiv.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao renderizar resultados:', error);
            resultsDiv.innerHTML = '<div class="text-center w-100 text-danger">Erro ao buscar jogos. Tente novamente.<br><small>Verifique o console para mais detalhes.</small></div>';
        }
    }

    // Função para favoritar um jogo
    function favoritarJogo(appid, name) {
        let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
        if (!favoritos.some(j => j.appid === appid)) {
            favoritos.push({ appid, name });
            localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
            alert('Jogo favoritado!');
        } else {
            alert('Este jogo já está nos favoritos.');
        }
    }

    // Função para exibir favoritos
    function renderizarFavoritos() {
        const favDiv = document.getElementById('favoritosList');
        if (!favDiv) return;
        
        let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
        favDiv.innerHTML = '';
        
        if (favoritos.length === 0) {
            favDiv.innerHTML = '<div class="text-center w-100 text-muted">Nenhum favorito ainda.<br><small>Adicione jogos aos favoritos na página inicial.</small></div>';
            return;
        }
        
        favoritos.forEach(jogo => {
            const appid = jogo.appid;
            const name = jogo.name || 'Nome não disponível';
            const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`;
            
            const card = document.createElement('div');
            card.className = 'card text-dark bg-light mb-3';
            card.style.width = '14rem';
            card.innerHTML = `
                <img src="${imgUrl}" class="card-img-top" alt="${name}" onerror="this.src='https://via.placeholder.com/184x69?text=Sem+Imagem'">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${name}</h5>
                    <button class="btn btn-outline-secondary btn-sm mt-2" onclick="removerFavorito(${appid})">Remover</button>
                </div>
            `;
            favDiv.appendChild(card);
        });
    }

    // Função para remover favorito
    function removerFavorito(appid) {
        let favoritos = JSON.parse(localStorage.getItem('favoritosSteam') || '[]');
        favoritos = favoritos.filter(j => j.appid !== appid);
        localStorage.setItem('favoritosSteam', JSON.stringify(favoritos));
        renderizarFavoritos(); // Atualiza a lista
        alert('Jogo removido dos favoritos!');
    }

    // Eventos para Home e Favoritos
    if (window.location.pathname.endsWith('home.html')) {
        document.getElementById('searchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('searchInput').value;
            if (query.trim()) renderizarResultados(query);
        });
    }
    if (window.location.pathname.endsWith('favoritos.html')) {
        renderizarFavoritos();
    }
});