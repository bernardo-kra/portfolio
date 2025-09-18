# 🎯 Guia Passo a Passo - Deploy do Backend

## 📚 **O que vamos fazer:**
1. Configurar Firebase (banco de dados gratuito)
2. Deploy do backend no Vercel (hospedagem gratuita)
3. Conectar frontend ao backend online

---

## 🔥 **PASSO 1: Configurar Firebase**

### 1.1 Criar Conta Firebase
1. Acesse: https://console.firebase.google.com/
2. Clique em "Começar"
3. Faça login com sua conta Google

### 1.2 Criar Projeto
1. Clique em "Adicionar projeto"
2. **Nome do projeto**: `portfolio-backend-bernardo`
3. **Google Analytics**: ✅ Ativar (recomendado)
4. Clique em "Criar projeto"
5. Aguarde alguns segundos

### 1.3 Configurar Firestore (Banco de Dados)
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. **Modo**: Escolha "Modo de produção"
4. **Localização**: Escolha `us-central1` (melhor para Vercel)
5. Clique em **"Concluído"**

### 1.4 Gerar Chave de Serviço (IMPORTANTE!)
1. No menu lateral, clique em **"Configurações do projeto"** (ícone de engrenagem)
2. Vá para a aba **"Contas de serviço"**
3. Clique em **"Gerar nova chave privada"**
4. **BAIXE O ARQUIVO JSON** - guarde em local seguro!
5. **NÃO COMPARTILHE** este arquivo com ninguém

---

## 🚀 **PASSO 2: Deploy no Vercel**

### 2.1 Criar Conta Vercel
1. Acesse: https://vercel.com/
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 2.2 Importar Projeto
1. No dashboard do Vercel, clique em **"New Project"**
2. Encontre seu repositório `portfolio`
3. Clique em **"Import"**

### 2.3 Configurar Build
1. **Framework Preset**: `Other`
2. **Root Directory**: `backend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Clique em **"Deploy"**

### 2.4 Configurar Variáveis de Ambiente
1. Após o deploy, vá em **Settings** > **Environment Variables**
2. Adicione cada variável (use os dados do arquivo JSON baixado):

```
FIREBASE_PROJECT_ID = portfolio-backend-bernardo
FIREBASE_PRIVATE_KEY_ID = (do arquivo JSON)
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n(conteúdo da chave)\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@portfolio-backend-bernardo.iam.gserviceaccount.com
FIREBASE_CLIENT_ID = (do arquivo JSON)
FIREBASE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI = https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40portfolio-backend-bernardo.iam.gserviceaccount.com
```

### 2.5 Fazer Novo Deploy
1. Após adicionar as variáveis, vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Clique em **"Redeploy"**

---

## ✅ **PASSO 3: Testar o Backend**

### 3.1 Verificar Health Check
1. Acesse: `https://seu-projeto.vercel.app/api/health`
2. Deve retornar: `{"status":"ok","timestamp":"...","environment":"production"}`

### 3.2 Configurar Admin
1. No terminal, vá para a pasta `backend`
2. Execute: `npm run setup-admin`
3. Digite os dados do admin:
   - Email: `bernardo@kraczkowski.com`
   - Nome: `Bernardo`
   - Sobrenome: `Kraczkowski`
   - Senha: (escolha uma senha forte)

---

## 🔗 **PASSO 4: Conectar Frontend**

### 4.1 Atualizar URL do Backend
1. No arquivo `.env` do frontend, altere:
```
VITE_BACKEND_URL=https://seu-projeto.vercel.app
```

### 4.2 Deploy do Frontend
1. Faça commit das mudanças
2. O Vercel fará deploy automático do frontend

---

## 🎉 **PASSO 5: Verificação Final**

### 5.1 Testar Funcionalidades
1. **Login**: Teste fazer login no frontend
2. **Chat**: Teste enviar mensagens
3. **Admin**: Teste acessar `/admin/chat`

### 5.2 Verificar Logs
1. No Vercel, vá em **Functions** > **Logs**
2. Verifique se não há erros

---

## 🆘 **Solução de Problemas Comuns**

### ❌ Erro: "Firebase not initialized"
- **Solução**: Verifique se todas as variáveis de ambiente estão corretas

### ❌ Erro: "CORS policy"
- **Solução**: O CORS já está configurado, mas verifique se a URL do frontend está correta

### ❌ Erro: "Rate limit exceeded"
- **Solução**: Aguarde alguns minutos e tente novamente

### ❌ Erro: "Admin not found"
- **Solução**: Execute `npm run setup-admin` novamente

---

## 📞 **Precisa de Ajuda?**

Se algo der errado:
1. Verifique os logs do Vercel
2. Verifique o console do Firebase
3. Teste localmente primeiro: `npm run dev`

**Lembre-se**: O primeiro deploy pode demorar alguns minutos!
