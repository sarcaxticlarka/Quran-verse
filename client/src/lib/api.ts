import axios, { AxiosInstance } from 'axios';
import {
  VerseOfDayResponse,
  CreateReflectionRequest,
  ReflectionsResponse,
  SearchQuery,
  SearchResponse,
  SearchHistoryResponse,
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

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Verse of the Day
  async getVerseOfDay(): Promise<VerseOfDayResponse> {
    const { data } = await this.client.get<VerseOfDayResponse>('/verse-of-day');
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

  async getSearchHistory(userId: string, limit: number = 20): Promise<SearchHistoryResponse> {
    const { data } = await this.client.get<SearchHistoryResponse>(
      `/search/history/${userId}?limit=${limit}`
    );
    return data;
  }
}

export default new ApiClient();
