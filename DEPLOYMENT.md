# Deployment Guide

## 🚀 Visão Geral

Este projeto utiliza GitHub Actions para deploy automático no GitHub Pages.

## 📋 Configuração Atual

- **Repositório Fonte:** `bernardo-kra/portfolio`
- **Repositório Destino:** `bernardo-kra/bernardo-kra.github.io`
- **URL de Produção:** https://bernardo-kra.github.io/
- **Base Path:** `/` (raiz)
- **Trigger:** Push para branch `main`

## 🔧 Arquivos de Configuração

### 1. Vite Config (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // ⚠️ Crítico para paths de assets
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
```

### 2. GitHub Actions (`.github/workflows/deploy-root.yml`)
```yaml
name: Deploy root site to bernardo-kra.github.io

on:
  push:
    branches: [ main ]

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          user_name: github-actions
          user_email: actions@github.com
          keep_files: false
```

### 3. GitHub Pages (`.nojekyll`)
- Arquivo vazio em `public/.nojekyll`
- Desabilita processamento Jekyll
- Essencial para SPAs React

## 🔄 Processo de Deploy

1. **Push para main** → Trigger automático
2. **GitHub Actions** → Build (`npm run build`)
3. **Deploy** → Push para branch `gh-pages`
4. **GitHub Pages** → Publicação automática

## 🐛 Troubleshooting

### Site Não Carrega (404)

**Verifique:**
1. GitHub Actions: https://github.com/bernardo-kra/portfolio/actions
2. Arquivos no destino: https://github.com/bernardo-kra/bernardo-kra.github.io
3. Base path em `vite.config.ts`

**Soluções:**
- Limpe cache: `https://bernardo-kra.github.io/?cache-bust`
- Verifique se GitHub Pages está habilitado
- Confirme base path `/` no Vite

### Assets Não Carregam

**Causas comuns:**
- Base path incorreto no Vite
- Paths relativos no HTML
- Cache do navegador

**Verificação:**
```bash
npm run build
# Verifique se assets em dist/ usam paths absolutos
cat dist/index.html | grep "assets/"
```

### Deploy Falha

**Verifique:**
- Permissões do workflow
- Secrets configurados
- Build local funciona

## 📝 Mudanças no Deploy

### Alterar Base Path

**⚠️ CRÍTICO: Teste sempre localmente!**

1. **Crie branch:**
   ```bash
   git checkout -b fix/base-path-change
   ```

2. **Altere vite.config.ts:**
   ```typescript
   base: '/novo-path/'
   ```

3. **Teste local:**
   ```bash
   npm run build
   npm run preview
   # Acesse http://localhost:4173/novo-path/
   ```

4. **Commit e PR:**
   ```bash
   git add .
   git commit -m "fix: update base path to /novo-path/"
   git push origin fix/base-path-change
   ```

5. **Merge apenas após aprovação!**

### Adicionar Novo Domínio

1. **Configure CNAME no DNS**
2. **Adicione CNAME file:**
   ```bash
   echo "seusite.com" > public/CNAME
   ```
3. **Configure GitHub Pages** para domínio customizado

## 🧪 Testes Locais

### Simular Deploy
```bash
# Build de produção
npm run build

# Preview local
npm run preview

# Verifique estrutura
ls -la dist/
```

### Verificar Paths
```bash
# HTML deve ter paths absolutos
grep -o 'href="[^"]*"' dist/index.html

# Assets devem usar /base/
ls dist/assets/
```

## 📊 Monitoramento

### GitHub Actions
- **URL:** https://github.com/bernardo-kra/portfolio/actions
- **Workflow:** "Deploy root site"
- **Duração esperada:** 2-3 minutos

### Site Status
- **URL:** https://bernardo-kra.github.io/
- **Uptime:** Monitorado pelo GitHub
- **Cache:** Atualiza a cada deploy

## 🚨 Boas Práticas

### ✅ Faça
- Teste mudanças localmente
- Use branches para features
- Documente mudanças no base path
- Verifique GitHub Actions após push

### ❌ Não Faça
- Commit direto na main sem testes
- Altere base path sem testar
- Ignore erros no build
- Esqueça de documentar mudanças

## 📞 Suporte

Para problemas de deploy:

1. **Verifique logs** do GitHub Actions
2. **Teste localmente** com `npm run build`
3. **Consulte esta documentação**
4. **Abra issue** se necessário

---

**Última atualização:** 30/01/2026  
**Versão:** 1.0
