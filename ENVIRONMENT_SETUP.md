# Configuração de Ambiente

## Backend URL

O frontend está configurado para usar o backend hospedado no Render. A URL padrão é:
`https://portfolio-08my.onrender.com`

## Variáveis de Ambiente Configuradas no GitHub

As seguintes variáveis já estão configuradas no GitHub para deploy automático:

### Backend
- `VITE_BACKEND_URL` - URL do backend (https://portfolio-08my.onrender.com)
- `VITE_BACKEND_ENABLED` - Habilitar/desabilitar backend

### Features
- `VITE_AUTH_ENABLED` - Sistema de autenticação
- `VITE_CHAT_ENABLED` - Sistema de chat
- `VITE_ANALYTICS_ENABLED` - Analytics
- `VITE_PORTFOLIO_ENABLED` - Seção portfolio

### UI
- `VITE_SHOW_CHAT_BUTTON` - Mostrar botão de chat
- `VITE_SHOW_AUTH_BUTTON` - Mostrar botão de autenticação
- `VITE_SHOW_CONTACT_METHODS` - Mostrar métodos de contato

### Firebase (Backend)
- `FIREBASE_CLIENT_EMAIL` - Email do cliente Firebase
- `FIREBASE_PRIVATE_KEY` - Chave privada Firebase
- `FIREBASE_PROJECT_ID` - ID do projeto Firebase
- `FIREBASE_WEB_API_KEY` - API Key do Firebase

## Configuração Local (Desenvolvimento)

Para desenvolvimento local, crie um arquivo `.env` na raiz do projeto com:

```env
# Backend Configuration
VITE_BACKEND_URL=https://portfolio-08my.onrender.com
VITE_BACKEND_ENABLED=true

# Feature Flags
VITE_AUTH_ENABLED=true
VITE_CHAT_ENABLED=true
VITE_ANALYTICS_ENABLED=true
VITE_PORTFOLIO_ENABLED=true

# UI Configuration
VITE_SHOW_CHAT_BUTTON=true
VITE_SHOW_AUTH_BUTTON=true
VITE_SHOW_CONTACT_METHODS=true

# Environment
NODE_ENV=production
```

## Como Funciona

1. **Desenvolvimento**: Usa `http://localhost:3001` automaticamente
2. **Produção**: Usa `https://portfolio-08my.onrender.com` ou a URL definida em `VITE_BACKEND_URL`

## Nota sobre Render Free Tier

O Render free tier pode "dormir" após inatividade. Se o backend não responder:
1. Acesse o painel do Render
2. Faça um deploy manual ou aguarde a próxima requisição
3. O primeiro acesso pode demorar alguns segundos para "acordar" o serviço
