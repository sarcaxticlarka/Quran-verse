'use client';

import VerseOfDay from '@/components/VerseOfDay';
import SearchComponent from '@/components/SearchComponent';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quran Application
          </h1>
          <p className="text-gray-600 text-lg">
            Daily verses, reflections, and spiritual insights
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Verse of the Day */}
          <VerseOfDay />

          {/* Search Component */}
          <SearchComponent />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Quran Application. Built with Next.js and Node.js</p>
          <p className="mt-2">Data from Quran.Foundation API</p>
        </footer>
      </div>
    </main>
  );
}
