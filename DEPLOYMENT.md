# Deploy

Este arquivo é a fonte de verdade para o deploy do projeto.

## Frontend principal

O site principal é publicado na raiz de `https://bernardo-kra.github.io/`.

- Fonte: branch `main` deste repositório.
- Workflow: `.github/workflows/deploy-root.yml`.
- Destino: repositório `bernardo-kra/bernardo-kra.github.io`.
- Base do Vite: `/`.
- Secret necessário: `GH_PAGES_TOKEN`, com permissão para gravar no repositório de destino.

Todo push em `main` executa `npm ci`, `npm run build` e publica `dist`. O arquivo `public/.nojekyll` impede o processamento por Jekyll.

O workflow usa Node.js 22 LTS.

## Frontend na Vercel

O `vercel.json` da raiz descreve um deploy Vite alternativo:

- Build: `npm run build`
- Saída: `dist`
- Framework: Vite

Como o site usa `base: '/'`, ele deve ser servido na raiz do domínio. Não configure o diretório `backend` para esse projeto Vercel.

## Backend no Render

O backend de produção é referenciado pelo frontend como `https://portfolio-08my.onrender.com`. A configuração está em `backend/render.yaml`.

Ao criar o serviço no Render:

- Root Directory: `backend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Health Check: `/api/health`

Configure as credenciais Firebase listadas em [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).

## Validação antes do deploy

```bash
npm ci
npm --prefix backend ci
npm run build:full
npm run preview
```

Verifique a home e as rotas diretas. O arquivo `public/404.html` faz o fallback das rotas no GitHub Pages.

## Observações

- Não use `/portfolio/` como base enquanto o destino for o domínio raiz.
- Não publique simultaneamente outro workflow no GitHub Pages deste repositório.
- O diretório `api/` contém funções Vercel independentes do backend Express; ele deve ser revisado antes de qualquer unificação das APIs.
