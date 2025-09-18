# 🚀 Deploy do Backend - Guia Completo

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Vercel
- Conta no Firebase (Google)

## 🔧 Passo 1: Configurar Firebase

### 1.1 Acesse o Console do Firebase
- Vá para: https://console.firebase.google.com/
- Faça login com sua conta Google

### 1.2 Criar/Configurar Projeto
- Clique em "Adicionar projeto"
- Nome: `portfolio-backend` (ou qualquer nome)
- Ative o Google Analytics (opcional)
- Clique em "Criar projeto"

### 1.3 Configurar Firestore
- No menu lateral, clique em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha "Modo de produção"
- Escolha uma localização (us-east1 é boa para Vercel)
- Clique em "Concluído"

### 1.4 Gerar Chave de Serviço
- No menu lateral, clique em "Configurações do projeto" (ícone de engrenagem)
- Vá para a aba "Contas de serviço"
- Clique em "Gerar nova chave privada"
- Baixe o arquivo JSON
- **IMPORTANTE**: Guarde este arquivo em local seguro!

## 🔧 Passo 2: Configurar Vercel

### 2.1 Acesse o Vercel
- Vá para: https://vercel.com/
- Faça login com sua conta GitHub

### 2.2 Importar Projeto
- Clique em "New Project"
- Conecte seu repositório GitHub
- Selecione o repositório do portfolio
- Configure:
  - **Framework Preset**: Other
  - **Root Directory**: `backend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### 2.3 Configurar Variáveis de Ambiente
No Vercel, vá em Settings > Environment Variables e adicione:

```
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY_ID=seu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-chave-privada\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=seu-email@seu-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=seu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/seu-email%40seu-project.iam.gserviceaccount.com
```

## 🔧 Passo 3: Deploy

### 3.1 Fazer Deploy
- Clique em "Deploy"
- Aguarde o build completar
- Anote a URL gerada (ex: https://portfolio-backend-abc123.vercel.app)

### 3.2 Testar API
- Acesse: `https://sua-url.vercel.app/api/health`
- Deve retornar: `{"status":"ok"}`

## 🔧 Passo 4: Atualizar Frontend

### 4.1 Atualizar URL do Backend
No arquivo `.env` do frontend:
```
VITE_BACKEND_URL=https://sua-url.vercel.app
```

### 4.2 Deploy do Frontend
- Faça commit das mudanças
- O Vercel fará deploy automático

## ✅ Verificação Final

1. **Backend funcionando**: https://sua-url.vercel.app/api/health
2. **Frontend conectado**: Teste o chat e autenticação
3. **Banco de dados**: Verifique no Firebase Console

## 🆘 Solução de Problemas

### Erro de CORS
- Verifique se o CORS está configurado no backend
- Adicione a URL do frontend nas origens permitidas

### Erro de Firebase
- Verifique se todas as variáveis de ambiente estão corretas
- Confirme se o projeto Firebase está ativo

### Erro de Build
- Verifique se o TypeScript está compilando corretamente
- Execute `npm run build` localmente primeiro

## 📞 Suporte
Se tiver problemas, verifique:
1. Logs do Vercel (Functions > Logs)
2. Console do Firebase
3. Network tab do navegador
