import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Eye } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { toggleStudentView, isStudentViewActive } from '../utils/studentModules';

interface StudentViewToggleProps {
  onToggle?: (isStudentView: boolean) => void;
}

const StudentViewToggle: React.FC<StudentViewToggleProps> = ({ onToggle }) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const [isStudentView, setIsStudentView] = useState(isStudentViewActive());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsStudentView(isStudentViewActive());
  }, []);

  const handleToggle = () => {
    const newView = toggleStudentView();
    setIsStudentView(newView);
    if (onToggle) {
      onToggle(newView);
    }
    // Recharger la page pour appliquer les changements
    window.location.reload();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          border: `2px solid ${isStudentView ? '#10b981' : c.accentPrimary}`,
          background: isStudentView 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
            : `linear-gradient(135deg, ${c.accentPrimary}15, ${c.accentSecondary}15)`,
          color: c.textPrimary,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isStudentView 
            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
            : `0 4px 12px ${c.accentPrimary}33`,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <Eye size={18} />
        {isStudentView ? (
          <>
            <GraduationCap size={18} />
            <span>Vue Étudiante</span>
          </>
        ) : (
          <>
            <Briefcase size={18} />
            <span>Vue Professionnelle</span>
          </>
        )}
      </button>

      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '0.5rem',
          padding: '0.75rem 1rem',
          background: c.cardBg,
          border: `1px solid ${c.borderColor}`,
          borderRadius: '0.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          fontSize: '0.85rem',
          color: c.textSecondary
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: c.textPrimary }}>
            🔧 Mode Super Admin
          </div>
          Basculer entre les vues pour tester l'interface
        </div>
      )}
    </div>
  );
};

export default StudentViewToggle;
