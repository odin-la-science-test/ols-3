import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictiveAnalytics, type Prediction } from '../utils/predictiveAnalytics';
import { Sparkles, TrendingUp, Clock, Zap, X } from 'lucide-react';

const PredictiveSuggestions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre un peu avant d'afficher les suggestions
    const timer = setTimeout(() => {
      const preds = predictiveAnalytics.predictNextActions();
      setPredictions(preds);
      if (preds.length > 0) {
        setShow(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSuggestionClick = (prediction: Prediction) => {
    if (prediction.suggestedPage) {
      navigate(`/hugin/${prediction.suggestedPage}`);
    } else if (prediction.suggestedTool) {
      navigate(`/hugin/${prediction.suggestedTool}`);
    }
  };

  const handleDismiss = (index: number) => {
    setDismissed(prev => new Set([...prev, index.toString()]));
  };

  const visiblePredictions = predictions.filter((_, i) => !dismissed.has(i.toString()));

  if (!show || visiblePredictions.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000,
      maxWidth: '400px'
    }}>
      {visiblePredictions.slice(0, 2).map((prediction, index) => (
        <div
          key={index}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginBottom: '1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            animation: 'slideIn 0.3s ease-out',
            position: 'relative'
          }}
        >
          <button
            onClick={() => handleDismiss(index)}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {prediction.confidence > 0.8 ? (
              <Zap size={20} color="#8b5cf6" />
            ) : prediction.action === 'workflow_suggestion' ? (
              <TrendingUp size={20} color="#8b5cf6" />
            ) : prediction.action === 'visit_page' ? (
              <Clock size={20} color="#8b5cf6" />
            ) : (
              <Sparkles size={20} color="#8b5cf6" />
            )}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                SUGGESTION INTELLIGENTE
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Confiance: {(prediction.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>
            {prediction.reason}
          </p>

          <button
            onClick={() => handleSuggestionClick(prediction)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            Accéder maintenant →
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PredictiveSuggestions;
