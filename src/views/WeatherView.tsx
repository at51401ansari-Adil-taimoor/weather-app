import React, { useMemo } from 'react';
import { User } from 'firebase/auth';
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel';
import { useWeatherViewModel } from '../viewmodels/useWeatherViewModel';
import { getBackgroundConfig } from '../services/backgroundService';
import { Header } from './Header';
import { LocationButton } from './LocationButton';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import './WeatherView.css';

interface WeatherViewProps {
  user: User;
  onLogout: () => Promise<void>;
}

export function WeatherView({ user, onLogout }: WeatherViewProps) {
  const {
    weather,
    loading,
    error,
    cityInput,
    setCityInput,
    searchByCity,
    searchForCity,
    searchByLocation,
  } = useWeatherViewModel();

  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavoritesViewModel(user.uid);

  const bgConfig = useMemo(
    () => getBackgroundConfig(weather?.weather?.[0]?.main),
    [weather],
  );

  const handleSaveFavorite = async () => {
    if (!weather) {
      return;
    }

    await addFavorite(weather.name);
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `${bgConfig.gradient}, url(${bgConfig.imageUrl})`,
  };

  return (
    <main className="weather-view" style={backgroundStyle}>
      <div className="weather-view__content">

        {/* Top bar: user email + logout */}
        <div className="weather-view__top-bar">
          <p className="weather-view__user">Signed in as {user.email}</p>
          <button
            className="weather-view__logout"
            type="button"
            onClick={onLogout}
            disabled={loading}
          >
            Logout
          </button>
        </div>

        {/* App title */}
        <Header />

        {/* Two-column grid */}
        <div className="weather-view__grid">

          {/* LEFT — search controls */}
          <div className="weather-view__left">
            <section className="weather-view__controls">
              <SearchBar
                value={cityInput}
                onChange={setCityInput}
                onSubmit={searchByCity}
                disabled={loading}
              />
              <LocationButton onClick={searchByLocation} disabled={loading} />
            </section>
          </div>

          {/* LEFT — weather result (below controls in same column) */}
          <div className="weather-view__result">
            {loading && (
              <p className="weather-view__status" role="status" aria-live="polite">
                Loading weather...
              </p>
            )}

            {!loading && error && (
              <p className="weather-view__error" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && weather && (
              <>
                <WeatherCard weather={weather} glassStyle={bgConfig.glassStyle} />
                <button
                  className="weather-view__save-favorite"
                  type="button"
                  onClick={handleSaveFavorite}
                  disabled={favoritesLoading || isFavorite(weather.name)}
                >
                  {isFavorite(weather.name) ? '✓ Saved to favorites' : '+ Save to favorites'}
                </button>
              </>
            )}
          </div>

          {/* RIGHT — favorites list */}
          <section className="weather-view__favorites">
            <h2 className="weather-view__favorites-title">Favorite Cities</h2>

            {favoritesLoading && favorites.length === 0 && (
              <p className="weather-view__status">Loading favorites...</p>
            )}

            {favoritesError && (
              <p className="weather-view__error" role="alert">
                {favoritesError}
              </p>
            )}

            {!favoritesLoading && favorites.length === 0 && !favoritesError && (
              <p className="weather-view__favorites-empty">
                No saved cities yet. Search for weather and save a city to get started.
              </p>
            )}

            {favorites.length > 0 && (
              <ul className="weather-view__favorites-list">
                {favorites.map((favorite) => (
                  <li key={favorite.id} className="weather-view__favorite-item">
                    <button
                      className="weather-view__favorite-button"
                      type="button"
                      onClick={() => searchForCity(favorite.cityName)}
                      disabled={loading}
                    >
                      {favorite.cityName}
                    </button>
                    <button
                      className="weather-view__favorite-remove"
                      type="button"
                      onClick={() => removeFavorite(favorite.id)}
                      disabled={favoritesLoading}
                      aria-label={`Remove ${favorite.cityName} from favorites`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
