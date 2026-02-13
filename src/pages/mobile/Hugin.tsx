import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Beaker, Calendar, Mail, Activity, Brain, Search,
    Package, Snowflake, Wallet, BookOpen, Dna, Camera
} from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import Navbar from '../../components/Navbar';
import { checkHasAccess, getAccessData } from '../../utils/ShieldUtils';

const MobileHugin = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const userStr = localStorage.getItem('currentUser');
    const { sub, hiddenTools } = getAccessData(userStr);
    const hasAccess = (moduleId: string) => checkHasAccess(moduleId, userStr, sub || undefined, hiddenTools);

    const modules = [
        { id: 'messaging', icon: <Mail size={24} />, path: '/hugin/messaging', color: '#3b82f6' },
        { id: 'planning', icon: <Calendar size={24} />, path: '/hugin/planning', color: '#f59e0b' },
        { id: 'inventory', icon: <Beaker size={24} />, path: '/hugin/inventory', color: '#10b981' },
        { id: 'stock', icon: <Package size={24} />, path: '/hugin/stock', color: '#8b5cf6' },
        { id: 'cryo', icon: <Snowflake size={24} />, path: '/hugin/cryo', color: '#06b6d4' },
        { id: 'budget', icon: <Wallet size={24} />, path: '/hugin/budget', color: '#f59e0b' },
        { id: 'mimir', icon: <Brain size={24} />, path: '/hugin/mimir', color: '#6366f1' },
        { id: 'notebook', icon: <BookOpen size={24} />, path: '/hugin/notebook', color: '#10b981' },
        { id: 'bioanalyzer', icon: <Dna size={24} />, path: '/hugin/bioanalyzer', color: '#8b5cf6' },
        { id: 'culture', icon: <Beaker size={24} />, path: '/hugin/culture', color: '#10b981' },
        { id: 'colony', icon: <Camera size={24} />, path: '/hugin/colony', color: '#3b82f6' },
        { id: 'flow', icon: <Activity size={24} />, path: '/hugin/flow', color: '#f59e0b' }
    ];

    const accessibleModules = modules.filter(m => hasAccess(m.id));
    const filteredModules = accessibleModules.filter(m => {
        const name = t(`hugin.${m.id}`);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="app-viewport">
            <Navbar />
            <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <img 
                        src="/logo3.png" 
                        alt="Hugin Lab" 
                        style={{ 
                            width: '120px', 
                            height: '120px', 
                            objectFit: 'contain', 
                            marginBottom: '1rem',
                            filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
                        }} 
                    />
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                        {t('hugin.title')}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        {t('hugin.subtitle')}
                    </p>
                </div>

                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255,255,255,0.5)'
                        }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un module..."
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1rem',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {filteredModules.map(module => (
                        <div
                            key={module.id}
                            onClick={() => navigate(module.path)}
                            className="card-native"
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                minHeight: '140px'
                            }}
                        >
                            <div style={{
                                padding: '0.875rem',
                                background: `${module.color}15`,
                                borderRadius: '1rem',
                                color: module.color,
                                marginBottom: '0.75rem'
                            }}>
                                {module.icon}
                            </div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {t(`hugin.${module.id}`)}
                            </h3>
                            <p style={{ 
                                fontSize: '0.7rem', 
                                color: 'rgba(255,255,255,0.5)', 
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {t(`hugin.${module.id}_desc`)}
                            </p>
                        </div>
                    ))}
                </div>

                {filteredModules.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                        <Search size={48} style={{ marginBottom: '1rem' }} />
                        <p>Aucun module trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileHugin;
