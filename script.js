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
        try {
            // Usar a API oficial do Steam com autenticação
            const response = await fetch(`${STEAM_API_BASE_URL}/ISteamApps/GetAppList/v2/?key=${STEAM_API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            const apps = data.applist?.apps || [];
            
            // Filtra jogos pelo nome
            const results = apps.filter(jogo => 
                jogo.name && jogo.name.toLowerCase().includes(query.toLowerCase())
            );
            
            return results.slice(0, 12); // Limita a 12 resultados
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            // Fallback para API pública se a autenticada falhar
            try {
                const response = await fetch('https://steamapi.xpaw.me/list.json');
                const data = await response.json();
                const results = Object.values(data).filter(jogo => 
                    jogo.name && jogo.name.toLowerCase().includes(query.toLowerCase())
                );
                return results.slice(0, 12);
            } catch (fallbackError) {
                console.error('Erro no fallback:', fallbackError);
                return [];
            }
        }
    }

    // Função para renderizar resultados na Home
    async function renderizarResultados(query) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;
        
        resultsDiv.innerHTML = '<div class="text-center w-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Buscando...</span></div><br>Buscando jogos...</div>';
        
        try {
            const jogos = await buscarJogosSteam(query);
            
            if (jogos.length === 0) {
                resultsDiv.innerHTML = '<div class="text-center w-100 text-muted">Nenhum jogo encontrado para "' + query + '".</div>';
                return;
            }
            
            resultsDiv.innerHTML = '';
            jogos.forEach(jogo => {
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
            resultsDiv.innerHTML = '<div class="text-center w-100 text-danger">Erro ao buscar jogos. Tente novamente.</div>';
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