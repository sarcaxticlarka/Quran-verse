'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ReflectionModal from './ReflectionModal';
import { Verse } from '@/types';
import { Globe, BookOpen, PenLine } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { id: 149, language: 'English' }, // Fadel Soliman, Bridges' translation
  { id: 54, language: 'Urdu' },
];

export default function VerseOfDay() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('149'); // Default to English (ID 149)
  const [translationText, setTranslationText] = useState('');
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const { data, error, isLoading } = useSWR('verse-of-day', () => api.getVerseOfDay());
  const verse = data?.data?.verse;

  useEffect(() => {
    if (!verse) return;

    const loadTranslation = async () => {
      setLoadingTranslation(true);
      try {
        console.log('Fetching translation for:', verse.verse_key, 'Language:', selectedLanguage);
        
        // Fetch translation directly from Quran.com API using by_key endpoint
        // This ensures we get the EXACT verse requested
        const response = await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${verse.verse_key}?translations=${selectedLanguage}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translation: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Quran.com API response:', data);
        
        if (data.verse && data.verse.translations && data.verse.translations.length > 0) {
          const translation = data.verse.translations[0];
          if (translation && translation.text) {
            const cleanText = translation.text.replace(/<[^>]*>/g, '');
            setTranslationText(cleanText);
            console.log('✅ Translation loaded for language:', selectedLanguage);
          } else {
            setTranslationText('Translation not available');
            console.warn('⚠️ No translation found in verse');
          }
        } else {
          setTranslationText('Translation not available');
          console.error('❌ No verses or translations in response');
        }
      } catch (err) {
        console.error('❌ Failed to load translation:', err);
        setTranslationText('Error loading translation. Please try again.');
      } finally {
        setLoadingTranslation(false);
      }
    };

    loadTranslation();
  }, [selectedLanguage, verse]);

  if (error) {
    return <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"><p className="text-red-800 dark:text-red-400 text-center">Failed to load verse</p></div>;
  }

  if (isLoading) {
    return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div></div>;
  }

  if (!verse) {
    return <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"><p className="text-yellow-800 dark:text-yellow-400 text-center">No verse available</p></div>;
  }

  const handleReflect = () => {
    setSelectedVerse(verse);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-8 mb-6 border border-emerald-200 dark:border-emerald-800">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verse of the Day</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Surah {verse.chapter_id}, Ayah {verse.verse_number}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-arabic text-right leading-loose text-gray-900 dark:text-white">{verse.text_uthmani}</p>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <Globe className="w-4 h-4" />
            Choose Translation Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(String(lang.id))}
                className={`px-4 py-3 rounded-lg transition-all text-center font-medium border-2 ${
                  String(selectedLanguage) === String(lang.id)
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                }`}
              >
                <div className="text-sm font-medium">{lang.language}</div>
              </button>
            ))}
          </div>
        </div>

        {loadingTranslation ? (
          <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg animate-pulse"><div className="h-20 bg-gray-200 dark:bg-gray-600 rounded"></div></div>
        ) : (
          <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-emerald-500">
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">{translationText}</p>
          </div>
        )}

        <button
          onClick={handleReflect}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <PenLine className="w-5 h-5" />
          Write Reflection
        </button>
      </div>

      {showModal && selectedVerse && (
        <ReflectionModal
          verse={selectedVerse}
          translationText={translationText}
          selectedTranslation={selectedLanguage}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
