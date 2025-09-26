import * as Location from 'expo-location';

export interface Coordinates { latitude: number; longitude: number }
export interface PlaceSuggestion { id: string; description: string; placeId?: string }

// NOTE: To use Google Places, set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in mobile/.env or app config
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export async function getCurrentPosition(): Promise<Coordinates | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

export async function getPlaceSuggestions(query: string): Promise<PlaceSuggestion[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !query) return [];
  const url = `${GOOGLE_PLACES_URL}?input=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  return (json.predictions || []).map((p: any) => ({ id: p.place_id, description: p.description, placeId: p.place_id }));
}

export async function geocodePlaceId(placeId: string): Promise<Coordinates | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !placeId) return null;
  const url = `${GOOGLE_GEOCODE_URL}?place_id=${encodeURIComponent(placeId)}&key=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  const loc = json.results?.[0]?.geometry?.location;
  return loc ? { latitude: loc.lat, longitude: loc.lng } : null;
}


