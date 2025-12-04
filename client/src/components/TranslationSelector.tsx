'use client';

import { useState } from 'react';

export enum TranslationLanguage {
  ENGLISH = '131',
  ARABIC = '21',
  URDU = '54',
  FRENCH = '66',
  GERMAN = '73',
  TURKISH = '77',
  CHINESE = '57',
  SPANISH = '12',
  RUSSIAN = '85',
  BENGALI = '112',
  BOSNIAN = '92',
  THAI = '76'
}

interface TranslationOption {
  id: string;
  name: string;
  language: string;
  flag: string;
}

interface TranslationSelectorProps {
  onSelect: (translationId: string) => void;
  selected: string;
}

const TRANSLATIONS: TranslationOption[] = [
  { id: TranslationLanguage.ENGLISH, name: 'English', language: 'en', flag: '🇬🇧' },
  { id: TranslationLanguage.URDU, name: 'اردو', language: 'ur', flag: '🇵🇰' },
  { id: TranslationLanguage.ARABIC, name: 'العربية', language: 'ar', flag: '🇸🇦' },
  { id: TranslationLanguage.FRENCH, name: 'Français', language: 'fr', flag: '🇫🇷' },
  { id: TranslationLanguage.GERMAN, name: 'Deutsch', language: 'de', flag: '🇩🇪' },
  { id: TranslationLanguage.TURKISH, name: 'Türkçe', language: 'tr', flag: '🇹🇷' },
  { id: TranslationLanguage.SPANISH, name: 'Español', language: 'es', flag: '🇪🇸' },
  { id: TranslationLanguage.RUSSIAN, name: 'Русский', language: 'ru', flag: '🇷🇺' },
  { id: TranslationLanguage.CHINESE, name: '中文', language: 'zh', flag: '🇨🇳' },
  { id: TranslationLanguage.BENGALI, name: 'বাংলা', language: 'bn', flag: '🇧🇩' },
  { id: TranslationLanguage.BOSNIAN, name: 'Bosanski', language: 'bs', flag: '🇧🇦' },
  { id: TranslationLanguage.THAI, name: 'ไทย', language: 'th', flag: '🇹🇭' },
];

export default function TranslationSelector({ 
  onSelect, 
  selected 
}: TranslationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTranslation = TRANSLATIONS.find(t => t.id === selected);

  return (
    <div className="relative inline-block w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Translation
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{selectedTranslation?.flag}</span>
          <span>{selectedTranslation?.name}</span>
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="grid grid-cols-2 gap-2 p-3 max-h-96 overflow-y-auto">
            {TRANSLATIONS.map((translation) => (
              <button
                key={translation.id}
                onClick={() => {
                  onSelect(translation.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 rounded-lg text-left transition-all flex items-center gap-2 ${
                  selected === translation.id
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{translation.flag}</span>
                <span>{translation.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
