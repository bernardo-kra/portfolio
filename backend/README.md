# Portfolio Backend

Backend simples para o portfolio com integração ao Firebase.

## 🚀 Funcionalidades

- **Portfolio**: CRUD completo para projetos
- **Contato**: Sistema de mensagens
- **Analytics**: Rastreamento de visualizações de páginas
- **Firebase**: Integração com Firestore e Authentication

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Firebase
- Chave de serviço do Firebase

## ⚙️ Configuração

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Configurar Firebase:**
   - Acesse o [Console do Firebase](https://console.firebase.google.com/)
   - Crie um projeto ou use um existente
   - Vá em "Configurações do projeto" > "Contas de serviço"
   - Gere uma nova chave privada
   - Configure as variáveis no arquivo `.env`

4. **Executar em desenvolvimento:**
```bash
npm run dev
```

5. **Build para produção:**
```bash
npm run build
npm start
```

## 🔗 Endpoints da API

### Health Check
- `GET /api/health` - Status da API

### Portfolio
- `GET /api/portfolio/projects` - Listar projetos
- `POST /api/portfolio/projects` - Criar projeto
- `GET /api/portfolio/projects/:id` - Buscar projeto
- `PUT /api/portfolio/projects/:id` - Atualizar projeto
- `DELETE /api/portfolio/projects/:id` - Deletar projeto

### Contato
- `POST /api/contact/messages` - Enviar mensagem
- `GET /api/contact/messages` - Listar mensagens
- `PATCH /api/contact/messages/:id/read` - Marcar como lida

### Analytics
- `POST /api/analytics/page-view` - Registrar visualização
- `GET /api/analytics/stats` - Estatísticas

## 🛠️ Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executar versão de produção
- `npm run lint` - Verificar código
- `npm run format` - Formatar código

## 🔧 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.ts      # Configuração do Firebase
│   ├── middleware/
│   │   ├── cors.ts          # Configuração CORS
│   │   └── errorHandler.ts  # Tratamento de erros
│   ├── routes/
│   │   ├── portfolio.ts     # Rotas do portfolio
│   │   ├── contact.ts       # Rotas de contato
│   │   ├── analytics.ts     # Rotas de analytics
│   │   └── index.ts         # Roteador principal
│   └── index.ts             # Servidor principal
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Variáveis de Ambiente

```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
CORS_ORIGIN=http://localhost:5173
```

## 📝 Exemplo de Uso

### Criar um projeto:
```bash
curl -X POST http://localhost:3001/api/portfolio/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Projeto",
    "description": "Descrição do projeto",
    "technologies": ["React", "TypeScript"],
    "githubUrl": "https://github.com/user/repo",
    "liveUrl": "https://meuprojeto.com"
  }'
```

### Enviar mensagem de contato:
```bash
curl -X POST http://localhost:3001/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "subject": "Interesse em projeto",
    "message": "Olá, gostaria de conversar sobre um projeto."
  }'
```





