'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ColleagueForm from '@/components/forms/colleague-form';
import Link from 'next/link';

type Step = 'lookup' | 'form' | 'success' | 'limit-reached';

export default function AddColleaguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <AddColleagueContent />
    </Suspense>
  );
}

function AddColleagueContent() {
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';

  const [step, setStep] = useState<Step>(prefilledEmail ? 'lookup-auto' as Step : 'lookup');
  const [email, setEmail] = useState(prefilledEmail);
  const [userId, setUserId] = useState('');
  const [currentCount, setCurrentCount] = useState(0);
  const [maxConnections, setMaxConnections] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Auto-lookup if email was pre-filled from registration
  useState(() => {
    if (prefilledEmail) {
      doLookup(prefilledEmail);
    }
  });

  async function doLookup(lookupEmail: string) {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/colleagues/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lookupEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setStep('lookup');
        return;
      }

      setUserId(data.user_id);
      setCurrentCount(data.current_count);
      setMaxConnections(data.max_connections);

      if (data.limit_reached) {
        setStep('limit-reached');
      } else {
        setStep('form');
      }
    } catch {
      setError('Network error. Please try again.');
      setStep('lookup');
    } finally {
      setLoading(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    await doLookup(email);
  }

  function handleColleagueSuccess() {
    setStep('success');
  }

  // Step: Email lookup
  if (step === 'lookup') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a Colleague</h1>
          <p className="text-gray-600 mb-6">Enter your email to get started.</p>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Looking up...' : 'Continue'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step: Limit reached
  if (step === 'limit-reached') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connection Limit Reached</h1>
          <p className="text-gray-600 mb-6">
            You have {currentCount} connections (max {maxConnections}).
            To add a new colleague, remove one first.
          </p>
          <div className="space-y-3">
            <Link
              href={`/request-limit?email=${encodeURIComponent(email)}&current_limit=${maxConnections}`}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium text-center"
            >
              Request Limit Increase
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step: Colleague form
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a Colleague</h1>
          <p className="text-gray-600 mb-6">
            Tell us about your colleague so we can create personalized conversation starters.
          </p>
          <ColleagueForm
            userId={userId}
            mode="add"
            onSuccess={handleColleagueSuccess}
          />
        </div>
      </div>
    );
  }

  // Step: Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Colleague Added!</h1>
          <p className="text-gray-600 mb-6">
            Your colleague has been added to your connections.
          </p>
          <Link
            href={`/colleagues/add?email=${encodeURIComponent(email)}`}
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-medium"
          >
            + Add Another Colleague
          </Link>
        </div>
      </div>
    );
  }

  // Loading state (auto-lookup)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
