# VisionDay Academy - Sistema de Educação

## 📚 Visão Geral

O VisionDay Academy é um sistema completo de educação online integrado à plataforma VisionDay Hub. Permite que os usuários naveguem por catálogos de cursos, matriculem-se, acompanhem progresso e obtenham certificados.

## ✅ Status da Implementação

### FASE 2 - CONCLUÍDA ✅

#### Backend (100%)
- [x] Schema Prisma com 9 tabelas
- [x] Migrations aplicadas
- [x] Seeds com dados de exemplo (5 cursos, 4 categorias, 3 instrutores)
- [x] Módulo `academy-curso` com CRUD completo
- [x] Módulo `academy-categoria` com endpoints
- [x] Filtros avançados (busca, categoria, nível, preço, destaque)
- [x] Sistema de paginação (page, limit, totalPages)
- [x] Endpoint de detalhes com relacionamentos (módulos + aulas)
- [x] Servidor em execução

#### Frontend (100%)
- [x] Tipos TypeScript completos (`academy.types.ts`)
- [x] Serviço de API (`academy.api.ts`) com 30+ métodos
- [x] Componente `CourseCard` (card de curso)
- [x] Componente `CourseFilters` (filtros avançados)
- [x] Página `CatalogPage` (catálogo com grid e paginação)
- [x] Página `CourseDetailsPage` (detalhes com tabs)

#### Integração (100%)
- [x] Rotas configuradas no `App.tsx`
- [x] Links no menu de navegação (Sidebar)
- [x] Integração com sistema de autenticação
- [x] Export indexes criados

---

## 🚀 Como Usar

### 1. Acessar o Academy

1. Faça login na plataforma VisionDay
2. Na tela "Escolher Sistema", clique em **VisionDay Academy**
3. Ou acesse diretamente: `http://localhost:5173/academy/catalog`

### 2. Navegar pelo Catálogo

**Filtros Disponíveis:**
- 🔍 **Busca**: Digite palavras-chave (ex: "contabilidade")
- 📂 **Categoria**: Filtre por categoria (Contabilidade Básica, Fiscal, etc.)
- 📊 **Nível**: Iniciante, Intermediário, Avançado
- 💰 **Preço**: Defina faixa de preço mínima e máxima
- ✅ **Checkboxes**: Apenas gratuitos, Em destaque
- 🔽 **Ordenação**: Recentes, Populares, Melhor avaliados, Alfabética, Menor preço

**Paginação:**
- 12 cursos por página
- Navegação com botões "Anterior" e "Próxima"
- Números de página clicáveis
- Contador de resultados

### 3. Visualizar Detalhes do Curso

Clique em qualquer curso para ver:

**Seção Hero:**
- Título e descrição
- Categoria e nível
- Avaliações e número de alunos
- Duração total e certificado
- Informações do instrutor

**Card de Compra (Fixo):**
- Preview do curso
- Preço (com desconto se houver)
- Botão de matrícula
- Resumo (módulos, aulas, duração, acesso)

**Tabs:**
1. **Sobre o Curso**
   - Descrição detalhada
   - O que você vai aprender (objetivos)
   - Requisitos
   - Para quem é este curso

2. **Conteúdo Programático**
   - Lista de módulos expansíveis
   - Aulas com duração
   - Aulas gratuitas marcadas com "Preview"
   - Aulas bloqueadas (requerem matrícula)

3. **Instrutor**
   - Biografia
   - Especialidades
   - Foto de perfil

---

## 📁 Estrutura de Arquivos

```
visioday-hub-web/src/modules/academy/
├── components/
│   ├── AcademyLayout.tsx       # Layout principal do Academy
│   ├── Sidebar.tsx             # Menu lateral
│   ├── CourseCard.tsx          # Card de curso (190 linhas)
│   ├── CourseFilters.tsx       # Filtros do catálogo (260 linhas)
│   └── index.ts                # Export index
├── pages/
│   ├── AcademyDashboardPage.tsx    # Dashboard (futuro)
│   ├── CatalogPage.tsx             # Catálogo de cursos (220 linhas)
│   ├── CourseDetailsPage.tsx       # Detalhes do curso (580 linhas)
│   └── index.ts                    # Export index
├── types/
│   └── academy.types.ts        # Tipos TypeScript (370 linhas)
└── contexts/
    └── AcademyContext.tsx      # Context API (futuro)
```

```
visioday-hub-web/src/services/api/
└── academy.api.ts              # Serviço de API (270 linhas)
```

```
visionday-hub-api/src/
├── academy-curso/              # Módulo de cursos
│   ├── academy-curso.controller.ts
│   ├── academy-curso.service.ts
│   ├── academy-curso.module.ts
│   └── dto/
│       ├── curso-filter.dto.ts
│       ├── create-curso.dto.ts
│       └── update-curso.dto.ts
└── academy-categoria/          # Módulo de categorias
    ├── academy-categoria.controller.ts
    ├── academy-categoria.service.ts
    └── academy-categoria.module.ts
```

---

## 🔌 Endpoints da API

### Cursos

```
GET    /api/academy/cursos
GET    /api/academy/cursos/destaque
GET    /api/academy/cursos/slug/:slug
GET    /api/academy/cursos/:id
POST   /api/academy/cursos
PATCH  /api/academy/cursos/:id
PATCH  /api/academy/cursos/:id/toggle-publicado
PATCH  /api/academy/cursos/:id/toggle-destaque
DELETE /api/academy/cursos/:id
```

### Categorias

```
GET    /api/academy/categorias
GET    /api/academy/categorias/slug/:slug
GET    /api/academy/categorias/:id
```

### Filtros (Query Params)

```
?busca=contabilidade
&categoriaId=1
&nivel=INICIANTE
&precoMin=0
&precoMax=500
&gratuito=true
&destaque=true
&ordenarPor=recente|popular|avaliacao|titulo|preco
&ordem=asc|desc
&page=1
&limit=12
```

---

## 🎨 Componentes Principais

### CourseCard

**Props:**
- `course: AcademyCurso` - Dados do curso
- `className?: string` - Classes CSS adicionais

**Features:**
- Thumbnail com fallback gradient
- Badges de destaque e desconto
- Nível com cores personalizadas
- Categoria com cor customizável
- Instrutor com foto/inicial
- Metadados (duração, alunos, avaliação)
- Preço com suporte a promoção
- Hover effects e animações

### CourseFilters

**Props:**
- `filters: CursoFilterParams` - Filtros atuais
- `onFilterChange: (filters) => void` - Callback de mudança
- `onReset: () => void` - Callback de reset

**Features:**
- Busca em tempo real
- Dropdowns: categoria, nível, ordenação
- Inputs numéricos: preço mín/máx
- Checkboxes: gratuito, destaque
- Responsivo (toggle para mobile)
- Indicador de filtros ativos
- Botão de limpar filtros

### CatalogPage

**Features:**
- Header com título e descrição
- Integração com CourseFilters
- Grid responsivo (1/2/3 colunas)
- Paginação inteligente com "..."
- Estados: loading, erro, sem resultados
- Contador de resultados
- Scroll suave ao mudar página

### CourseDetailsPage

**Features:**
- Hero section com gradient
- Card de compra fixo (sticky)
- Sistema de tabs (Sobre, Conteúdo, Instrutor)
- Módulos expansíveis
- Aulas com preview
- Botão de voltar
- Responsivo completo

---

## 🗄️ Banco de Dados

### Tabelas Criadas

1. **AcademyCategoria** - Categorias de cursos
2. **AcademyInstrutor** - Instrutores
3. **AcademyCurso** - Cursos principais
4. **AcademyModulo** - Módulos do curso
5. **AcademyAula** - Aulas individuais
6. **AcademyMatricula** - Matrículas dos alunos
7. **AcademyProgresso** - Progresso nas aulas
8. **AcademyCertificado** - Certificados de conclusão
9. **AcademyAvaliacao** - Avaliações dos cursos
10. **AcademyAnotacao** - Anotações dos alunos

### Dados de Exemplo (Seed)

- ✅ 4 categorias
- ✅ 3 instrutores
- ✅ 5 cursos completos
- ✅ 3 módulos por curso
- ✅ 12 aulas no total

---

## 🧪 Como Testar

### 1. Backend

```bash
# Entrar na pasta da API
cd visionday-hub-api

# Iniciar servidor (se não estiver rodando)
npm run start:dev

# Testar endpoints (Postman/Thunder Client)
GET http://localhost:3000/api/academy/cursos
GET http://localhost:3000/api/academy/cursos?busca=contabilidade&page=1&limit=12
GET http://localhost:3000/api/academy/cursos/slug/fundamentos-da-contabilidade
GET http://localhost:3000/api/academy/categorias
```

### 2. Frontend

```bash
# Entrar na pasta do frontend
cd visioday-hub-web

# Iniciar servidor de desenvolvimento (se não estiver rodando)
npm run dev

# Acessar no navegador
# http://localhost:5173/academy/catalog
```

### 3. Fluxo Completo

1. Login com usuário de teste: `dayane_paz@gmail.com` / `Pazygor080@`
2. Escolher "VisionDay Academy"
3. Ver catálogo com 5 cursos
4. Usar filtros (busca, categoria, nível)
5. Clicar em um curso
6. Navegar pelas tabs
7. Expandir módulos
8. Voltar ao catálogo

---

## 🚧 Próximas Fases

### FASE 3 - Matrículas e Progresso
- [ ] Backend: Módulo de matrículas
- [ ] Backend: Módulo de progresso
- [ ] Frontend: Página "Meus Cursos"
- [ ] Frontend: Player de vídeo
- [ ] Frontend: Sistema de progresso

### FASE 4 - Certificados e Avaliações
- [ ] Backend: Geração de certificados
- [ ] Backend: Sistema de avaliações
- [ ] Frontend: Página de certificados
- [ ] Frontend: Formulário de avaliação

### FASE 5 - Recursos Avançados
- [ ] Anotações em aulas
- [ ] Fórum de discussão
- [ ] Gamificação (badges, pontos)
- [ ] Dashboard do instrutor

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o servidor backend está rodando
2. Verifique se o banco de dados está acessível
3. Veja os logs do console (F12)
4. Consulte a documentação do Prisma/NestJS/React

---

**Desenvolvido com ❤️ pela equipe VisionDay**
