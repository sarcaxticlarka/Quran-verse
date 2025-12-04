# 🚀 Quick Start: Adding Translation & Audio Features

## 📋 What Has Been Done

✅ **Backend Service Enhanced** (`quranApiService.ts`)
- Added 5 new methods for translations, reciters, and chapters
- Support for dynamic translation and reciter parameters

✅ **Frontend Components Created**
1. `TranslationSelector.tsx` - 12 language options
2. `ReciterSelector.tsx` - 6+ reciters with details
3. `AudioPlayer.tsx` - Full audio player with controls

✅ **Backend Controller Created** (`translationController.ts`)
- Translation endpoint with 7-day caching
- Reciter endpoint with 30-day caching
- Chapter endpoints with 7-day caching

## 🔧 Next Steps (6 Easy Steps)

### Step 1: Add Routes to Backend (5 minutes)

Edit `/server/src/routes/index.ts`:

```typescript
import translationController from '../controllers/translationController';

// Add these lines after existing routes:
router.get('/api/translations', translationController.getAvailableTranslations);
router.get('/api/reciters', translationController.getAvailableReciters);
router.get('/api/chapters', translationController.getAvailableChapters);
router.get('/api/chapters/:chapterId/verses', translationController.getChapterVerses);
```

### Step 2: Update API Client (10 minutes)

Edit `/client/src/lib/api.ts`, add these methods inside the `api` object:

```typescript
// Add after existing methods
getTranslations: async (): Promise<any> => {
  const response = await axios.get(`${API_URL}/api/translations`);
  return response.data;
},

getReciters: async (): Promise<any> => {
  const response = await axios.get(`${API_URL}/api/reciters`);
  return response.data;
},

getChapters: async (): Promise<any> => {
  const response = await axios.get(`${API_URL}/api/chapters`);
  return response.data;
},

getChapterVerses: async (
  chapterId: number,
  translationId: string = '131',
  reciterId: string = 'ar.alafasy',
  page: number = 1
): Promise<any> => {
  const response = await axios.get(
    `${API_URL}/api/chapters/${chapterId}/verses`,
    {
      params: { 
        translation: translationId, 
        reciter: reciterId,
        page 
      },
    }
  );
  return response.data;
},

getVerseWithOptions: async (
  verseKey: string,
  translationId: string = '131',
  reciterId: string = 'ar.alafasy'
): Promise<any> => {
  const response = await axios.get(`${API_URL}/api/verses/${verseKey}`, {
    params: { translation: translationId, reciter: reciterId },
  });
  return response.data;
},
```

### Step 3: Update VerseOfDay Component (15 minutes)

Replace entire `/client/src/components/VerseOfDay.tsx` with:

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
    async () => {
      const randomVerse = Math.floor(Math.random() * 6236) + 1;
      // Get verse from API
      const response = await api.getVerseOfDay();
      return response;
    },
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
            onSelect={setSelectedTranslation}
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
            onSelect={setSelectedReciter}
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

### Step 4: Update Types (10 minutes)

Edit `/client/src/types/index.ts`:

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
  words?: any[];
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
  style?: string;
  country?: string;
}

// Keep existing interfaces...
```

### Step 5: Update Verse Controller (5 minutes)

Edit `/server/src/controllers/verseController.ts`, update `getVerseOfDay`:

```typescript
export const getVerseOfDay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { translation = '131', reciter = 'ar.alafasy' } = req.query;
    
    // Check if we have a cached verse
    const VERSE_OF_DAY_KEY = `verse_of_day_${translation}_${reciter}`;
    const cachedVerse = cacheService.get(VERSE_OF_DAY_KEY);

    if (cachedVerse) {
      console.log('✅ Returning cached verse of the day');
      res.status(200).json({
        success: true,
        message: 'Verse of the day retrieved from cache',
        cached: true,
        data: cachedVerse,
      });
      return;
    }

    console.log('🔄 Fetching new verse of the day...');
    
    // Fetch a new random verse
    const verse = await quranApiService.getRandomVerse(
      translation as string,
      reciter as string
    );

    // Cache the verse for 24 hours
    cacheService.set(VERSE_OF_DAY_KEY, verse, 86400);

    console.log('✅ New verse of the day cached');

    res.status(200).json({
      success: true,
      message: 'Verse of the day retrieved successfully',
      cached: false,
      data: verse,
    });
  } catch (error) {
    console.error('Error in getVerseOfDay controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve verse of the day',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
```

### Step 6: Test Everything (10 minutes)

```bash
# Terminal 1: Start backend
cd /Users/underxcore/Desktop/quran/server
npm run dev

# Terminal 2: Start frontend
cd /Users/underxcore/Desktop/quran/client
npm run dev

# Terminal 3: Test API
curl http://localhost:5000/api/translations
curl http://localhost:5000/api/reciters
curl http://localhost:5000/api/chapters
```

Then visit `http://localhost:3000` and:
- ✅ Check verse loads
- ✅ Switch translations
- ✅ Change reciter
- ✅ Test audio player
- ✅ Test reflection button

## ⏱️ Total Time: ~45 minutes

## 🎯 What You Get

- ✅ 12 language translations
- ✅ 6+ audio reciters
- ✅ Full audio player
- ✅ Smart caching
- ✅ Mobile responsive
- ✅ Professional UI

## 🐛 Common Issues & Fixes

### Issue: "Module not found" error
**Fix**: Make sure components are in the right folder and imports use `@/` prefix

### Issue: Audio doesn't play
**Fix**: Check browser console for CORS errors. Make sure audio URL is valid.

### Issue: Translations not loading
**Fix**: Ensure API endpoint is accessible. Check server logs.

### Issue: TypeScript errors
**Fix**: Run `npm run build` to check for type issues

## 📚 Reference Files

- Components: `/client/src/components/`
- Controllers: `/server/src/controllers/`
- Services: `/server/src/services/`
- Types: `/client/src/types/`
- Routes: `/server/src/routes/`

## 🚀 Ready to Launch!

You now have a feature-rich Quran application with:
- Multi-language support
- Audio recitation
- Professional UI
- Proper caching
- TypeScript throughout

Happy coding! 🎉
