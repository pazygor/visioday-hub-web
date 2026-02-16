/**
 * VISIONDAY ACADEMY - COURSE DETAILS PAGE
 * Página de detalhes do curso com tabs
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  Clock,
  Users,
  Star,
  Award,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Lock,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react';
import type { CourseDetailsData } from '../types/academy.types';
import { getCursoBySlug } from '@/services/api/academy.api';

export function CourseDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sobre' | 'conteudo' | 'instrutor'>('sobre');
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  async function loadCourse() {
    try {
      setLoading(true);
      setError(null);
      const data = await getCursoBySlug(slug!);
      setCourse(data);
      // Expande o primeiro módulo por padrão
      if (data.modulos && data.modulos.length > 0) {
        setExpandedModules({ [data.modulos[0].id]: true });
      }
    } catch (err) {
      console.error('Erro ao carregar curso:', err);
      setError('Erro ao carregar curso. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function toggleModule(moduleId: number) {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }

  function handleEnroll() {
    // TODO: Implementar matrícula
    alert('Funcionalidade de matrícula em desenvolvimento');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error || 'Curso não encontrado'}</p>
          <button
            onClick={() => navigate('/academy')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount = course.preco_promocional && course.preco_promocional < course.preco;
  const finalPrice = hasDiscount ? course.preco_promocional : course.preco;
  const totalAulas = course.modulos?.reduce((acc, mod) => acc + (mod.aulas?.length || 0), 0) || 0;

  const levelLabels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Botão voltar */}
          <button
            onClick={() => navigate('/academy')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao catálogo</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações principais */}
            <div className="lg:col-span-2 space-y-4">
              {/* Categoria e Nível */}
              <div className="flex items-center gap-3 flex-wrap">
                {course.categoria && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {course.categoria.nome}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {levelLabels[course.nivel]}
                </span>
                {course.destaque && (
                  <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm font-medium">
                    ⭐ Destaque
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl font-bold">{course.titulo}</h1>

              {/* Descrição */}
              <p className="text-lg text-white/90">{course.descricao}</p>

              {/* Metadados */}
              <div className="flex items-center gap-6 flex-wrap text-sm">
                {course.totalAvaliacoes > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.avaliacaoMedia.toFixed(1)}</span>
                    <span className="text-white/70">({course.totalAvaliacoes} avaliações)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.totalAlunos} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duracao_horas}h de conteúdo</span>
                </div>
                {course.certificado && (
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Certificado incluído</span>
                  </div>
                )}
              </div>

              {/* Instrutor */}
              {course.instrutor && (
                <div className="flex items-center gap-3 pt-4">
                  {course.instrutor.foto ? (
                    <img
                      src={course.instrutor.foto}
                      alt={course.instrutor.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {course.instrutor.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white/70">Instrutor</p>
                    <p className="font-medium">{course.instrutor.nome}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Card de compra */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4 sticky top-4">
                {/* Preview de vídeo ou imagem */}
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  {course.video_preview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors cursor-pointer">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Preço */}
                <div className="text-center py-2">
                  {finalPrice === 0 ? (
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      Gratuito
                    </p>
                  ) : (
                    <div>
                      {hasDiscount && (
                        <p className="text-lg text-gray-400 line-through">
                          R$ {course.preco.toFixed(2)}
                        </p>
                      )}
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        R$ {finalPrice!.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão de matrícula */}
                <button
                  onClick={handleEnroll}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {finalPrice === 0 ? 'Começar agora' : 'Matricular-se'}
                </button>

                {/* Informações do curso */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Módulos</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.modulos?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Aulas</span>
                    <span className="font-medium text-gray-900 dark:text-white">{totalAulas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duração total</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.duracao_horas}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Acesso</span>
                    <span className="font-medium text-gray-900 dark:text-white">Vitalício</span>
                  </div>
                  {course.certificado && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Certificado</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Incluído
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs e Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
              {[
                { id: 'sobre', label: 'Sobre o curso' },
                { id: 'conteudo', label: 'Conteúdo programático' },
                { id: 'instrutor', label: 'Instrutor' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Sobre */}
            {activeTab === 'sobre' && (
              <div className="space-y-6">
                {/* Descrição detalhada */}
                {course.descricaoDetalhada && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Descrição
                    </h2>
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.descricaoDetalhada }}
                    />
                  </div>
                )}

                {/* Objetivos */}
                {course.objetivos && course.objetivos.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      O que você vai aprender
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.objetivos.map((obj, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requisitos */}
                {course.requisitos && course.requisitos.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Requisitos
                    </h2>
                    <ul className="space-y-2">
                      {course.requisitos.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Público-alvo */}
                {course.publicoAlvo && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Para quem é este curso
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">{course.publicoAlvo}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Conteúdo */}
            {activeTab === 'conteudo' && (
              <div className="space-y-3">
                {course.modulos && course.modulos.length > 0 ? (
                  course.modulos.map((modulo, index) => (
                    <div
                      key={modulo.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Header do módulo */}
                      <button
                        onClick={() => toggleModule(modulo.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {expandedModules[modulo.id] ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Módulo {index + 1}: {modulo.titulo}
                            </h3>
                            {modulo.descricao && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {modulo.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {modulo.aulas?.length || 0} aulas • {modulo.duracao_horas}h
                        </div>
                      </button>

                      {/* Lista de aulas */}
                      {expandedModules[modulo.id] && modulo.aulas && modulo.aulas.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          {modulo.aulas.map((aula, aulaIndex) => (
                            <div
                              key={aula.id}
                              className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {aula.gratuita ? (
                                  <PlayCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {aulaIndex + 1}. {aula.titulo}
                                  </p>
                                  {aula.descricao && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                      {aula.descricao}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>{aula.duracao_minutos} min</span>
                                {aula.gratuita && (
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    Conteúdo programático não disponível
                  </p>
                )}
              </div>
            )}

            {/* Tab: Instrutor */}
            {activeTab === 'instrutor' && course.instrutor && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {course.instrutor.foto ? (
                    <img
                      src={course.instrutor.foto}
                      alt={course.instrutor.nome}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <span className="text-3xl font-medium text-indigo-600 dark:text-indigo-400">
                        {course.instrutor.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.instrutor.nome}
                    </h2>
                    {course.instrutor.especialidades &&
                      course.instrutor.especialidades.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.instrutor.especialidades.map((esp, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded"
                            >
                              {esp}
                            </span>
                          ))}
                        </div>
                      )}
                    {course.instrutor.bio && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {course.instrutor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (vazio por enquanto, pode adicionar cursos relacionados) */}
          <div className="lg:col-span-1 hidden lg:block">
            {/* Futuramente: cursos relacionados, avaliações recentes, etc */}
          </div>
        </div>
      </div>
    </div>
  );
}
