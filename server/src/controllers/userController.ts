import { Request, Response } from 'express';
import prisma from '../config/prisma';

// POST /api/users/sync - Sync or create user from Google OAuth
export const syncGoogleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, google_id, profile_image } = req.body;

    // Validation
    if (!email || !name || !google_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: email, name, and google_id are required',
      });
      return;
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Update existing user if needed
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          googleId: google_id,
          profileImage: profile_image,
        },
      });
      console.log(`✅ Updated existing user: ${email}`);
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId: google_id,
          profileImage: profile_image,
        },
      });
      console.log(`✅ Created new user: ${email}`);
    }

    res.status(200).json({
      success: true,
      message: 'User synced successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile_image: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Error in syncGoogleUser controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/users/:email - Get user by email
export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile_image: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Error in getUserByEmail controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/users/:email/reflections - Get all reflections for a user
export const getUserReflections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // First find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get user's reflections
    const reflections = await prisma.reflection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Map to client-friendly (snake_case) shape
    const mapped = reflections.map((r) => ({
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
      message: `Retrieved ${mapped.length} reflection(s) for user ${email}`,
      data: mapped,
    });
  } catch (error) {
    console.error('Error in getUserReflections controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user reflections',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
