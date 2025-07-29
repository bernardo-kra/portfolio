# 📱 Guia de Responsividade

## Visão Geral

Este projeto implementa um sistema de responsividade robusto baseado em **CSS Variables** e **clamp()** para garantir uma experiência consistente em todos os dispositivos.

## 🎯 Breakpoints

```css
--breakpoint-xs: 400px   /* Mobile pequeno */
--breakpoint-sm: 600px   /* Mobile */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 900px   /* Desktop pequeno */
--breakpoint-xl: 1200px  /* Desktop */
```

## 📏 Sistema de Espaçamentos

### Variáveis CSS
```css
--spacing-xs: clamp(0.25rem, 1vw, 0.5rem)    /* 4px - 8px */
--spacing-sm: clamp(0.5rem, 2vw, 1rem)       /* 8px - 16px */
--spacing-md: clamp(1rem, 3vw, 1.5rem)       /* 16px - 24px */
--spacing-lg: clamp(1.5rem, 4vw, 2rem)       /* 24px - 32px */
--spacing-xl: clamp(2rem, 5vw, 3rem)         /* 32px - 48px */
--spacing-2xl: clamp(3rem, 6vw, 4rem)        /* 48px - 64px */
```

### Uso
```css
.my-component {
  padding: var(--spacing-md)
  margin: var(--spacing-lg)
  gap: var(--spacing-sm)
}
```

## 🔤 Tipografia Responsiva

### Variáveis CSS
```css
--font-size-xs: clamp(0.75rem, 2vw, 0.875rem)    /* 12px - 14px */
--font-size-sm: clamp(0.875rem, 2.5vw, 1rem)     /* 14px - 16px */
--font-size-base: clamp(1rem, 3vw, 1.125rem)     /* 16px - 18px */
--font-size-lg: clamp(1.125rem, 3.5vw, 1.25rem)  /* 18px - 20px */
--font-size-xl: clamp(1.25rem, 4vw, 1.5rem)      /* 20px - 24px */
--font-size-2xl: clamp(1.5rem, 5vw, 2rem)        /* 24px - 32px */
--font-size-3xl: clamp(2rem, 6vw, 2.5rem)        /* 32px - 40px */
--font-size-4xl: clamp(2.5rem, 7vw, 3rem)        /* 40px - 48px */
--font-size-5xl: clamp(3rem, 8vw, 4rem)          /* 48px - 64px */
```

### Uso
```css
.title {
  font-size: var(--font-size-3xl)
}

.subtitle {
  font-size: var(--font-size-lg)
}

.body-text {
  font-size: var(--font-size-base)
}
```

## 📐 Container Responsivo

### Variáveis CSS
```css
--container-padding: clamp(1rem, 4vw, 2rem)
--container-max-width: min(1200px, 95vw)
```

### Uso
```css
.container {
  max-width: var(--container-max-width)
  padding: 0 var(--container-padding)
  margin: 0 auto
}
```

## 🎨 Classes Utilitárias

### Container
```css
.container-responsive {
  max-width: var(--container-max-width)
  padding: 0 var(--container-padding)
  margin: 0 auto
}
```

### Grid
```css
.grid-responsive {
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 300px, 350px), 1fr))
  gap: var(--spacing-md)
}
```

### Flex
```css
.flex-responsive {
  display: flex
  gap: var(--spacing-sm)
  flex-wrap: wrap
}
```

### Texto
```css
.text-responsive { font-size: var(--font-size-base) }
.text-responsive-sm { font-size: var(--font-size-sm) }
.text-responsive-lg { font-size: var(--font-size-lg) }
.text-responsive-xl { font-size: var(--font-size-xl) }
```

### Espaçamentos
```css
.spacing-responsive { padding: var(--spacing-md) margin: var(--spacing-md) }
.spacing-responsive-sm { padding: var(--spacing-sm) margin: var(--spacing-sm) }
.spacing-responsive-lg { padding: var(--spacing-lg) margin: var(--spacing-lg) }
```

## 📱 Media Queries

### Estrutura Recomendada
```css
/* Desktop First */
.my-component {
  /* Estilos para desktop */
}

@media (max-width: 900px) {
  .my-component {
    /* Estilos para tablet */
  }
}

@media (max-width: 600px) {
  .my-component {
    /* Estilos para mobile */
  }
}

@media (max-width: 400px) {
  .my-component {
    /* Estilos para mobile pequeno */
  }
}
```

## 🛠️ Boas Práticas

### 1. Use clamp() para valores fluidos
```css
/* ✅ Bom */
width: clamp(200px, 50vw, 400px)
font-size: clamp(1rem, 3vw, 1.5rem)

/* ❌ Evite */
width: 300px
font-size: 1.2rem
```

### 2. Use variáveis CSS para consistência
```css
/* ✅ Bom */
padding: var(--spacing-md)
font-size: var(--font-size-lg)

/* ❌ Evite */
padding: 1rem
font-size: 1.2rem
```

### 3. Prefira unidades relativas
```css
/* ✅ Bom */
width: 100%
max-width: var(--container-max-width)
height: clamp(200px, 50vh, 400px)

/* ❌ Evite */
width: 1200px
height: 300px
```

### 4. Teste em múltiplos dispositivos
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px - 1200px+
- Large Desktop: 1201px+

## 🔧 Debugging

### Verificar variáveis CSS
```javascript
// No console do navegador
getComputedStyle(document.documentElement).getPropertyValue('--spacing-md')
```

### Testar breakpoints
```css
/* Adicione temporariamente para debug */
* {
  outline: 1px solid red
}
```

## 📚 Recursos

- [CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design) 