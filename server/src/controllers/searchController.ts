import { Request, Response } from 'express';
import quranApiService from '../services/quranApiService';
import prisma from '../config/prisma';

// POST /api/search - Search verses and log the query
export const searchVerses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, user_id, page = 1 } = req.body;

    // Validation
    if (!query) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    console.log(`🔍 Searching for: "${query}"`);

    // Perform the search via Quran API
    // Request both English (149) and Urdu (54) translations
    const searchResults = await quranApiService.searchVerses(
      query, 
      page, 
      20, 
      undefined, 
      '149,54' // Request English and Urdu translations with correct IDs
    );

    // Log the search query to database
    const resultCount = searchResults.search?.results?.length || 0;
    await prisma.searchHistory.create({
      data: {
        userId: user_id,
        query: query,
        resultCount: resultCount,
      },
    });

    console.log(`✅ Search query logged for user ${user_id}`);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: searchResults,
    });
  } catch (error) {
    console.error('Error in searchVerses controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search verses',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/search/history/:userId - Get search history for a user
export const getSearchHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.status(200).json({
      success: true,
      message: `Retrieved ${history.length} search history record(s)`,
      data: history,
    });
  } catch (error) {
    console.error('Error in getSearchHistory controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve search history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
