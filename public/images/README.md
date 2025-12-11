# 🖼️ Guia de Imagens - VisionDay Hub

## 📁 Estrutura de Pastas

```
public/images/
├── logos/              # Logos do VisionDay Hub
├── icons/              # Ícones e favicons
├── backgrounds/        # Imagens de fundo
└── illustrations/      # Ilustrações e gráficos
```

---

## 📋 Checklist de Imagens Necessárias

### 🏢 Logos (`/logos/`)

#### VisionDay Hub
- [ ] `visionday-logo.svg` - Logo principal do VisionDay (colorido)
- [ ] `visionday-logo-white.svg` - Logo do VisionDay (branco para fundos escuros)
- [ ] `visionday-icon.svg` - Ícone/símbolo do VisionDay

#### Variantes
- [ ] `logo-visionday.png` - Logo completo do VisionDay Hub
- [ ] `logo-visionday-white.png` - Logo do VisionDay Hub (branco)
- [ ] `icon-visionday.png` - Ícone do VisionDay Hub

**Recomendações:**
- Formato: `.svg` (escalável) ou `.png` com alta resolução
- Fundo transparente
- Versões: colorida, branca e preta

---

### 🎯 Ícones (`/icons/`)

#### Favicons
- [ ] `favicon.ico` - 16x16, 32x32, 48x48 (formato .ico)
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png` - 180x180 (iOS)
- [ ] `android-chrome-192x192.png` - 192x192 (Android)
- [ ] `android-chrome-512x512.png` - 512x512 (Android)

#### PWA Icons
- [ ] `icon-192.png` - 192x192
- [ ] `icon-512.png` - 512x512

**Ferramentas para gerar favicons:**
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

---

### 🖼️ Backgrounds (`/backgrounds/`)

#### Autenticação
- [ ] `auth-sidebar-bg.jpg` - Imagem de fundo da lateral de login/cadastro
  - **Dimensões:** 1080x1920px (portrait) ou padrão similar
  - **Tema:** Tecnologia, dados, conexões, inovação
  - **Estilo:** Moderno, gradiente #151D28

#### Dashboard
- [ ] `dashboard-bg.jpg` - Imagem de fundo sutil do dashboard (opcional)
- [ ] `hero-bg.jpg` - Hero section da página inicial

**Recomendações:**
- Formato: `.jpg` ou `.webp` (otimizado)
- Tamanho: Máximo 500KB por imagem
- Qualidade: 85% de compressão

---

### 🎨 Ilustrações (`/illustrations/`)

#### Páginas de Autenticação
- [ ] `login-illustration.svg` - Ilustração da página de login
- [ ] `register-illustration.svg` - Ilustração da página de cadastro
- [ ] `forgot-password-illustration.svg` - Ilustração de recuperação de senha
- [ ] `email-sent-illustration.svg` - Ilustração de email enviado

#### Estados
- [ ] `empty-state.svg` - Estado vazio (sem dados)
- [ ] `error-404.svg` - Página não encontrada
- [ ] `error-500.svg` - Erro no servidor
- [ ] `no-connection.svg` - Sem conexão

#### Módulos
- [ ] `prospeccao-icon.svg` - Ícone do módulo de prospecção
- [ ] `analise-if-icon.svg` - Ícone do módulo de análise IF
- [ ] `pre-aprovado-icon.svg` - Ícone do módulo pré-aprovado
- [ ] `ia-comercial-icon.svg` - Ícone do módulo de IA comercial
- [ ] `abertura-conta-icon.svg` - Ícone do módulo de abertura de conta

**Recursos gratuitos de ilustrações:**
- [unDraw](https://undraw.co/)
- [Storyset](https://storyset.com/)
- [Humaaans](https://www.humaaans.com/)
- [Blush](https://blush.design/)

---

## 🎨 Diretrizes de Design

### Paleta de Cores
Certifique-se de que as imagens sigam a identidade visual:

```css
--app-background: #F9FAFB
--app-text-primary: #1D2530
--app-sidebar: #151D28
--app-active: #F0EFEE
--primary: #3B82F6
```

### Tamanhos Recomendados

| Tipo | Dimensões | Formato | Peso Máximo |
|------|-----------|---------|-------------|
| Logo principal | 240x60px | SVG/PNG | 50KB |
| Ícone | 48x48px | SVG/PNG | 10KB |
| Favicon | 32x32px | ICO/PNG | 5KB |
| Background | 1920x1080px | JPG/WebP | 500KB |
| Ilustração | 800x600px | SVG | 100KB |

---

## 📦 Como Adicionar Novas Imagens

### 1. Imagens Estáticas (Public)

Para imagens que **não mudam** e são **acessadas diretamente via URL**:

```tsx
// Coloque em: public/images/logos/
<img src="/images/logos/banco-bv-logo.svg" alt="Banco BV" />
```

**Vantagens:**
- URL permanente e previsível
- Ideal para SEO
- Não passa pelo build

**Exemplos:**
- Logos
- Favicons
- Imagens de compartilhamento social (og:image)

### 2. Imagens Importadas (Assets)

Para imagens que fazem parte do **código da aplicação**:

```tsx
// Coloque em: src/assets/images/
import logo from '@/assets/images/logo.svg'

<img src={logo} alt="Logo" />
```

**Vantagens:**
- Otimização automática no build
- Hashing no nome (cache busting)
- TypeScript type-safety

**Exemplos:**
- Ilustrações de componentes
- Ícones inline
- Imagens de conteúdo dinâmico

---

## 🚀 Otimização de Imagens

### Ferramentas Recomendadas

1. **[TinyPNG](https://tinypng.com/)** - Compressão de PNG/JPG
2. **[Squoosh](https://squoosh.app/)** - Conversão e otimização
3. **[SVGOMG](https://jakearchibald.github.io/svgomg/)** - Otimização de SVG
4. **[ImageOptim](https://imageoptim.com/)** - App para macOS

### Comandos CLI

```bash
# Instalar imagemin
npm install -g imagemin-cli

# Otimizar todas as imagens
imagemin public/images/**/*.{jpg,png} --out-dir=public/images-optimized
```

---

## 📝 Convenções de Nomenclatura

### Padrão de Nomes

```
[categoria]-[descrição]-[variante].[extensão]

Exemplos:
✅ mttechne-logo-white.svg
✅ dashboard-hero-bg.jpg
✅ login-illustration.svg
✅ icon-user-avatar.png

❌ LogoMttechne.svg
❌ image1.jpg
❌ foto final final2.png
```

### Regras
- Usar **kebab-case** (lowercase com hífens)
- Nomes **descritivos** e **claros**
- Incluir **variante** quando houver múltiplas versões
- Evitar espaços, acentos e caracteres especiais

---

## 🔄 Atualização do index.html

Após adicionar favicons, atualize o `index.html`:

```html
<head>
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/images/icons/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png">
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png">
  
  <!-- Android Chrome -->
  <link rel="icon" type="image/png" sizes="192x192" href="/images/icons/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/images/icons/android-chrome-512x512.png">
  
  <!-- Meta Tags -->
  <meta name="theme-color" content="#151D28">
  <meta name="description" content="DataHub - Plataforma de gestão do funil comercial da Mttechne">
  
  <!-- Open Graph (Redes Sociais) -->
  <meta property="og:title" content="DataHub - Mttechne">
  <meta property="og:description" content="Gestão inteligente do funil comercial">
  <meta property="og:image" content="/images/logos/datahub-logo.svg">
  <meta property="og:url" content="https://datahub.mttechne.com.br">
</head>
```

---

## ✅ Status das Imagens

| Imagem | Status | Prioridade |
|--------|--------|------------|
| Logo Mttechne | ⏳ Pendente | 🔴 Alta |
| Logo DataHub | ⏳ Pendente | 🔴 Alta |
| Favicons | ⏳ Pendente | 🔴 Alta |
| Background Auth | ⏳ Pendente | 🟡 Média |
| Ilustrações | ⏳ Pendente | 🟢 Baixa |

**Legenda:**
- ✅ Concluído
- ⏳ Pendente
- 🚧 Em andamento
- ❌ Bloqueado

---

## 📞 Contato

Para solicitar novas imagens ou atualizar as existentes, entre em contato com:

- **Designer:** design@mttechne.com.br
- **Marketing:** marketing@mttechne.com.br

---

**Última atualização:** 06/12/2025  
**Responsável:** Equipe Frontend DataHub
