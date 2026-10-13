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

As rotas principais são `/`, `/portfolio`, `/agency`, `/learning`, `/landing`, `/pomodoro`, `/generative`, `/experimental3d`, `/chat` e `/admin/chat`.

O chat acompanha mensagens recebidas mesmo com a conversa fechada: o sino e
o botão flutuante mostram avisos pendentes. A leitura é confirmada apenas para
mensagens visíveis com a aba em foco, ou pela ação explícita no sino. Os avisos
do navegador são opcionais e precisam ser ativados pelo usuário. O site deve
permanecer aberto e conectado; ainda não há Web Push com o site fechado.

O estudo Forma (`/agency`) é uma agência conceitual inspirada em referências de design editorial. As fotografias são servidas localmente; os créditos estão em [public/images/forma/CREDITS.md](./public/images/forma/CREDITS.md). Consulte [UX_REVIEW.md](./UX_REVIEW.md) para a revisão de interface e os testes manuais pendentes.

O estudo Bastidores de uma interface (`/learning`) conecta seis estúdios: pixel art com histórico e SVG, animações com exportação de CSS, desafios de leitura visual, fundos vetoriais generativos, um diagrama de camadas em 3D e um construtor de páginas. Ícone e fundo são compartilhados entre os estúdios e a bancada. O construtor permite editar textos, reorganizar/remover/adicionar blocos (arraste ou botões), experimentar larguras e exportar HTML independente com os desenhos incorporados. O progresso vale apenas para a visita. A bancada permite experimentar paletas, tipografia, cantos e espaçamento, revelar a estrutura, conferir o contraste do botão e exportar variáveis em CSS. Tudo funciona em português e inglês, respeita movimento reduzido e fica na memória até sair ou recarregar. As fontes são locais, com [licenças incluídas](./public/fonts/learning/README.md).

O Neon Bay (`/experimental3d`) é uma missão de espionagem steampunk em três etapas: arquivo corporativo, interceptação de sinais e controle de portões, com extração e reinício completo. A rota foi preservada, mas a experiência utiliza SVG e CSS sem vídeo ou motor 3D. Consulte [o diagnóstico e o roteiro de testes](./src/Pages/Experimental3D/README.md).

## Deploy

O frontend principal é publicado em `https://bernardo-kra.github.io/`. O backend usa Render e o frontend também pode ser compilado pela Vercel. A configuração completa está em [DEPLOYMENT.md](./DEPLOYMENT.md).

## Convenções

As mensagens de commit seguem [Conventional Commits](./COMMIT_CONVENTION.md).
