"use client";

import React from 'react';
import { BookOpen, PenLine, CalendarDays } from 'lucide-react';
import useSWR from 'swr';
import { useSession, signIn } from 'next-auth/react';
import api from '@/lib/api';
import { Reflection } from '@/types';

export default function ReflectionsPage() {
  const { data: session, status } = useSession();

  const { data, error, isLoading } = useSWR(
    session ? `user-reflections-${session.user?.email}` : null,
    () => api.getUserReflections(session!.user!.email as string)
  );

  const reflections: Reflection[] = data?.data || [];

  if (status === 'loading') {
    return <div className="p-6">Loading session...</div>;
  }

  if (!session) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto bg-primary-50 rounded-xl shadow-lg p-8 border border-gold-100">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-7 h-7 text-primary-700" />
            <h1 className="text-3xl font-display font-bold text-primary-800">My Reflections</h1>
          </div>
          <p className="mb-4">Sign in to view and manage your saved reflections.</p>
          <button
            onClick={() => signIn('google')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow"
          >
            <PenLine className="w-5 h-5" /> Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-primary-50 rounded-xl shadow-lg p-8 border border-gold-100">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-primary-700" />
          <h1 className="text-3xl font-display font-bold text-primary-800">My Reflections</h1>
        </div>

        {error && <p className="text-red-600">Failed to load reflections</p>}

        {isLoading ? (
          <p>Loading reflections...</p>
        ) : reflections.length === 0 ? (
          <p className="text-gray-500">You don't have any reflections yet.</p>
        ) : (
          <div className="space-y-4">
            {reflections.map((r: Reflection) => (
              <div key={r.id} className="p-4 border border-gold-100 rounded-xl bg-white/80 shadow flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <PenLine className="w-5 h-5 text-accent-500" />
                  <span className="text-gray-800 font-medium">{r.reflection_text}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-primary-700">
                  <BookOpen className="w-4 h-4" />
                  <span>Verse: {r.verse_key}</span>
                  <CalendarDays className="w-4 h-4 ml-2" />
                  <span>Created: {new Date(r.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
