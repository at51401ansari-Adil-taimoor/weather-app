// Maps weather conditions to full-page background images and glassmorphism card styles.

import { BackgroundConfig, WeatherState } from '../models/WeatherBackground';

/** Background images live in /public/backgrounds/ and are referenced by absolute path. */
const BACKGROUNDS: Record<WeatherState, BackgroundConfig> = {
  clear: {
    imageUrl: '/backgrounds/clear.jpg',
    // Warm amber tint — strong enough to ensure text contrast
    gradient: 'linear-gradient(160deg, rgba(120, 60, 0, 0.52) 0%, rgba(180, 100, 10, 0.38) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.42)',
      border: '1px solid rgba(255, 220, 120, 0.30)',
    },
  },
  clouds: {
    imageUrl: '/backgrounds/clouds.jpg',
    // Cool slate tint
    gradient: 'linear-gradient(160deg, rgba(20, 30, 50, 0.58) 0%, rgba(50, 65, 90, 0.44) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.44)',
      border: '1px solid rgba(200, 210, 230, 0.22)',
    },
  },
  rain: {
    imageUrl: '/backgrounds/rain.jpg',
    // Deep blue tint
    gradient: 'linear-gradient(160deg, rgba(10, 20, 80, 0.62) 0%, rgba(20, 60, 140, 0.48) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.46)',
      border: '1px solid rgba(100, 170, 255, 0.25)',
    },
  },
  snow: {
    imageUrl: '/backgrounds/snow.jpg',
    // Icy blue-grey tint — lighter photo needs more darkening
    gradient: 'linear-gradient(160deg, rgba(20, 40, 80, 0.54) 0%, rgba(60, 100, 150, 0.38) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.40)',
      border: '1px solid rgba(180, 220, 255, 0.28)',
    },
  },
  thunderstorm: {
    imageUrl: '/backgrounds/thunderstorm.jpg',
    // Very dark purple — dramatic and high contrast
    gradient: 'linear-gradient(160deg, rgba(15, 10, 50, 0.68) 0%, rgba(50, 15, 100, 0.52) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.50)',
      border: '1px solid rgba(180, 130, 255, 0.25)',
    },
  },
  default: {
    imageUrl: '/backgrounds/default.png',
    // Neutral dark tint — default.png can be bright so overlay is strongest here
    gradient: 'linear-gradient(160deg, rgba(10, 15, 30, 0.65) 0%, rgba(15, 25, 45, 0.52) 100%)',
    glassStyle: {
      background: 'rgba(0, 0, 0, 0.44)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
    },
  },
};

/**
 * Derives a WeatherState key from the `weather[0].main` string returned by
 * OpenWeatherMap, then returns the matching BackgroundConfig.
 *
 * @param weatherMain - The `weather[0].main` string (e.g. "Clear", "Rain").
 *   Pass `undefined` or an empty string to get the default config.
 */
export function getBackgroundConfig(weatherMain?: string): BackgroundConfig {
  if (!weatherMain) {
    return BACKGROUNDS.default;
  }

  const key = weatherMain.toLowerCase() as WeatherState;

  return BACKGROUNDS[key] ?? BACKGROUNDS.default;
}
