# Configuração de ambiente

Nunca versione arquivos `.env` nem credenciais do Firebase.

## Frontend

Crie `.env.local` na raiz quando precisar sobrescrever os padrões:

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_BACKEND_ENABLED=true
VITE_AUTH_ENABLED=true
VITE_CHAT_ENABLED=true
VITE_ANALYTICS_ENABLED=true
VITE_PORTFOLIO_ENABLED=true
VITE_SHOW_CHAT_BUTTON=true
VITE_SHOW_AUTH_BUTTON=true
VITE_SHOW_CONTACT_METHODS=true
VITE_GA_MEASUREMENT_ID=
```

Em desenvolvimento, a URL padrão do backend é `http://localhost:3001`. Em produção, o fallback atual é `https://portfolio-08my.onrender.com`.

Todas as flags são habilitadas por padrão e só são desligadas quando o valor é exatamente `false`.

## Backend

Copie o exemplo e substitua os valores:

```bash
cd backend
cp env.example .env
```

Variáveis consumidas diretamente pelo backend:

```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

O `FIREBASE_PRIVATE_KEY` pode conter quebras de linha escapadas como `\n`. As demais variáveis do arquivo `backend/env.example` são úteis para configurar a credencial completa no provedor de hospedagem.

## Produção

- GitHub Actions: configure `VITE_GA_MEASUREMENT_ID` se o analytics deve ser habilitado.
- Render: configure as credenciais Firebase como secrets.
- Não coloque variáveis `FIREBASE_*` no frontend; tudo que começa com `VITE_` pode ser exposto no bundle.
