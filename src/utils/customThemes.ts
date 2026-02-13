export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    munin: string;
    hugin: string;
    background: string;
    card: string;
  };
}

export const defaultThemes: CustomTheme[] = [
  {
    id: 'default',
    name: 'Par défaut',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      munin: '#10b981',
      hugin: '#6366f1',
      background: '#0f172a',
      card: 'rgba(255, 255, 255, 0.03)'
    }
  },
  {
    id: 'ocean',
    name: 'Océan',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      munin: '#14b8a6',
      hugin: '#0ea5e9',
      background: '#0c1e2e',
      card: 'rgba(14, 165, 233, 0.05)'
    }
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      munin: '#eab308',
      hugin: '#f97316',
      background: '#1a0f0a',
      card: 'rgba(249, 115, 22, 0.05)'
    }
  },
  {
    id: 'forest',
    name: 'Forêt',
    colors: {
      primary: '#22c55e',
      secondary: '#84cc16',
      munin: '#10b981',
      hugin: '#22c55e',
      background: '#0a1f0f',
      card: 'rgba(34, 197, 94, 0.05)'
    }
  },
  {
    id: 'purple',
    name: 'Violet',
    colors: {
      primary: '#a855f7',
      secondary: '#d946ef',
      munin: '#c084fc',
      hugin: '#a855f7',
      background: '#1a0f2e',
      card: 'rgba(168, 85, 247, 0.05)'
    }
  }
];

export const getActiveTheme = (): CustomTheme => {
  const stored = localStorage.getItem('customTheme');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultThemes[0];
    }
  }
  return defaultThemes[0];
};

export const setActiveTheme = (theme: CustomTheme) => {
  localStorage.setItem('customTheme', JSON.stringify(theme));
  applyTheme(theme);
};

export const applyTheme = (theme: CustomTheme) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-munin', theme.colors.munin);
  root.style.setProperty('--color-hugin', theme.colors.hugin);
  root.style.setProperty('--bg-primary', theme.colors.background);
  root.style.setProperty('--bg-card', theme.colors.card);
};
