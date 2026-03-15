import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { getDashboardStats, getDashboardContinueWatching, getDashboardRecommended } from '@/services/api/academy.api';
import type { DashboardStatsDto, DashboardCourseDto, RecommendedCourseDto } from '@/modules/academy/types/academy.types';

export const AcademyDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [continueWatching, setContinueWatching] = useState<DashboardCourseDto[]>([]);
  const [recommended, setRecommended] = useState<RecommendedCourseDto[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, continueData, recommendedData] = await Promise.all([
        getDashboardStats(),
        getDashboardContinueWatching(4),
        getDashboardRecommended(4),
      ]);
      
      setStats(statsData);
      setContinueWatching(continueData);
      setRecommended(recommendedData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueCourse = (courseSlug: string, lessonId?: number) => {
    if (lessonId) {
      navigate(`/academy/courses/${courseSlug}/watch/${lessonId}`);
    } else {
      navigate(`/academy/courses/${courseSlug}`);
    }
  };

  const handleViewCourse = (courseSlug: string) => {
    navigate(`/academy/courses/${courseSlug}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo ao VisionDay Academy 🎓
        </h1>
        <p className="text-blue-100 text-lg">
          Continue sua jornada de aprendizado
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Em Andamento</p>
              <p className="text-3xl font-bold text-blue-900">
                {loading ? '...' : stats?.cursosEmAndamento || 0}
              </p>
            </div>
            <i className="pi pi-book text-4xl text-blue-300"></i>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Concluídos</p>
              <p className="text-3xl font-bold text-green-900">
                {loading ? '...' : stats?.cursosConcluidos || 0}
              </p>
            </div>
            <i className="pi pi-check-circle text-4xl text-green-300"></i>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Horas Assistidas</p>
              <p className="text-3xl font-bold text-purple-900">
                {loading ? '...' : Math.round((stats?.horasAssistidas || 0) * 10) / 10}
              </p>
            </div>
            <i className="pi pi-clock text-4xl text-purple-300"></i>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Certificados</p>
              <p className="text-3xl font-bold text-yellow-900">
                {loading ? '...' : stats?.certificados || 0}
              </p>
            </div>
            <i className="pi pi-star-fill text-4xl text-yellow-300"></i>
          </div>
        </Card>
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Continuar Assistindo</h2>
            <Button
              label="Ver Todos"
              icon="pi pi-arrow-right"
              iconPos="right"
              text
              onClick={() => navigate('/academy/courses')}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {continueWatching.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="pi pi-play-circle text-6xl text-gray-400"></i>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Tag
                        value={`${Math.round(course.progresso)}%`}
                        severity="info"
                        className="font-semibold"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {course.titulo}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="pi pi-tag"></i>
                    <span>{course.categoria}</span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <ProgressBar
                      value={course.progresso}
                      showValue={false}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {course.aulasCompletas} de {course.totalAulas} aulas
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    label="Continuar"
                    icon="pi pi-play"
                    className="w-full"
                    onClick={() => handleContinueCourse(course.slug, course.ultimaAulaId ?? undefined)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recomendados para Você</h2>
            <Button
              label="Explorar Catálogo"
              icon="pi pi-arrow-right"
              iconPos="right"
              text
              onClick={() => navigate('/academy/catalog')}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommended.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="pi pi-book text-6xl text-gray-400"></i>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Tag
                        value={course.nivel}
                        severity={
                          course.nivel === 'INICIANTE'
                            ? 'success'
                            : course.nivel === 'INTERMEDIARIO'
                            ? 'warning'
                            : 'danger'
                        }
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {course.titulo}
                  </h3>

                  {/* Category & Instructor */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-tag"></i>
                      <span>{course.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-user"></i>
                      <span>{course.instrutor}</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>⭐ {course.avaliacaoMedia.toFixed(1)}</span>
                    <span>{course.totalAlunos} alunos</span>
                  </div>

                  {/* Action Button */}
                  <Button
                    label="Ver Curso"
                    icon="pi pi-eye"
                    outlined
                    className="w-full"
                    onClick={() => handleViewCourse(course.slug)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && continueWatching.length === 0 && recommended.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <i className="pi pi-book text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Comece sua Jornada de Aprendizado
          </h3>
          <p className="text-gray-500 mb-6">
            Explore nosso catálogo de cursos e inicie sua capacitação profissional
          </p>
          <Button
            label="Explorar Cursos"
            icon="pi pi-search"
            size="large"
            onClick={() => navigate('/academy/catalog')}
          />
        </div>
      )}
    </div>
  );
};
