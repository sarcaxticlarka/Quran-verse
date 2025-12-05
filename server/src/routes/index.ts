import { Router } from 'express';
import { getToken } from '../controllers/tokenController';
import { getVerseOfDay, getVerseByKey } from '../controllers/verseController';
import { createReflection, getReflectionsByVerseKey, getReflectionsByUserId } from '../controllers/reflectionController';
import { searchVerses, getSearchHistory } from '../controllers/searchController';
import { syncGoogleUser, getUserByEmail, getUserReflections } from '../controllers/userController';
import { 
  getAvailableTranslations, 
  getAvailableReciters, 
  getAvailableChapters, 
  getChapterVerses,
  getChapterTranslations,
  getChapterAudio
} from '../controllers/translationController';
import {
  getVerseByPosition,
  getVersesByJuz,
  getVersesByHizb,
  getVersesByRub,
  getVersesByRange
} from '../controllers/versePositionController';

const router = Router();

// Token endpoint
router.get('/token', getToken);

// Verse of the day endpoint
router.get('/verse-of-day', getVerseOfDay);
router.get('/verse/:verseKey', getVerseByKey);

// User endpoints (Google OAuth)
router.post('/users/sync', syncGoogleUser);
router.get('/users/:email', getUserByEmail);
router.get('/users/:email/reflections', getUserReflections);

// Reflections endpoints
router.post('/reflections', createReflection);
router.get('/reflections/:key', getReflectionsByVerseKey);
router.get('/reflections/user/:userId', getReflectionsByUserId);

// Search endpoints
router.post('/search', searchVerses);
router.get('/search/history/:userId', getSearchHistory);

// Translation & Audio endpoints
router.get('/translations', getAvailableTranslations);
router.get('/reciters', getAvailableReciters);
router.get('/chapters', getAvailableChapters);
router.get('/chapters/:chapterId/verses', getChapterVerses);
router.get('/translations/:resourceId/chapter/:chapterNumber', getChapterTranslations);
router.get('/chapter-audio/:reciterId/:chapterNumber', getChapterAudio);

// Positional Search endpoints
router.get('/verse-by-position/:chapter/:verse', getVerseByPosition);
router.get('/verses-by-juz/:juzNumber', getVersesByJuz);
router.get('/verses-by-hizb/:hizbNumber', getVersesByHizb);
router.get('/verses-by-rub/:rubNumber', getVersesByRub);
router.get('/verses-by-range/:chapter/:verseStart/:verseEnd', getVersesByRange);

export default router;

