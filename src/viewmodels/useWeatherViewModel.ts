// Custom hook: weather state, loading/error handling, and business logic for the UI.

import { useCallback, useState } from 'react';
import { Weather, WeatherServiceError } from '../models/Weather';
import {
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from '../services/weatherService';

function getErrorMessage(error: unknown): string {
  if (error instanceof WeatherServiceError) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Enable location permissions to use this feature.';
    case error.POSITION_UNAVAILABLE:
      return 'Your location is unavailable right now. Try searching for a city instead.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'Unable to retrieve your location. Please try again.';
  }
}

export interface WeatherViewModel {
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  cityInput: string;
  setCityInput: (value: string) => void;
  searchByCity: () => Promise<void>;
  searchForCity: (city: string) => Promise<void>;
  searchByLocation: () => void;
}

export function useWeatherViewModel(): WeatherViewModel {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState('');

  const searchForCity = useCallback(async (city: string) => {
    const normalizedCity = city.trim();
    setCityInput(normalizedCity);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(normalizedCity);
      setWeather(data);
    } catch (requestError) {
      setWeather(null);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCity = useCallback(async () => {
    await searchForCity(cityInput);
  }, [cityInput, searchForCity]);

  const searchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setWeather(data);
          setCityInput(data.name);
        } catch (requestError) {
          setWeather(null);
          setError(getErrorMessage(requestError));
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setWeather(null);
        setError(getGeolocationErrorMessage(geoError));
        setLoading(false);
      },
    );
  }, []);

  return {
    weather,
    loading,
    error,
    cityInput,
    setCityInput,
    searchByCity,
    searchForCity,
    searchByLocation,
  };
}
