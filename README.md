# Steam Games - Aplicação React

Aplicação React para descobrir e gerenciar jogos favoritos da Steam.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM** - Roteamento de páginas
- **React Bootstrap** - Componentes Bootstrap para React
- **React Icons** - Biblioteca de ícones
- **Vite** - Build tool moderna e rápida
- **Bootstrap 5** - Framework CSS

## 📋 Requisitos Atendidos

✅ Usar ReactJS para componentizar o projeto  
✅ Usar React Bootstrap para estilizar os componentes  
✅ Usar o Hook useState  
✅ Fazer request em alguma API (IsThereAnyDeal API)  
✅ Usar ícones de React Icons  
✅ Usar rotas de React Router Dom  
✅ Versionar o projeto no Github  
✅ Configurado para deploy no Vercel  

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd WEB1
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Preview da build de produção

## 🌐 Deploy na Vercel

### Opção 1: Deploy via CLI

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Opção 2: Deploy via GitHub

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu repositório GitHub
4. A Vercel detectará automaticamente o projeto Vite e fará o deploy

O arquivo `vercel.json` já está configurado para o projeto funcionar corretamente na Vercel.

## 📁 Estrutura do Projeto

```
WEB1/
├── public/
│   └── index.html          # HTML principal
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── GameCard.jsx
│   │   ├── LoginForm.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchBar.jsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   └── Favoritos.jsx
│   ├── hooks/             # Custom hooks
│   │   └── useFavoritos.js
│   ├── services/          # Serviços e APIs
│   │   └── api.js
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globais
├── package.json
├── vite.config.js
└── vercel.json
```

## 🎯 Funcionalidades

- **Login**: Página de autenticação (demonstração)
- **Busca de Jogos**: Busca jogos na API IsThereAnyDeal
- **Favoritos**: Adiciona e remove jogos dos favoritos
- **Persistência**: Favoritos salvos no localStorage
- **Responsivo**: Design adaptável para mobile e desktop

## 🔑 API Utilizada

A aplicação utiliza a API [IsThereAnyDeal](https://isthereanydeal.com/) para buscar informações sobre jogos. Em caso de falha, utiliza um fallback para a API pública do Steam.

## 📝 Notas

- Os favoritos são salvos no localStorage do navegador
- A API key está hardcoded no código (em produção, use variáveis de ambiente)
- O login é apenas demonstrativo e aceita qualquer usuário/senha

## 👨‍💻 Desenvolvido com

- React Hooks (useState, useEffect)
- React Router para navegação
- React Bootstrap para UI
- React Icons para ícones
- Vite para build e desenvolvimento

