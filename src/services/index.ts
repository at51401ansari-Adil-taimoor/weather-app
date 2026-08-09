// Re-exports for service modules that talk to external APIs.

export { register, login, logout } from './authService';
export { addFavorite, removeFavorite, getFavorites } from './favoritesService';
export { fetchWeatherByCity, fetchWeatherByCoordinates } from './weatherService';
