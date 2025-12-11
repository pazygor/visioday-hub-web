# 🎨 Layout System - DataHub

## 📐 Estrutura de Layout

O sistema de layout da aplicação é composto por 3 componentes principais:

### **1. Sidebar** (`#002358` - Azul Mttechne)

Barra lateral fixa com navegação principal.

**Componentes:**
- Logo Mttechne + Nome do sistema
- Menu de navegação (7 itens)
- Botão de logout
- Footer com copyright

**Características:**
- Largura fixa: 256px (w-64)
- Background: #002358
- Item ativo: #0066B1
- Hover: branco/10% opacity

### **2. Header** (`#F9FAFB` - Cinza claro)

Cabeçalho fixo no topo com breadcrumbs e menu de usuário.

**Componentes:**
- Breadcrumbs de navegação
- Avatar com iniciais do usuário
- Dropdown com perfil e logout

**Características:**
- Altura: 64px (h-16)
- Background: #F9FAFB
- Margem esquerda: 256px (compensa sidebar)

### **3. AppLayout**

Componente wrapper que une Sidebar + Header + Content.

**Uso:**
```tsx
<AppLayout>
  <YourPageContent />
</AppLayout>
```

---

## 🗺️ Rotas Implementadas

| Rota | Página | Status |
|------|--------|--------|
| `/dashboard` | Dashboard | ✅ Implementada |
| `/prospecting` | Etapa 1: Prospecção | 🚧 Em breve |
| `/pre-approval` | Etapa 2: Pré-Aprovados | 🚧 Em breve |
| `/approach` | Etapa 3: Abordagem | 🚧 Em breve |
| `/opening` | Etapa 4: Abertura | 🚧 Em breve |
| `/flowchart` | Fluxograma | 🚧 Em breve |
| `/functional-design` | Desenho Funcional | 🚧 Em breve |

---

## 🎨 Identidade Visual

### **Cores**
```css
/* Sidebar */
--sidebar-bg: #002358        /* Azul escuro Mttechne */
--sidebar-active: #0066B1    /* Azul claro Mttechne */
--sidebar-text: #FFFFFF      /* Branco */

/* Header */
--header-bg: #F9FAFB         /* Cinza claro */
--header-text: #1D2530       /* Cinza escuro */

/* Content */
--content-bg: #F9FAFB        /* Cinza claro */
```

### **Tipografia**
```css
font-family: 'Inter', sans-serif;
```

---

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx      # Wrapper principal
│       ├── Sidebar.tsx        # Menu lateral
│       ├── Header.tsx         # Cabeçalho com breadcrumbs
│       └── index.ts           # Exports
│
├── modules/
│   └── dashboard/
│       ├── pages/
│       │   └── DashboardPage.tsx
│       ├── components/
│       └── index.ts
│
└── App.tsx                    # Rotas com layout
```

---

## 🚀 Como Adicionar Nova Página

### **1. Criar módulo**
```bash
src/modules/meu-modulo/
├── pages/
│   └── MinhaPage.tsx
├── components/
├── hooks/
├── services/
└── types/
```

### **2. Criar página**
```tsx
// src/modules/meu-modulo/pages/MinhaPage.tsx
export const MinhaPage = () => {
  return (
    <div>
      <h1>Minha Página</h1>
    </div>
  )
}
```

### **3. Adicionar rota no App.tsx**
```tsx
import { MinhaPage } from '@/modules/meu-modulo/pages/MinhaPage'

// Dentro de <Route element={<PrivateRoute />}>
<Route 
  path="/minha-rota" 
  element={<AppLayout><MinhaPage /></AppLayout>} 
/>
```

### **4. Adicionar item no Sidebar**
```tsx
// src/components/layout/Sidebar.tsx
const menuItems: MenuItem[] = [
  // ... itens existentes
  {
    id: 'minha-rota',
    label: 'Minha Página',
    path: '/minha-rota',
    icon: <Icon className="w-5 h-5" />
  }
]
```

### **5. Adicionar breadcrumb no Header**
```tsx
// src/components/layout/Header.tsx
const routeConfig: Record<string, BreadcrumbItem[]> = {
  // ... rotas existentes
  '/minha-rota': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Minha Página' }
  ]
}
```

---

## 🎯 Features Implementadas

### **Sidebar**
- ✅ Navegação com 7 itens
- ✅ Item ativo destacado (#0066B1)
- ✅ Hover states
- ✅ Logo Mttechne no topo
- ✅ Botão de logout
- ✅ Footer com copyright
- ✅ Scroll automático se muitos itens

### **Header**
- ✅ Breadcrumbs dinâmicos
- ✅ Avatar com iniciais do usuário
- ✅ Dropdown com menu de usuário
- ✅ Links para perfil e configurações
- ✅ Logout no dropdown
- ✅ Responsivo (esconde nome em mobile)

### **AppLayout**
- ✅ Sidebar fixa à esquerda
- ✅ Header fixo no topo
- ✅ Content area com padding
- ✅ Background #F9FAFB

---

## 🔧 Customizações

### **Mudar cor da sidebar**
```tsx
// Sidebar.tsx
<aside className="bg-[#002358]">  // Troque a cor aqui
```

### **Mudar cor do item ativo**
```tsx
// Sidebar.tsx
isActive(item.path)
  ? 'bg-[#0066B1]'  // Troque a cor aqui
  : 'hover:bg-white/10'
```

### **Adicionar logo diferente**
```tsx
// Sidebar.tsx
<img src="/images/logos/outra-logo.png" />
```

---

## 📱 Responsividade

✅ **Implementado completamente!** A plataforma é 100% responsiva para mobile, tablet e desktop.

### Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1023px (md)
- **Desktop**: ≥ 1024px (lg)

### Comportamento do Layout

#### 🖥️ Desktop (≥ 1024px)
- ✅ Sidebar sempre visível (256px fixo à esquerda)
- ✅ Header fixo no topo com breadcrumbs completos
- ✅ Conteúdo com margem esquerda de 256px
- ✅ Menu hambúrguer oculto

#### 📱 Mobile/Tablet (< 1024px)
- ✅ **Sidebar como drawer lateral**:
  - Menu hambúrguer no Header abre sidebar
  - Overlay escuro sobre o conteúdo (backdrop)
  - Animação suave de slide (transform)
  - Botão X para fechar no canto superior direito
  - Fecha automaticamente ao clicar em um link
  - Fecha ao clicar no backdrop
- ✅ **Header responsivo**: 
  - Menu hambúrguer visível (ícone ☰)
  - Breadcrumbs com texto truncado
  - Width total da tela (sem margem lateral)
- ✅ **Conteúdo adaptado**: 
  - Sem margem esquerda
  - Padding reduzido (p-4 ao invés de p-6)
  - Grids ajustados (1 coluna → 2 colunas → 4 colunas)

### Implementação Técnica

#### AppLayout
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false)

<Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)} 
/>
<Header onMenuClick={() => setSidebarOpen(true)} />
```

#### Sidebar
```tsx
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// Classes responsivas
className={`${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}

// Overlay mobile
{isOpen && <div className="lg:hidden" onClick={onClose} />}

// Auto-close ao navegar
if (window.innerWidth < 1024) { onClose() }
```

#### Header
```tsx
interface HeaderProps {
  onMenuClick: () => void
}

// Botão hambúrguer (mobile only)
<button className="lg:hidden" onClick={onMenuClick}>
  <Menu />
</button>

// Posicionamento responsivo
className="left-0 lg:left-64"
```

### Como Testar

1. Abra DevTools (F12)
2. Ative o modo de dispositivo (Ctrl/Cmd + Shift + M)
3. Teste os seguintes tamanhos:
   - 📱 iPhone SE (375x667)
   - 📱 iPad (768x1024)
   - 🖥️ Desktop (1920x1080)
4. Verifique:
   - ✅ Menu hambúrguer aparece em mobile/tablet
   - ✅ Sidebar abre/fecha suavemente
   - ✅ Overlay escurece o fundo quando sidebar aberto
   - ✅ Conteúdo se adapta ao tamanho
   - ✅ Grids reorganizam colunas
   - ✅ Breadcrumbs truncam em telas pequenas

---

## 🐛 Troubleshooting

### **Sidebar não aparece**
Verifique se `AppLayout` está envolvendo a página:
```tsx
<Route path="/rota" element={<AppLayout><Página /></AppLayout>} />
```

### **Breadcrumbs não aparecem**
Adicione a rota no `routeConfig` do `Header.tsx`

### **Avatar mostra "U" ao invés das iniciais**
Verifique se o `user` está no contexto de autenticação

---

**Criado em:** 08/12/2025  
**Última atualização:** 08/12/2025  
**Versão:** 1.0.0
