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
VITE_GOOGLE_CLIENT_ID=
```

Em desenvolvimento, a URL padrão do backend é `http://localhost:3001`. Em produção, o fallback atual é `https://portfolio-backed-ll6j.onrender.com`.

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
GOOGLE_CLIENT_ID=
```

O `FIREBASE_PRIVATE_KEY` pode conter quebras de linha escapadas como `\n`. As demais variáveis do arquivo `backend/env.example` são úteis para configurar a credencial completa no provedor de hospedagem.

## Produção

- GitHub Actions: configure a variável de repositório `VITE_GA_MEASUREMENT_ID` para o Analytics e `VITE_GOOGLE_CLIENT_ID` para login Google. Analytics só carrega após consentimento.
- Render: configure as credenciais Firebase como secrets.
- Não coloque variáveis `FIREBASE_*` no frontend; tudo que começa com `VITE_` pode ser exposto no bundle.

## Login Google

Crie um cliente OAuth de tipo **Aplicativo da Web** no Google Cloud / Google Auth
Platform. Configure as origens JavaScript autorizadas: `https://bernardo-kra.github.io`
e `http://localhost:5173` para desenvolvimento. Cadastre a URL da política:
`https://bernardo-kra.github.io/privacy`. Configure audiência/testadores e a tela
de consentimento conforme o status do aplicativo no Google.

Use o mesmo identificador público em `VITE_GOOGLE_CLIENT_ID` (frontend, durante
o build) e `GOOGLE_CLIENT_ID` (backend, Render). O fluxo usa o botão oficial
Google Identity Services em popup; não usa Client Secret nem acesso ao Gmail/Drive.
Sem o Client ID, o botão fica indisponível e o login por senha continua disponível.

O backend valida assinatura, emissor, validade e audiência com `google-auth-library`.
Um nonce aleatório de cinco minutos é consumido em transação no Firestore. Ative
uma política TTL no campo `expiresAt` da coleção `googleChallenges` para limpar
desafios abandonados e em `sessions` para remover sessões expiradas. A expiração
é validada pelo código mesmo antes da remoção pelo TTL.

Contas de senha existentes não são vinculadas automaticamente pelo email: o
usuário continua entrando com senha. Novas contas recebem apenas o papel `user`;
administradores são definidos por ferramentas administrativas existentes.

Publique o backend antes de habilitar o Client ID no frontend. Teste com uma conta
de teste Google: login/cadastro, logout, token inválido, nonce reutilizado e
conta de senha existente. Esses testes reais dependem da configuração no Google
e de um Firestore de teste; não foram executados só com mocks locais.

## Privacidade

A página `/privacy` documenta os dados usados, provedores, armazenamento e o
canal de atendimento aos titulares. O banner distingue armazenamento necessário
de análise opcional. Recusar não impede navegação ou autenticação; revogar limpa
cookies de análise acessíveis e recarrega a página para descarregar o script.

Pedidos de acesso, correção e exclusão são atendidos pelo email público do perfil;
não há exclusão automática de contas ou mensagens. Antes de publicar, confirmar
esse canal, os procedimentos de atendimento, retenção dos provedores, eventuais
transferências internacionais e a configuração de retenção do Analytics.
Os controles técnicos e o texto precisam refletir a operação real; não constituem
uma certificação de conformidade jurídica.

Referências: [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token),
[ANPD — cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais),
[LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm).

## Reforços de segurança — 2026-10-05

As sessões ficam apenas em memória no frontend, terminam ao recarregar e expiram
no backend em uma hora. Versões antigas são removidas do armazenamento local.
Isso reduz persistência e exposição, mas não torna o site imune a XSS: scripts
maliciosos executados na origem ainda podem agir durante uma sessão ativa.
Cookies persistentes entre GitHub Pages e Render exigem atenção a bloqueio de
cookies de terceiros; para adotá-los, prefira frontend/API sob o mesmo site.

Novas contas usam Google com email verificado. Cadastro por senha está bloqueado
até existir um serviço de confirmação de email; contas existentes ainda entram
com senha. Configure os dois Client IDs antes de disponibilizar cadastro Google.
O limite por conta usa Firestore (10 tentativas/15 minutos, mesmo entre instâncias),
além do limite por IP. Configure TTL de expiresAt em authAttempts.

Rotas de leitura/alteração de contatos e alteração de projetos exigem admin.
Perfis devolvem apenas campos explícitos. Respostas de autenticação não são
armazenadas em cache. O proxy de produção confia em um salto: validar essa
quantidade e o IP recebido no ambiente Render antes de ampliar a configuração.

backend/firestore.rules bloqueia todo acesso direto por clientes. As regras
publicadas foram consultadas em 2026-10-05 e já possuem esse bloqueio; probes
anônimos de documentos inexistentes em users/sessions/chats/messages deram 403.
Nenhuma mensagem de usuário foi consultada. Firebase Admin ignora essas regras:
IAM da conta de serviço, proteção das credenciais e autorização do backend
continuam essenciais. Permissões IAM não foram auditadas nesta etapa.

O script antigo set-admin.js continha uma senha padrão pública. Foi substituído
pelo setup seguro: PORTFOLIO_ADMIN_PASSWORD precisa ter ao menos 16 caracteres,
sem exibição da senha nem substituição automática de uma conta existente. Se o
script antigo já foi executado, troque essa senha no Firebase Authentication e
nas contas por senha do aplicativo que a reutilizaram; revogue suas sessões.
Uma alteração no código não troca senhas existentes nem apaga histórico do Git.

npm run test:security compila e executa handlers HTTP reais usando registros
sintéticos, cobrindo anonimato, isolamento entre contas, funções administrativas,
logout, expiração, token falso e limites de tentativas. Não substitui testes
reais do Google, revisão de IAM ou auditoria de segurança em produção.

Publique o backend corrigido antes do frontend. As rotas públicas antigas não
ficam protegidas apenas porque o código local mudou. Reavalie as sessões antigas
antes de implantar: o backend aceita somente sessões versão 2, invalidando tokens
antigos. Todos os usuários precisarão entrar novamente. Login administrativo
por senha exige ao menos 16 caracteres, bloqueando senhas curtas históricas.
