import { Request, Response } from 'express';
import Reflection from '../models/Reflection';

// POST /api/reflections - Create a new reflection
export const createReflection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, verse_key, reflection_text } = req.body;

    // Validation
    if (!user_id || !verse_key || !reflection_text) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, verse_key, and reflection_text are required',
      });
      return;
    }

    // Create the reflection
    const reflection = await Reflection.create({
      user_id,
      verse_key,
      reflection_text,
    });

    res.status(201).json({
      success: true,
      message: 'Reflection created successfully',
      data: reflection,
    });
  } catch (error) {
    console.error('Error in createReflection controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reflection',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/reflections/:key - Get all reflections for a verse
export const getReflectionsByVerseKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    if (!key) {
      res.status(400).json({
        success: false,
        message: 'Verse key is required',
      });
      return;
    }

    const reflections = await Reflection.findAll({
      where: { verse_key: key },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: `Retrieved ${reflections.length} reflection(s) for verse ${key}`,
      data: reflections,
    });
  } catch (error) {
    console.error('Error in getReflectionsByVerseKey controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reflections',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/reflections/user/:userId - Get all reflections for a user
export const getReflectionsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const reflections = await Reflection.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: `Retrieved ${reflections.length} reflection(s) for user ${userId}`,
      data: reflections,
    });
  } catch (error) {
    console.error('Error in getReflectionsByUserId controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reflections',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
