import type { GeminiResponse, Colleague, ColleagueDigest } from '@/types';

/** Call Gemini API and parse the JSON response */
export async function callGemini(prompt: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return parseGeminiResponse(rawText);
}

/** Extract JSON from Gemini response (handles markdown wrapping) */
function parseGeminiResponse(rawText: string): GeminiResponse {
  // Try to extract JSON from the response (may be wrapped in markdown code fences)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Gemini response');
  }

  return JSON.parse(jsonMatch[0]);
}

/** Generate basic fallback starters when Gemini fails */
export function generateFallbackDigest(colleagues: Colleague[]): GeminiResponse {
  return {
    colleagues: colleagues.map((col): ColleagueDigest => {
      const events = [];

      if (col.hobbies) {
        events.push({
          category: 'hobby' as const,
          event_title: `${col.name}'s interests`,
          user_explainer: `${col.name} enjoys ${col.hobbies}.`,
          why_it_matters: `Showing interest in someone's hobbies is a great way to build rapport.`,
          conversation_starter: `Hey ${col.name}, have you been doing any ${col.hobbies.split(',')[0]?.trim()} lately?`,
          follow_ups: [
            'How did you get into that?',
            'What do you enjoy most about it?',
            'Any recommendations for someone new to it?',
          ],
        });
      }

      if (col.notes) {
        events.push({
          category: 'hobby' as const,
          event_title: 'Personal connection',
          user_explainer: `Based on what you know about ${col.name}.`,
          why_it_matters: `Personal details make conversations feel genuine.`,
          conversation_starter: `I was thinking about what you mentioned — ${col.notes.substring(0, 80)}. How's that going?`,
          follow_ups: [
            'Tell me more about that!',
            'What got you interested?',
            'Any updates since we last talked?',
          ],
        });
      }

      // Always have at least one event
      if (events.length === 0) {
        const location = col.current_city || col.grew_up_places?.split('|')[0]?.trim() || 'your area';
        events.push({
          category: 'news' as const,
          event_title: `Catch up with ${col.name}`,
          user_explainer: `Sometimes the best conversations start with a simple check-in.`,
          why_it_matters: `${col.name} is based in ${location} — ask about what's happening there.`,
          conversation_starter: `Hey ${col.name}, anything interesting happening in ${location} lately?`,
          follow_ups: [
            'Been up to anything fun this weekend?',
            'Tried any good restaurants recently?',
            'Any trips planned?',
          ],
        });
      }

      return {
        colleague_id: col.colleague_id,
        colleague_name: col.name,
        events,
      };
    }),
  };
}

/** Validate colleague IDs in Gemini output match the input, with name-matching fallback */
export function validateColleagueIds(
  response: GeminiResponse,
  colleagues: Colleague[]
): GeminiResponse {
  return {
    colleagues: response.colleagues.map((digestCol) => {
      // Check if ID matches an input colleague
      const matchById = colleagues.find((c) => c.colleague_id === digestCol.colleague_id);
      if (matchById) return digestCol;

      // Fallback: match by name
      const matchByName = colleagues.find(
        (c) => c.name.toLowerCase() === digestCol.colleague_name?.toLowerCase()
      );
      if (matchByName) {
        return { ...digestCol, colleague_id: matchByName.colleague_id };
      }

      // Keep as-is if no match found
      return digestCol;
    }),
  };
}
