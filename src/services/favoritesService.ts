import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { FavoriteCity } from '../models/Favorite';

function getFavoritesCollection(userId: string) {
  return collection(db, 'users', userId, 'favorites');
}

function createFavoriteId(cityName: string): string {
  return cityName.trim().toLowerCase().replace(/\s+/g, '-');
}

export async function addFavorite(
  userId: string,
  cityName: string,
): Promise<FavoriteCity> {
  const normalizedCityName = cityName.trim();
  const favoriteId = createFavoriteId(normalizedCityName);
  const favorite: FavoriteCity = {
    id: favoriteId,
    cityName: normalizedCityName,
  };

  await setDoc(doc(db, 'users', userId, 'favorites', favoriteId), {
    cityName: normalizedCityName,
    addedAt: Date.now(),
  });

  return favorite;
}

export async function removeFavorite(
  userId: string,
  favoriteId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'favorites', favoriteId));
}

export async function getFavorites(userId: string): Promise<FavoriteCity[]> {
  const snapshot = await getDocs(getFavoritesCollection(userId));

  return snapshot.docs.map((favoriteDoc) => ({
    id: favoriteDoc.id,
    cityName: favoriteDoc.data().cityName as string,
  }));
}
