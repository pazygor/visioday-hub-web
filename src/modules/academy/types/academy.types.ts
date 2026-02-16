/**
 * VISIONDAY ACADEMY - TYPE DEFINITIONS
 * Tipos TypeScript para o sistema Academy
 */

// ============================================
// ENUMS (usando const como alternativa)
// ============================================

export const CursoNivel = {
  INICIANTE: 'INICIANTE',
  INTERMEDIARIO: 'INTERMEDIARIO',
  AVANCADO: 'AVANCADO',
} as const;

export type CursoNivel = typeof CursoNivel[keyof typeof CursoNivel];

export const CursoStatus = {
  RASCUNHO: 'RASCUNHO',
  PUBLICADO: 'PUBLICADO',
  ARQUIVADO: 'ARQUIVADO',
} as const;

export type CursoStatus = typeof CursoStatus[keyof typeof CursoStatus];

export const AulaTipo = {
  VIDEO: 'VIDEO',
  TEXTO: 'TEXTO',
  QUIZ: 'QUIZ',
  EXERCICIO: 'EXERCICIO',
} as const;

export type AulaTipo = typeof AulaTipo[keyof typeof AulaTipo];

export const MatriculaStatus = {
  ATIVA: 'ATIVA',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
  EXPIRADA: 'EXPIRADA',
} as const;

export type MatriculaStatus = typeof MatriculaStatus[keyof typeof MatriculaStatus];

// ============================================
// CATEGORIA
// ============================================

export interface AcademyCategoria {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
  ordem: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    cursos: number;
  };
}

// ============================================
// INSTRUTOR
// ============================================

export interface AcademyInstrutor {
  id: number;
  nome: string;
  email: string;
  bio: string | null;
  foto: string | null;
  especialidades: string[];
  redesSociais: Record<string, string> | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    cursos: number;
  };
}

// ============================================
// CURSO
// ============================================

export interface AcademyCurso {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  descricaoDetalhada: string | null;
  thumbnail: string | null;
  video_preview: string | null;
  nivel: CursoNivel;
  duracao_horas: number;
  preco: number;
  preco_promocional: number | null;
  categoriaId: number;
  instrutorId: number;
  tags: string[];
  objetivos: string[];
  requisitos: string[];
  publicoAlvo: string | null;
  certificado: boolean;
  destaque: boolean;
  publicado: boolean;
  status: CursoStatus;
  visualizacoes: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  totalAlunos: number;
  ordem: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  
  // Relacionamentos
  categoria?: AcademyCategoria;
  instrutor?: AcademyInstrutor;
  modulos?: AcademyModulo[];
}

// ============================================
// MÓDULO
// ============================================

export interface AcademyModulo {
  id: number;
  cursoId: number;
  titulo: string;
  descricao: string | null;
  ordem: number;
  duracao_horas: number;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  curso?: AcademyCurso;
  aulas?: AcademyAula[];
}

// ============================================
// AULA
// ============================================

export interface AcademyAula {
  id: number;
  moduloId: number;
  titulo: string;
  descricao: string | null;
  tipo: AulaTipo;
  conteudo: string | null;
  video_url: string | null;
  duracao_minutos: number;
  recursos: string[];
  ordem: number;
  gratuita: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  modulo?: AcademyModulo;
}

// ============================================
// MATRÍCULA
// ============================================

export interface AcademyMatricula {
  id: number;
  usuarioId: number;
  cursoId: number;
  status: MatriculaStatus;
  dataMatricula: string;
  dataInicio: string | null;
  dataConclusao: string | null;
  progressoGeral: number; // 0-100
  tempoAssistido: number; // em segundos
  ultimaAulaId: number | null;
  favorito: boolean;
  
  // Relacionamentos
  curso?: AcademyCurso;
  progressos?: AcademyProgresso[];
  certificado?: AcademyCertificado;
}

// ============================================
// PROGRESSO
// ============================================

export interface AcademyProgresso {
  id: number;
  matriculaId: number;
  aulaId: number;
  concluido: boolean;
  tempoAssistido: number; // em segundos
  ultimaPosicao: number; // posição do vídeo em segundos
  dataInicio: string | null;
  dataConclusao: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  matricula?: AcademyMatricula;
  aula?: AcademyAula;
}

// ============================================
// CERTIFICADO
// ============================================

export interface AcademyCertificado {
  id: number;
  matriculaId: number;
  codigo: string;
  dataEmissao: string;
  urlCertificado: string | null;
  validado: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  matricula?: AcademyMatricula;
}

// ============================================
// AVALIAÇÃO
// ============================================

export interface AcademyAvaliacao {
  id: number;
  matriculaId: number;
  cursoId: number;
  nota: number;
  comentario: string | null;
  aprovado: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  matricula?: AcademyMatricula;
  curso?: AcademyCurso;
}

// ============================================
// ANOTAÇÃO
// ============================================

export interface AcademyAnotacao {
  id: number;
  usuarioId: number;
  aulaId: number;
  conteudo: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  aula?: AcademyAula;
}

// ============================================
// DTOs e FILTROS
// ============================================

export interface CursoFilterParams {
  busca?: string;
  categoriaId?: number;
  nivel?: CursoNivel;
  precoMin?: number;
  precoMax?: number;
  destaque?: boolean;
  gratuito?: boolean;
  ordenarPor?: 'recente' | 'popular' | 'avaliacao' | 'titulo' | 'preco';
  ordem?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMatriculaDto {
  cursoId: number;
}

export interface UpdateMatriculaDto {
  favorito?: boolean;
}

export interface MatriculaStatsDto {
  cursosEmAndamento: number;
  cursosConcluidos: number;
  horasAssistidas: number;
  certificadosObtidos: number;
  progressoMedio: number;
}

export interface ContinueWatchingDto {
  matriculaId: number;
  cursoId: number;
  cursoTitulo: string;
  cursoThumbnail: string;
  cursoSlug: string;
  progressoGeral: number;
  ultimaAulaId: number | null;
  ultimaAulaTitulo: string | null;
  dataUltimoAcesso: string;
}

export interface UpdateProgressoDto {
  aulaId: number;
  ultimaPosicao?: number;
  tempoAssistido?: number;
  concluido?: boolean;
}

export interface ProgressoResponseDto {
  aulaId: number;
  concluido: boolean;
  tempoAssistido: number;
  ultimaPosicao: number;
  dataInicio: string | null;
  dataConclusao: string | null;
}

export interface CursoProgressoDto {
  matriculaId: number;
  cursoId: number;
  progressoGeral: number;
  totalAulas: number;
  aulasCompletas: number;
  tempoAssistido: number;
  aulas: ProgressoAulaDto[];
}

export interface ProgressoAulaDto {
  aulaId: number;
  moduloId: number;
  moduloTitulo: string;
  aulaTitulo: string;
  concluido: boolean;
  ultimaPosicao: number;
  ordem: number;
}

export interface ProximaAulaDto {
  aulaId: number;
  moduloId: number;
  titulo: string;
  tipo: string;
  duracao: number | null;
  conteudoUrl: string | null;
}

export interface CreateAvaliacaoDto {
  cursoId: number;
  nota: number;
  comentario?: string;
}

export interface CreateAnotacaoDto {
  aulaId: number;
  conteudo: string;
  timestamp: number;
}

// ============================================
// VIEW MODELS (para UI)
// ============================================

export interface CourseCardData {
  id: number;
  titulo: string;
  slug: string;
  thumbnail: string | null;
  nivel: CursoNivel;
  duracao_horas: number;
  preco: number;
  preco_promocional: number | null;
  avaliacaoMedia: number;
  totalAlunos: number;
  categoria: {
    nome: string;
    cor: string | null;
  };
  instrutor: {
    nome: string;
    foto: string | null;
  };
}

export interface CourseDetailsData extends AcademyCurso {
  categoria: AcademyCategoria;
  instrutor: AcademyInstrutor;
  modulos: (AcademyModulo & {
    aulas: AcademyAula[];
  })[];
  isEnrolled?: boolean;
  userProgress?: number;
}

export interface StudentProgress {
  matriculaId: number;
  cursoId: number;
  progresso: number;
  aulasCompletas: number;
  totalAulas: number;
  tempoTotal: number;
  ultimaAula: {
    id: number;
    titulo: string;
    moduloTitulo: string;
  } | null;
}
