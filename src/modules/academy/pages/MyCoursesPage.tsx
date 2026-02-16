/**
 * VISIONDAY ACADEMY - MY COURSES PAGE
 * Página de cursos matriculados do usuário
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, CheckCircle2, Heart, Loader2 } from 'lucide-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Message } from 'primereact/message';
import { getMyEnrollments, updateEnrollment } from '@/services/api/academy.api';
import type { AcademyMatricula } from '@/modules/academy/types/academy.types';

export function MyCoursesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<AcademyMatricula[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getMyEnrollments();
      setCursos(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite(matriculaId: number, currentFavorito: boolean) {
    try {
      await updateEnrollment(matriculaId, { favorito: !currentFavorito });
      // Atualizar localmente
      setCursos((prev) =>
        prev.map((c) =>
          c.id === matriculaId ? { ...c, favorito: !currentFavorito } : c
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  }

  function handleContinueCourse(curso: AcademyMatricula) {
    if (curso.ultimaAulaId) {
      navigate(`/academy/courses/${curso.curso?.slug}/watch/${curso.ultimaAulaId}`);
    } else {
      navigate(`/academy/catalog/${curso.curso?.slug}`);
    }
  }

  const cursosAtivos = cursos.filter((c) => c.status === 'ATIVA' && c.progressoGeral < 100);
  const cursosConcluidos = cursos.filter((c) => c.status === 'CONCLUIDA' || c.progressoGeral === 100);
  const cursosFavoritos = cursos.filter((c) => c.favorito);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
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
                Meus Cursos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie seus cursos e continue aprendendo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          {/* Tab: Em Andamento */}
          <TabPanel header={`Em Andamento (${cursosAtivos.length})`}>
            {cursosAtivos.length === 0 ? (
              <Message
                severity="info"
                text="Você ainda não iniciou nenhum curso. Explore o catálogo e comece a aprender!"
                className="w-full"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {cursosAtivos.map((matricula) => (
                  <CourseEnrollmentCard
                    key={matricula.id}
                    matricula={matricula}
                    onContinue={handleContinueCourse}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </TabPanel>

          {/* Tab: Concluídos */}
          <TabPanel header={`Concluídos (${cursosConcluidos.length})`}>
            {cursosConcluidos.length === 0 ? (
              <Message
                severity="info"
                text="Você ainda não concluiu nenhum curso. Continue estudando!"
                className="w-full"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {cursosConcluidos.map((matricula) => (
                  <CourseEnrollmentCard
                    key={matricula.id}
                    matricula={matricula}
                    onContinue={handleContinueCourse}
                    onToggleFavorite={handleToggleFavorite}
                    completed
                  />
                ))}
              </div>
            )}
          </TabPanel>

          {/* Tab: Favoritos */}
          <TabPanel header={`Favoritos (${cursosFavoritos.length})`}>
            {cursosFavoritos.length === 0 ? (
              <Message
                severity="info"
                text="Você ainda não marcou nenhum curso como favorito."
                className="w-full"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {cursosFavoritos.map((matricula) => (
                  <CourseEnrollmentCard
                    key={matricula.id}
                    matricula={matricula}
                    onContinue={handleContinueCourse}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: COURSE ENROLLMENT CARD
// ============================================

interface CourseEnrollmentCardProps {
  matricula: AcademyMatricula;
  onContinue: (matricula: AcademyMatricula) => void;
  onToggleFavorite: (matriculaId: number, currentFavorito: boolean) => void;
  completed?: boolean;
}

function CourseEnrollmentCard({
  matricula,
  onContinue,
  onToggleFavorite,
  completed = false,
}: CourseEnrollmentCardProps) {
  const curso = matricula.curso!;
  const horasAssistidas = Math.floor(matricula.tempoAssistido / 3600);

  const cardFooter = (
    <div className="flex gap-2">
      <Button
        label={completed ? 'Revisar' : 'Continuar'}
        icon="pi pi-play"
        onClick={() => onContinue(matricula)}
        className="flex-1"
      />
      <Button
        icon={matricula.favorito ? 'pi pi-heart-fill' : 'pi pi-heart'}
        onClick={() => onToggleFavorite(matricula.id, matricula.favorito)}
        className={matricula.favorito ? 'p-button-danger' : 'p-button-outlined'}
        tooltip={matricula.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      />
    </div>
  );

  return (
    <Card
      title={curso.titulo}
      subTitle={curso.categoria?.nome}
      footer={cardFooter}
      header={
        <div className="relative">
          <img
            src={curso.thumbnail || '/images/course-placeholder.png'}
            alt={curso.titulo}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {completed && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Concluído
            </div>
          )}
          {matricula.favorito && !completed && (
            <div className="absolute top-2 right-2">
              <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            </div>
          )}
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {/* Progresso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progresso
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {matricula.progressoGeral}%
            </span>
          </div>
          <ProgressBar
            value={matricula.progressoGeral}
            showValue={false}
            className="h-2"
          />
        </div>

        {/* Informações */}
        <div className="flex flex-wrap gap-2">
          <Chip
            label={curso.nivel}
            className="text-xs"
          />
          {horasAssistidas > 0 && (
            <Chip
              icon="pi pi-clock"
              label={`${horasAssistidas}h assistidas`}
              className="text-xs"
            />
          )}
        </div>

        {/* Instrutor */}
        {curso.instrutor && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{curso.instrutor.nome}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
