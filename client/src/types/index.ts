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
  translation_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReflectionRequest {
  user_id: string;
  verse_key: string;
  reflection_text: string;
  translation_id?: number;
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
  size?: number;
  language?: string;
  translations?: string;
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

// Audio types
export interface AudioSegment {
  word_index: number;
  start_ms: number;
  end_ms: number;
}

export interface VerseTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments?: AudioSegment[];
}

export interface AudioFile {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
  duration: number;
}

export interface ChapterAudioData {
  audio_file: AudioFile;
  verse_timings?: VerseTimestamp[];
}

// Chapter types
export interface Chapter {
  id: number;
  name: string;
  arabic_name: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
  revelation_order: number;
}

export interface ChapterTranslation {
  resource_id: number;
  resource_name: string;
  id: number;
  text: string;
  verse_id: number;
  language_id: number;
  language_name: string;
  verse_key: string;
  chapter_id: number;
  verse_number: number;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
}

// Reciter types
export interface Reciter {
  id: string | number;
  name: string;
  style?: string;
  country?: string;
}

// Translation resource types
export interface TranslationResource {
  id: number;
  name: string;
  language: string;
  author: string;
}
