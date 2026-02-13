import React, { useState, useEffect, useRef } from 'react';
import { useTheme, type ThemeName } from '../components/ThemeContext';
import { useToast } from '../components/ToastContext';
import Navbar from '../components/Navbar';
import {
    Settings as SettingsIcon, Palette, LayoutTemplate, Sparkles, Type,
    Bell, BellRing, Volume2, Clock, Shield, Save, History, Trash2,
    Zap, Rocket, ZoomIn, Archive, Download, Upload, RefreshCw, Database
} from 'lucide-react';

const Settings = () => {
    const { currentTheme, setTheme, themes } = useTheme();
    const { showToast } = useToast();

    // Settings State
    const [settings, setSettings] = useState(() => {
        const currentUser = localStorage.getItem('currentUser');
        const settingsKey = currentUser ? `odin-la-science-settings-${currentUser}` : 'odin-la-science-settings-v2';
        const saved = localStorage.getItem(settingsKey);

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        }
        return {
            notifications: {
                enabled: true,
                sounds: false,
                duration: 3
            },
            privacy: {
                autoSave: true,
                keepHistory: true
            },
            accessibility: {
                zoom: 100,
                keyboardShortcuts: true,
                focusMode: false
            },
            performance: {
                performanceMode: false,
                cache: true,
                itemsPerPage: 25
            },
            appearance: {
                particles: true,
                fontSize: 16
            }
        };
    });

    const [stats, setStats] = useState({
        dataSize: 0,
        historyCount: 0,
        settingsCount: 0
    });

    // Stats Calculation
    useEffect(() => {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += (localStorage[key].length + key.length);
            }
        }

        const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');

        let activeCount = 0;
        if (settings.notifications.enabled) activeCount++;
        if (settings.notifications.sounds) activeCount++;
        if (settings.privacy.autoSave) activeCount++;
        if (settings.privacy.keepHistory) activeCount++;
        if (settings.accessibility.keyboardShortcuts) activeCount++;
        if (settings.accessibility.focusMode) activeCount++;
        if (settings.performance.performanceMode) activeCount++;
        if (settings.performance.cache) activeCount++;
        if (settings.appearance.particles) activeCount++;

        setStats({
            dataSize: Math.round(totalSize / 1024),
            historyCount: history.length,
            settingsCount: activeCount
        });
    }, [settings]);

    // Apply Settings Effects
    useEffect(() => {
        // Set document title
        document.title = "Paramètres pour Odin la Science";

        // Font Size
        document.documentElement.style.fontSize = settings.appearance.fontSize + 'px';

        // Zoom
        (document.body.style as any).zoom = settings.accessibility.zoom + '%';

        // Focus Mode
        if (settings.accessibility.focusMode) {
            document.body.style.opacity = '0.95';
        } else {
            document.body.style.opacity = '1';
        }
    }, [settings]);

    const handleSettingChange = (category: keyof typeof settings, setting: string, value: any) => {
        setSettings((prev: typeof settings) => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof settings],
                [setting]: value
            }
        }));
        if (settings.privacy.autoSave) {
            const currentUser = localStorage.getItem('currentUser');
            const settingsKey = currentUser ? `odin-la-science-settings-${currentUser}` : 'odin-la-science-settings-v2';
            localStorage.setItem(settingsKey, JSON.stringify({ ...settings, [category]: { ...(settings as any)[category], [setting]: value } }));
        }
    };

    const handleSaveSettings = () => {
        const currentUser = localStorage.getItem('currentUser');
        const settingsKey = currentUser ? `odin-la-science-settings-${currentUser}` : 'odin-la-science-settings-v2';
        localStorage.setItem(settingsKey, JSON.stringify(settings));
        showToast('✅ Paramètres enregistrés avec succès !', 'success');
    };

    const handleResetDefaults = () => {
        if (window.confirm('Voulez-vous vraiment réinitialiser tous les paramètres par défaut ?')) {
            setSettings({
                notifications: { enabled: true, sounds: false, duration: 3 },
                privacy: { autoSave: true, keepHistory: true },
                accessibility: { zoom: 100, keyboardShortcuts: true, focusMode: false },
                performance: { performanceMode: false, cache: true, itemsPerPage: 25 },
                appearance: { particles: true, fontSize: 16 }
            });
            showToast('🔄 Paramètres réinitialisés', 'success');
        }
    };

    const handleClearData = () => {
        if (window.confirm('⚠️ ATTENTION : Cette action va supprimer TOUTES vos données locales. Continuer ?')) {
            localStorage.clear();
            sessionStorage.clear();
            showToast('🗑️ Toutes les données ont été effacées', 'success');
            setTimeout(() => window.location.reload(), 2000);
        }
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `odin-la-science-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showToast('⬇️ Paramètres exportés', 'success');
    };

    const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target?.result as string);
                setSettings(imported);
                handleSaveSettings(); // Save immediately
                showToast('⬆️ Paramètres importés avec succès', 'success');
            } catch (err) {
                showToast('❌ Erreur lors de l\'import', 'error');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            // CSS Variable Mapping: User's --cosmic- variables mapped to our ThemeContext variables
            '--cosmic-bg-primary': 'var(--bg-primary)',
            '--cosmic-bg-secondary': 'var(--bg-secondary)',
            '--cosmic-bg-card': 'var(--card-bg)',
            '--cosmic-text-primary': 'var(--text-primary)',
            '--cosmic-text-secondary': 'var(--text-secondary)',
            '--cosmic-border': 'var(--border-color)',
            '--cosmic-accent': 'var(--accent-primary)',
            '--cosmic-accent-2': 'var(--accent-secondary)',
            '--cosmic-shadow': '0 10px 40px rgba(0,0,0,0.5)',
        } as React.CSSProperties}>
            <Navbar />

            {/* Particles Background */}
            {settings.appearance.particles && !settings.performance.performanceMode && <Particles />}

            {/* Main Container */}
            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Settings Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{
                        fontSize: '4em',
                        marginBottom: '20px',
                        filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.5))',
                        display: 'flex', justifyContent: 'center'
                    }}>
                        <SettingsIcon size={64} color="var(--cosmic-accent)" />
                    </div>
                    <h1 style={{
                        fontSize: '2.5em',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px'
                    }}>Configuration</h1>
                    <p style={{ color: 'var(--cosmic-text-secondary)', fontSize: '1.1em' }}>Ajustez les préférences de l'application</p>
                </div>

                <div style={{ display: 'grid', gap: '25px' }}>

                    {/* Apparence Section */}
                    <Section
                        title="Apparence"
                        icon={<Palette size={32} />}
                        description="Personnalisez l'interface visuelle"
                    >
                        {/* Theme Selection */}
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <LayoutTemplate size={20} />
                                    <span>Thème Visuel</span>
                                </div>
                                <div className="setting-desc">Choisissez l'ambiance globale de l'application</div>
                            </div>
                            <div className="setting-control" style={{ width: '100%' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                    {(Object.keys(themes) as ThemeName[]).map(tName => (
                                        <button
                                            key={tName}
                                            onClick={() => setTheme(tName)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: currentTheme === tName ? '2px solid var(--cosmic-accent)' : '2px solid var(--cosmic-border)',
                                                background: currentTheme === tName ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                                                color: 'var(--cosmic-text-primary)',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                fontSize: '0.9em',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
                                            }}
                                        >
                                            {/* We could allow specific icons per theme, but simple text is fine for now */}
                                            {themes[tName].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SettingToggle
                            label="Particules de fond"
                            icon={<Sparkles size={20} />}
                            desc="Afficher les particules animées en arrière-plan"
                            checked={settings.appearance.particles}
                            onChange={() => handleSettingChange('appearance', 'particles', !settings.appearance.particles)}
                            disabled={settings.performance.performanceMode}
                        />

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <Type size={20} />
                                    <span>Taille de la police</span>
                                </div>
                                <div className="setting-desc">Ajuster la taille du texte (px)</div>
                            </div>
                            <div className="setting-control">
                                <input
                                    type="number"
                                    className="number-input"
                                    value={settings.appearance.fontSize}
                                    min="12" max="24"
                                    onChange={(e) => handleSettingChange('appearance', 'fontSize', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Notifications */}
                    <Section
                        title="Notifications"
                        icon={<Bell size={32} />}
                        description="Gérez vos alertes et notifications"
                    >
                        <SettingToggle
                            label="Notifications activées"
                            icon={<BellRing size={20} />}
                            desc="Recevoir des notifications pour les événements importants"
                            checked={settings.notifications.enabled}
                            onChange={() => handleSettingChange('notifications', 'enabled', !settings.notifications.enabled)}
                        />
                        <SettingToggle
                            label="Sons"
                            icon={<Volume2 size={20} />}
                            desc="Jouer un son lors des notifications"
                            checked={settings.notifications.sounds}
                            onChange={() => handleSettingChange('notifications', 'sounds', !settings.notifications.sounds)}
                        />
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <Clock size={20} />
                                    <span>Durée d'affichage</span>
                                </div>
                                <div className="setting-desc">Durée d'affichage des notifications (secondes)</div>
                            </div>
                            <div className="setting-control">
                                <input
                                    type="number"
                                    className="number-input"
                                    value={settings.notifications.duration}
                                    min="1" max="10"
                                    onChange={(e) => handleSettingChange('notifications', 'duration', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Données et Confidentialité */}
                    <Section
                        title="Données et Confidentialité"
                        icon={<Shield size={32} />}
                        description="Gérez vos données et votre historique"
                    >
                        <SettingToggle
                            label="Sauvegarde automatique"
                            icon={<Save size={20} />}
                            desc="Sauvegarder automatiquement vos modifications"
                            checked={settings.privacy.autoSave}
                            onChange={() => handleSettingChange('privacy', 'autoSave', !settings.privacy.autoSave)}
                        />
                        <SettingToggle
                            label="Conserver l'historique"
                            icon={<History size={20} />}
                            desc="Enregistrer l'historique de navigation"
                            checked={settings.privacy.keepHistory}
                            onChange={() => handleSettingChange('privacy', 'keepHistory', !settings.privacy.keepHistory)}
                        />

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <Trash2 size={20} />
                                    <span>Effacer les données</span>
                                </div>
                                <div className="setting-desc">Supprimer toutes les données locales stockées</div>
                            </div>
                            <div className="setting-control">
                                <button className="btn btn-danger" onClick={handleClearData}>
                                    <Trash2 size={16} />
                                    <span>Effacer</span>
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' }}>
                            <StatsCard value={stats.dataSize} label="Ko de données" icon={<Database size={24} />} />
                            <StatsCard value={stats.historyCount} label="Éléments historique" icon={<History size={24} />} />
                            <StatsCard value={stats.settingsCount} label="Paramètres actifs" icon={<SettingsIcon size={24} />} />
                        </div>
                    </Section>

                    {/* Performance & Accessibility */}
                    <Section
                        title="Performance & Accessibilité"
                        icon={<Zap size={32} />}
                        description="Optimisation et confort"
                    >
                        <SettingToggle
                            label="Mode performance"
                            icon={<Rocket size={20} />}
                            desc="Désactiver les effets pour améliorer les performances"
                            checked={settings.performance.performanceMode}
                            onChange={() => handleSettingChange('performance', 'performanceMode', !settings.performance.performanceMode)}
                        />
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <ZoomIn size={20} />
                                    <span>Zoom automatique</span>
                                </div>
                                <div className="setting-desc">Niveau de zoom de l'interface (%)</div>
                            </div>
                            <div className="setting-control">
                                <select
                                    className="select-input"
                                    value={settings.accessibility.zoom}
                                    onChange={(e) => handleSettingChange('accessibility', 'zoom', parseInt(e.target.value))}
                                >
                                    <option value="75">75%</option>
                                    <option value="90">90%</option>
                                    <option value="100">100%</option>
                                    <option value="110">110%</option>
                                    <option value="125">125%</option>
                                    <option value="150">150%</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* Raccourcis Clavier */}
                    <Section
                        title="Raccourcis Clavier"
                        icon={<Type size={32} />}
                        description="Guide des raccourcis pour une navigation rapide"
                    >
                        <div className="setting-item" style={{ display: 'block' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                <ShortcutItem keys={['Ctrl', 'H']} label="Retour à l'accueil" />
                                <ShortcutItem keys={['Ctrl', 'S']} label="Ouvrir les paramètres" />
                                <ShortcutItem keys={['Ctrl', 'U']} label="Ouvrir le module Hugin" />
                                <ShortcutItem keys={['Ctrl', 'L']} label="Se déconnecter" />
                                <ShortcutItem keys={['Ctrl', 'A']} label="Page À propos" />
                            </div>
                        </div>
                    </Section>

                    {/* Import/Export */}
                    <Section
                        title="Sauvegarde & Restauration"
                        icon={<Archive size={32} />}
                        description="Exportez ou importez vos configurations"
                    >
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '20px' }}>
                            <button className="btn btn-secondary" onClick={exportSettings}>
                                <Download size={16} />
                                <span>Exporter</span>
                            </button>
                            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                <Upload size={16} />
                                <span>Importer</span>
                                <input type="file" style={{ display: 'none' }} onChange={importSettings} accept=".json" />
                            </label>
                        </div>
                    </Section>
                </div>

                {/* Actions */}
                <div className="settings-actions">
                    <button className="btn btn-primary" onClick={handleSaveSettings}>
                        <Save size={18} />
                        <span>Enregistrer</span>
                    </button>
                    <button className="btn btn-secondary" onClick={handleResetDefaults}>
                        <RefreshCw size={18} />
                        <span>Réinitialiser</span>
                    </button>
                </div>

            </div>

            <style>{`
                .btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9em;
                }
                .btn-secondary {
                    background: var(--cosmic-bg-card);
                    color: var(--cosmic-text-primary);
                    border: 2px solid var(--cosmic-border);
                }
                .btn-secondary:hover {
                    border-color: var(--cosmic-accent);
                    transform: translateY(-2px);
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                    color: white;
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
                    padding: 15px 40px;
                    font-size: 1.1em;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
                }
                .btn-danger {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 2px solid rgba(239, 68, 68, 0.3);
                    padding: 10px 20px;
                    font-size: 0.9em;
                }
                .btn-danger:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                    transform: translateY(-2px);
                }
                .settings-section {
                    background: var(--cosmic-bg-secondary);
                    border-radius: 20px;
                    padding: 30px;
                    border: 2px solid var(--cosmic-border);
                    box-shadow: var(--cosmic-shadow);
                    transition: all 0.3s ease;
                }
                .settings-section:hover {
                    border-color: var(--cosmic-accent);
                    transform: translateY(-3px);
                }
                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: var(--cosmic-bg-card);
                    border-radius: 15px;
                    border: 1px solid var(--cosmic-border);
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                    flex-wrap: wrap; 
                    gap: 15px;
                }
                .setting-item:hover {
                    background: rgba(102, 126, 234, 0.05);
                    border-color: var(--cosmic-accent);
                }
                .setting-label {
                    font-size: 1.1em;
                    font-weight: 600;
                    color: var(--cosmic-text-primary);
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                 .setting-desc {
                    color: var(--cosmic-text-secondary);
                    font-size: 0.9em;
                }
                .toggle-switch {
                    position: relative;
                    width: 60px;
                    height: 30px;
                    background: var(--cosmic-border);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .toggle-switch.active {
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                }
                .toggle-slider {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                .toggle-switch.active .toggle-slider {
                    left: 33px;
                }
                .number-input, .select-input {
                    padding: 12px 18px;
                    background: var(--cosmic-bg-primary);
                    border: 2px solid var(--cosmic-border);
                    border-radius: 10px;
                    color: var(--cosmic-text-primary);
                    font-size: 1em;
                    transition: all 0.3s ease;
                }
                .settings-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid var(--cosmic-border);
                    flex-wrap: wrap;
                }
            `}</style>
        </div>
    );
};

// Helper Components
const Section = ({ title, icon, description, children }: any) => (
    <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid var(--cosmic-border)' }}>
            <span style={{ color: 'var(--cosmic-accent)', filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))', display: 'flex' }}>
                {icon}
            </span>
            <div>
                <h2 style={{ fontSize: '1.5em', fontWeight: 700, color: 'var(--cosmic-text-primary)' }}>{title}</h2>
                <p style={{ color: 'var(--cosmic-text-secondary)', fontSize: '0.9em', marginTop: '5px' }}>{description}</p>
            </div>
        </div>
        {children}
    </div>
);

const SettingToggle = ({ label, icon, desc, checked, onChange, disabled }: any) => (
    <div className="setting-item" style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
        <div className="setting-info" style={{ flex: 1 }}>
            <div className="setting-label">
                <span style={{ color: 'var(--cosmic-accent)' }}>{icon}</span>
                <span>{label}</span>
            </div>
            <div className="setting-desc">{desc}</div>
        </div>
        <div className="setting-control">
            <div className={`toggle-switch ${checked ? 'active' : ''}`} onClick={onChange}>
                <div className="toggle-slider"></div>
            </div>
        </div>
    </div>
);

const StatsCard = ({ value, label, icon }: any) => (
    <div style={{
        background: 'var(--cosmic-bg-card)',
        padding: '20px',
        borderRadius: '15px',
        border: '1px solid var(--cosmic-border)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    }}>
        <div style={{ color: 'var(--cosmic-accent)' }}>{icon}</div>
        <div style={{
            fontSize: '2em',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '5px'
        }}>{value}</div>
        <div style={{ color: 'var(--cosmic-text-secondary)', fontSize: '0.9em' }}>{label}</div>
    </div>
);

const ShortcutItem = ({ keys, label }: { keys: string[], label: string }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px', background: 'var(--cosmic-bg-primary)', borderRadius: '8px',
        border: '1px solid var(--cosmic-border)'
    }}>
        <div style={{ color: 'var(--cosmic-text-primary)', fontSize: '0.9em' }}>{label}</div>
        <div style={{ display: 'flex', gap: '5px' }}>
            {keys.map(k => (
                <kbd key={k} style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--cosmic-bg-card)',
                    border: '1px solid var(--cosmic-border)',
                    color: 'var(--cosmic-accent)',
                    fontSize: '0.8em',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 0 var(--cosmic-border)'
                }}>{k}</kbd>
            ))}
        </div>
    </div>
);

const Particles = () => {
    // Simple particle implementation converted to React
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 25 + 's';
            particle.style.animationDuration = (Math.random() * 15 + 20) + 's';
            Object.assign(particle.style, {
                position: 'absolute',
                width: '3px',
                height: '3px',
                background: 'var(--cosmic-accent)',
                borderRadius: '50%',
                opacity: '0',
                animationName: 'float',
                animationIterationCount: 'infinite'
            });
            container.appendChild(particle);
        }
    }, []);

    return (
        <div className="particles" ref={containerRef} style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            overflow: 'hidden', zIndex: 0, pointerEvents: 'none'
        }}>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(-120vh) translateX(150px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Settings;
