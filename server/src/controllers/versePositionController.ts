import { Request, Response } from 'express';
import quranApiService from '../services/quranApiService';
import cacheService from '../services/cacheService';

const VERSE_CACHE_TTL = 86400; // 24 hours

/**
 * GET /api/verse-by-position/:chapter/:verse
 * Get a specific verse by chapter and verse position
 */
export const getVerseByPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chapter, verse } = req.params;
    const { translation = '131' } = req.query;

    const chapterNum = parseInt(chapter, 10);
    const verseNum = parseInt(verse, 10);

    // Validate parameters
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 114) {
      res.status(400).json({
        success: false,
        message: 'Invalid chapter number. Must be between 1 and 114.',
      });
      return;
    }

    if (isNaN(verseNum) || verseNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Invalid verse number.',
      });
      return;
    }

    const cacheKey = `verse_${chapterNum}_${verseNum}_${translation}`;
    let verseData = cacheService.get(cacheKey);

    if (!verseData) {
      console.log(`📥 Fetching verse ${chapterNum}:${verseNum}`);
      verseData = await quranApiService.getVerseByPosition(
        chapterNum,
        verseNum,
        translation as string
      );

      cacheService.set(cacheKey, verseData, VERSE_CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: `Verse ${chapterNum}:${verseNum} retrieved successfully`,
      cached: !!verseData,
      data: verseData,
    });
  } catch (error) {
    console.error('❌ Error fetching verse by position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve verse',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/verses-by-juz/:juzNumber
 * Get all verses in a specific Juz (1/30th of Quran)
 */
export const getVersesByJuz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { juzNumber } = req.params;
    const { translation = '131' } = req.query;

    const juzNum = parseInt(juzNumber, 10);

    if (isNaN(juzNum) || juzNum < 1 || juzNum > 30) {
      res.status(400).json({
        success: false,
        message: 'Invalid Juz number. Must be between 1 and 30.',
      });
      return;
    }

    const cacheKey = `juz_${juzNum}_${translation}`;
    let juzData = cacheService.get(cacheKey);

    if (!juzData) {
      console.log(`📥 Fetching Juz ${juzNum}`);
      juzData = await quranApiService.getVersesByJuz(juzNum, translation as string);
      cacheService.set(cacheKey, juzData, VERSE_CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: `Juz ${juzNum} retrieved successfully`,
      cached: !!juzData,
      data: juzData,
    });
  } catch (error) {
    console.error('❌ Error fetching Juz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Juz',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/verses-by-hizb/:hizbNumber
 * Get all verses in a specific Hizb (1/60th of Quran)
 */
export const getVersesByHizb = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hizbNumber } = req.params;
    const { translation = '131' } = req.query;

    const hizbNum = parseInt(hizbNumber, 10);

    if (isNaN(hizbNum) || hizbNum < 1 || hizbNum > 60) {
      res.status(400).json({
        success: false,
        message: 'Invalid Hizb number. Must be between 1 and 60.',
      });
      return;
    }

    const cacheKey = `hizb_${hizbNum}_${translation}`;
    let hizbData = cacheService.get(cacheKey);

    if (!hizbData) {
      console.log(`📥 Fetching Hizb ${hizbNum}`);
      hizbData = await quranApiService.getVersesByHizb(hizbNum, translation as string);
      cacheService.set(cacheKey, hizbData, VERSE_CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: `Hizb ${hizbNum} retrieved successfully`,
      cached: !!hizbData,
      data: hizbData,
    });
  } catch (error) {
    console.error('❌ Error fetching Hizb:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Hizb',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/verses-by-rub/:rubNumber
 * Get all verses in a specific Rub (1/240th of Quran)
 */
export const getVersesByRub = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rubNumber } = req.params;
    const { translation = '131' } = req.query;

    const rubNum = parseInt(rubNumber, 10);

    if (isNaN(rubNum) || rubNum < 1 || rubNum > 240) {
      res.status(400).json({
        success: false,
        message: 'Invalid Rub number. Must be between 1 and 240.',
      });
      return;
    }

    const cacheKey = `rub_${rubNum}_${translation}`;
    let rubData = cacheService.get(cacheKey);

    if (!rubData) {
      console.log(`📥 Fetching Rub ${rubNum}`);
      rubData = await quranApiService.getVersesByRub(rubNum, translation as string);
      cacheService.set(cacheKey, rubData, VERSE_CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: `Rub ${rubNum} retrieved successfully`,
      cached: !!rubData,
      data: rubData,
    });
  } catch (error) {
    console.error('❌ Error fetching Rub:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Rub',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/verses-by-range/:chapter/:verseStart/:verseEnd
 * Get verses in a specific range within a chapter
 */
export const getVersesByRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chapter, verseStart, verseEnd } = req.params;
    const { translation = '131' } = req.query;

    const chapterNum = parseInt(chapter, 10);
    const startVerse = parseInt(verseStart, 10);
    const endVerse = parseInt(verseEnd, 10);

    // Validate parameters
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 114) {
      res.status(400).json({
        success: false,
        message: 'Invalid chapter number. Must be between 1 and 114.',
      });
      return;
    }

    if (isNaN(startVerse) || startVerse < 1 || isNaN(endVerse) || endVerse < 1) {
      res.status(400).json({
        success: false,
        message: 'Invalid verse range.',
      });
      return;
    }

    if (startVerse > endVerse) {
      res.status(400).json({
        success: false,
        message: 'Start verse must be less than or equal to end verse.',
      });
      return;
    }

    if (endVerse - startVerse > 100) {
      res.status(400).json({
        success: false,
        message: 'Range too large. Maximum 100 verses at a time.',
      });
      return;
    }

    const cacheKey = `range_${chapterNum}_${startVerse}_${endVerse}_${translation}`;
    let rangeData = cacheService.get(cacheKey);

    if (!rangeData) {
      console.log(`📥 Fetching verses ${chapterNum}:${startVerse}-${endVerse}`);
      rangeData = await quranApiService.getVersesByRange(
        chapterNum,
        startVerse,
        endVerse,
        translation as string
      );
      cacheService.set(cacheKey, rangeData, VERSE_CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: `Verses in range retrieved successfully`,
      cached: !!rangeData,
      count: (rangeData as any[]).length,
      data: rangeData,
    });
  } catch (error) {
    console.error('❌ Error fetching verse range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve verses',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
