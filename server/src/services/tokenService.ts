import axios from 'axios';
import NodeCache from 'node-cache';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class TokenService {
  private cache: NodeCache;
  private tokenUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    // Cache for 55 minutes (tokens typically expire in 1 hour)
    this.cache = new NodeCache({ stdTTL: 3300 });
    this.tokenUrl = process.env.QURAN_TOKEN_URL || '';
    this.clientId = process.env.QURAN_CLIENT_ID || '';
    this.clientSecret = process.env.QURAN_CLIENT_SECRET || '';
  }

  async getAccessToken(): Promise<string> {
    const cachedToken = this.cache.get<string>('access_token');

    if (cachedToken) {
      console.log('✅ Using cached access token');
      return cachedToken;
    }

    console.log('🔄 Fetching new access token...');
    
    try {
      // Using form-urlencoded format as per Quran Foundation API specs
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      const response = await axios.post<TokenResponse>(
        this.tokenUrl,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in } = response.data;

      // Cache the token for slightly less than its expiry time (expires in 1 hour = 3600s)
      const cacheDuration = Math.min(expires_in - 300, 3300); // 55 minutes max
      this.cache.set('access_token', access_token, cacheDuration);

      console.log(`✅ New access token cached for ${cacheDuration} seconds (expires in ${expires_in}s)`);
      return access_token;
    } catch (error) {
      console.error('❌ Error fetching access token:', error instanceof Error ? error.message : error);
      throw new Error('Failed to authenticate with Quran Foundation API');
    }
  }

  getCachedToken(): string | undefined {
    return this.cache.get<string>('access_token');
  }
}

export default new TokenService();
