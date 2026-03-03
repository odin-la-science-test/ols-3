import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictiveAnalytics } from '../../utils/predictiveAnalytics';
import { 
  TrendingUp, Clock, Zap, BarChart3, Activity, 
  Brain, Target, ArrowLeft, RefreshCw 
} from 'lucide-react';

const PredictiveDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);

  const loadData = () => {
    const usageStats = predictiveAnalytics.getUsageStats();
    const nextActions = predictiveAnalytics.predictNextActions();
    setStats(usageStats);
    setPredictions(nextActions);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/hugin')}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
              <Brain size={32} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Dashboard Prédictif
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Analyse intelligente de votre utilisation
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(139, 92, 246, 0.2)', 
              borderRadius: '0.75rem' 
            }}>
              <Activity size={24} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
                ACTIONS TOTALES
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                {stats.totalActions}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Derniers 30 jours
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(99, 102, 241, 0.2)', 
              borderRadius: '0.75rem' 
            }}>
              <TrendingUp size={24} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
                MOYENNE / JOUR
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                {stats.averageActionsPerDay}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Actions par jour
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(16, 185, 129, 0.2)', 
              borderRadius: '0.75rem' 
            }}>
              <Target size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
                PRÉDICTIONS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                {predictions.length}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Suggestions actives
          </div>
        </div>
      </div>

      {/* Most Used Tools */}
      <div className="card glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#f8fafc', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <BarChart3 size={24} color="#8b5cf6" />
          Outils les plus utilisés
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {stats.mostUsedPages.map((page: any, index: number) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: '#8b5cf6',
                minWidth: '2rem'
              }}>
                #{index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  {page.page}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {page.count} utilisations • {page.percentage}% du total
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                maxWidth: '200px', 
                height: '8px', 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${page.percentage}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#f8fafc', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Zap size={24} color="#f59e0b" />
          Prédictions intelligentes
        </h2>
        {predictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <Clock size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>Pas encore assez de données pour faire des prédictions.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Continuez à utiliser Hugin Lab pour obtenir des suggestions personnalisées.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {predictions.map((pred, index) => (
              <div key={index} style={{ 
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(139, 92, 246, 0.2)', 
                    borderRadius: '0.75rem' 
                  }}>
                    {pred.confidence > 0.8 ? <Zap size={20} color="#f59e0b" /> : <TrendingUp size={20} color="#8b5cf6" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.25rem' }}>
                      CONFIANCE: {(pred.confidence * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
                      {pred.reason}
                    </div>
                  </div>
                </div>
                {(pred.suggestedPage || pred.suggestedTool) && (
                  <button
                    onClick={() => navigate(`/hugin/${pred.suggestedPage || pred.suggestedTool}`)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      border: 'none',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Accéder à {pred.suggestedPage || pred.suggestedTool} →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveDashboard;
