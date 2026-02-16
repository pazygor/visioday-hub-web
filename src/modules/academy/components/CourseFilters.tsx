/**
 * VISIONDAY ACADEMY - COURSE FILTERS
 * Componente de filtros para o catálogo de cursos
 */

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { CursoFilterParams, AcademyCategoria } from '../types/academy.types';
import { CursoNivel } from '../types/academy.types';
import { getCategorias } from '@/services/api/academy.api';

interface CourseFiltersProps {
  filters: CursoFilterParams;
  onFilterChange: (filters: CursoFilterParams) => void;
  onReset: () => void;
}

export function CourseFilters({ filters, onFilterChange, onReset }: CourseFiltersProps) {
  const [categorias, setCategorias] = useState<AcademyCategoria[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  async function loadCategorias() {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  const handleSearchChange = (busca: string) => {
    onFilterChange({ ...filters, busca, page: 1 });
  };

  const handleCategoriaChange = (categoriaId: number | undefined) => {
    onFilterChange({ ...filters, categoriaId, page: 1 });
  };

  const handleNivelChange = (nivel: typeof CursoNivel[keyof typeof CursoNivel] | undefined) => {
    onFilterChange({ ...filters, nivel, page: 1 });
  };

  const handlePrecoChange = (precoMin: number | undefined, precoMax: number | undefined) => {
    onFilterChange({ ...filters, precoMin, precoMax, page: 1 });
  };

  const handleGratuitoChange = (gratuito: boolean | undefined) => {
    onFilterChange({ ...filters, gratuito, page: 1 });
  };

  const handleDestaqueChange = (destaque: boolean | undefined) => {
    onFilterChange({ ...filters, destaque, page: 1 });
  };

  const handleSortChange = (ordenarPor: typeof filters.ordenarPor) => {
    onFilterChange({ ...filters, ordenarPor, page: 1 });
  };

  const hasActiveFilters =
    filters.categoriaId ||
    filters.nivel ||
    filters.precoMin !== undefined ||
    filters.precoMax !== undefined ||
    filters.gratuito ||
    filters.destaque;

  return (
    <div className="space-y-4">
      {/* Barra de busca e ordenação */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={filters.busca || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Ordenação */}
        <select
          value={filters.ordenarPor || 'recente'}
          onChange={(e) => handleSortChange(e.target.value as typeof filters.ordenarPor)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="recente">Mais recentes</option>
          <option value="popular">Mais populares</option>
          <option value="avaliacao">Melhor avaliados</option>
          <option value="titulo">Ordem alfabética</option>
          <option value="preco">Menor preço</option>
        </select>

        {/* Botão de filtros mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">
              {[
                filters.categoriaId,
                filters.nivel,
                filters.precoMin !== undefined || filters.precoMax !== undefined,
                filters.gratuito,
                filters.destaque,
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filtros avançados */}
      <div
        className={`${
          showFilters ? 'block' : 'hidden'
        } sm:block space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filtros
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              value={filters.categoriaId || ''}
              onChange={(e) =>
                handleCategoriaChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nível
            </label>
            <select
              value={filters.nivel || ''}
              onChange={(e) =>
                handleNivelChange(
                  e.target.value
                    ? (e.target.value as typeof CursoNivel[keyof typeof CursoNivel])
                    : undefined
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value={CursoNivel.INICIANTE}>Iniciante</option>
              <option value={CursoNivel.INTERMEDIARIO}>Intermediário</option>
              <option value={CursoNivel.AVANCADO}>Avançado</option>
            </select>
          </div>

          {/* Preço mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço mín.
            </label>
            <input
              type="number"
              min="0"
              step="10"
              placeholder="R$ 0"
              value={filters.precoMin || ''}
              onChange={(e) =>
                handlePrecoChange(
                  e.target.value ? Number(e.target.value) : undefined,
                  filters.precoMax
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Preço máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço máx.
            </label>
            <input
              type="number"
              min="0"
              step="10"
              placeholder="R$ 999"
              value={filters.precoMax || ''}
              onChange={(e) =>
                handlePrecoChange(
                  filters.precoMin,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.gratuito || false}
              onChange={(e) => handleGratuitoChange(e.target.checked || undefined)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Apenas gratuitos</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.destaque || false}
              onChange={(e) => handleDestaqueChange(e.target.checked || undefined)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Em destaque</span>
          </label>
        </div>
      </div>
    </div>
  );
}
