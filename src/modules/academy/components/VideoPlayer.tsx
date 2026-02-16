/**
 * VISIONDAY ACADEMY - VIDEO PLAYER
 * Componente de player de vídeo com controles e salvamento de progresso
 */

import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';

interface VideoPlayerProps {
  url: string;
  startTime?: number;
  onProgress?: (currentTime: number) => void;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoSave?: boolean;
  saveInterval?: number; // em segundos
}

export function VideoPlayer({
  url,
  startTime = 0,
  onProgress,
  onComplete,
  onTimeUpdate,
  autoSave = true,
  saveInterval = 10,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const lastSavedTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Definir tempo inicial
    if (startTime > 0) {
      video.currentTime = startTime;
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      // Callback de atualização de tempo
      if (onTimeUpdate) {
        onTimeUpdate(current, video.duration);
      }

      // Auto save a cada X segundos
      if (autoSave && onProgress) {
        if (current - lastSavedTime.current >= saveInterval) {
          onProgress(current);
          lastSavedTime.current = current;
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
      // Salvar progresso final
      if (onProgress) {
        onProgress(video.currentTime);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
      // Salvar ao pausar
      if (onProgress) {
        onProgress(video.currentTime);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [url, startTime, onProgress, onComplete, onTimeUpdate, autoSave, saveInterval]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number | number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Array.isArray(value) ? value[0] : value;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number | number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Array.isArray(value) ? value[0] / 100 : value / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Vídeo */}
      <video
        ref={videoRef}
        src={url}
        className="w-full aspect-video"
        onClick={togglePlay}
      />

      {/* Controles */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Barra de progresso */}
        <div className="mb-4">
          <Slider
            value={currentTime}
            onChange={(e) => handleSeek(e.value)}
            max={duration}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles principais */}
        <div className="flex items-center justify-between gap-4">
          {/* Esquerda: Play/Pause */}
          <div className="flex items-center gap-2">
            <Button
              icon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              onClick={togglePlay}
              className="p-button-rounded p-button-text text-white"
            />
          </div>

          {/* Centro: Espaçador */}
          <div className="flex-1" />

          {/* Direita: Volume, Settings, Fullscreen */}
          <div className="flex items-center gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                icon={isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                onClick={toggleMute}
                className="p-button-rounded p-button-text text-white"
              />
              <div className="w-20 hidden sm:block">
                <Slider
                  value={isMuted ? 0 : volume * 100}
                  onChange={(e) => handleVolumeChange(e.value)}
                  max={100}
                  className="w-full"
                />
              </div>
            </div>

            {/* Settings */}
            <Button
              icon={<Settings className="w-5 h-5" />}
              className="p-button-rounded p-button-text text-white"
              tooltip="Configurações"
            />

            {/* Fullscreen */}
            <Button
              icon={<Maximize className="w-5 h-5" />}
              onClick={toggleFullscreen}
              className="p-button-rounded p-button-text text-white"
              tooltip="Tela cheia"
            />
          </div>
        </div>
      </div>

      {/* Play button overlay (quando pausado) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
            <Play className="w-16 h-16 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
