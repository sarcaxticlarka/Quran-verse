/**
 * Quran Translations grouped by language
 * User-friendly format: Show language name, not scholar
 */

export interface TranslationOption {
  id: number;
  language: string;
  languageCode: string;
  flag: string;
  scholars: string; // For reference only
  name: string;
}

export const TRANSLATIONS_BY_LANGUAGE: Record<string, TranslationOption[]> = {
  'English': [
    { id: 131, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Saheeh International', name: 'English (Saheeh International)' },
    { id: 85, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Hilali & Khan', name: 'English (Hilali & Khan)' },
    { id: 33, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Yusuf Ali', name: 'English (Yusuf Ali)' },
    { id: 20, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Pickthall', name: 'English (Pickthall)' },
    { id: 95, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Dr. Ghali', name: 'English (Dr. Ghali)' },
    { id: 17, language: 'English', languageCode: 'en', flag: '🇺🇸', scholars: 'Arberry', name: 'English (Arberry)' },
  ],
  'Urdu': [
    { id: 54, language: 'Urdu', languageCode: 'ur', flag: '🇵🇰', scholars: 'Abul A\'ala Maududi', name: 'Urdu (Maududi)' },
    { id: 78, language: 'Urdu', languageCode: 'ur', flag: '🇵🇰', scholars: 'Muhammad Junagarhi', name: 'Urdu (Junagarhi)' },
  ],
  'French': [
    { id: 34, language: 'French', languageCode: 'fr', flag: '🇫🇷', scholars: 'Muhammad Hamidullah', name: 'French (Hamidullah)' },
  ],
  'German': [
    { id: 35, language: 'German', languageCode: 'de', flag: '🇩🇪', scholars: 'Max Henning', name: 'German (Henning)' },
  ],
  'Spanish': [
    { id: 36, language: 'Spanish', languageCode: 'es', flag: '🇪🇸', scholars: 'Julio Cortés', name: 'Spanish (Cortés)' },
  ],
  'Turkish': [
    { id: 50, language: 'Turkish', languageCode: 'tr', flag: '🇹🇷', scholars: 'Diyanet', name: 'Turkish (Diyanet)' },
  ],
  'Indonesian': [
    { id: 61, language: 'Indonesian', languageCode: 'id', flag: '🇮🇩', scholars: 'Ministry of Religious Affairs', name: 'Indonesian (Official)' },
  ],
  'Bangla': [
    { id: 32, language: 'Bangla', languageCode: 'bn', flag: '🇧🇩', scholars: 'Bangladesh Islamic Foundation', name: 'Bangla (BIF)' },
  ],
  'Russian': [
    { id: 125, language: 'Russian', languageCode: 'ru', flag: '🇷🇺', scholars: 'Transcontinental', name: 'Russian (Transcontinental)' },
  ],
  'Chinese Simplified': [
    { id: 145, language: 'Chinese (Simplified)', languageCode: 'zh', flag: '🇨🇳', scholars: 'Jian Kun', name: 'Chinese Simplified (Jian Kun)' },
  ],
};

// Flat array for easy access
export const ALL_TRANSLATIONS: TranslationOption[] = Object.values(TRANSLATIONS_BY_LANGUAGE).flat();

// Get default translation (English Saheeh International)
export const DEFAULT_TRANSLATION_ID = 131;

// Get translation by ID
export const getTranslationById = (id: number): TranslationOption | undefined => {
  return ALL_TRANSLATIONS.find(t => t.id === id);
};

// Get all languages
export const getLanguages = (): string[] => {
  return Object.keys(TRANSLATIONS_BY_LANGUAGE);
};

// Get translations for a specific language
export const getTranslationsByLanguage = (language: string): TranslationOption[] => {
  return TRANSLATIONS_BY_LANGUAGE[language] || [];
};
