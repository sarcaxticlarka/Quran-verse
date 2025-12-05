'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Verse, Reflection } from '@/types';
import { GoogleSignInButton } from './GoogleSignInButton';
import { LogOut, PenLine, BookOpen, Calendar } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface ReflectionModalProps {
  verse: Verse;
  onClose: () => void;
  translationText?: string;
  selectedTranslation?: string;
}

export default function ReflectionModal({ verse, onClose, translationText, selectedTranslation }: ReflectionModalProps) {
  const { data: session, status } = useSession();
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // Use session user email or default user ID
  const userId = session?.user?.email || process.env.NEXT_PUBLIC_USER_ID || 'default-user';

  const {
    data: reflectionsData,
    error: fetchError,
    mutate,
  } = useSWR(
    session ? `reflections-${verse.verse_key}` : null,
    () => api.getReflectionsByVerseKey(verse.verse_key)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setShowLoginMessage(true);
      return;
    }

    if (!reflectionText.trim()) {
      setError('Please enter your reflection');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Sync user to database
      if (session.user?.email) {
        await api.syncGoogleUser({
          email: session.user.email,
          name: session.user.name || '',
          google_id: (session.user as any).id || 'unknown',
          profile_image: session.user.image || undefined,
        });
      }

      // Create reflection with user email
      await api.createReflection({
        user_id: userId,
        verse_key: verse.verse_key,
        reflection_text: reflectionText,
        translation_id: selectedTranslation ? Number(selectedTranslation) : undefined,
      });

      setReflectionText('');
      setShowLoginMessage(false);
      mutate(); // Refresh the reflections list
      console.log('✅ Reflection saved and user synced');
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Failed to save reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reflections = reflectionsData?.data || [];
  const isLoading = status === 'loading';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-primary-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gold-100">
        <div className="p-6 border-b border-gold-200 sticky top-0 bg-primary-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <PenLine className="w-6 h-6 text-accent-500" />
              <div>
                <h3 className="text-xl font-display font-bold text-primary-800">Reflections</h3>
                <p className="text-sm text-primary-700 mt-1">
                  Verse {verse.verse_key}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-primary-600 hover:text-primary-800 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Verse Display */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-gold-100 shadow">
            <p className="text-2xl font-arabic text-right leading-loose text-primary-900 mb-3">
              {verse.text_uthmani}
            </p>
            {verse.translations && verse.translations.length > 0 && (
              <p className="text-sm text-primary-800 leading-relaxed border-t border-gold-100 pt-3">
                {verse.translations[0].text}
              </p>
            )}
          </div>

          {/* User Authentication Status */}
          {!isLoading && (
            <div className="mb-6 p-4 bg-gold-100 border border-gold-300 rounded-lg">
              {session ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-900">
                      Logged in as: {session.user?.name || session.user?.email}
                    </p>
                    <p className="text-xs text-primary-700 mt-1">
                      Your reflections will be saved to your account
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-primary-700 hover:text-primary-900 hover:bg-gold-200 rounded transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-primary-900 mb-3">
                    Sign in to save your reflections
                  </p>
                  <GoogleSignInButton onSuccess={() => setShowLoginMessage(false)} />
                </div>
              )}
            </div>
          )}

          {/* Reflection Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm font-medium text-primary-800 mb-2 flex items-center gap-2">
              <PenLine className="w-5 h-5 text-accent-500" />
              Your Reflection
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white text-primary-900"
              rows={4}
              placeholder={session ? "Share your thoughts and reflections on this verse..." : "Sign in to write reflections"}
              disabled={isSubmitting || !session}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">Error: {error}</p>
            )}
            {showLoginMessage && !session && (
              <p className="text-amber-700 text-sm mt-2 flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Please sign in with Google to save your reflection
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !session}
              className="mt-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              <PenLine className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : session ? 'Save Reflection' : 'Sign in to Save'}
            </button>
          </form>

          {/* Previous Reflections */}
          <div>
            <h4 className="text-lg font-display font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-700" />
              Previous Reflections ({reflections.length})
            </h4>

            {fetchError && (
              <p className="text-red-600 text-sm">Failed to load reflections</p>
            )}

            {!session && reflections.length === 0 ? (
              <p className="text-primary-700 text-sm italic">
                Sign in to view reflections
              </p>
            ) : reflections.length === 0 ? (
              <p className="text-primary-700 text-sm italic">
                No reflections yet. Be the first to add one!
              </p>
            ) : (
              <div className="space-y-4">
                {reflections.map((reflection: Reflection) => (
                  <div
                    key={reflection.id}
                    className="p-4 bg-white rounded-lg border border-gold-100 shadow hover:shadow-md transition"
                  >
                    <p className="text-primary-900 mb-2 font-medium">{reflection.reflection_text}</p>
                    <p className="text-xs text-primary-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
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
