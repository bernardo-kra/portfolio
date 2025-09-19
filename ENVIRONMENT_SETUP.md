# Configuração de Ambiente

## Backend URL

O frontend está configurado para usar o backend hospedado no Render. A URL padrão é:
`https://portfolio-08my.onrender.com`

## Configuração via Variáveis de Ambiente

Para personalizar a URL do backend, crie um arquivo `.env` na raiz do projeto com:

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
