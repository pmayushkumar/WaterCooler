export interface User {
  user_id: string;
  name: string;
  email: string;
  grew_up_places: string; // pipe-delimited: "City, Country | City, Country"
  current_city: string;
  current_country: string;
  secret_token: string;
  created_at: string;
}

export interface Colleague {
  colleague_id: string;
  user_id: string;
  name: string;
  grew_up_places: string;
  current_city: string;
  current_country: string;
  family_info: string;
  hobbies: string;
  preference_type: 'outdoor' | 'culture' | 'sports';
  sports_detail: string;
  notes: string;
  created_at: string;
}

export interface DigestEvent {
  category: 'sports' | 'food' | 'festival' | 'news' | 'hobby';
  event_title: string;
  user_explainer: string;
  why_it_matters: string;
  conversation_starter: string;
  follow_ups: string[];
}

export interface ColleagueDigest {
  colleague_id: string;
  colleague_name: string;
  events: DigestEvent[];
}

export interface GeminiResponse {
  colleagues: ColleagueDigest[];
}

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

export interface ColleagueSearchResults {
  colleague_id: string;
  colleague_name: string;
  results: SearchResult[];
}