import React from 'react';
import { Weather } from '../models/Weather';

interface WeatherCardProps {
  weather: Weather;
}

function formatDescription(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const description = weather.weather[0]?.description ?? 'No description available';

  return (
    <article className="weather-card">
      <div className="weather-card__header">
        <h2 className="weather-card__location">
          {weather.name}, {weather.sys.country}
        </h2>
        <p className="weather-card__description">
          {formatDescription(description)}
        </p>
      </div>

      <p className="weather-card__temperature">
        {Math.round(weather.main.temp)}
        <span className="weather-card__unit">°C</span>
      </p>

      <dl className="weather-card__details">
        <div className="weather-card__detail">
          <dt>Humidity</dt>
          <dd>{weather.main.humidity}%</dd>
        </div>
        <div className="weather-card__detail">
          <dt>Wind Speed</dt>
          <dd>{weather.wind.speed} m/s</dd>
        </div>
      </dl>
    </article>
  );
}
