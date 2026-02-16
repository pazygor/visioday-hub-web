/**
 * VISIONDAY ACADEMY - CATALOG PAGE
 * Página de catálogo de cursos com filtros e paginação
 */

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { CourseFilters } from '../components/CourseFilters';
import type { AcademyCurso, CursoFilterParams, PaginatedResponse } from '../types/academy.types';
import { getCursos } from '@/services/api/academy.api';

const INITIAL_FILTERS: CursoFilterParams = {
  page: 1,
  limit: 12,
  ordenarPor: 'recente',
  ordem: 'desc',
};

export function CatalogPage() {
  const [courses, setCourses] = useState<AcademyCurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CursoFilterParams>(INITIAL_FILTERS);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  useEffect(() => {
    loadCourses();
  }, [filters]);

  async function loadCourses() {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Carregando cursos com filtros:', filters);
      const response: PaginatedResponse<AcademyCurso> = await getCursos(filters);
      console.log('✅ Resposta da API:', response);
      setCourses(response.data);
      setPagination(response.meta);
    } catch (err) {
      console.error('❌ Erro ao carregar cursos:', err);
      setError('Erro ao carregar cursos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(newFilters: CursoFilterParams) {
    setFilters(newFilters);
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function handlePageChange(newPage: number) {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Catálogo de Cursos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore nossa coleção de cursos de contabilidade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <CourseFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Contador de resultados */}
        {!loading && !error && (
          <div className="mt-6 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pagination.total === 0 ? (
                'Nenhum curso encontrado'
              ) : (
                <>
                  Mostrando{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pagination.total}
                  </span>{' '}
                  {pagination.total === 1 ? 'curso' : 'cursos'}
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
            <button
              onClick={loadCourses}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de cursos */}
        {!loading && !error && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Mostra primeira, última, atual e vizinhas
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Adiciona "..." entre páginas não consecutivas
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;

                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="text-gray-400 dark:text-gray-600">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              page === pagination.page
                                ? 'bg-indigo-600 text-white'
                                : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {/* Sem resultados */}
        {!loading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
