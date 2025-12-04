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

  async getRandomVerse(translationId: string = '131', reciterId: string = 'ar.alafasy') {
    try {
      // Get a random verse using the verses endpoint
      // Quran has 6236 verses total
      const randomVerseNumber = Math.floor(Math.random() * 6236) + 1;
      const verseKey = this.getVerseKeyByNumber(randomVerseNumber);
      
      console.log(`🔍 Fetching verse: ${verseKey} with translation ${translationId}`);

      const response = await this.axiosInstance.get(`/verses/by_key/${verseKey}`, {
        params: {
          words: 'true',
          translations: translationId,
          audio: reciterId,
          fields: 'text_uthmani,chapter_id,verse_number,verse_key,words,audio',
        },
      });

      console.log(`✅ Successfully fetched verse ${verseKey}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching random verse:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async getVerseByKey(
    verseKey: string, 
    translationId: string = '131',
    reciterId: string = 'ar.alafasy'
  ) {
    try {
      console.log(`🔍 Fetching verse by key: ${verseKey}`);
      
      const response = await this.axiosInstance.get(`/verses/by_key/${verseKey}`, {
        params: {
          words: 'true',
          translations: translationId,
          audio: reciterId,
          fields: 'text_uthmani,chapter_id,verse_number,verse_key,words,audio',
        },
      });

      console.log(`✅ Successfully fetched verse ${verseKey}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching verse ${verseKey}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Enhanced search with language detection and translation filtering
   * @param query - Search query (max 250 UTF-8 characters)
   * @param page - Page number (1-based)
   * @param size - Results per page (1-50, default 10)
   * @param language - ISO language code (auto-detected if omitted)
   * @param translations - Comma-separated translation IDs to filter
   */
  async searchVerses(
    query: string, 
    page: number = 1, 
    size: number = 20,
    language?: string,
    translations?: string
  ) {
    try {
      // Limit query to 250 UTF-8 characters as per API spec
      const trimmedQuery = query.substring(0, 250);
      console.log(`🔍 Searching for: "${trimmedQuery}" (page ${page}, size ${size})`);
      
      const params: any = {
        q: trimmedQuery,
        size: Math.min(size, 50), // Cap at 50 as per API spec
        page: page,
      };

      // Add language if specified (otherwise API auto-detects)
      if (language) {
        params.language = language;
      }

      // Add translation filter if specified
      if (translations) {
        params.translations = translations;
      }

      const response = await this.axiosInstance.get('/search', {
        params,
      });

      console.log(`✅ Search completed: found ${response.data.search?.results?.length || 0} results`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error searching verses:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get all available translations
   */
  async getTranslations() {
    try {
      console.log('🔍 Fetching available translations');
      const response = await this.axiosInstance.get('/resources', {
        params: {
          resource_type: 'translations',
        },
      });

      const translations = (response.data.translations || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        language: t.language_name,
        author: t.author_name,
      }));

      console.log(`✅ Found ${translations.length} translations`);
      return translations;
    } catch (error) {
      console.error('❌ Error fetching translations:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get all available reciters
   */
  async getReciters() {
    try {
      console.log('🔍 Fetching available reciters');
      const response = await this.axiosInstance.get('/recitations', {
        params: {
          language: 'ar',
        },
      });

      const reciters = (response.data.recitations || []).map((r: any) => ({
        id: r.identifier,
        name: r.translated_name?.name || r.name,
        style: r.style,
      }));

      console.log(`✅ Found ${reciters.length} reciters`);
      return reciters;
    } catch (error) {
      console.error('❌ Error fetching reciters:', error instanceof Error ? error.message : error);
      // Return default reciters if API call fails
      return [
        { id: 'ar.alafasy', name: 'Mishari Al-Afasy', style: 'Modern & Clear' },
        { id: 'ar.abdulbasit_mrattal', name: 'Abdul Basit Murattal', style: 'Slow & Melodious' },
        { id: 'ar.al_husary', name: 'Al-Husary', style: 'Moderate Speed' },
        { id: 'ar.al_minshawi', name: 'Al-Minshawi', style: 'Emotional' },
        { id: 'ar.parhizgar', name: 'Parhizgar', style: 'Traditional' },
      ];
    }
  }

  /**
   * Get all chapters (Surahs)
   */
  async getChapters() {
    try {
      console.log('🔍 Fetching all chapters');
      const response = await this.axiosInstance.get('/chapters');

      const chapters = (response.data.chapters || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        arabic_name: c.arabic_name,
        name_simple: c.name_simple,
        verses_count: c.verses_count,
        revelation_place: c.revelation_place,
        revelation_order: c.revelation_order,
      }));

      console.log(`✅ Found ${chapters.length} chapters`);
      return chapters;
    } catch (error) {
      console.error('❌ Error fetching chapters:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get verse by specific position (chapter:verse)
   * @param chapter - Chapter number (1-114)
   * @param verse - Verse number within the chapter
   * @param translationId - Translation ID
   * @param reciterId - Reciter ID
   */
  async getVerseByPosition(
    chapter: number,
    verse: number,
    translationId: string = '131',
    reciterId: string = 'ar.alafasy'
  ) {
    try {
      const verseKey = `${chapter}:${verse}`;
      console.log(`🔍 Fetching verse by position: ${verseKey}`);
      
      const response = await this.axiosInstance.get(`/verses/by_key/${verseKey}`, {
        params: {
          words: 'true',
          translations: translationId,
          audio: reciterId,
          fields: 'text_uthmani,chapter_id,verse_number,verse_key,words,audio,juz_number,hizb_number,rub_number,page_number',
        },
      });

      console.log(`✅ Successfully fetched verse ${verseKey}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching verse by position:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get verses by Juz (1/30th of Quran)
   * @param juzNumber - Juz number (1-30)
   * @param translationId - Translation ID
   * @param page - Page number for pagination
   */
  async getVersesByJuz(
    juzNumber: number,
    translationId: string = '131',
    page: number = 1
  ) {
    try {
      console.log(`🔍 Fetching Juz ${juzNumber} verses`);
      
      const response = await this.axiosInstance.get('/juzs', {
        params: {
          translations: translationId,
          page,
          limit: 50,
        },
      });

      const juz = response.data.juzs?.find((j: any) => j.juz_number === juzNumber);
      console.log(`✅ Found Juz ${juzNumber}`);
      return juz;
    } catch (error) {
      console.error(`❌ Error fetching Juz:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get verses by Hizb (1/60th of Quran)
   * @param hizbNumber - Hizb number (1-60)
   * @param translationId - Translation ID
   */
  async getVersesByHizb(
    hizbNumber: number,
    translationId: string = '131'
  ) {
    try {
      console.log(`🔍 Fetching Hizb ${hizbNumber} verses`);
      
      const response = await this.axiosInstance.get(`/verses`, {
        params: {
          hizb_number: hizbNumber,
          translations: translationId,
          limit: 50,
        },
      });

      console.log(`✅ Found ${response.data.verses?.length || 0} verses in Hizb ${hizbNumber}`);
      return response.data.verses;
    } catch (error) {
      console.error(`❌ Error fetching Hizb:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get verses by Rub (1/240th of Quran)
   * @param rubNumber - Rub number (1-240)
   * @param translationId - Translation ID
   */
  async getVersesByRub(
    rubNumber: number,
    translationId: string = '131'
  ) {
    try {
      console.log(`🔍 Fetching Rub ${rubNumber} verses`);
      
      const response = await this.axiosInstance.get(`/verses`, {
        params: {
          rub_number: rubNumber,
          translations: translationId,
          limit: 50,
        },
      });

      console.log(`✅ Found ${response.data.verses?.length || 0} verses in Rub ${rubNumber}`);
      return response.data.verses;
    } catch (error) {
      console.error(`❌ Error fetching Rub:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Search verses by range (chapter:verse_start to verse_end)
   * @param chapter - Chapter number
   * @param verseStart - Starting verse number
   * @param verseEnd - Ending verse number
   * @param translationId - Translation ID
   */
  async getVersesByRange(
    chapter: number,
    verseStart: number,
    verseEnd: number,
    translationId: string = '131'
  ) {
    try {
      console.log(`🔍 Fetching verses ${chapter}:${verseStart}-${verseEnd}`);
      
      const verses = [];
      for (let v = verseStart; v <= verseEnd; v++) {
        try {
          const response = await this.axiosInstance.get(`/verses/by_key/${chapter}:${v}`, {
            params: {
              translations: translationId,
              fields: 'text_uthmani,chapter_id,verse_number,verse_key,juz_number,hizb_number,rub_number,page_number',
            },
          });
          if (response.data.verse) {
            verses.push(response.data.verse);
          }
        } catch (err) {
          console.warn(`⚠️ Could not fetch verse ${chapter}:${v}`);
        }
      }

      console.log(`✅ Found ${verses.length} verses in range`);
      return verses;
    } catch (error) {
      console.error(`❌ Error fetching verse range:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get verses from a specific chapter
   */
  async getChapterVerses(
    chapterId: number, 
    page: number = 1,
    translationId: string = '131',
    reciterId: string = 'ar.alafasy'
  ) {
    try {
      console.log(`🔍 Fetching chapter ${chapterId} verses (page ${page})`);
      
      const response = await this.axiosInstance.get(`/chapters/${chapterId}/verses`, {
        params: {
          page,
          limit: 20,
          translations: translationId,
          audio: reciterId,
          fields: 'text_uthmani,chapter_id,verse_number,verse_key,words,audio',
        },
      });

      console.log(`✅ Successfully fetched chapter ${chapterId} verses`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching chapter ${chapterId}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get translations for a specific chapter/Surah
   * @param resourceId - Translation resource ID (e.g., 131 for English Sahih International)
   * @param chapterNumber - Chapter number (1-114)
   */
  async getChapterTranslations(resourceId: number, chapterNumber: number) {
    try {
      console.log(`🔍 Fetching translations for chapter ${chapterNumber} using resource ${resourceId}`);
      
      const response = await this.axiosInstance.get(
        `/translations/${resourceId}/by_chapter/${chapterNumber}`
      );

      console.log(`✅ Successfully fetched chapter ${chapterNumber} translations`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching chapter translations:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get chapter audio file with optional word-level segments
   * @param reciterId - Reciter ID (e.g., 7 for Al-Afasy)
   * @param chapterNumber - Chapter number (1-114)
   * @param segments - If true, includes word-level timestamps [word_index, start_ms, end_ms]
   */
  async getChapterAudio(reciterId: number, chapterNumber: number, segments: boolean = false) {
    try {
      console.log(`🔍 Fetching chapter ${chapterNumber} audio from reciter ${reciterId} (segments: ${segments})`);
      
      const params: any = {};
      if (segments) {
        params.segments = 'true';
      }

      const response = await this.axiosInstance.get(
        `/chapter_recitations/${reciterId}/${chapterNumber}`,
        { params }
      );

      console.log(`✅ Successfully fetched chapter ${chapterNumber} audio`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching chapter audio:`, error instanceof Error ? error.message : error);
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
