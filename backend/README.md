# Portfolio Backend

API Express em TypeScript para autenticação, chat, contato, analytics e dados do portfólio. Usuários, sessões e dados da aplicação são persistidos no Firestore.

## Executar localmente

```bash
npm ci
copy env.example .env
npm run dev
```

Em shells Unix, use `cp env.example .env`. O servidor usa a porta `3001` por padrão.

## Scripts

| Comando               | Finalidade                               |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Executa com reload via tsx               |
| `npm run build`       | Compila TypeScript em `dist`             |
| `npm start`           | Executa o build                          |
| `npm run lint`        | Analisa `src`                            |
| `npm run setup-admin` | Executa o assistente de criação do admin |

## Rotas

Todas as rotas usam o prefixo `/api`.

- `/health`: status do serviço.
- `/auth`: registro, login e dados de autenticação.
- `/chat`: mensagens, respostas, leitura e estatísticas.
- `/contact`: mensagens do formulário de contato.
- `/analytics`: visualizações e estatísticas.
- `/portfolio`: CRUD de projetos.
- `/security`: logs e estatísticas restritos ao admin.

Consulte os arquivos em `src/routes` para os contratos atuais. Ainda não há uma especificação OpenAPI nem testes automatizados.

## Autenticação

As rotas protegidas esperam `Authorization: Bearer <token>`. Login e cadastro criam uma sessão com duração de sete dias; apenas o hash SHA-256 do token é persistido na coleção `sessions`. O header `x-user-email` é opcional e, quando enviado, precisa corresponder ao usuário da sessão.

## Deploy

O serviço atual usa Render. Configure o diretório raiz como `backend`, execute `npm ci && npm run build` e inicie com `npm start`. As variáveis necessárias estão em `env.example` e na documentação da raiz.
