import { Request, Response } from 'express';
import prisma from '../config/prisma';

// POST /api/reflections - Create a new reflection
export const createReflection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, verse_key, reflection_text, translation_id } = req.body;

    // Validation
    if (!user_id || !verse_key || !reflection_text) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, verse_key, and reflection_text are required',
      });
      return;
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({ where: { email: user_id } });

    if (!user) {
      // If user doesn't exist, return error (they should sync first)
      res.status(400).json({
        success: false,
        message: 'User not found. Please sign in with Google first.',
      });
      return;
    }

    // Create the reflection
    const reflection = await prisma.reflection.create({
      data: {
        userId: user.id,
        verseKey: verse_key,
        reflectionText: reflection_text,
        translationId: translation_id,
      },
    });

    // Map Prisma camelCase fields to snake_case shape expected by the client
    const mapped = {
      id: reflection.id,
      user_id: user.email || user.id,
      verse_key: reflection.verseKey,
      reflection_text: reflection.reflectionText,
      translation_id: reflection.translationId ?? null,
      created_at: reflection.createdAt.toISOString(),
      updated_at: reflection.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Reflection created successfully',
      data: mapped,
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

    const reflections = await prisma.reflection.findMany({
      where: { verseKey: key },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Normalize fields to snake_case for the client
    const mapped = reflections.map((r: any) => ({
      id: r.id,
      user_id: r.user?.email || r.userId,
      verse_key: r.verseKey,
      reflection_text: r.reflectionText,
      translation_id: r.translationId ?? null,
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      message: `Retrieved ${mapped.length} reflection(s) for verse ${key}`,
      data: mapped,
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

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: userId } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const reflections = await prisma.reflection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = reflections.map((r: any) => ({
      id: r.id,
      user_id: user.email || user.id,
      verse_key: r.verseKey,
      reflection_text: r.reflectionText,
      translation_id: r.translationId ?? null,
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      message: `Retrieved ${mapped.length} reflection(s) for user ${userId}`,
      data: mapped,
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
