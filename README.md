# Portfolio

Portfólio pessoal em React, TypeScript e Vite. O repositório também contém um backend Express usado por autenticação, chat, contato e analytics.

## Requisitos

- Node.js 22 LTS
- npm
- Credenciais do Firebase apenas para executar o backend

## Desenvolvimento

```bash
npm ci
npm run dev
```

O frontend abre em `http://localhost:5173`. Para executar frontend e backend juntos:

```bash
npm --prefix backend ci
npm run dev:full
```

Consulte [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) para configurar os arquivos `.env`.

## Scripts

| Comando                | Finalidade                              |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Inicia o frontend                       |
| `npm run dev:backend`  | Inicia o backend                        |
| `npm run dev:full`     | Inicia os dois processos                |
| `npm run build`        | Compila o frontend                      |
| `npm run build:full`   | Compila frontend e backend              |
| `npm run lint`         | Executa a análise estática              |
| `npm run test:tasks`   | Testa exclusão e restauração de tarefas |
| `npm run test:neon`    | Testa a missão e a sintonia do Neon Bay |
| `npm run format:check` | Verifica a formatação                   |
| `npm run preview`      | Serve o build localmente                |

## Estrutura

```text
api/                  Funções serverless simples da raiz
backend/src/          API Express e integração Firebase Admin
public/               Arquivos estáticos
src/Pages/            Páginas carregadas por rota
src/components/       Componentes por domínio
src/config/           Configuração do frontend
src/context/          Contextos React
src/hooks/            Hooks compartilhados
src/services/         Clientes de serviços
```

As rotas principais são `/`, `/portfolio`, `/agency`, `/landing`, `/pomodoro`, `/generative`, `/experimental3d` e `/admin/chat`.

O estudo Forma (`/agency`) é uma agência conceitual inspirada em referências de design editorial. As fotografias são servidas localmente; os créditos estão em [public/images/forma/CREDITS.md](./public/images/forma/CREDITS.md). Consulte [UX_REVIEW.md](./UX_REVIEW.md) para a revisão de interface e os testes manuais pendentes.

O Neon Bay (`/experimental3d`) é uma simulação de terminal de espionagem steampunk. A rota foi preservada, mas a experiência utiliza SVG e CSS sem vídeo ou motor 3D. Consulte [o diagnóstico e o roteiro de testes](./src/Pages/Experimental3D/README.md).

## Deploy

O frontend principal é publicado em `https://bernardo-kra.github.io/`. O backend usa Render e o frontend também pode ser compilado pela Vercel. A configuração completa está em [DEPLOYMENT.md](./DEPLOYMENT.md).

## Convenções

As mensagens de commit seguem [Conventional Commits](./COMMIT_CONVENTION.md).
