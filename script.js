document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Simplesmente redireciona para a Home
            window.location.href = 'home.html';
        });
    }

    // Função para buscar jogos na API do Steam
    async function buscarJogosSteam(query) {
        // API: http://steamapi.xpaw.me/
        // Usaremos o endpoint de busca de apps: http://steamapi.xpaw.me/list.json
        const response = await fetch('https://steamapi.xpaw.me/list.json');
        const data = await response.json();
        // Filtra jogos pelo nome
        const results = Object.values(data).filter(jogo => jogo.name.toLowerCase().includes(query.toLowerCase()));
        return results.slice(0, 12); // Limita a 12 resultados
    }

    // Função para renderizar resultados na Home
    async function renderizarResultados(query) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '<div class="text-center w-100">Buscando...</div>';
        const jogos = await buscarJogosSteam(query);
        if (jogos.length === 0) {
            resultsDiv.innerHTML = '<div class="text-center w-100">Nenhum jogo encontrado.</div>';
            return;
        }
        resultsDiv.innerHTML = '';
        jogos.forEach(jogo => {
            const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/capsule_184x69.jpg`;
            const card = document.createElement('div');
            card.className = 'card text-dark bg-light mb-3';
            card.style.width = '14rem';
            card.innerHTML = `
                <img src="${imgUrl}" class="card-img-top" alt="${jogo.name}" onerror="this.src='https://via.placeholder.com/184x69?text=Sem+Imagem'">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${jogo.name}</h5>
                    <button class="btn btn-outline-danger mt-2" onclick="favoritarJogo(${jogo.appid}, '${jogo.name.replace(/'/g, "\'")}')">Favoritar</button>
                </div>
            `;
            resultsDiv.appendChild(card);
        });
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
            favDiv.innerHTML = '<div class="text-center w-100">Nenhum favorito ainda.</div>';
            return;
        }
        favoritos.forEach(jogo => {
            const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/capsule_184x69.jpg`;
            const card = document.createElement('div');
            card.className = 'card text-dark bg-light mb-3';
            card.style.width = '14rem';
            card.innerHTML = `
                <img src="${imgUrl}" class="card-img-top" alt="${jogo.name}" onerror="this.src='https://via.placeholder.com/184x69?text=Sem+Imagem'">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${jogo.name}</h5>
                </div>
            `;
            favDiv.appendChild(card);
        });
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