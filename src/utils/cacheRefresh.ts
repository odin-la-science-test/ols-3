interface CacheRefreshOptions {
  showConfirmation?: boolean;
  confirmationMessage?: string;
}

export async function refreshCache(options: CacheRefreshOptions = {}): Promise<void> {
  const {
    showConfirmation = true,
    confirmationMessage = 'Le cache va être vidé et la page rechargée. Continuer ?'
  } = options;

  // Demander confirmation si activé
  if (showConfirmation && !confirm(confirmationMessage)) {
    return;
  }

  try {
    // Vider le cache du navigateur si l'API Cache est disponible
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✓ Browser cache cleared');
    }

    // Vider le localStorage (optionnel, peut être commenté si non souhaité)
    // localStorage.clear();
    // console.log('✓ LocalStorage cleared');

    // Recharger la page avec cache busting
    const url = new URL(window.location.href);
    url.searchParams.set('_refresh', Date.now().toString());
    window.location.href = url.toString();
  } catch (error) {
    console.error('Failed to clear cache:', error);
    // Fallback: simple rechargement
    window.location.reload();
  }
}
