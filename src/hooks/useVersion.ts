import { useState, useEffect } from 'react';

interface VersionInfo {
  version: string;
  buildTime: string;
  gitHash?: string;
  gitBranch?: string;
  environment: 'development' | 'production';
}

interface VersionData extends VersionInfo {
  isLoading: boolean;
  error?: Error;
}

const DEV_VERSION: VersionInfo = {
  version: 'DEV',
  buildTime: new Date().toISOString(),
  environment: 'development'
};

let cachedVersion: VersionInfo | null = null;
let fetchPromise: Promise<VersionInfo> | null = null;

async function fetchVersion(retries = 3): Promise<VersionInfo> {
  // Si déjà en cache, retourner immédiatement
  if (cachedVersion) {
    return cachedVersion;
  }

  // Si un fetch est déjà en cours, attendre son résultat
  if (fetchPromise) {
    return fetchPromise;
  }

  // Créer une nouvelle promesse de fetch
  fetchPromise = (async () => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('/version.json', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        cachedVersion = data;
        fetchPromise = null;
        return data;
      } catch (error) {
        console.warn(`Failed to fetch version (attempt ${i + 1}/${retries}):`, error);
        
        if (i < retries - 1) {
          // Attendre 5 secondes avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
    
    // Si tous les essais échouent, retourner une version par défaut
    fetchPromise = null;
    throw new Error('Failed to fetch version after multiple retries');
  })();

  return fetchPromise;
}

export function useVersion(): VersionData {
  const [versionData, setVersionData] = useState<VersionData>({
    ...DEV_VERSION,
    isLoading: true
  });

  useEffect(() => {
    // En développement, utiliser la version DEV
    if (import.meta.env.DEV) {
      setVersionData({
        ...DEV_VERSION,
        isLoading: false
      });
      console.log('🔧 Running in development mode');
      return;
    }

    // En production, charger la version depuis version.json
    fetchVersion()
      .then(data => {
        setVersionData({
          ...data,
          isLoading: false
        });
        console.log(`✓ Version ${data.version} loaded`);
        if (data.gitHash) {
          console.log(`  Git: ${data.gitBranch}@${data.gitHash}`);
        }
      })
      .catch(error => {
        console.error('Failed to load version:', error);
        setVersionData({
          version: 'Unknown',
          buildTime: new Date().toISOString(),
          environment: 'production',
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error')
        });
      });
  }, []);

  return versionData;
}
