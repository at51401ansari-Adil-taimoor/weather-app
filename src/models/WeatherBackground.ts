// Types for mapping weather conditions to dynamic background configurations.

/** The normalized weather state derived from OpenWeatherMap's weather[0].main. */
export type WeatherState =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'default';

/** Glassmorphism-style configuration for a specific weather state. */
export interface BackgroundConfig {
  /** Path to the background image served from /public/backgrounds/. */
  imageUrl: string;
  /** CSS gradient used as a colour overlay on top of the image. */
  gradient: string;
  /** Inline styles for the glassmorphism card overlay. */
  glassStyle: {
    background: string;
    border: string;
  };
}
