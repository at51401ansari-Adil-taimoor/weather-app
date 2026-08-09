import { useCallback, useEffect, useState } from 'react';
import { FavoriteCity } from '../models/Favorite';
import * as favoritesService from '../services/favoritesService';

function getFavoritesErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to update favorites. Please try again.';
}

export interface FavoritesViewModel {
  favorites: FavoriteCity[];
  loading: boolean;
  error: string | null;
  addFavorite: (cityName: string) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  isFavorite: (cityName: string) => boolean;
}

export function useFavoritesViewModel(
  userId: string | undefined,
): FavoritesViewModel {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const favoriteCities = await favoritesService.getFavorites(userId);

        if (isMounted) {
          setFavorites(favoriteCities);
        }
      } catch (loadError) {
        if (isMounted) {
          setFavorites([]);
          setError(getFavoritesErrorMessage(loadError));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const addFavorite = useCallback(
    async (cityName: string) => {
      if (!userId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const favorite = await favoritesService.addFavorite(userId, cityName);
        setFavorites((currentFavorites) => {
          const alreadySaved = currentFavorites.some(
            (item) => item.id === favorite.id,
          );

          if (alreadySaved) {
            return currentFavorites;
          }

          return [...currentFavorites, favorite];
        });
      } catch (addError) {
        setError(getFavoritesErrorMessage(addError));
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeFavorite = useCallback(
    async (favoriteId: string) => {
      if (!userId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await favoritesService.removeFavorite(userId, favoriteId);
        setFavorites((currentFavorites) =>
          currentFavorites.filter((favorite) => favorite.id !== favoriteId),
        );
      } catch (removeError) {
        setError(getFavoritesErrorMessage(removeError));
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const isFavorite = useCallback(
    (cityName: string) => {
      const normalizedCityName = cityName.trim().toLowerCase();

      return favorites.some(
        (favorite) => favorite.cityName.toLowerCase() === normalizedCityName,
      );
    },
    [favorites],
  );

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
