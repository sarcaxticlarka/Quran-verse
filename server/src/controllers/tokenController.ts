import { Request, Response } from 'express';
import tokenService from '../services/tokenService';

export const getToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await tokenService.getAccessToken();
    const cachedToken = tokenService.getCachedToken();

    res.status(200).json({
      success: true,
      message: 'Access token retrieved successfully',
      data: {
        access_token: token,
        cached: cachedToken === token,
      },
    });
  } catch (error) {
    console.error('Error in getToken controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve access token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
