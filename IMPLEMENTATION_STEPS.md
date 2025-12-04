# 📖 Step-by-Step Implementation Guide: Translation & Audio Features

## ✅ Phase 1: Multi-Language Translation Support

### Step 1: Update Backend API Service ✅ (DONE)

The `quranApiService.ts` has been enhanced with:

```typescript
// Now supports translation parameter
async getRandomVerse(translationId: string = '131', reciterId: string = 'ar.alafasy')

// New methods added:
async getTranslations()      // Get all available translations
async getReciters()          // Get all available reciters  
async getChapters()          // Get all Quran chapters
async getChapterVerses()     // Get verses from a chapter
```

### Step 2: Update Backend Controllers

Create `GET /api/translations` endpoint:

```typescript
// server/src/controllers/translationController.ts
import { Request, Response } from 'express';
import quranApiService from '../services/quranApiService';
import cacheService from '../services/cacheService';

const TRANSLATIONS_CACHE_KEY = 'translations_list';
const TRANSLATIONS_TTL = 86400 * 7; // 7 days

export const getAvailableTranslations = async (req: Request, res: Response) => {
  try {
    // Check cache first
    let translations = cacheService.get(TRANSLATIONS_CACHE_KEY);

    if (!translations) {
      console.log('📥 Fetching translations from API');
      translations = await quranApiService.getTranslations();
      
      // Cache for 7 days
      cacheService.set(TRANSLATIONS_CACHE_KEY, translations, TRANSLATIONS_TTL);
    }

    res.status(200).json({
      success: true,
      message: 'Translations retrieved successfully',
      data: translations,
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve translations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAvailableReciters = async (req: Request, res: Response) => {
  try {
    // Check cache first
    let reciters = cacheService.get('reciters_list');

    if (!reciters) {
      console.log('📥 Fetching reciters from API');
      reciters = await quranApiService.getReciters();
      
      // Cache for 30 days
      cacheService.set('reciters_list', reciters, 86400 * 30);
    }

    res.status(200).json({
      success: true,
      message: 'Reciters retrieved successfully',
      data: reciters,
    });
  } catch (error) {
    console.error('Error fetching reciters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reciters',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
```

### Step 3: Update Routes

Add to `server/src/routes/index.ts`:

```typescript
import translationController from '../controllers/translationController';

router.get('/api/translations', translationController.getAvailableTranslations);
router.get('/api/reciters', translationController.getAvailableReciters);
router.get('/api/chapters', translationController.getAvailableChapters);
```

### Step 4: Create Frontend Components ✅ (DONE)

Components created:
- ✅ `TranslationSelector.tsx` - Multi-language dropdown with 12 languages
- ✅ `ReciterSelector.tsx` - Reciter selector with details
- ✅ `AudioPlayer.tsx` - Full-featured audio player

### Step 5: Update Frontend Types

Update `client/src/types/index.ts`:

```typescript
export interface Verse {
  id: number;
  verse_number: number;
  chapter_id: number;
  verse_key: string;
  text_uthmani: string;
  translations?: Translation[];
  audio?: {
    url: string;
    duration?: number;
  };
  words?: {
    id: number;
    position: number;
    text: string;
    translation: {
      text: string;
    };
  }[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  resource_name?: string;
  language?: string;
}

export interface Chapter {
  id: number;
  name: string;
  arabic_name: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
  revelation_order: number;
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  country?: string;
}
```

### Step 6: Update Frontend API Client

Update `client/src/lib/api.ts`:

```typescript
import axios from 'axios';
import * as Types from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = {
  // ... existing methods ...

  // New translation & audio methods
  getTranslations: async (): Promise<Types.ApiResponse<Types.Translation[]>> => {
    const response = await axios.get(`${API_URL}/api/translations`);
    return response.data;
  },

  getReciters: async (): Promise<Types.ApiResponse<Types.Reciter[]>> => {
    const response = await axios.get(`${API_URL}/api/reciters`);
    return response.data;
  },

  getChapters: async (): Promise<Types.ApiResponse<Types.Chapter[]>> => {
    const response = await axios.get(`${API_URL}/api/chapters`);
    return response.data;
  },

  getChapterVerses: async (
    chapterId: number,
    translationId: string = '131',
    reciterId: string = 'ar.alafasy'
  ): Promise<Types.ApiResponse> => {
    const response = await axios.get(
      `${API_URL}/api/chapters/${chapterId}/verses`,
      {
        params: { translation: translationId, reciter: reciterId },
      }
    );
    return response.data;
  },

  getVerseOfDayWithOptions: async (
    translationId: string = '131',
    reciterId: string = 'ar.alafasy'
  ): Promise<Types.ApiResponse> => {
    const response = await axios.get(`${API_URL}/api/verse-of-day`, {
      params: { translation: translationId, reciter: reciterId },
    });
    return response.data;
  },
};

export default api;
```

### Step 7: Update VerseOfDay Component

Update `client/src/components/VerseOfDay.tsx`:

```tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ReflectionModal from './ReflectionModal';
import TranslationSelector from './TranslationSelector';
import ReciterSelector from './ReciterSelector';
import AudioPlayer from './AudioPlayer';
import { Verse } from '@/types';

export default function VerseOfDay() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState('131');
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');

  const { data, error, isLoading, mutate } = useSWR(
    ['verse-of-day', selectedTranslation, selectedReciter],
    () => api.getVerseOfDayWithOptions(selectedTranslation, selectedReciter),
    { revalidateOnFocus: false }
  );

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

  const handleRefresh = () => {
    mutate();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        {/* Header */}
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

        {/* Arabic Verse */}
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-4xl font-arabic text-right leading-loose text-gray-900">
            {verse.text_uthmani}
          </p>
        </div>

        {/* Translation Selector */}
        <div className="mb-6">
          <TranslationSelector
            selected={selectedTranslation}
            onSelect={(translationId) => {
              setSelectedTranslation(translationId);
            }}
          />
        </div>

        {/* English Translation */}
        {verse.translations && verse.translations.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Translation:</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {verse.translations[0].text}
            </p>
          </div>
        )}

        {/* Reciter Selector */}
        <div className="mb-6">
          <ReciterSelector
            selected={selectedReciter}
            onSelect={(reciterId) => {
              setSelectedReciter(reciterId);
            }}
          />
        </div>

        {/* Audio Player */}
        {verse.audio && (
          <div className="mb-6">
            <AudioPlayer
              audioUrl={verse.audio?.url}
              verseKey={verse.verse_key}
              reciterName="Quran Reciter"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleReflect}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Reflection
          </button>
          <button
            onClick={handleRefresh}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Get Another Verse
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
```

---

## 📋 Implementation Checklist

### Backend Tasks
- [ ] ✅ Update `quranApiService.ts` with translation/reciter methods
- [ ] Create `translationController.ts`
- [ ] Add translation routes to `routes/index.ts`
- [ ] Update `verseController.ts` to accept translation parameter
- [ ] Test endpoints with curl

### Frontend Tasks
- [ ] ✅ Create `TranslationSelector.tsx` component
- [ ] ✅ Create `ReciterSelector.tsx` component
- [ ] ✅ Create `AudioPlayer.tsx` component
- [ ] Update `types/index.ts` with new interfaces
- [ ] Update `lib/api.ts` with new methods
- [ ] Update `VerseOfDay.tsx` component
- [ ] Test all features locally

### Testing
- [ ] Test translation switching
- [ ] Test audio playback
- [ ] Test caching behavior
- [ ] Mobile responsive design
- [ ] Error handling

---

## 🚀 Quick Start Commands

```bash
# Backend
cd /Users/underxcore/Desktop/quran/server
npm run dev

# Frontend (in another terminal)
cd /Users/underxcore/Desktop/quran/client
npm run dev

# Visit: http://localhost:3000
```

---

## 🔗 API Endpoints Reference

### Translations
```
GET /api/translations
Response: { success: true, data: Translation[] }
```

### Reciters
```
GET /api/reciters
Response: { success: true, data: Reciter[] }
```

### Verse of Day with Options
```
GET /api/verse-of-day?translation=131&reciter=ar.alafasy
Response: { success: true, data: { verse: Verse } }
```

### Chapters
```
GET /api/chapters
Response: { success: true, data: Chapter[] }
```

### Chapter Verses
```
GET /api/chapters/:id/verses?translation=131&reciter=ar.alafasy&page=1
Response: { success: true, data: { verses: Verse[] } }
```

---

## 🎨 UI Component Tree

```
VerseOfDay
├── TranslationSelector
├── AudioPlayer
├── ReciterSelector
├── ReflectionModal
└── Buttons (Add Reflection, Get Another Verse)
```

---

## 📝 Next Steps After Implementation

1. **Add Bookmarks Feature**
   - Create bookmark model
   - Add bookmark endpoints
   - Create bookmark button in UI

2. **Add Surah Browser**
   - Create ChapterList component
   - Create ChapterVerses component
   - Add navigation

3. **Add Dark Mode**
   - Create ThemeSwitcher component
   - Update Tailwind config
   - Add localStorage persistence

4. **Add Tafsir**
   - Create TafsirViewer component
   - Integrate tafsir API

5. **Add PWA Support**
   - Add service worker
   - Enable offline mode
   - Add installability

