'use client';

import React, { useState, useRef, useEffect } from 'react';

// Types for chapter audio with segments
interface AudioSegment {
  word_index: number;
  start_ms: number;
  end_ms: number;
}

interface VerseTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments?: AudioSegment[];
}

interface ChapterAudioData {
  audio_file: {
    id: number;
    chapter_id: number;
    file_size: number;
    format: string;
    audio_url: string;
    duration: number;
  };
  verse_timings?: VerseTimestamp[];
}

interface ChapterAudioPlayerProps {
  reciterId: number;
  chapterNumber: number;
  chapterName?: string;
  includeSegments?: boolean;
  onVerseChange?: (verseKey: string) => void;
}

export default function ChapterAudioPlayer({
  reciterId,
  chapterNumber,
  chapterName = `Chapter ${chapterNumber}`,
  includeSegments = false,
  onVerseChange,
}: ChapterAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<ChapterAudioData | null>(null);
  const [currentVerse, setCurrentVerse] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<number | null>(null);

  // Fetch chapter audio data
  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/chapter-audio/${reciterId}/${chapterNumber}${
          includeSegments ? '?segments=true' : ''
        }`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to load audio data');
        }

        const result = await response.json();
        setAudioData(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching audio:', err);
        setError(err instanceof Error ? err.message : 'Failed to load audio');
        setLoading(false);
      }
    };

    fetchAudioData();
  }, [reciterId, chapterNumber, includeSegments]);

  // Set audio source when data is loaded
  useEffect(() => {
    if (audioData && audioRef.current) {
      audioRef.current.src = audioData.audio_file.audio_url;
      audioRef.current.volume = volume;
    }
  }, [audioData, volume]);

  // Track current verse and word based on playback time
  useEffect(() => {
    if (!audioData?.verse_timings || !audioRef.current) return;

    const currentTimeMs = currentTime * 1000;

    // Find current verse
    const verse = audioData.verse_timings.find(
      (v) => currentTimeMs >= v.timestamp_from && currentTimeMs <= v.timestamp_to
    );

    if (verse) {
      if (currentVerse !== verse.verse_key) {
        setCurrentVerse(verse.verse_key);
        onVerseChange?.(verse.verse_key);
      }

      // Find current word if segments are available
      if (includeSegments && verse.segments) {
        const word = verse.segments.find(
          (s) => currentTimeMs >= s.start_ms && currentTimeMs <= s.end_ms
        );
        if (word) {
          setCurrentWord(word.word_index);
        }
      }
    }
  }, [currentTime, audioData, currentVerse, includeSegments, onVerseChange]);

  // Audio event handlers
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Jump to specific verse
  const jumpToVerse = (verseKey: string) => {
    if (!audioData?.verse_timings || !audioRef.current) return;

    const verse = audioData.verse_timings.find((v) => v.verse_key === verseKey);
    if (verse) {
      audioRef.current.currentTime = verse.timestamp_from / 1000;
      setCurrentTime(verse.timestamp_from / 1000);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading chapter audio...</p>
        </div>
      </div>
    );
  }

  if (error || !audioData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
        <p className="text-red-600 dark:text-red-400">⚠️ {error || 'Failed to load audio'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 space-y-4">
      {/* Chapter Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {chapterName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Full Chapter Recitation • {formatTime(audioData.audio_file.duration)}
          </p>
        </div>
        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
          <p>{audioData.audio_file.format.toUpperCase()}</p>
          <p>{formatFileSize(audioData.audio_file.file_size)}</p>
        </div>
      </div>

      {/* Current Verse Display */}
      {currentVerse && (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border-l-4 border-emerald-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">Now Playing:</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            Verse {currentVerse}
            {currentWord !== null && includeSegments && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 ml-2">
                (Word {currentWord})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={() => setError('Failed to load audio file')}
        preload="metadata"
      />

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${
              (currentTime / duration) * 100
            }%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Verse Timeline (if available) */}
      {audioData.verse_timings && audioData.verse_timings.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Jump to Verse:
          </p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {audioData.verse_timings.map((verse) => (
              <button
                key={verse.verse_key}
                onClick={() => jumpToVerse(verse.verse_key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentVerse === verse.verse_key
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="font-medium">{verse.verse_key}</span>
                <span className="ml-2 text-xs opacity-75">
                  {formatTime(verse.timestamp_from / 1000)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Segments Info */}
      {includeSegments && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
          <p className="text-blue-800 dark:text-blue-300">
            ℹ️ Word-level segments enabled for precise Tajweed learning
          </p>
        </div>
      )}
    </div>
  );
}
