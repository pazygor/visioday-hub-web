/**
 * VISIONDAY ACADEMY - API SERVICE
 * Serviço para comunicação com backend da Academy
 */

import httpClient from '../httpClient';
import type {
  AcademyCurso,
  AcademyCategoria,
  AcademyMatricula,
  AcademyProgresso,
  AcademyAvaliacao,
  AcademyAnotacao,
  AcademyCertificado,
  CursoFilterParams,
  PaginatedResponse,
  CreateMatriculaDto,
  UpdateMatriculaDto,
  UpdateProgressoDto,
  CreateAvaliacaoDto,
  CreateAnotacaoDto,
  CourseDetailsData,
  StudentProgress,
  MatriculaStatsDto,
  ContinueWatchingDto,
  ProgressoResponseDto,
  CursoProgressoDto,
  ProximaAulaDto,
  DashboardStatsDto,
  DashboardCourseDto,
  RecommendedCourseDto,
} from '@/modules/academy/types/academy.types';

const BASE_PATH = '/academy';

// ============================================
// CURSOS
// ============================================

/**
 * Lista todos os cursos com filtros e paginação
 */
export async function getCursos(
  filters?: CursoFilterParams
): Promise<PaginatedResponse<AcademyCurso>> {
  const params = new URLSearchParams();

  if (filters?.busca) params.append('busca', filters.busca);
  if (filters?.categoriaId) params.append('categoriaId', filters.categoriaId.toString());
  if (filters?.nivel) params.append('nivel', filters.nivel);
  if (filters?.precoMin !== undefined) params.append('precoMin', filters.precoMin.toString());
  if (filters?.precoMax !== undefined) params.append('precoMax', filters.precoMax.toString());
  if (filters?.destaque !== undefined) params.append('destaque', filters.destaque.toString());
  if (filters?.gratuito !== undefined) params.append('gratuito', filters.gratuito.toString());
  if (filters?.ordenarPor) params.append('ordenarPor', filters.ordenarPor);
  if (filters?.ordem) params.append('ordem', filters.ordem);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const url = `${BASE_PATH}/cursos${queryString ? `?${queryString}` : ''}`;

  return httpClient.get<PaginatedResponse<AcademyCurso>>(url);
}

/**
 * Busca cursos em destaque
 */
export async function getCursosDestaque(): Promise<AcademyCurso[]> {
  return httpClient.get<AcademyCurso[]>(`${BASE_PATH}/cursos/destaque`);
}

/**
 * Busca detalhes de um curso por slug
 */
export async function getCursoBySlug(slug: string): Promise<CourseDetailsData> {
  return httpClient.get<CourseDetailsData>(`${BASE_PATH}/cursos/slug/${slug}`);
}

/**
 * Busca detalhes de um curso por ID
 */
export async function getCursoById(id: number): Promise<CourseDetailsData> {
  return httpClient.get<CourseDetailsData>(`${BASE_PATH}/cursos/${id}`);
}

// ============================================
// CATEGORIAS
// ============================================
// CATEGORIAS
// ============================================

/**
 * Lista todas as categorias
 */
export async function getCategorias(): Promise<AcademyCategoria[]> {
  return httpClient.get<AcademyCategoria[]>(`${BASE_PATH}/categorias`);
}

/**
 * Busca categoria por slug
 */
export async function getCategoriaBySlug(slug: string): Promise<AcademyCategoria> {
  return httpClient.get<AcademyCategoria>(`${BASE_PATH}/categorias/slug/${slug}`);
}

/**
 * Busca categoria por ID
 */
export async function getCategoriaById(id: number): Promise<AcademyCategoria> {
  return httpClient.get<AcademyCategoria>(`${BASE_PATH}/categorias/${id}`);
}

// ============================================
// MATRÍCULAS
// ============================================

/**
 * Matricula o usuário em um curso
 */
export async function enrollCourse(data: CreateMatriculaDto): Promise<AcademyMatricula> {
  return httpClient.post<AcademyMatricula>(`${BASE_PATH}/matriculas`, data);
}

/**
 * Lista matrículas do usuário logado
 */
export async function getMyEnrollments(
  status?: string,
  favorito?: boolean
): Promise<AcademyMatricula[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (favorito !== undefined) params.append('favorito', favorito.toString());
  
  const queryString = params.toString();
  const url = `${BASE_PATH}/matriculas${queryString ? `?${queryString}` : ''}`;
  
  return httpClient.get<AcademyMatricula[]>(url);
}

/**
 * Busca estatísticas do usuário
 */
export async function getMatriculaStats(): Promise<MatriculaStatsDto> {
  return httpClient.get<MatriculaStatsDto>(`${BASE_PATH}/matriculas/stats`);
}

/**
 * Busca cursos para continuar assistindo
 */
export async function getContinueWatching(limit?: number): Promise<ContinueWatchingDto[]> {
  const params = limit ? `?limit=${limit}` : '';
  return httpClient.get<ContinueWatchingDto[]>(`${BASE_PATH}/matriculas/continue-watching${params}`);
}

/**
 * Verifica se está matriculado em um curso
 */
export async function checkEnrollment(cursoId: number): Promise<{ isEnrolled: boolean }> {
  return httpClient.get<{ isEnrolled: boolean }>(`${BASE_PATH}/matriculas/check/${cursoId}`);
}

/**
 * Busca matrícula por curso
 */
export async function getEnrollmentByCourse(cursoId: number): Promise<AcademyMatricula> {
  return httpClient.get<AcademyMatricula>(`${BASE_PATH}/matriculas/curso/${cursoId}`);
}

/**
 * Busca detalhes de uma matrícula
 */
export async function getEnrollmentById(id: number): Promise<AcademyMatricula> {
  return httpClient.get<AcademyMatricula>(`${BASE_PATH}/matriculas/${id}`);
}

/**
 * Atualiza matrícula (favorito)
 */
export async function updateEnrollment(
  id: number,
  data: UpdateMatriculaDto
): Promise<AcademyMatricula> {
  return httpClient.patch<AcademyMatricula>(`${BASE_PATH}/matriculas/${id}`, data);
}

/**
 * Cancela uma matrícula
 */
export async function cancelEnrollment(id: number): Promise<void> {
  await httpClient.delete(`${BASE_PATH}/matriculas/${id}`);
}

// ============================================
// PROGRESSO
// ============================================

/**
 * Atualiza progresso de uma aula
 */
export async function updateProgress(
  matriculaId: number,
  data: UpdateProgressoDto
): Promise<ProgressoResponseDto> {
  return httpClient.post<ProgressoResponseDto>(
    `${BASE_PATH}/progresso/${matriculaId}`,
    data
  );
}

/**
 * Marca aula como concluída
 */
export async function markLessonComplete(
  matriculaId: number,
  aulaId: number
): Promise<ProgressoResponseDto> {
  return httpClient.put<ProgressoResponseDto>(
    `${BASE_PATH}/progresso/${matriculaId}/complete`,
    { aulaId }
  );
}

/**
 * Busca progresso completo de um curso
 */
export async function getCourseProgress(matriculaId: number): Promise<CursoProgressoDto> {
  return httpClient.get<CursoProgressoDto>(
    `${BASE_PATH}/progresso/${matriculaId}`
  );
}

/**
 * Busca progresso de uma aula específica
 */
export async function getLessonProgress(
  matriculaId: number,
  aulaId: number
): Promise<ProgressoResponseDto | null> {
  return httpClient.get<ProgressoResponseDto | null>(
    `${BASE_PATH}/progresso/${matriculaId}/aula/${aulaId}`
  );
}

/**
 * Busca próxima aula a ser assistida
 */
export async function getNextLesson(matriculaId: number): Promise<ProximaAulaDto | null> {
  return httpClient.get<ProximaAulaDto | null>(
    `${BASE_PATH}/progresso/${matriculaId}/next-lesson`
  );
}

/**
 * Busca progresso do aluno em um curso (legacy - manter compatibilidade)
 */
export async function getStudentProgress(matriculaId: number): Promise<StudentProgress> {
  const progresso = await getCourseProgress(matriculaId);
  
  return {
    matriculaId: progresso.matriculaId,
    cursoId: progresso.cursoId,
    progresso: progresso.progressoGeral,
    aulasCompletas: progresso.aulasCompletas,
    totalAulas: progresso.totalAulas,
    tempoTotal: progresso.tempoAssistido,
    ultimaAula: null, // TODO: implementar se necessário
  };
}

// ============================================
// AVALIAÇÕES
// ============================================

/**
 * Cria avaliação de um curso
 */
export async function createAvaliacao(data: CreateAvaliacaoDto): Promise<AcademyAvaliacao> {
  return httpClient.post<AcademyAvaliacao>(`${BASE_PATH}/avaliacoes`, data);
}

/**
 * Lista avaliações de um curso
 */
export async function getAvaliacoesByCurso(cursoId: number): Promise<AcademyAvaliacao[]> {
  return httpClient.get<AcademyAvaliacao[]>(
    `${BASE_PATH}/cursos/${cursoId}/avaliacoes`
  );
}

/**
 * Atualiza avaliação
 */
export async function updateAvaliacao(
  id: number,
  data: Partial<CreateAvaliacaoDto>
): Promise<AcademyAvaliacao> {
  return httpClient.patch<AcademyAvaliacao>(`${BASE_PATH}/avaliacoes/${id}`, data);
}

/**
 * Remove avaliação
 */
export async function deleteAvaliacao(id: number): Promise<void> {
  await httpClient.delete(`${BASE_PATH}/avaliacoes/${id}`);
}

// ============================================
// ANOTAÇÕES
// ============================================

/**
 * Cria anotação em uma aula
 */
export async function createAnotacao(data: CreateAnotacaoDto): Promise<AcademyAnotacao> {
  return httpClient.post<AcademyAnotacao>(`${BASE_PATH}/anotacoes`, data);
}

/**
 * Lista anotações de uma aula
 */
export async function getAnotacoesByAula(aulaId: number): Promise<AcademyAnotacao[]> {
  return httpClient.get<AcademyAnotacao[]>(
    `${BASE_PATH}/aulas/${aulaId}/anotacoes`
  );
}

/**
 * Lista todas as anotações do usuário em um curso
 */
export async function getAnotacoesByCurso(cursoId: number): Promise<AcademyAnotacao[]> {
  return httpClient.get<AcademyAnotacao[]>(
    `${BASE_PATH}/cursos/${cursoId}/anotacoes`
  );
}

/**
 * Atualiza anotação
 */
export async function updateAnotacao(
  id: number,
  conteudo: string
): Promise<AcademyAnotacao> {
  return httpClient.patch<AcademyAnotacao>(
    `${BASE_PATH}/anotacoes/${id}`,
    { conteudo }
  );
}

/**
 * Remove anotação
 */
export async function deleteAnotacao(id: number): Promise<void> {
  await httpClient.delete(`${BASE_PATH}/anotacoes/${id}`);
}

// ============================================
// CERTIFICADOS
// ============================================

/**
 * Gera certificado de conclusão
 */
export async function generateCertificate(matriculaId: number): Promise<AcademyCertificado> {
  return httpClient.post<AcademyCertificado>(
    `${BASE_PATH}/matriculas/${matriculaId}/certificado`
  );
}

/**
 * Busca certificado por código
 */
export async function getCertificateByCodigo(codigo: string): Promise<AcademyCertificado> {
  return httpClient.get<AcademyCertificado>(
    `${BASE_PATH}/certificados/${codigo}`
  );
}

/**
 * Lista certificados do usuário
 */
export async function getMyCertificates(): Promise<AcademyCertificado[]> {
  return httpClient.get<AcademyCertificado[]>(`${BASE_PATH}/certificados/meus`);
}

/**
 * Valida certificado
 */
export async function validateCertificate(codigo: string): Promise<boolean> {
  const response = await httpClient.get<{ valido: boolean }>(
    `${BASE_PATH}/certificados/${codigo}/validar`
  );
  return response.valido;
}

// ============================================
// BUSCA E ESTATÍSTICAS
// ============================================

/**
 * Busca global por cursos
 */
export async function searchCursos(query: string): Promise<AcademyCurso[]> {
  return httpClient.get<AcademyCurso[]>(
    `${BASE_PATH}/cursos/buscar?q=${encodeURIComponent(query)}`
  );
}

/**
 * Busca estatísticas gerais da Academy
 */
export async function getAcademyStats(): Promise<{
  totalCursos: number;
  totalAlunos: number;
  totalAulas: number;
  horasConteudo: number;
}> {
  return httpClient.get(`${BASE_PATH}/estatisticas`);
}

/**
 * Busca estatísticas do aluno
 */
export async function getStudentStats(): Promise<{
  cursosMatriculados: number;
  cursosConcluidos: number;
  horasAssistidas: number;
  certificadosObtidos: number;
  proximaAula: {
    cursoId: number;
    cursoTitulo: string;
    aulaId: number;
    aulaTitulo: string;
  } | null;
}> {
  return httpClient.get(`${BASE_PATH}/aluno/estatisticas`);
}

/**
 * Busca cursos recomendados para o aluno
 */
export async function getRecommendedCourses(): Promise<AcademyCurso[]> {
  return httpClient.get<AcademyCurso[]>(`${BASE_PATH}/cursos/recomendados`);
}

// ============================================
// DASHBOARD
// ============================================

/**
 * Buscar estatísticas do dashboard
 */
export async function getDashboardStats(): Promise<DashboardStatsDto> {
  return httpClient.get(`${BASE_PATH}/dashboard/stats`);
}

/**
 * Buscar cursos para continuar assistindo
 */
export async function getDashboardContinueWatching(limit: number = 4): Promise<DashboardCourseDto[]> {
  return httpClient.get(`${BASE_PATH}/dashboard/continue-watching?limit=${limit}`);
}

/**
 * Buscar cursos recomendados
 */
export async function getDashboardRecommended(limit: number = 4): Promise<RecommendedCourseDto[]> {
  return httpClient.get(`${BASE_PATH}/dashboard/recommended?limit=${limit}`);
}
