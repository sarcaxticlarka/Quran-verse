'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Verse, Reflection } from '@/types';

interface ReflectionModalProps {
  verse: Verse;
  onClose: () => void;
}

export default function ReflectionModal({ verse, onClose }: ReflectionModalProps) {
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userId = process.env.NEXT_PUBLIC_USER_ID || 'default-user';

  const {
    data: reflectionsData,
    error: fetchError,
    mutate,
  } = useSWR(`reflections-${verse.verse_key}`, () =>
    api.getReflectionsByVerseKey(verse.verse_key)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reflectionText.trim()) {
      setError('Please enter your reflection');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.createReflection({
        user_id: userId,
        verse_key: verse.verse_key,
        reflection_text: reflectionText,
      });

      setReflectionText('');
      mutate(); // Refresh the reflections list
    } catch (err) {
      setError('Failed to save reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reflections = reflectionsData?.data || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reflections</h3>
              <p className="text-sm text-gray-600 mt-1">
                Verse {verse.verse_key}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Verse Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-arabic text-right leading-loose text-gray-900 mb-3">
              {verse.text_uthmani}
            </p>
            {verse.translations && verse.translations.length > 0 && (
              <p className="text-sm text-gray-700 leading-relaxed border-t pt-3">
                {verse.translations[0].text}
              </p>
            )}
          </div>

          {/* Reflection Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reflection
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your thoughts and reflections on this verse..."
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Reflection'}
            </button>
          </form>

          {/* Previous Reflections */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Previous Reflections ({reflections.length})
            </h4>

            {fetchError && (
              <p className="text-red-600 text-sm">Failed to load reflections</p>
            )}

            {reflections.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No reflections yet. Be the first to add one!
              </p>
            ) : (
              <div className="space-y-4">
                {reflections.map((reflection: Reflection) => (
                  <div
                    key={reflection.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-gray-800 mb-2">{reflection.reflection_text}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reflection.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
