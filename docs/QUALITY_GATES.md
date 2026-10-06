# Quality gates e plano de migração

Medição de instalação: 2026-10-06. React 19 / Vite / TypeScript, Express / Firebase Admin e testes Node, gerenciados por npm. ESLint 9.39.5. Fontes em src/, backend/src/ e api/. Aliases @src, @components, @assets, @pages, @theme, @hooks e @context resolvidos pelos tsconfigs existentes.

As três regras CommonJS foram copiadas sem alteração de [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/tree/main/templates/eslint). O verificador original está em tests/qualityRules.verify.mjs e integra npm test. .prettierignore protege as cópias. Os configs mjs são adaptações dos exemplos do mesmo fornecedor.

## Escopo e limites

- Teto de 350 linhas físicas, incluindo comentários e linhas vazias; testes incluídos explicitamente. Nenhum teto foi aumentado.
- O fornecedor ignora TODOS os arquivos chamados index.*, types.*, interfaces.*, constants.*, dtos.*, enums.* e vo.*, mesmo que contenham implementação. Isso é uma limitação real da regra copiada, não prova de que esses arquivos são pequenos. Não alteramos o plugin para esconder essa limitação.
- UI em src/Pages, src/components e a entrada src/main.tsx não pode importar backend/src. Rotas backend e api/ não podem importar diretamente config/firebase.ts; devem usar repositórios. quality/no-direct-data-access reforça os nomes relativos/aliases atuais, import-x verifica a resolução real.
- Único cliente do banco: db em backend/src/config/firebase.ts. Middleware e serviços de infraestrutura continuam consumidores legítimos.
- Nenhum adaptador de logging existia na instalação. A etapa de refatoração criará adaptadores explícitos para browser, backend e serverless; só esses arquivos podem usar console.
- O lint rápido não monta programa TypeScript. npm run lint:types é a etapa separada com projectService, nunca adicionada ao pre-commit.
- Assets absolutos do Vite só resolvem quando o arquivo realmente existe sob public/. Dois CSS ausentes são diagnósticos reais, não excluídos da regra.

## Baseline medido (instalação, antes de refatorar)

Rápido: 171 avisos, 0 erros. Com tipos: 1078 avisos, 0 erros. Regras com zero violações começam em error; as demais têm contagem de baseline junto à configuração e ficam em warn durante a migração.

| Regra (lint rápido) | Avisos |
| --- | ---: |
| complexity | 42 |
| quality/no-direct-console | 39 |
| max-statements | 37 |
| max-lines-per-function | 24 |
| quality/max-lines | 8 |
| quality/no-direct-data-access | 6 |
| import-x-debt/no-restricted-paths | 6 |
| max-depth | 4 |
| import-x/no-unresolved | 2 |
| max-params | 2 |
| max-nested-callbacks | 1 |

| Regra (lint com tipos, inclui rápido) | Avisos |
| --- | ---: |
| @typescript-eslint/no-unsafe-member-access | 590 |
| @typescript-eslint/no-unsafe-argument | 188 |
| @typescript-eslint/no-unsafe-assignment | 77 |
| complexity | 42 |
| quality/no-direct-console | 39 |
| max-statements | 37 |
| @typescript-eslint/no-unsafe-call | 24 |
| max-lines-per-function | 24 |
| @typescript-eslint/no-misused-promises | 16 |
| quality/max-lines | 8 |
| @typescript-eslint/no-floating-promises | 8 |
| quality/no-direct-data-access | 6 |
| import-x-debt/no-restricted-paths | 6 |
| max-depth | 4 |
| @typescript-eslint/restrict-template-expressions | 2 |
| import-x/no-unresolved | 2 |
| max-params | 2 |
| @typescript-eslint/no-unsafe-return | 2 |
| max-nested-callbacks | 1 |

| Arquivo | Avisos com tipos |
| --- | ---: |
| src/components/generative/PatternCanvas/InfiniteGenerator.ts | 770 |
| backend/src/routes/chat.ts | 30 |
| backend/src/routes/auth.ts | 25 |
| src/components/auth/SimpleAuthModal/GoogleLogin.tsx | 19 |
| src/services/chatService.ts | 19 |
| backend/src/routes/googleAuth.ts | 13 |
| backend/src/middleware/accountRateLimiter.ts | 11 |
| src/components/auth/LoginForm/index.tsx | 11 |
| src/components/auth/RegisterForm/index.tsx | 11 |
| src/components/auth/SimpleAuthModal/index.tsx | 10 |
| src/components/pomodoro/MusicPlaylist/index.tsx | 8 |
| backend/src/routes/contact.ts | 7 |
| backend/src/routes/portfolio.ts | 7 |
| backend/src/middleware/rateLimiter.ts | 6 |
| backend/src/routes/analytics.ts | 6 |
| src/components/pomodoro/MusicSettings/index.tsx | 6 |
| src/privacy/consent.ts | 6 |
| src/services/chatEvents.ts | 6 |
| src/Pages/Experimental3D/SignalConsole.tsx | 5 |
| src/components/chat/ConversationList/index.tsx | 5 |
| src/components/notifications/ChatNotifications/index.tsx | 5 |
| src/components/chat/WhatsAppChat/index.tsx | 4 |
| src/components/notifications/NotificationCenter/index.tsx | 4 |
| src/components/theme/DayBackground/index.tsx | 4 |
| src/context/PomodoroContext.tsx | 4 |
| backend/src/index.ts | 3 |
| src/components/chat/FloatingChatButton/index.tsx | 3 |
| src/components/chat/MessageInput/index.tsx | 3 |
| src/components/home/ModernHomePage/index.tsx | 3 |
| src/components/pomodoro/LofiPlayer/index.tsx | 3 |
| src/components/pomodoro/TimerControls/index.tsx | 3 |
| src/components/portfolio/PortfolioNav/index.tsx | 3 |
| src/components/theme/StarfieldBackground/index.tsx | 3 |
| backend/src/middleware/auth.ts | 2 |
| backend/src/routes/security.ts | 2 |
| backend/src/services/sessionService.ts | 2 |
| src/Pages/Chat/index.tsx | 2 |
| src/Pages/Experimental3D/index.tsx | 2 |
| src/components/chat/ModernChat/index.tsx | 2 |
| src/components/common/BackButton/index.tsx | 2 |
| src/components/common/CopyEmailButton/index.tsx | 2 |
| src/components/pomodoro/TaskList/index.tsx | 2 |
| src/config/app.config.ts | 2 |
| src/hooks/useAnalytics.ts | 2 |
| backend/src/middleware/adminAuth.ts | 1 |
| backend/src/middleware/cors.ts | 1 |
| backend/src/middleware/errorHandler.ts | 1 |
| backend/src/middleware/securityLogger.ts | 1 |
| backend/src/services/chatEvents.ts | 1 |
| backend/src/services/inputValidation.ts | 1 |
| src/Pages/AdminChat/index.tsx | 1 |
| src/Pages/AgencyStudio/index.tsx | 1 |
| src/Pages/Experimental3D/components/SectorMap.tsx | 1 |
| src/Pages/Experimental3D/consoleState.ts | 1 |
| src/Pages/Experimental3D/missionState.ts | 1 |
| src/Pages/GenerativeArt/index.tsx | 1 |
| src/Pages/Pomodoro/index.tsx | 1 |
| src/Pages/Portfolio/index.tsx | 1 |
| src/components/PrivacyControls/index.tsx | 1 |
| src/components/RouteEffects.tsx | 1 |
| src/components/auth/AccountControl/index.tsx | 1 |
| src/components/chat/MessageBubble/index.tsx | 1 |
| src/components/chat/ReplyModal/index.tsx | 1 |
| src/components/common/Button/index.tsx | 1 |
| src/components/common/HomeButton/index.tsx | 1 |
| src/components/common/Typography/index.tsx | 1 |
| src/components/generative/CosmicControlPanel/index.tsx | 1 |
| src/components/portfolio/AboutMe/index.tsx | 1 |
| src/components/theme/Confetti/index.tsx | 1 |
| src/components/theme/InteractiveParticles/index.tsx | 1 |
| src/components/theme/TransitionThemeEffect/index.tsx | 1 |
| src/i18n/en.ts | 1 |
| src/i18n/pt.ts | 1 |
| tests/security.test.mjs | 1 |

## Lote de tamanho: exatamente três arquivos

1. InfiniteGenerator.ts (4058 linhas): estado, atualização e desenho de múltiplos fenômenos cósmicos. Costuras: cada fenômeno astronômico, geração/eventos, formas e colisões; tipos de estado e payloads explícitos. Preservar exports InfiniteGenerator e CosmicSettings e assinaturas públicas (constructor, render, updateSettings). Comparar comandos Canvas e estado com referência anterior sob RNG determinístico, incluindo eventos e colisões.
2. SignalConsole.tsx (745): operação de interceptação e painéis de UI. Costuras: hooks de efeitos/controle e painéis especializados. Preservar default SignalConsole, props e comportamentos de foco, idioma, áudio, cancelamento e reinício.
3. security.test.mjs (671): harness Express/Firebase/Google e cenários de autenticação/chat/validação. Costuras: harness compartilhado e grupos de casos por domínio. Manter entrada original, ordem de registro e limpeza; nenhum export público existente.

Cada arquivo será separado, validado com typecheck/test/lint e commitado antes do próximo. Não iniciar um quarto arquivo por tamanho. Extrações de repositórios ou de lógica para outras regras podem incidentalmente reduzir outros arquivos; isso será relatado separadamente.

## Decisão de risco

O motor InfiniteGenerator concentra 770 avisos na primeira medição com tipos (734 de tipos e 36 rápidos), 4058 linhas e mais de 100 métodos. A: corrigir tudo preservando comportamento (padrão expresso no prompt se não houver resposta); B: dívida explícita; C: mudar escopo, que seria alteração de configuração e não correção. Pergunta enviada ao usuário antes da implementação. Sem resposta após oportunidade razoável, seguimos A conforme padrão solicitado. Nenhuma flexibilização de teto ou ocultação do motor.

## Ondas e despacho

Seguir [parallel wave dispatch](https://raw.githubusercontent.com/soumatheusgomes/vibe-coding-toolkit/main/docs/prompts/05-parallel-wave-dispatch.md): implementadores não fazem commits; orquestrador captura HEAD imediatamente antes de cada commit, um por vez em ordem fixa. Revisores independentes trabalham após os commits da onda. Worktrees isolados evitam que verificações incluam alterações parciais de outros agentes.

| Onda | ID | Files | Depends-on | Owner |
| --- | --- | --- | --- | --- |
| 0 | T00 | eslint.config.*, eslint.typed.config.mjs, eslint-rules/**, tests/qualityRules.verify.mjs, package*.json, .prettierignore, docs/QUALITY_GATES.md | none | orquestrador/tooling |
| 1 | T01 | src/components/generative/PatternCanvas/InfiniteGenerator.ts, src/components/generative/PatternCanvas/cosmic/**, tests/cosmic*.test.mjs, tests/cosmic/** | T00 | TypeScript/Canvas |
| 1 | T04 | backend/src/** exceto config/firebase.ts (permitido só import de logger), api/**, tests/repository*.test.mjs | T00 | backend/segurança |
| 1 | T05 | src/** exceto src/components/generative/PatternCanvas/** e src/Pages/Experimental3D/**, tests/frontend*.test.mjs | T00 | React/TypeScript |
| 2 | T02 | src/Pages/Experimental3D/SignalConsole.tsx, src/Pages/Experimental3D/signal/** | T01 e revisões da onda 1 | React/interceptação |
| 3 | T03 | tests/security.test.mjs, tests/security/** | T02 e revisão | testes/segurança |
| 4 | T06 | eslint.config.mjs, eslint.typed.config.mjs, docs/QUALITY_GATES.md | T03 e revisão | orquestrador/tooling |

T01, T04 e T05 são disjuntos; commits na ordem T01, T04, T05. Antes de ampliar um escopo incerto, serializar e registrar. Revisores: TypeScript/Canvas para T01, segurança/Node para T04, React/TypeScript para T05/T02, segurança/testes para T03. Revisão integral final por React/TypeScript e segurança/Node.

Revisão independente de T00: fechou uma lacuna de imports resolvidos em src/main.tsx e api/. O teste tests/qualityBoundaries.test.mjs cobre extensões .js/.ts/sem extensão, aliases de binding, namespace, repositórios legítimos e assets existentes/ausentes do Vite. A adaptação não altera fontes de produção ou a contagem de baseline. .gitattributes protege as cópias CommonJS e o verificador também no checkout Windows.

## Pegadinhas (copiar em cada briefing)

1. O teto conta todas as linhas, inclusive vazias/comentários, e o fornecedor isenta index.* pelo nome; não criar index.ts com implementação para burlar o teto.
2. Preservar exports/assinaturas públicas, ordem de inicialização, Math.random, datas, callbacks, efeitos, foco e streams; extração não é mudança de recurso.
3. Não usar any/assertions/supressões para calar tipos; cada payload precisa representar valores existentes. Nenhum novo eslint-disable, regra relaxada ou orçamento aumentado.
4. Firebase continua mockável em backend/dist/config/firebase.js. Repositórios preservam consultas, spread order, transactions, batch, timestamps e status/JSON.
5. role=admin não significa dono do chat: googleSub e email Google verificado determinam o dono. Preservar ordem de middleware, nonce de uso único/TTL/audience, hash idempotente e recibos apenas de mensagens recebidas/IDs explícitos.
6. Promises em handlers/efeitos precisam preservar execução e tratamento de erro existentes; void sozinho não trata rejeição.
7. Novo módulo pode trocar violação de tamanho por complexidade ou alargar retorno inferido. Verificar ambos os tiers e typecheck, sem cache de lint.
8. Não editar configs, lockfile, docs ou arquivos de outra tarefa. Implementadores não fazem commits; relatar escopo/validação e parar.
9. Dois componentes legados importam CSS ausente. Investigar consumo/histórico; não inventar estilos ou apagar export público silenciosamente. Correção não mecânica vira item separado para revisão humana.

## Critérios verificáveis

- npm run lint: zero avisos não relacionados ao lote de tamanho restante ou itens não mecânicos separados para revisão.
- npm run lint:types: mesmo critério e zero avisos de tipos.
- npm run typecheck: código 0; npm run build:backend: código 0.
- npm test: código 0, incluindo verificador de três regras e comparação de renderização.
- npm run build:full: código 0.
- Reexecutar lint após cada arquivo do lote e no fim, relatar todos os restantes acima do teto; nenhuma nova violação transferida para módulos extraídos.
- Registrar toda supressão nova e item não mecânico (ou listas vazias) e pareceres independentes. Nada será publicado nesta tarefa sem novo pedido.
