import { Request, Response } from 'express';
import quranApiService from '../services/quranApiService';
import cacheService from '../services/cacheService';

const VERSE_OF_DAY_KEY = 'verse_of_day';
const CACHE_TTL = 86400; // 24 hours in seconds

export const getVerseOfDay = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if we have a cached verse
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
    const verse = await quranApiService.getRandomVerse();

    // Cache the verse for 24 hours
    cacheService.set(VERSE_OF_DAY_KEY, verse, CACHE_TTL);

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
