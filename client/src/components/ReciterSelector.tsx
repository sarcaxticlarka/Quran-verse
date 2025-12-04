'use client';

import { useState } from 'react';

export enum ReciterId {
  ALAFASY = 'ar.alafasy',
  ABDULBASIT = 'ar.abdulbasit_mrattal',
  HUSARY = 'ar.al_husary',
  MINSHAWI = 'ar.al_minshawi',
  PARHIZGAR = 'ar.parhizgar',
  GHAMIDI = 'ar.ghamadi',
  AFASY_WARSH = 'ar.alafasy_warsh',
}

interface ReciterOption {
  id: string;
  name: string;
  country: string;
  style: string;
  flag: string;
}

interface ReciterSelectorProps {
  onSelect: (reciterId: string) => void;
  selected: string;
}

const RECITERS: ReciterOption[] = [
  {
    id: ReciterId.ALAFASY,
    name: 'Mishari Al-Afasy',
    country: 'Kuwait',
    style: 'Modern & Clear',
    flag: '🇰🇼',
  },
  {
    id: ReciterId.ABDULBASIT,
    name: 'Abdul Basit Murattal',
    country: 'Egypt',
    style: 'Slow & Melodious',
    flag: '🇪🇬',
  },
  {
    id: ReciterId.HUSARY,
    name: 'Al-Husary',
    country: 'Egypt',
    style: 'Moderate Speed',
    flag: '🇪🇬',
  },
  {
    id: ReciterId.MINSHAWI,
    name: 'Al-Minshawi',
    country: 'Egypt',
    style: 'Emotional',
    flag: '🇪🇬',
  },
  {
    id: ReciterId.PARHIZGAR,
    name: 'Parhizgar',
    country: 'Iran',
    style: 'Traditional',
    flag: '🇮🇷',
  },
  {
    id: ReciterId.GHAMIDI,
    name: 'Al-Ghamdi',
    country: 'Saudi Arabia',
    style: 'Modern',
    flag: '🇸🇦',
  },
];

export default function ReciterSelector({ 
  onSelect, 
  selected 
}: ReciterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedReciter = RECITERS.find(r => r.id === selected);

  return (
    <div className="relative inline-block w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Reciter
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <span>{selectedReciter?.name}</span>
          <span className="text-xs text-gray-500">({selectedReciter?.country})</span>
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2 max-h-96 overflow-y-auto">
            {RECITERS.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => {
                  onSelect(reciter.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all mb-2 ${
                  selected === reciter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎙️</span>
                    <div>
                      <p className="font-semibold">{reciter.name}</p>
                      <p className="text-xs opacity-75">
                        {reciter.country} • {reciter.style}
                      </p>
                    </div>
                  </div>
                  {selected === reciter.id && <span className="text-lg">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
