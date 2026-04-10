import type { SearchResult } from '@/types';

const RATE_LIMIT_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Execute a single SerpAPI search */
async function searchSerpApi(query: string, apiKey: string): Promise<SearchResult[]> {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('engine', 'google');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', '5');

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return [];

    const data = await res.json();
    const organic = data.organic_results || [];

    return organic.slice(0, 5).map((r: { title?: string; snippet?: string; link?: string }) => ({
      title: r.title || '',
      snippet: r.snippet || '',
      link: r.link || '',
    }));
  } catch {
    return [];
  }
}

/** Execute multiple search queries with rate limiting (500ms between requests) */
export async function executeSearches(
  queries: string[],
  apiKey: string
): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];

  for (let i = 0; i < queries.length; i++) {
    if (i > 0) await sleep(RATE_LIMIT_MS);
    const results = await searchSerpApi(queries[i], apiKey);
    allResults.push(...results);
  }

  return allResults;
}
