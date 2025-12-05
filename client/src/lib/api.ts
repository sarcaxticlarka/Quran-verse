import axios, { AxiosInstance } from 'axios';
import {
  VerseOfDayResponse,
  CreateReflectionRequest,
  ReflectionsResponse,
  SearchQuery,
  SearchResponse,
  ApiResponse,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

   
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

   
  async getVerseOfDay(): Promise<VerseOfDayResponse> {
    const { data } = await this.client.get<VerseOfDayResponse>('/verse-of-day');
    return data;
  }

  // User Management (Google OAuth)
  async syncGoogleUser(userData: {
    email: string;
    name: string;
    google_id: string;
    profile_image?: string;
  }): Promise<ApiResponse> {
    const { data } = await this.client.post<ApiResponse>('/users/sync', userData);
    return data;
  }

  async getUserByEmail(email: string): Promise<ApiResponse> {
    const { data } = await this.client.get<ApiResponse>(`/users/${email}`);
    return data;
  }

  async getUserReflections(email: string): Promise<ReflectionsResponse> {
    const { data } = await this.client.get<ReflectionsResponse>(`/users/${email}/reflections`);
    return data;
  }

  // Reflections
  async createReflection(reflection: CreateReflectionRequest): Promise<ApiResponse> {
    const { data } = await this.client.post<ApiResponse>('/reflections', reflection);
    return data;
  }

  async getReflectionsByVerseKey(verseKey: string): Promise<ReflectionsResponse> {
    const { data } = await this.client.get<ReflectionsResponse>(`/reflections/${verseKey}`);
    return data;
  }

  async getReflectionsByUserId(userId: string): Promise<ReflectionsResponse> {
    const { data } = await this.client.get<ReflectionsResponse>(`/reflections/user/${userId}`);
    return data;
  }

  // Search
  async searchVerses(searchQuery: SearchQuery): Promise<SearchResponse> {
    const { data } = await this.client.post<SearchResponse>('/search', searchQuery);
    return data;
  }

  // Translations
  async getTranslations(): Promise<any> {
    const { data } = await this.client.get('/translations');
    return data;
  }

  async getReciters(): Promise<any> {
    const { data } = await this.client.get('/reciters');
    return data;
  }

  async getChapters(): Promise<any> {
    const { data } = await this.client.get('/chapters');
    return data;
  }

  async getChapterVerses(chapterId: number, params?: {
    translation?: string;
    reciter?: string;
    page?: number;
  }): Promise<any> {
    const { data } = await this.client.get(`/chapters/${chapterId}/verses`, { params });
    return data;
  }

  async getChapterTranslations(resourceId: number, chapterNumber: number): Promise<any> {
    const { data } = await this.client.get(`/translations/${resourceId}/chapter/${chapterNumber}`);
    return data;
  }

  async getChapterAudio(reciterId: number, chapterNumber: number, segments: boolean = false): Promise<any> {
    const { data } = await this.client.get(`/chapter-audio/${reciterId}/${chapterNumber}`, {
      params: { segments: segments ? 'true' : 'false' }
    });
    return data;
  }

  // Positional search methods
  async getVerseByPosition(
    chapter: number,
    verse: number,
    translationId: string = '131'
  ): Promise<any> {
    const { data } = await this.client.get(`/verse-by-position/${chapter}/${verse}`, {
      params: { translation: translationId }
    });
    return data;
  }

  async getVersesByJuz(juzNumber: number, translationId: string = '131'): Promise<any> {
    const { data } = await this.client.get(`/verses-by-juz/${juzNumber}`, {
      params: { translation: translationId }
    });
    return data;
  }

  async getVersesByHizb(hizbNumber: number, translationId: string = '131'): Promise<any> {
    const { data } = await this.client.get(`/verses-by-hizb/${hizbNumber}`, {
      params: { translation: translationId }
    });
    return data;
  }

  async getVersesByRub(rubNumber: number, translationId: string = '131'): Promise<any> {
    const { data } = await this.client.get(`/verses-by-rub/${rubNumber}`, {
      params: { translation: translationId }
    });
    return data;
  }

  async getVersesByRange(
    chapter: number,
    verseStart: number,
    verseEnd: number,
    translationId: string = '131'
  ): Promise<any> {
    const { data } = await this.client.get(`/verses-by-range/${chapter}/${verseStart}/${verseEnd}`, {
      params: { translation: translationId }
    });
    return data;
  }
}

export default new ApiClient();
