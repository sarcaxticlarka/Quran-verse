'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ReflectionModal from './ReflectionModal';
import { Verse } from '@/types';
import { BookOpen, Star, PenLine } from 'lucide-react';

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
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-400 text-center">Failed to load verse</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-yellow-800 dark:text-yellow-400 text-center">No verse available</p>
      </div>
    );
  }

  const handleReflect = () => {
    setSelectedVerse(verse);
  };

  return (
    <div className="bg-primary-50 rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gold-100">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-7 h-7 text-primary-700" />
        <h2 className="text-2xl font-display font-bold text-primary-800">Verse of the Day</h2>
        <Star className="w-6 h-6 text-gold-500" />
      </div>
      {loadingTranslation ? (
        <div className="text-primary-600">Loading translation...</div>
      ) : (
        <div className="space-y-2">
          <div className="text-lg font-arabic text-right text-primary-900 leading-loose">
            {verse.text_uthmani}
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-700">
            <Star className="w-4 h-4 text-gold-500" />
            <span>{LANGUAGE_OPTIONS.find(l => l.id.toString() === selectedLanguage)?.language}</span>
          </div>
          <div className="text-base text-primary-800 mt-2">
            {translationText}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              className="bg-gold-100 hover:bg-gold-300 text-primary-900 px-3 py-1 rounded transition text-sm flex items-center gap-1 border border-gold-500 shadow"
              onClick={() => setShowModal(true)}
            >
              <PenLine className="w-5 h-5 text-accent-500" /> Reflect
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2 mt-4">
        {LANGUAGE_OPTIONS.map(option => (
          <button
            key={option.id}
            className={`px-3 py-1 rounded text-sm font-semibold border transition ${selectedLanguage === option.id.toString() ? 'bg-primary-600 text-white border-gold-500' : 'bg-gold-100 text-primary-800 border-gold-300'}`}
            onClick={() => setSelectedLanguage(option.id.toString())}
          >
            {option.language}
          </button>
        ))}
      </div>
      {showModal && verse && (
        <ReflectionModal verse={verse} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
