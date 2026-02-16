/**
 * VISIONDAY ACADEMY - COURSE CARD
 * Card de curso para exibição no catálogo
 */

import { Link } from 'react-router-dom';
import { Clock, Users, Star, TrendingUp } from 'lucide-react';
import type { AcademyCurso } from '../types/academy.types';
import { cn } from '@/utils/cn';

interface CourseCardProps {
  course: AcademyCurso;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  // Converter Decimal para Number (Prisma retorna Decimal como string)
  const preco = course.preco ? Number(course.preco) : 0;
  const precoPromocional = course.preco_promocional ? Number(course.preco_promocional) : null;
  
  const hasDiscount = precoPromocional && preco && precoPromocional < preco;
  const finalPrice = hasDiscount ? precoPromocional : preco;
  const discountPercent = hasDiscount && preco
    ? Math.round(((preco - precoPromocional!) / preco) * 100)
    : 0;

  const levelColors = {
    INICIANTE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    INTERMEDIARIO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    AVANCADO: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const levelLabels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return (
    <Link
      to={`/academy/cursos/${course.slug}`}
      className={cn(
        'group block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
        'border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-white/30" />
          </div>
        )}

        {/* Badge de destaque */}
        {course.destaque && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
            ⭐ Destaque
          </div>
        )}

        {/* Badge de desconto */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}

        {/* Nível */}
        <div className="absolute bottom-3 left-3">
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              levelColors[course.nivel]
            )}
          >
            {levelLabels[course.nivel]}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-3">
        {/* Categoria */}
        {course.categoria && (
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-1 rounded"
              style={{
                backgroundColor: course.categoria.cor
                  ? `${course.categoria.cor}20`
                  : undefined,
                color: course.categoria.cor || undefined,
              }}
            >
              {course.categoria.nome}
            </span>
          </div>
        )}

        {/* Título */}
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {course.titulo}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {course.descricao}
        </p>

        {/* Instrutor */}
        {course.instrutor && (
          <div className="flex items-center gap-2">
            {course.instrutor.foto ? (
              <img
                src={course.instrutor.foto}
                alt={course.instrutor.nome}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {course.instrutor.nome.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.instrutor.nome}
            </span>
          </div>
        )}

        {/* Metadados */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duracao_horas}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.totalAlunos}</span>
          </div>
          {course.totalAvaliacoes > 0 && course.avaliacaoMedia && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{Number(course.avaliacaoMedia).toFixed(1)}</span>
              <span className="text-xs">({course.totalAvaliacoes})</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          {finalPrice === 0 ? (
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              Gratuito
            </span>
          ) : (
            <div className="flex items-baseline gap-2">
              {hasDiscount && preco > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  R$ {preco.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                R$ {finalPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
