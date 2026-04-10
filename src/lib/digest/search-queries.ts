import type { Colleague } from '@/types';

/** Build 2-4 SerpAPI search queries per colleague based on their profile */
export function buildSearchQueries(colleague: Colleague): string[] {
  const queries: string[] = [];
  const now = new Date();
  const monthYear = `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`;

  const locations = colleague.grew_up_places
    ? colleague.grew_up_places.split('|').map((p) => p.trim().split(',')[0]?.trim()).filter(Boolean)
    : [];
  const currentCity = colleague.current_city || '';

  // Query based on preference type
  switch (colleague.preference_type) {
    case 'sports': {
      const sports = colleague.sports_detail || 'sports';
      queries.push(`${sports} news ${monthYear}`);
      if (locations.length > 0) {
        queries.push(`${locations[0]} sports events ${monthYear}`);
      }
      break;
    }
    case 'outdoor': {
      const hobbies = colleague.hobbies || 'outdoor activities';
      queries.push(`${hobbies} events ${monthYear}`);
      if (currentCity) {
        queries.push(`${currentCity} outdoor events ${monthYear}`);
      }
      break;
    }
    case 'culture':
    default: {
      if (locations.length > 0) {
        queries.push(`${locations[0]} cultural festivals ${monthYear}`);
      }
      queries.push(`cultural events festivals ${monthYear}`);
      break;
    }
  }

  // Food / cuisine query from notes or location
  if (colleague.notes) {
    const foodMatch = colleague.notes.match(/(?:loves?|enjoys?|fan of)\s+([^,."]+(?:food|cuisine|cooking|restaurant))/i);
    if (foodMatch) {
      queries.push(`${foodMatch[1].trim()} ${monthYear}`);
    }
  }
  if (queries.length < 3 && locations.length > 0) {
    queries.push(`${locations[0]} food festivals ${monthYear}`);
  }

  // Hobby-specific query
  if (colleague.hobbies && queries.length < 4) {
    const firstHobby = colleague.hobbies.split(',')[0]?.trim();
    if (firstHobby) {
      queries.push(`${firstHobby} events news ${monthYear}`);
    }
  }

  // Ensure at least 2 queries
  if (queries.length < 2 && currentCity) {
    queries.push(`${currentCity} events ${monthYear}`);
  }

  return queries.slice(0, 4);
}
