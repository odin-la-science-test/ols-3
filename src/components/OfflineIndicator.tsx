import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="mobile-offline-banner">
      <WifiOff size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
      Mode hors ligne - Certaines fonctionnalités sont limitées
    </div>
  );
};

export default OfflineIndicator;
