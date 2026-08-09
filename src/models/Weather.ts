// TypeScript types and interfaces for weather data (e.g. current conditions, forecast).

/** A single weather condition entry from OpenWeatherMap's `weather` array. */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Geographic coordinates for the requested location. */
export interface WeatherCoordinates {
  lon: number;
  lat: number;
}

/** Temperature and atmospheric readings from the `main` object. */
export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

/** Wind speed and direction. */
export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

/** Cloud coverage percentage. */
export interface WeatherClouds {
  all: number;
}

/** Location metadata from the `sys` object. */
export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

/**
 * Current weather data for a city, matching OpenWeatherMap's
 * `/data/2.5/weather` response shape.
 */
export interface Weather {
  coord: WeatherCoordinates;
  weather: WeatherCondition[];
  base?: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export type WeatherServiceErrorCode =
  | 'MISSING_API_KEY'
  | 'INVALID_CITY'
  | 'NETWORK_ERROR'
  | 'API_ERROR';

/** Error thrown when weather data cannot be fetched. */
export class WeatherServiceError extends Error {
  readonly code: WeatherServiceErrorCode;

  constructor(message: string, code: WeatherServiceErrorCode) {
    super(message);
    this.name = 'WeatherServiceError';
    this.code = code;
  }
}
