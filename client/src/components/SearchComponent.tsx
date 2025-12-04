'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { SearchResult } from '@/types';

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const userId = process.env.NEXT_PUBLIC_USER_ID || 'default-user';

  const { data: historyData, mutate: mutateHistory } = useSWR(
    showHistory ? `search-history-${userId}` : null,
    () => api.getSearchHistory(userId)
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await api.searchVerses({
        query: searchQuery,
        user_id: userId,
        page: 1,
      });

      setSearchResults(response.data?.search?.results || []);
      mutateHistory(); // Refresh search history
    } catch (err) {
      setError('Failed to search verses. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const history = historyData?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Search Quran</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for verses..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Search History */}
      {showHistory && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recent Searches
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No search history</p>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <button
                    onClick={() => {
                      setSearchQuery(item.search_query);
                      setShowHistory(false);
                    }}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {item.search_query}
                  </button>
                  <span className="text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Search Results ({searchResults.length})
          </h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.verse_id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600">
                    {result.verse_key}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">{result.text}</p>
                {result.translations && result.translations.length > 0 && (
                  <p className="text-sm text-gray-600 border-t pt-2">
                    {result.translations[0].text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !isSearching && searchQuery && (
        <p className="text-gray-500 text-center py-8">
          No results found. Try a different search term.
        </p>
      )}
    </div>
  );
}
