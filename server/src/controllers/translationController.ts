import { Request, Response } from 'express';
import quranApiService from '../services/quranApiService';
import cacheService from '../services/cacheService';

// Cache keys and TTL
const TRANSLATIONS_CACHE_KEY = 'translations_list';
const RECITERS_CACHE_KEY = 'reciters_list';
const CHAPTERS_CACHE_KEY = 'chapters_list';
const TRANSLATIONS_TTL = 86400 * 7; // 7 days
const RECITERS_TTL = 86400 * 30; // 30 days
const CHAPTERS_TTL = 86400 * 7; // 7 days

/**
 * GET /api/translations
 * Get all available Quran translations
 */
export const getAvailableTranslations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check cache first
    let translations: any = cacheService.get(TRANSLATIONS_CACHE_KEY);

    if (!translations) {
      console.log('📥 Fetching translations from Quran API');
      translations = await quranApiService.getTranslations();
      
      // Cache for 7 days
      cacheService.set(TRANSLATIONS_CACHE_KEY, translations, TRANSLATIONS_TTL);
      console.log(`✅ Cached ${(translations as any[]).length} translations`);
    } else {
      console.log('📦 Returning cached translations');
    }

    res.status(200).json({
      success: true,
      message: 'Translations retrieved successfully',
      cached: !!translations,
      data: translations,
    });
  } catch (error) {
    console.error('❌ Error fetching translations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve translations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/reciters
 * Get all available Quranic reciters
 */
export const getAvailableReciters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check cache first
    let reciters: any = cacheService.get(RECITERS_CACHE_KEY);

    if (!reciters) {
      console.log('📥 Fetching reciters from Quran API');
      reciters = await quranApiService.getReciters();
      
      // Cache for 30 days
      cacheService.set(RECITERS_CACHE_KEY, reciters, RECITERS_TTL);
      console.log(`✅ Cached ${(reciters as any[]).length} reciters`);
    } else {
      console.log('📦 Returning cached reciters');
    }

    res.status(200).json({
      success: true,
      message: 'Reciters retrieved successfully',
      cached: !!reciters,
      data: reciters,
    });
  } catch (error) {
    console.error('❌ Error fetching reciters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reciters',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/chapters
 * Get all Quran chapters (Surahs)
 */
export const getAvailableChapters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check cache first
    let chapters: any = cacheService.get(CHAPTERS_CACHE_KEY);

    if (!chapters) {
      console.log('📥 Fetching chapters from Quran API');
      chapters = await quranApiService.getChapters();
      
      // Cache for 7 days
      cacheService.set(CHAPTERS_CACHE_KEY, chapters, CHAPTERS_TTL);
      console.log(`✅ Cached ${(chapters as any[]).length} chapters`);
    } else {
      console.log('📦 Returning cached chapters');
    }

    res.status(200).json({
      success: true,
      message: 'Chapters retrieved successfully',
      cached: !!chapters,
      data: chapters,
    });
  } catch (error) {
    console.error('❌ Error fetching chapters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapters',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/chapters/:chapterId/verses
 * Get verses from a specific chapter with optional translation and recitation
 * Query params: ?translation=131&reciter=ar.alafasy&page=1
 */
export const getChapterVerses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chapterId } = req.params;
    const {
      translation = '131',
      reciter = 'ar.alafasy',
      page = 1,
    } = req.query;

    const chapterNum = parseInt(chapterId, 10);
    const pageNum = parseInt(page as string, 10) || 1;

    // Validate chapter number
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 114) {
      res.status(400).json({
        success: false,
        message: 'Invalid chapter number. Must be between 1 and 114.',
      });
      return;
    }

    const cacheKey = `chapter_${chapterNum}_translation_${translation}_page_${pageNum}`;
    let verses = cacheService.get(cacheKey);

    if (!verses) {
      console.log(`📥 Fetching chapter ${chapterNum} verses (page ${pageNum})`);
      verses = await quranApiService.getChapterVerses(
        chapterNum,
        pageNum,
        translation as string,
        reciter as string
      );
      
      // Cache for 24 hours
      cacheService.set(cacheKey, verses, 86400);
    } else {
      console.log(`📦 Returning cached chapter ${chapterNum} verses`);
    }

    res.status(200).json({
      success: true,
      message: `Chapter ${chapterNum} verses retrieved successfully`,
      cached: !!verses,
      data: verses,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter verses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapter verses',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/translations/:resourceId/chapter/:chapterNumber
 * Get translations for a specific chapter using a translation resource
 * Example: GET /api/translations/131/chapter/1 (English Sahih International for Al-Fatiha)
 */
export const getChapterTranslations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resourceId, chapterNumber } = req.params;

    const resourceNum = parseInt(resourceId, 10);
    const chapterNum = parseInt(chapterNumber, 10);

    // Validate parameters
    if (isNaN(resourceNum) || resourceNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Invalid resource ID.',
      });
      return;
    }

    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 114) {
      res.status(400).json({
        success: false,
        message: 'Invalid chapter number. Must be between 1 and 114.',
      });
      return;
    }

    const cacheKey = `chapter_translation_${resourceNum}_${chapterNum}`;
    let translations = cacheService.get(cacheKey);

    if (!translations) {
      console.log(`📥 Fetching translations for chapter ${chapterNum} (resource ${resourceNum})`);
      translations = await quranApiService.getChapterTranslations(resourceNum, chapterNum);
      
      // Cache for 7 days
      cacheService.set(cacheKey, translations, CHAPTERS_TTL);
    } else {
      console.log(`📦 Returning cached chapter ${chapterNum} translations`);
    }

    res.status(200).json({
      success: true,
      message: `Chapter ${chapterNum} translations retrieved successfully`,
      cached: !!translations,
      data: translations,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter translations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapter translations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/chapter-audio/:reciterId/:chapterNumber
 * Get audio file for a specific chapter from a reciter
 * Query params: ?segments=true (for word-level timestamps)
 */
export const getChapterAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reciterId, chapterNumber } = req.params;
    const { segments = 'false' } = req.query;

    const reciterNum = parseInt(reciterId, 10);
    const chapterNum = parseInt(chapterNumber, 10);
    const includeSegments = segments === 'true';

    // Validate parameters
    if (isNaN(reciterNum) || reciterNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Invalid reciter ID.',
      });
      return;
    }

    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 114) {
      res.status(400).json({
        success: false,
        message: 'Invalid chapter number. Must be between 1 and 114.',
      });
      return;
    }

    const cacheKey = `chapter_audio_${reciterNum}_${chapterNum}_segments_${includeSegments}`;
    let audioData = cacheService.get(cacheKey);

    if (!audioData) {
      console.log(`📥 Fetching chapter ${chapterNum} audio (reciter ${reciterNum}, segments: ${includeSegments})`);
      audioData = await quranApiService.getChapterAudio(reciterNum, chapterNum, includeSegments);
      
      // Cache for 30 days (audio files rarely change)
      cacheService.set(cacheKey, audioData, RECITERS_TTL);
    } else {
      console.log(`📦 Returning cached chapter ${chapterNum} audio`);
    }

    res.status(200).json({
      success: true,
      message: `Chapter ${chapterNum} audio retrieved successfully`,
      cached: !!audioData,
      data: audioData,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapter audio',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export default {
  getAvailableTranslations,
  getAvailableReciters,
  getAvailableChapters,
  getChapterVerses,
};
