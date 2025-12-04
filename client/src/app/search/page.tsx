'use client';

import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import api from '@/lib/api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const result = await api.searchVerses({
        query: searchQuery,
        user_id: 'default-user',
        page: 1,
        size: 20,
      });

      const results = result.data?.search?.results || [];
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No results found. Try different keywords.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Quran Search
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search the Quran by keywords, phrases, or verse references
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keywords (e.g., mercy, prayer, guidance) or verse (e.g., 2:255)"
              className="w-full px-6 py-4 pr-32 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Found {searchResults.length} results
            </h2>
            
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-emerald-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Surah {result.verse_key}
                  </span>
                </div>
                
                {/* Arabic Text */}
                <p className="text-2xl font-arabic text-right leading-loose text-gray-900 dark:text-white mb-4">
                  {result.text}
                </p>
                
                {/* Translation */}
                {result.translations && result.translations[0] && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed border-t pt-4 dark:border-gray-700">
                    {stripHtml(result.translations[0].text)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        {!searchResults.length && !error && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Search by Keywords
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Enter words like: mercy, guidance, prayer, patience
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Example: "mercy"
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Search by Verse Reference
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Enter verse in format: Surah:Verse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Example: "2:255" for Ayat al-Kursi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
