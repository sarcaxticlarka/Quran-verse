import axios, { AxiosInstance } from 'axios';

class QuranApiService {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.QURAN_API_BASE_URL || 'https://api.quran.com/api/v4';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          console.error('❌ Unauthorized - Check your credentials');
        }
        return Promise.reject(error);
      }
    );
  }

  async getRandomVerse() {
    try {
      // Get a random verse using the verses endpoint
      // Quran has 6236 verses total
      const randomVerseNumber = Math.floor(Math.random() * 6236) + 1;
      const verseKey = this.getVerseKeyByNumber(randomVerseNumber);
      
      console.log(`🔍 Fetching verse: ${verseKey}`);

      const response = await this.axiosInstance.get(`/verses/by_key/${verseKey}`, {
        params: {
          words: 'true',
          translations: '131', // English translation
          fields: 'text_uthmani,chapter_id,verse_number,verse_key',
        },
      });

      console.log(`✅ Successfully fetched verse ${verseKey}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching random verse:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async getVerseByKey(verseKey: string) {
    try {
      console.log(`🔍 Fetching verse by key: ${verseKey}`);
      
      const response = await this.axiosInstance.get(`/verses/by_key/${verseKey}`, {
        params: {
          words: 'true',
          translations: '131',
          fields: 'text_uthmani,chapter_id,verse_number,verse_key',
        },
      });

      console.log(`✅ Successfully fetched verse ${verseKey}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching verse ${verseKey}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async searchVerses(query: string, page: number = 1) {
    try {
      console.log(`🔍 Searching for: "${query}" (page ${page})`);
      
      const response = await this.axiosInstance.get('/search', {
        params: {
          q: query,
          size: 20,
          page: page,
        },
      });

      console.log(`✅ Search completed for: "${query}"`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error searching verses:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  // Helper function to convert verse number to verse key
  private getVerseKeyByNumber(verseNumber: number): string {
    // This is a simplified version. In production, you'd want a proper mapping
    // For now, we'll use a simple chapter:verse format
    // Surah Al-Fatiha (1) has 7 verses, Al-Baqarah (2) has 286 verses, etc.
    
    const chapterVerses = [
      7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
      123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
      112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
      34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
      54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
      60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
      14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
      28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
      29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
      15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
      11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
      5, 4, 5, 6
    ];

    let currentVerse = 0;
    for (let i = 0; i < chapterVerses.length; i++) {
      currentVerse += chapterVerses[i];
      if (verseNumber <= currentVerse) {
        const verseInChapter = verseNumber - (currentVerse - chapterVerses[i]);
        return `${i + 1}:${verseInChapter}`;
      }
    }

    return '1:1'; // Fallback
  }
}

export default new QuranApiService();
