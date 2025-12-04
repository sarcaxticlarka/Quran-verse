'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl?: string;
  verseKey?: string;
  reciterName?: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export default function AudioPlayer({ 
  audioUrl, 
  verseKey = '',
  reciterName = 'Unknown Reciter',
  onTimeUpdate 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          setError('Failed to play audio');
          console.error('Play error:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      onTimeUpdate?.(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          🎵 Audio not available for {verseKey}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-100">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onVolumeChange={() => {}}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Reciter Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Reciter:</span> {reciterName}
        </p>
        <p className="text-xs text-gray-500">
          Verse: {verseKey}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 space-y-2">
        <div className="w-full bg-primary-200 rounded-full h-2 cursor-pointer hover:h-3 transition-all">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            onClick={(e) => {
              const rect = e.currentTarget.parentElement;
              if (rect) {
                const bounds = rect.getBoundingClientRect();
                const percent = (e.clientX - bounds.left) / bounds.width;
                handleSeek(Math.max(0, Math.min(percent * duration, duration)));
              }
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={isLoading || !audioUrl}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-full p-3 transition-colors w-12 h-12 flex items-center justify-center font-bold text-lg"
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : isPlaying ? (
            <span>⏸</span>
          ) : (
            <span>▶️</span>
          )}
        </button>

        {/* Time Display */}
        <div className="flex-1 mx-4 text-center">
          <span className="text-sm font-semibold text-gray-700">
            {formatTime(currentTime)} <span className="text-gray-500">/</span> {formatTime(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {isLoading && '⏳ Loading audio...'}
          {!isLoading && isPlaying && '🎵 Playing...'}
          {!isLoading && !isPlaying && audioUrl && '▶️ Ready to play'}
        </p>
      </div>
    </div>
  );
}
