'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ReflectionModal from './ReflectionModal';
import { Verse } from '@/types';

export default function VerseOfDay() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  const { data, error, isLoading } = useSWR('verse-of-day', () => api.getVerseOfDay());

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 text-center">Failed to load verse of the day</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const verse = data?.data?.verse;

  if (!verse) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800 text-center">No verse available</p>
      </div>
    );
  }

  const handleReflect = () => {
    setSelectedVerse(verse);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Verse of the Day</h2>
            {data?.cached && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Cached
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Surah {verse.chapter_id}, Ayah {verse.verse_number} ({verse.verse_key})
          </p>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-arabic text-right leading-loose text-gray-900 mb-6">
            {verse.text_uthmani}
          </p>

          {verse.translations && verse.translations.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                {verse.translations[0].text}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleReflect}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Reflection
          </button>
        </div>
      </div>

      {showModal && selectedVerse && (
        <ReflectionModal
          verse={selectedVerse}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
