# Dados Disponíveis nas APIs Públicas da Steam

## 📋 APIs que você pode usar SEM chave de API

### 1. **API Store Search** (`/api/storesearch/`)
**Endpoint atual que você está usando:**
```
https://store.steampowered.com/api/storesearch/?term={query}&l=portuguese&cc=BR
```

#### Dados retornados:
```json
{
  "total": 100,
  "items": [
    {
      "id": 730,                    // App ID do jogo
      "type": 0,                    // Tipo (0=game, 1=DLC, etc)
      "name": "Counter-Strike 2",   // Nome do jogo
      "released": 1234567890,       // Data de lançamento (timestamp)
      "release_date": "1 Jan, 2024", // Data formatada
      "is_free": false,            // Se é gratuito
      "header_image": "url",        // Imagem principal
      "tiny_image": "url",          // Imagem pequena
      "capsule_image": "url",       // Imagem capsula
      "capsule_imagev5": "url",     // Imagem capsula v5
      "small_capsule_image": "url", // Imagem capsula pequena
      "price": 0,                   // Preço em centavos
      "discount_percent": 0,        // Desconto percentual
      "final_price": 0,            // Preço final
      "currency": "BRL",           // Moeda
      "platforms": {               // Plataformas disponíveis
        "windows": true,
        "mac": false,
        "linux": false
      },
      "metacritic": {              // Nota do Metacritic
        "score": 88,
        "url": "url"
      },
      "recommendations": {         // Recomendações
        "total": 123456
      },
      "discount_expiration": 0,   // Expiração do desconto
      "controller_support": "full" // Suporte a controle
    }
  ]
}
```

---

### 2. **API App Details** (`/api/appdetails/`)
**Endpoint para detalhes completos de um jogo:**
```
https://store.steampowered.com/api/appdetails?appids={appid}&l=portuguese&cc=BR
```

#### Dados retornados (muito mais completo!):
```json
{
  "730": {
    "success": true,
    "data": {
      "type": "game",
      "name": "Counter-Strike 2",
      "steam_appid": 730,
      "required_age": 0,
      "is_free": false,
      "detailed_description": "Descrição completa do jogo...",
      "about_the_game": "Sobre o jogo...",
      "short_description": "Descrição curta",
      "supported_languages": "Português, Inglês, etc",
      "header_image": "url",
      "website": "https://...",
      "pc_requirements": {        // Requisitos do PC
        "minimum": "CPU: Intel Core 2 Duo...",
        "recommended": "CPU: Intel Core i5..."
      },
      "mac_requirements": {},
      "linux_requirements": {},
      "developers": ["Valve"],      // Desenvolvedores
      "publishers": ["Valve"],     // Publicadores
      "price_overview": {          // Informações de preço
        "currency": "BRL",
        "initial": 9999,
        "final": 9999,
        "discount_percent": 0,
        "initial_formatted": "R$ 99,99",
        "final_formatted": "R$ 99,99"
      },
      "packages": [],              // Pacotes disponíveis
      "platforms": {
        "windows": true,
        "mac": false,
        "linux": false
      },
      "categories": [              // Categorias
        {
          "id": 1,
          "description": "Multi-player"
        },
        {
          "id": 36,
          "description": "Online PvP"
        }
      ],
      "genres": [                  // Gêneros
        {
          "id": "1",
          "description": "Ação"
        }
      ],
      "screenshots": [             // Capturas de tela
        {
          "id": 0,
          "path_thumbnail": "url",
          "path_full": "url"
        }
      ],
      "movies": [                  // Vídeos/Trailers
        {
          "id": 256684314,
          "name": "Trailer",
          "thumbnail": "url",
          "webm": {
            "480": "url",
            "max": "url"
          },
          "highlight": true
        }
      ],
      "recommendations": {         // Recomendações
        "total": 12345678
      },
      "achievements": {            // Conquistas
        "total": 167,
        "highlighted": [...]
      },
      "release_date": {            // Data de lançamento
        "coming_soon": false,
        "date": "21 ago, 2012"
      },
      "support_info": {            // Informações de suporte
        "url": "https://...",
        "email": "support@..."
      },
      "background": "url",          // Imagem de fundo
      "content_descriptors": {     // Descritores de conteúdo
        "ids": [],
        "notes": null
      },
      "metacritic": {              // Metacritic
        "score": 88,
        "url": "https://..."
      },
      "ratings": {                 // Avaliações
        "steam": {
          "total": 12345678,
          "positive": 12345678,
          "negative": 0,
          "score": 100
        }
      }
    }
  }
}
```

---

### 3. **API Featured** (`/api/featured/`)
**Endpoint para jogos em destaque:**
```
https://store.steampowered.com/api/featured/?l=portuguese&cc=BR
```

#### Dados retornados:
- Jogos em destaque
- Ofertas especiais
- Novos lançamentos
- Mais vendidos

---

### 4. **API Featured Categories** (`/api/featuredcategories/`)
**Endpoint para categorias em destaque:**
```
https://store.steampowered.com/api/featuredcategories/?l=portuguese&cc=BR
```

#### Dados retornados:
- Especiais
- Lançamentos
- Mais vendidos
- Mais jogados

---

### 5. **API Player Count** (Não oficial, mas funciona)
**Endpoint para número de jogadores:**
```
https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid={appid}
```

#### Dados retornados:
```json
{
  "response": {
    "result": 1,
    "player_count": 1234567
  }
}
```

---

## 🎮 Dados que você pode exibir no seu projeto:

### Informações Básicas:
- ✅ Nome do jogo
- ✅ App ID
- ✅ Imagens (header, capsule, screenshots)
- ✅ Descrição curta e completa
- ✅ Data de lançamento
- ✅ Preço e descontos
- ✅ Se é gratuito

### Informações Avançadas:
- ✅ Desenvolvedores e publicadores
- ✅ Gêneros e categorias
- ✅ Requisitos do sistema (mínimo/recomendado)
- ✅ Plataformas suportadas (Windows, Mac, Linux)
- ✅ Idiomas suportados
- ✅ Capturas de tela
- ✅ Vídeos/Trailers
- ✅ Avaliações (positivas/negativas)
- ✅ Nota do Metacritic
- ✅ Número de recomendações
- ✅ Número de jogadores atuais
- ✅ Conquistas disponíveis
- ✅ Website oficial
- ✅ Email de suporte

### Informações de Mercado:
- ✅ Preço atual
- ✅ Preço original
- ✅ Percentual de desconto
- ✅ Data de expiração do desconto
- ✅ Moeda

---

## 💡 Exemplo de implementação:

Você pode criar uma função para buscar detalhes completos de um jogo:

```javascript
export async function buscarDetalhesJogo(appid) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese&cc=BR`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data[appid] && data[appid].success) {
      return data[appid].data;
    }
    return null;
  } catch (err) {
    console.error('Erro ao buscar detalhes:', err);
    return null;
  }
}
```

---

## 📝 Notas Importantes:

1. **Rate Limiting**: A Steam não tem rate limit oficial, mas use com moderação
2. **CORS**: Você precisa usar um proxy (como allorigins.win) para contornar CORS
3. **Idioma**: Use `l=portuguese` para obter dados em português
4. **Moeda**: Use `cc=BR` para preços em Real brasileiro
5. **App ID**: Cada jogo tem um ID único (steam_appid)

---

## 🔗 Recursos Úteis:

- **SteamDB**: https://steamdb.info/ - Para encontrar App IDs
- **Steam Store**: https://store.steampowered.com/ - Interface oficial
- **Steam API Docs**: https://steamcommunity.com/dev (requer chave de API)

