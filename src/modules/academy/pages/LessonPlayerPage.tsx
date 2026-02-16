/**
 * VISIONDAY ACADEMY - LESSON PLAYER PAGE
 * Página de reprodução de aulas com player e playlist
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Message } from 'primereact/message';
import { VideoPlayer } from '../components/VideoPlayer';
import {
  getEnrollmentByCourse,
  getCourseProgress,
  updateProgress,
  markLessonComplete,
  getCursoBySlug,
} from '@/services/api/academy.api';
import type {
  AcademyMatricula,
  CursoProgressoDto,
  CourseDetailsData,
  AcademyAula,
} from '@/modules/academy/types/academy.types';

export function LessonPlayerPage() {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [matricula, setMatricula] = useState<AcademyMatricula | null>(null);
  const [curso, setCurso] = useState<CourseDetailsData | null>(null);
  const [progresso, setProgresso] = useState<CursoProgressoDto | null>(null);
  const [currentLesson, setCurrentLesson] = useState<AcademyAula | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [courseSlug, lessonId]);

  async function loadData() {
    if (!courseSlug || !lessonId) return;

    try {
      setLoading(true);
      setError(null);

      // Carregar curso
      const cursoData = await getCursoBySlug(courseSlug);
      setCurso(cursoData);

      // Carregar matrícula
      const matriculaData = await getEnrollmentByCourse(cursoData.id);
      setMatricula(matriculaData);

      // Carregar progresso
      const progressoData = await getCourseProgress(matriculaData.id);
      setProgresso(progressoData);

      // Encontrar aula atual
      let foundLesson: AcademyAula | null = null;
      for (const modulo of cursoData.modulos || []) {
        const aula = modulo.aulas?.find((a) => a.id === Number(lessonId));
        if (aula) {
          foundLesson = aula;
          break;
        }
      }

      if (!foundLesson) {
        setError('Aula não encontrada');
        return;
      }

      setCurrentLesson(foundLesson);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar aula');
    } finally {
      setLoading(false);
    }
  }

  async function handleProgress(currentTime: number) {
    if (!matricula || !currentLesson) return;

    try {
      await updateProgress(matricula.id, {
        aulaId: currentLesson.id,
        ultimaPosicao: Math.floor(currentTime),
      });
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  }

  async function handleComplete() {
    if (!matricula || !currentLesson) return;

    try {
      await markLessonComplete(matricula.id, currentLesson.id);
      // Recarregar progresso
      const progressoData = await getCourseProgress(matricula.id);
      setProgresso(progressoData);
    } catch (err) {
      console.error('Erro ao marcar como concluída:', err);
    }
  }

  async function handleMarkComplete() {
    if (!matricula || !currentLesson) return;

    try {
      await markLessonComplete(matricula.id, currentLesson.id);
      const progressoData = await getCourseProgress(matricula.id);
      setProgresso(progressoData);
    } catch (err) {
      console.error('Erro ao marcar como concluída:', err);
    }
  }

  function handleSelectLesson(aulaId: number) {
    navigate(`/academy/courses/${courseSlug}/watch/${aulaId}`);
  }

  function handlePrevLesson() {
    if (!curso || !currentLesson) return;

    const allLessons: AcademyAula[] = [];
    curso.modulos?.forEach((m) => {
      m.aulas?.forEach((a) => allLessons.push(a));
    });

    const currentIndex = allLessons.findIndex((a) => a.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      handleSelectLesson(prevLesson.id);
    }
  }

  function handleNextLesson() {
    if (!curso || !currentLesson) return;

    const allLessons: AcademyAula[] = [];
    curso.modulos?.forEach((m) => {
      m.aulas?.forEach((a) => allLessons.push(a));
    });

    const currentIndex = allLessons.findIndex((a) => a.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      handleSelectLesson(nextLesson.id);
    }
  }

  const isLessonComplete = progresso?.aulas.find((a) => a.aulaId === currentLesson?.id)?.concluido || false;
  const lessonProgress = progresso?.aulas.find((a) => a.aulaId === currentLesson?.id);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Message severity="error" text={error} />
      </div>
    );
  }

  if (!currentLesson || !curso || !progresso) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Player Section */}
      <div className="flex-1 bg-black">
        <div className="container mx-auto">
          {/* Video Player */}
          <VideoPlayer
            url={currentLesson.video_url || ''}
            startTime={lessonProgress?.ultimaPosicao || 0}
            onProgress={handleProgress}
            onComplete={handleComplete}
            autoSave
            saveInterval={10}
          />

          {/* Lesson Info */}
          <div className="bg-white dark:bg-gray-800 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentLesson.titulo}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentLesson.descricao}
            </p>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                label="Anterior"
                icon={<ChevronLeft className="w-4 h-4" />}
                onClick={handlePrevLesson}
                className="p-button-outlined"
              />
              <Button
                label={isLessonComplete ? 'Concluída' : 'Marcar como concluída'}
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={handleMarkComplete}
                disabled={isLessonComplete}
                className={isLessonComplete ? 'p-button-success' : ''}
              />
              <Button
                label="Próxima"
                icon={<ChevronRight className="w-4 h-4" />}
                iconPos="right"
                onClick={handleNextLesson}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        {/* Course Progress */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {curso.titulo}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progresso do curso</span>
              <span className="font-bold text-indigo-600">{progresso.progressoGeral}%</span>
            </div>
            <ProgressBar value={progresso.progressoGeral} showValue={false} />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {progresso.aulasCompletas} de {progresso.totalAulas} aulas concluídas
            </div>
          </div>
        </div>

        {/* Modules & Lessons */}
        <div className="p-4">
          <Accordion multiple activeIndex={[0]}>
            {curso.modulos?.map((modulo) => (
              <AccordionTab
                key={modulo.id}
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-medium">{modulo.titulo}</span>
                    <span className="text-sm text-gray-500">
                      {modulo.aulas?.length} aulas
                    </span>
                  </div>
                }
              >
                <div className="space-y-2">
                  {modulo.aulas?.map((aula) => {
                    const isComplete = progresso.aulas.find((a) => a.aulaId === aula.id)?.concluido;
                    const isCurrent = aula.id === currentLesson.id;

                    return (
                      <button
                        key={aula.id}
                        onClick={() => handleSelectLesson(aula.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-indigo-100 dark:bg-indigo-900/30'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : aula.gratuita ? (
                              <PlayCircle className="w-5 h-5 text-gray-400" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {aula.titulo}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {aula.duracao_minutos ? `${aula.duracao_minutos} min` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
