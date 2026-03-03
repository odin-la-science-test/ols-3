import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { predictiveAnalytics } from '../utils/predictiveAnalytics';

// Hook pour tracker automatiquement les actions utilisateur
export const usePredictiveTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Extraire le nom de la page depuis le path
    const pathParts = location.pathname.split('/').filter(Boolean);
    const pageName = pathParts[pathParts.length - 1] || 'Home';

    // Tracker la visite de page
    predictiveAnalytics.trackAction('page_visit', pageName);
  }, [location]);

  // Retourner des fonctions pour tracker d'autres actions
  return {
    trackToolUse: (toolName: string, metadata?: any) => {
      predictiveAnalytics.trackAction('tool_use', toolName, metadata);
    },
    trackSearch: (query: string) => {
      predictiveAnalytics.trackAction('search', 'Search', { query });
    },
    trackExport: (format: string, page: string) => {
      predictiveAnalytics.trackAction('export', page, { format });
    },
    trackSave: (itemType: string, page: string) => {
      predictiveAnalytics.trackAction('save', page, { itemType });
    }
  };
};
