/**
 * VISIONDAY ACADEMY - COURSE FILTERS
 * Componente de filtros para o catálogo de cursos com PrimeReact
 */

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Panel } from 'primereact/panel';
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

  const handleCategoriaChange = (categoriaId: number | null | undefined | 'ALL') => {
    // Se for valor sentinela ou nulo, remove o filtro
    const newCategoriaId = categoriaId === 'ALL' || categoriaId === null ? undefined : categoriaId;
    onFilterChange({ ...filters, categoriaId: newCategoriaId, page: 1 });
  };

  const handleNivelChange = (nivel: typeof CursoNivel[keyof typeof CursoNivel] | null | undefined | '') => {
    // Se for string vazia ou null, remove o filtro
    const newNivel = nivel === '' || nivel === null ? undefined : nivel;
    onFilterChange({ ...filters, nivel: newNivel, page: 1 });
  };

  const handlePrecoMinChange = (value: number | null | undefined) => {
    onFilterChange({
      ...filters,
      precoMin: value !== null && value !== undefined ? value : undefined,
      page: 1,
    });
  };

  const handlePrecoMaxChange = (value: number | null | undefined) => {
    onFilterChange({
      ...filters,
      precoMax: value !== null && value !== undefined ? value : undefined,
      page: 1,
    });
  };

  const handleGratuitoChange = (checked: boolean) => {
    onFilterChange({ ...filters, gratuito: checked || undefined, page: 1 });
  };

  const handleDestaqueChange = (checked: boolean) => {
    onFilterChange({ ...filters, destaque: checked || undefined, page: 1 });
  };

  const handleSortChange = (ordenarPor: typeof filters.ordenarPor) => {
    onFilterChange({ ...filters, ordenarPor, page: 1 });
  };

  const sortOptions = [
    { label: 'Mais recentes', value: 'recente' },
    { label: 'Mais populares', value: 'popular' },
    { label: 'Melhor avaliados', value: 'avaliacao' },
    { label: 'Ordem alfabética', value: 'titulo' },
    { label: 'Menor preço', value: 'preco' },
  ];

  const categoriaOptions = [
    { label: 'Todas as categorias', value: 'ALL' },
    ...categorias.map((cat) => ({ label: cat.nome, value: cat.id })),
  ];

  const nivelOptions = [
    { label: 'Todos os níveis', value: '' },
    { label: 'Iniciante', value: CursoNivel.INICIANTE },
    { label: 'Intermediário', value: CursoNivel.INTERMEDIARIO },
    { label: 'Avançado', value: CursoNivel.AVANCADO },
  ];

  const hasActiveFilters =
    filters.categoriaId ||
    filters.nivel ||
    filters.precoMin !== undefined ||
    filters.precoMax !== undefined ||
    filters.gratuito ||
    filters.destaque;

  const activeFilterCount = [
    filters.categoriaId,
    filters.nivel,
    filters.precoMin !== undefined || filters.precoMax !== undefined,
    filters.gratuito,
    filters.destaque,
  ].filter(Boolean).length;

  // Função para formatar o label do nível
  const getNivelLabel = (nivel: string) => {
    switch (nivel) {
      case CursoNivel.INICIANTE:
        return 'Iniciante';
      case CursoNivel.INTERMEDIARIO:
        return 'Intermediário';
      case CursoNivel.AVANCADO:
        return 'Avançado';
      default:
        return nivel;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca e ordenação */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca com PrimeReact */}
        <div className="flex-1">
          <span className="p-input-icon-left w-full">
            <Search className="w-4 h-4" />
            <InputText
              value={filters.busca || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar cursos..."
              className="w-full"
            />
          </span>
        </div>

        {/* Ordenação com PrimeReact Dropdown */}
        <div className="w-full sm:w-64">
          <Dropdown
            value={filters.ordenarPor || 'recente'}
            options={sortOptions}
            onChange={(e) => handleSortChange(e.value)}
            placeholder="Ordenar por"
            className="w-full"
          />
        </div>

        {/* Botão de filtros mobile */}
        <Button
          label="Filtros"
          icon="pi pi-filter"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden"
          badge={activeFilterCount > 0 ? activeFilterCount.toString() : undefined}
          badgeClassName="p-badge-danger"
        />
      </div>

      {/* Filtros avançados com Panel */}
      <Panel
        header={
          <div 
            className="flex items-center justify-between w-full cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filtros Avançados</span>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount} ativo${activeFilterCount > 1 ? 's' : ''}`}
                  className="p-chip-sm bg-indigo-100 text-indigo-700"
                />
              )}
            </div>
            {hasActiveFilters && (
              <Button
                label="Limpar filtros"
                icon="pi pi-times"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="p-button-text p-button-sm p-button-danger"
                text
              />
            )}
          </div>
        }
        toggleable
        collapsed={!showFilters}
        onToggle={(e) => setShowFilters(!e.value)}
        className={showFilters ? '' : 'hidden sm:block'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <Dropdown
              value={filters.categoriaId ?? 'ALL'}
              options={categoriaOptions}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => handleCategoriaChange(e.value)}
              placeholder="Selecione"
              className="w-full"
              showClear={filters.categoriaId !== undefined}
              filter
              filterBy="label"
              filterPlaceholder="Buscar categoria"
            />
          </div>

          {/* Nível */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nível de Dificuldade
            </label>
            <Dropdown
              value={filters.nivel || ''}
              options={nivelOptions}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => handleNivelChange(e.value)}
              placeholder="Selecione"
              className="w-full"
              showClear={filters.nivel !== undefined}
            />
          </div>

          {/* Preço Mínimo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço Mínimo
            </label>
            <InputNumber
              value={filters.precoMin || null}
              onValueChange={(e) => handlePrecoMinChange(e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="R$ 0,00"
              className="w-full"
              min={0}
            />
          </div>

          {/* Preço Máximo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço Máximo
            </label>
            <InputNumber
              value={filters.precoMax || null}
              onValueChange={(e) => handlePrecoMaxChange(e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="R$ 1.000,00"
              className="w-full"
              min={0}
            />
          </div>

          {/* Checkboxes - Gratuito e Destaque */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId="gratuito"
                  checked={filters.gratuito || false}
                  onChange={(e) => handleGratuitoChange(e.checked || false)}
                />
                <label
                  htmlFor="gratuito"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Apenas cursos gratuitos
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  inputId="destaque"
                  checked={filters.destaque || false}
                  onChange={(e) => handleDestaqueChange(e.checked || false)}
                />
                <label
                  htmlFor="destaque"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Em destaque
                </label>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Tags de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.categoriaId && (
            <Chip
              label={`Categoria: ${categorias.find((c) => c.id === filters.categoriaId)?.nome || 'Desconhecida'}`}
              removable
              onRemove={() => {
                handleCategoriaChange(undefined);
                return true;
              }}
              className="bg-blue-100 text-blue-700"
            />
          )}
          {filters.nivel && (
            <Chip
              label={`Nível: ${getNivelLabel(filters.nivel)}`}
              removable
              onRemove={() => {
                handleNivelChange(undefined);
                return true;
              }}
              className="bg-green-100 text-green-700"
            />
          )}
          {(filters.precoMin !== undefined || filters.precoMax !== undefined) && (
            <Chip
              label={`Preço: R$ ${filters.precoMin || 0} - R$ ${filters.precoMax || '∞'}`}
              removable
              onRemove={() => {
                onFilterChange({ ...filters, precoMin: undefined, precoMax: undefined, page: 1 });
                return true;
              }}
              className="bg-purple-100 text-purple-700"
            />
          )}
          {filters.gratuito && (
            <Chip
              label="Gratuito"
              removable
              onRemove={() => {
                handleGratuitoChange(false);
                return true;
              }}
              className="bg-emerald-100 text-emerald-700"
            />
          )}
          {filters.destaque && (
            <Chip
              label="Em destaque"
              removable
              onRemove={() => {
                handleDestaqueChange(false);
                return true;
              }}
              className="bg-amber-100 text-amber-700"
            />
          )}
        </div>
      )}
    </div>
  );
}
