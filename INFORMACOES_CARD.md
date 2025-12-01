# 📋 Informações que podem ser adicionadas ao GameCard

## ✅ **JÁ IMPLEMENTADO:**
- ✅ Nome do jogo
- ✅ Imagem do jogo (header_image)
- ✅ Preço formatado (R$)
- ✅ Preço original (quando há desconto)
- ✅ Percentual de desconto
- ✅ Badge "GRÁTIS" para jogos gratuitos
- ✅ Data de lançamento
- ✅ Plataformas (Windows, Mac, Linux)
- ✅ Nota do Metacritic
- ✅ Número de recomendações
- ✅ Número de jogadores recentes

---

## 🎮 **INFORMAÇÕES DISPONÍVEIS NA API (storesearch) - AINDA NÃO IMPLEMENTADAS:**

### 1. **Suporte a Controle** ⚙️
```javascript
controller_support: "full" | "partial" | null
```
- Badge indicando se o jogo suporta controle
- Ícone de controle (FaGamepad)

### 2. **Tipo de Jogo** 🎯
```javascript
type: 0  // 0=game, 1=DLC, 2=software, etc
```
- Badge indicando se é Jogo, DLC, Software, etc.

### 3. **Data de Expiração do Desconto** ⏰
```javascript
discount_expiration: timestamp
```
- Mostrar quando o desconto expira
- Badge "Oferta termina em X dias"

### 4. **Link do Metacritic** 🔗
```javascript
metacritic: { score: 88, url: "..." }
```
- Botão/link para ver mais detalhes no Metacritic

---

## 🚀 **INFORMAÇÕES DA API appdetails (requer chamada adicional):**

### 5. **Gêneros** 🎨
```javascript
genres: [
  { id: "1", description: "Ação" },
  { id: "2", description: "Aventura" }
]
```
- Badges com os gêneros do jogo
- Ex: [Ação] [Aventura] [RPG]

### 6. **Categorias** 📂
```javascript
categories: [
  { id: 1, description: "Multi-player" },
  { id: 36, description: "Online PvP" }
]
```
- Badges com categorias
- Ex: [Multi-player] [Online PvP] [Single-player]

### 7. **Desenvolvedores** 👨‍💻
```javascript
developers: ["Valve", "Rockstar Games"]
```
- Lista de desenvolvedores
- Ícone de desenvolvedor (FaCode)

### 8. **Publicadores** 🏢
```javascript
publishers: ["Valve", "Rockstar Games"]
```
- Lista de publicadores
- Ícone de publicador (FaBuilding)

### 9. **Descrição Curta** 📝
```javascript
short_description: "Descrição curta do jogo..."
```
- Tooltip ou texto expandível
- Máximo 2-3 linhas no card

### 10. **Idiomas Suportados** 🌍
```javascript
supported_languages: "Português, Inglês, Espanhol..."
```
- Badge com idiomas principais
- Ícone de idioma (FaGlobe)

### 11. **Avaliações Steam** ⭐
```javascript
ratings: {
  steam: {
    total: 12345678,
    positive: 12345678,
    negative: 0,
    score: 100  // Percentual positivo
  }
}
```
- Percentual de avaliações positivas
- Badge verde/vermelho baseado no score
- Ex: "98% Positivas (1.2M avaliações)"

### 12. **Conquistas** 🏆
```javascript
achievements: {
  total: 167,
  highlighted: [...]
}
```
- Número total de conquistas
- Badge com ícone de troféu
- Ex: "167 Conquistas"

### 13. **Idade Mínima** 🔞
```javascript
required_age: 18
```
- Badge de classificação etária
- Cores diferentes (verde, amarelo, vermelho)

### 14. **Website Oficial** 🌐
```javascript
website: "https://..."
```
- Botão/link para website
- Ícone de link externo

### 15. **Requisitos do Sistema** 💻
```javascript
pc_requirements: {
  minimum: "CPU: Intel Core 2 Duo...",
  recommended: "CPU: Intel Core i5..."
}
```
- Tooltip ou modal com requisitos
- Ícone de computador

### 16. **Capturas de Tela** 📸
```javascript
screenshots: [
  { path_thumbnail: "url", path_full: "url" }
]
```
- Galeria de imagens (modal ou carousel)
- Miniaturas clicáveis

### 17. **Vídeos/Trailers** 🎬
```javascript
movies: [
  { name: "Trailer", thumbnail: "url", webm: {...} }
]
```
- Botão para assistir trailer
- Ícone de play

### 18. **Status de Lançamento** 📅
```javascript
release_date: {
  coming_soon: false,
  date: "21 ago, 2012"
}
```
- Badge "Em Breve" se coming_soon = true
- Diferente de data de lançamento normal

### 19. **Link da Steam Store** 🛒
```javascript
// URL: https://store.steampowered.com/app/{appid}
```
- Botão "Ver na Steam"
- Abre em nova aba

### 20. **Imagem de Fundo** 🖼️
```javascript
background: "url"
```
- Usar como background do card (opcional)
- Efeito parallax ou overlay

---

## 📊 **INFORMAÇÕES DE OUTRAS APIs:**

### 21. **Jogadores Online (Tempo Real)** 👥
```javascript
// API: ISteamUserStats/GetNumberOfCurrentPlayers
player_count: 1234567
```
- Atualizar em tempo real
- Badge com número atual de jogadores

### 22. **Tempo Médio de Jogo** ⏱️
```javascript
// Requer API adicional ou dados externos
average_playtime: 120  // em horas
```
- Mostrar tempo médio de jogo
- Badge com ícone de relógio

### 23. **Preço Histórico** 📈
```javascript
// Requer API de terceiros (SteamDB, etc)
lowest_price: 29.99,
current_price: 99.99
```
- Mostrar menor preço histórico
- Badge "Melhor preço: R$ 29,99"

---

## 🎨 **MELHORIAS VISUAIS:**

### 24. **Badge de Destaque** ⭐
- "Mais Vendido"
- "Novo Lançamento"
- "Em Alta"
- "Jogo do Ano"

### 25. **Indicador de Status** 🟢
- Online/Offline
- Manutenção
- Servidor ativo

### 26. **Progress Bar de Avaliações** 📊
- Barra visual mostrando % positivo vs negativo
- Verde para positivo, vermelho para negativo

### 27. **Tags Personalizadas** 🏷️
- "Indie"
- "Early Access"
- "VR"
- "Mods Suportados"

### 28. **Contador de Desconto** ⏳
- "Oferta termina em: 2 dias 5 horas"
- Contador regressivo

### 29. **Rating Visual** ⭐⭐⭐⭐⭐
- Estrelas baseadas no Metacritic
- 5 estrelas = 90+, 4 estrelas = 70-89, etc.

### 30. **Badge de Qualidade** 🏅
- "Overwhelmingly Positive"
- "Very Positive"
- "Mostly Positive"
- "Mixed"

---

## 💡 **SUGESTÕES DE IMPLEMENTAÇÃO:**

### **Prioridade ALTA** (Fácil de implementar):
1. ✅ Suporte a Controle (já está na API)
2. ✅ Gêneros (requer appdetails)
3. ✅ Avaliações Steam (requer appdetails)
4. ✅ Link para Steam Store
5. ✅ Descrição curta (requer appdetails)

### **Prioridade MÉDIA** (Requer mais trabalho):
6. ✅ Desenvolvedores/Publicadores
7. ✅ Conquistas
8. ✅ Idiomas suportados
9. ✅ Classificação etária
10. ✅ Status "Em Breve"

### **Prioridade BAIXA** (Requer APIs adicionais):
11. ✅ Jogadores online em tempo real
12. ✅ Preço histórico
13. ✅ Tempo médio de jogo

---

## 🎯 **EXEMPLO DE CARD COMPLETO:**

```
┌─────────────────────────────────┐
│  [Imagem do Jogo]               │
│  [-50%] [STEAM] [GRÁTIS]        │
├─────────────────────────────────┤
│  🎮 Nome do Jogo                │
│                                 │
│  💰 R$ 49,99                    │
│     ~~R$ 99,99~~                │
│                                 │
│  📅 21 ago, 2012                │
│  🖥️ Windows | Mac | Linux      │
│  ⭐ Metacritic: 88/100          │
│  👍 98% Positivas (1.2M)        │
│  🏆 167 Conquistas              │
│  🎮 [Ação] [Aventura] [RPG]     │
│  👥 1.2M jogadores online       │
│  🎮 Suporte a Controle          │
│  🌍 PT-BR, EN, ES               │
│  🔞 18+                         │
│                                 │
│  [Favoritar] [Ver na Steam]    │
└─────────────────────────────────┘
```

---

## 📝 **NOTAS:**
- Algumas informações requerem chamada adicional à API `/appdetails`
- Algumas informações podem ser carregadas sob demanda (lazy loading)
- Considere usar tooltips para informações extras
- Modal pode ser usado para detalhes completos
- Algumas informações podem ser opcionais (mostrar apenas se disponível)

