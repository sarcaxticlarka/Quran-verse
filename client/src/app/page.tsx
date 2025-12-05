'use client';


import VerseOfDay from '@/components/VerseOfDay';
import Link from 'next/link';
import { Search, BookOpen, Heart } from 'lucide-react';

// Islamic icons (SVGs)
const CrescentMoon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 20c0 7-5 12-12 12-2 0-4-.5-6-1.5C18 32 28 24 28 12c0-2-.5-4-1.5-6C27 8 30 13 30 20z" fill="#ffd700" />
  </svg>
);
const  StarAndCrescent = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
 
    <path
      d="M 30 5 A 25 25 0 1 0 30 55 A 20 20 0 1 1 30 10 Z"
      fill="#DAA520"  
    />

 
    <polygon
      points="30,15 34,26 45,26 36,33 39,44 30,38 21,44 24,33 15,26 26,26"
      fill="#FFD700"  
    />
  </svg>
);

 

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CrescentMoon />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 drop-shadow-lg">
              Quran Application
            </h1>
            <StarAndCrescent />
          </div>
          <p className="text-primary-700 text-lg font-arabic">
            ﷽ <span className="ml-2">Daily verses, reflections, and spiritual insights</span>
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Verse of the Day */}
          <div className="rounded-xl border border-gold-500 bg-white/80 shadow-lg p-6">
            <VerseOfDay />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/search"
              className="bg-primary-100 rounded-lg shadow-lg p-8 border-l-4 border-gold-500 hover:shadow-xl transition-shadow group hover:bg-gold-100"
            >
              <div className="flex items-center gap-4">
                <Search className="w-10 h-10 text-primary-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-2 font-display">
                    Search Quran
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Find verses by keywords or references
                  </p>
                </div>
              </div>
            </Link>

            <Link 
              href="/reflections"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <Heart className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    My Reflections
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View your saved reflections and insights
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2024 Quran Application. Built with Next.js and Node.js</p>
          <p className="mt-2">Data from Quran.com API</p>
        </footer>
      </div>
    </main>
  );
}
