import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { useToast } from './ToastContext';

interface FavoriteButtonProps {
  title: string;
  path: string;
  icon?: string;
  size?: number;
}

const FavoriteButton = ({ title, path, icon, size = 20 }: FavoriteButtonProps) => {
  const [isFav, setIsFav] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setIsFav(isFavorite(path));
  }, [path]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite({ title, path, icon });
    setIsFav(added);
    showToast(
      added ? `✨ ${title} ajouté aux favoris` : `${title} retiré des favoris`,
      added ? 'success' : 'info'
    );
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        color: isFav ? '#f59e0b' : 'var(--text-secondary)'
      }}
      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Star
        size={size}
        fill={isFav ? '#f59e0b' : 'none'}
        style={{ transition: 'all 0.2s' }}
      />
    </button>
  );
};

export default FavoriteButton;
