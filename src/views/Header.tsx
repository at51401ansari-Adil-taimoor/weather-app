import React from 'react';

export function Header() {
  return (
    <header className="weather-header">
      <h1 className="weather-header__title">Weather App</h1>
      <p className="weather-header__subtitle">
        Search for a city or use your current location
      </p>
    </header>
  );
}
