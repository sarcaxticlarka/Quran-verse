import { Router } from 'express';
import { getToken } from '../controllers/tokenController';
import { getVerseOfDay } from '../controllers/verseController';
import { createReflection, getReflectionsByVerseKey, getReflectionsByUserId } from '../controllers/reflectionController';
import { searchVerses, getSearchHistory } from '../controllers/searchController';

const router = Router();

// Token endpoint
router.get('/token', getToken);

// Verse of the day endpoint
router.get('/verse-of-day', getVerseOfDay);

// Reflections endpoints
router.post('/reflections', createReflection);
router.get('/reflections/:key', getReflectionsByVerseKey);
router.get('/reflections/user/:userId', getReflectionsByUserId);

// Search endpoints
router.post('/search', searchVerses);
router.get('/search/history/:userId', getSearchHistory);

export default router;
