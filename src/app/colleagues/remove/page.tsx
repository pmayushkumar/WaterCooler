'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Colleague } from '@/types';

export default function RemoveColleaguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <RemoveColleagueContent />
    </Suspense>
  );
}

function RemoveColleagueContent() {
  const searchParams = useSearchParams();
  const colleagueId = searchParams.get('colleague_id') || '';
  const userId = searchParams.get('user_id') || '';
  const token = searchParams.get('token') || '';

  const [colleague, setColleague] = useState<Colleague | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!colleagueId || !userId || !token) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    fetch(`/api/colleagues/${colleagueId}?user_id=${userId}&token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setColleague(data);
        }
      })
      .catch(() => setError('Failed to load colleague data'))
      .finally(() => setLoading(false));
  }, [colleagueId, userId, token]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/colleagues/${colleagueId}?user_id=${userId}&token=${token}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete');
      } else {
        setDeleted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Colleague Removed</h1>
          <p className="text-gray-600">
            {colleague?.name} has been removed from your connections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Remove Colleague?</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove <strong>{colleague?.name}</strong> from your connections?
          They won&apos;t appear in your digest emails anymore.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            {deleting ? 'Removing...' : 'Yes, Remove'}
          </button>
          <button
            onClick={() => window.close()}
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
