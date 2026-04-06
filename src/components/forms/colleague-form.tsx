'use client';

import { useState } from 'react';
import PlacesInput from '@/components/places-input';

interface ColleagueFormProps {
  userId: string;
  initialData?: {
    colleague_id?: string;
    name?: string;
    grew_up_places?: string;
    current_city?: string;
    current_country?: string;
    family_info?: string;
    hobbies?: string;
    preference_type?: string;
    sports_detail?: string;
    notes?: string;
  };
  onSuccess: (data: { colleague_id: string; is_first?: boolean }) => void;
  mode: 'add' | 'edit';
  token?: string;
}

export default function ColleagueForm({ userId, initialData, onSuccess, mode, token }: ColleagueFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [grewUpPlaces, setGrewUpPlaces] = useState(initialData?.grew_up_places || '');
  const [currentCity, setCurrentCity] = useState(initialData?.current_city || '');
  const [currentCountry, setCurrentCountry] = useState(initialData?.current_country || '');
  const [familyInfo, setFamilyInfo] = useState(initialData?.family_info || '');
  const [hobbies, setHobbies] = useState(initialData?.hobbies || '');
  const [preferenceType, setPreferenceType] = useState(initialData?.preference_type || 'culture');
  const [sportsDetail, setSportsDetail] = useState(initialData?.sports_detail || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        user_id: userId,
        name,
        grew_up_places: grewUpPlaces,
        current_city: currentCity,
        current_country: currentCountry,
        family_info: familyInfo,
        hobbies,
        preference_type: preferenceType,
        sports_detail: sportsDetail,
        notes,
      };

      let url: string;
      let method: string;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (mode === 'edit' && initialData?.colleague_id) {
        url = `/api/colleagues/${initialData.colleague_id}`;
        method = 'PUT';
        if (token) headers['X-Token'] = token;
      } else {
        url = '/api/colleagues';
        method = 'POST';
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      onSuccess(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Colleague's full name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <PlacesInput
        label="Places they grew up"
        value={grewUpPlaces}
        onChange={setGrewUpPlaces}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
          <input
            type="text"
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            placeholder="Mumbai"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Country</label>
          <input
            type="text"
            value={currentCountry}
            onChange={(e) => setCurrentCountry(e.target.value)}
            placeholder="India"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Family Info</label>
        <input
          type="text"
          value={familyInfo}
          onChange={(e) => setFamilyInfo(e.target.value)}
          placeholder="e.g., Married with 2 kids, parents live in Delhi"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
        <input
          type="text"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="e.g., hiking, cooking, photography"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What are they most into?</label>
        <select
          value={preferenceType}
          onChange={(e) => setPreferenceType(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="culture">Culture & Arts</option>
          <option value="sports">Sports</option>
          <option value="outdoor">Outdoor & Adventure</option>
        </select>
      </div>

      {preferenceType === 'sports' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specific Sports</label>
          <input
            type="text"
            value={sportsDetail}
            onChange={(e) => setSportsDetail(e.target.value)}
            placeholder="e.g., cricket, IPL, F1, UFC"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder={`Anything else that could help personalize conversations? For example:
- Favorite cuisine or restaurant ("loves authentic Sichuan food")
- A recent trip ("just got back from Japan")
- Something they're proud of ("ran their first marathon")
- A shared experience ("we bonded over the offsite in Goa")
- Media they enjoy ("big fan of F1 Drive to Survive")`}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Colleague'}
      </button>
    </form>
  );
}
