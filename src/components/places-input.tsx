'use client';

import { useState } from 'react';

interface Place {
  city: string;
  country: string;
}

interface PlacesInputProps {
  label: string;
  value: string; // pipe-delimited: "City, Country | City, Country"
  onChange: (value: string) => void;
}

function parsePlaces(value: string): Place[] {
  if (!value) return [{ city: '', country: '' }];
  const places = value.split('|').map((p) => {
    const parts = p.trim().split(',').map((s) => s.trim());
    return { city: parts[0] || '', country: parts[1] || '' };
  });
  return places.length > 0 ? places : [{ city: '', country: '' }];
}

function serializePlaces(places: Place[]): string {
  return places
    .filter((p) => p.city || p.country)
    .map((p) => `${p.city}, ${p.country}`)
    .join(' | ');
}

export default function PlacesInput({ label, value, onChange }: PlacesInputProps) {
  const [places, setPlaces] = useState<Place[]>(parsePlaces(value));

  function update(newPlaces: Place[]) {
    setPlaces(newPlaces);
    onChange(serializePlaces(newPlaces));
  }

  function addPlace() {
    update([...places, { city: '', country: '' }]);
  }

  function removePlace(index: number) {
    if (places.length <= 1) return;
    update(places.filter((_, i) => i !== index));
  }

  function updatePlace(index: number, field: keyof Place, val: string) {
    const updated = places.map((p, i) => (i === index ? { ...p, [field]: val } : p));
    update(updated);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {places.map((place, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            placeholder="City"
            value={place.city}
            onChange={(e) => updatePlace(i, 'city', e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Country"
            value={place.country}
            onChange={(e) => updatePlace(i, 'country', e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {places.length > 1 && (
            <button
              type="button"
              onClick={() => removePlace(i)}
              className="text-red-500 hover:text-red-700 text-sm px-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addPlace}
        className="text-sm text-blue-600 hover:text-blue-800 mt-1"
      >
        + Add another place
      </button>
    </div>
  );
}