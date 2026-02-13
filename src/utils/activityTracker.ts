export interface Activity {
  id: string;
  type: 'navigation' | 'action' | 'creation' | 'modification';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  path?: string;
}

const MAX_ACTIVITIES = 50;

export const trackActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  const activities = getActivities();
  const newActivity: Activity = {
    ...activity,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  
  const updated = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
  localStorage.setItem('activityHistory', JSON.stringify(updated));
  
  // Dispatch event pour mettre à jour les composants
  window.dispatchEvent(new CustomEvent('activityUpdate'));
};

export const getActivities = (): Activity[] => {
  const stored = localStorage.getItem('activityHistory');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const clearActivities = () => {
  localStorage.removeItem('activityHistory');
  window.dispatchEvent(new CustomEvent('activityUpdate'));
};

export const getRecentActivities = (limit: number = 10): Activity[] => {
  return getActivities().slice(0, limit);
};
