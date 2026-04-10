'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ColleagueForm from '@/components/forms/colleague-form';
import Link from 'next/link';
import type { Colleague } from '@/types';

export default function EditColleaguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <EditColleagueContent />
    </Suspense>
  );
}

function EditColleagueContent() {
  const searchParams = useSearchParams();
  const colleagueId = searchParams.get('colleague_id') || '';
  const userId = searchParams.get('user_id') || '';
  const token = searchParams.get('token') || '';

  const [colleague, setColleague] = useState<Colleague | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Changes Saved!</h1>
          <p className="text-gray-600">
            Updated info will appear in your next digest email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Colleague</h1>
        <p className="text-gray-600 mb-6">Update {colleague?.name}&apos;s information.</p>
        {colleague && (
          <ColleagueForm
            userId={userId}
            initialData={colleague}
            mode="edit"
            token={token}
            onSuccess={() => setSaved(true)}
          />
        )}
      </div>
    </div>
  );
}
