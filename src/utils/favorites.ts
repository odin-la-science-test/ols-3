// Favorites/Bookmarks system

export interface Favorite {
  id: string;
  title: string;
  path: string;
  icon?: string;
  addedAt: string;
}

export const getFavorites = (): Favorite[] => {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>): void => {
  const favorites = getFavorites();
  const newFavorite: Favorite = {
    ...favorite,
    id: Date.now().toString(),
    addedAt: new Date().toISOString()
  };
  
  // Éviter les doublons
  if (!favorites.some(f => f.path === favorite.path)) {
    favorites.unshift(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

export const removeFavorite = (id: string): void => {
  const favorites = getFavorites();
  const updated = favorites.filter(f => f.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updated));
};

export const isFavorite = (path: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.path === path);
};

export const toggleFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>): boolean => {
  const favorites = getFavorites();
  const existing = favorites.find(f => f.path === favorite.path);
  
  if (existing) {
    removeFavorite(existing.id);
    return false;
  } else {
    addFavorite(favorite);
    return true;
  }
};
