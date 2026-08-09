// API calls to OpenWeatherMap (fetch weather by city, coordinates, etc.).

import {
  Weather,
  WeatherServiceError,
} from '../models/Weather';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface OpenWeatherMapErrorResponse {
  cod?: number | string;
  message?: string;
}

function getApiKey(): string {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY?.trim();

  if (!apiKey) {
    throw new WeatherServiceError(
      'Missing API key. Set REACT_APP_WEATHER_API_KEY in your .env file.',
      'MISSING_API_KEY',
    );
  }

  return apiKey;
}

function normalizeCityName(city: string): string {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    throw new WeatherServiceError('City name is required.', 'INVALID_CITY');
  }

  return trimmedCity;
}

function buildWeatherUrl(apiKey: string): URL {
  const url = new URL(WEATHER_API_BASE_URL);
  url.searchParams.set('appid', apiKey);
  url.searchParams.set('units', 'metric');
  return url;
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const errorBody = (await response.json()) as OpenWeatherMapErrorResponse;
    if (errorBody.message) {
      return errorBody.message;
    }
  } catch {
    // Fall back to a generic message when the error body is not JSON.
  }

  return `Weather API request failed with status ${response.status}.`;
}

async function requestWeather(
  url: URL,
  notFoundMessage?: string,
): Promise<Weather> {
  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new WeatherServiceError(
      'Network error. Please check your connection and try again.',
      'NETWORK_ERROR',
    );
  }

  if (response.status === 404 && notFoundMessage) {
    throw new WeatherServiceError(notFoundMessage, 'INVALID_CITY');
  }

  if (response.status === 401) {
    throw new WeatherServiceError(
      'Invalid API key. Check REACT_APP_WEATHER_API_KEY in your .env file.',
      'MISSING_API_KEY',
    );
  }

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new WeatherServiceError(message, 'API_ERROR');
  }

  const data = (await response.json()) as Weather;

  if (Number(data.cod) !== 200) {
    throw new WeatherServiceError(
      notFoundMessage ?? 'Weather data could not be retrieved.',
      notFoundMessage ? 'INVALID_CITY' : 'API_ERROR',
    );
  }

  return data;
}

/**
 * Fetches current weather data from OpenWeatherMap for the given city name.
 *
 * @throws {WeatherServiceError} When the API key is missing, the city is invalid,
 * the network request fails, or the API returns an error response.
 */
export async function fetchWeatherByCity(city: string): Promise<Weather> {
  const apiKey = getApiKey();
  const normalizedCity = normalizeCityName(city);

  const url = buildWeatherUrl(apiKey);
  url.searchParams.set('q', normalizedCity);

  return requestWeather(
    url,
    `City "${normalizedCity}" not found.`,
  );
}

/**
 * Fetches current weather data from OpenWeatherMap for the given coordinates.
 *
 * @throws {WeatherServiceError} When the API key is missing, the network request
 * fails, or the API returns an error response.
 */
export async function fetchWeatherByCoordinates(
  latitude: number,
  longitude: number,
): Promise<Weather> {
  const apiKey = getApiKey();

  const url = buildWeatherUrl(apiKey);
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));

  return requestWeather(url);
}
