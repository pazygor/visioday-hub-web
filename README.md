# VisionDay Hub - Frontend

> Plataforma de contabilidade digital com área do cliente e sistema de gestão interno para contadores.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## � Quick Start

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
http://localhost:5173
```

### Credenciais de Teste (Mock)
```
Email: phs2190@hotmail.com
Senha: Jo@o51.0
```

## � Tecnologias

- **React 18.3** + **TypeScript 5.6** + **Vite 6.0**
- **Tailwind CSS 4.0** - Estilização
- **React Router 7.0** - Roteamento
- **React Hook Form + Zod** - Formulários e validação
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📁 Estrutura

```
src/
├── components/ui/       # Componentes base (Button, Input, Alert)
├── modules/auth/        # Módulo de autenticação completo
├── contexts/            # AuthContext, ThemeContext
├── pages/               # Páginas principais (Dashboard)
├── styles/              # Estilos globais e variáveis CSS
└── utils/               # Funções auxiliares
```

## ✨ Features Implementadas

### Autenticação
- ✅ Login e Cadastro com validação
- ✅ Recuperação e redefinição de senha
- ✅ Indicador de força de senha
- ✅ Proteção de rotas privadas
- ✅ Persistência de sessão

### UI/UX
- ✅ Design system com cores corporativas
- ✅ Componentes reutilizáveis (Button, Input, Alert)
- ✅ Feedback visual (loading, toasts, validações)
- ✅ Responsividade mobile-first

## 🛠️ Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código com ESLint
```

## 📚 Documentação

Documentação detalhada disponível em [`docs/`](./docs/):

- **[AUTH_README.md](./docs/AUTH_README.md)** - Documentação técnica completa
- **[AUTH_GUIDE_JUNIOR.md](./docs/AUTH_GUIDE_JUNIOR.md)** - Guia para desenvolvedores júnior
- **[SETUP_STYLES.md](./docs/SETUP_STYLES.md)** - Guia de cores e estilos

## 🔗 Integrando com API

Por padrão, o sistema usa dados mockados. Para conectar à API real:

1. Edite `src/modules/auth/services/authService.ts`
2. Altere `USE_MOCK = false`
3. Configure `.env` com a URL da API

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m "feat: adiciona nova feature"`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

### Convenção de Commits
```
feature: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
```

##  Licença

© 2025 Mttechne - Todos os direitos reservados.
