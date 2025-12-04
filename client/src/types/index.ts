export interface Verse {
  id: number;
  verse_number: number;
  chapter_id: number;
  verse_key: string;
  text_uthmani: string;
  translations?: Translation[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface VerseOfDayResponse {
  success: boolean;
  message: string;
  cached: boolean;
  data: {
    verse: Verse;
  };
}

export interface Reflection {
  id: number;
  user_id: string;
  verse_key: string;
  reflection_text: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReflectionRequest {
  user_id: string;
  verse_key: string;
  reflection_text: string;
}

export interface ReflectionsResponse {
  success: boolean;
  message: string;
  data: Reflection[];
}

export interface SearchQuery {
  query: string;
  user_id: string;
  page?: number;
}

export interface SearchResult {
  verse_id: number;
  verse_key: string;
  text: string;
  translations?: Translation[];
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    search: {
      results: SearchResult[];
      current_page: number;
      total_pages: number;
      total_records: number;
    };
  };
}

export interface SearchHistoryItem {
  id: number;
  user_id: string;
  search_query: string;
  created_at: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  message: string;
  data: SearchHistoryItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
