import React, { useState } from 'react';
import {
    FlaskConical, Send, Search, Database, MessageSquare,
    Activity, Brain, Globe, Shield, Zap
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ImmersionTestProps {
    type: 'munin' | 'hugin';
    onClose: () => void;
}

const ImmersionTest: React.FC<ImmersionTestProps> = ({ type }) => {
    const { theme } = useTheme();

    if (type === 'munin') {
        return <MuninImmersion theme={theme} />;
    }
    return <HuginImmersion theme={theme} />;
};

const MuninImmersion: React.FC<{ theme: any }> = ({ theme }) => {
    const c = theme.colors;
    const [search, setSearch] = useState('');
    const [selectedEntity, setSelectedEntity] = useState<any>(null);

    const dummyEntities = [
        { id: 1, name: 'Séquençage 16S rRNA', category: 'Bactériologie', complexity: 'Haut', desc: 'Identification taxonomique précise des bactéries par analyse de l\'ARN ribosomal 16S.' },
        { id: 2, name: 'Spectrométrie de Masse', category: 'Chimie Analytique', complexity: 'Ultra', desc: 'Technique d\'analyse permettant l\'identification et la quantification des molécules par mesure de leur masse.' },
        { id: 3, name: 'CRISPR-Cas9 Editing', category: 'Génétique', complexity: 'Medium', desc: 'Outil révolutionnaire de modification du génome permettant des coupes précises dans l\'ADN.' },
        { id: 4, name: 'Diffraction des Rayons X', category: 'Physique des Matériaux', complexity: 'Haut', desc: 'Méthode d\'analyse de la structure cristalline des matériaux et des protéines.' },
    ];

    const filtered = dummyEntities.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', minHeight: '500px' }}>
            <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.textSecondary }} size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une discipline ou une entité (ex: Génétique)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '0.75rem',
                        background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.borderColor} `,
                        color: 'white', outline: 'none'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {filtered.map(entity => (
                    <div
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity)}
                        style={{
                            padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedEntity?.id === entity.id ? c.accentMunin : 'transparent'} `,
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: selectedEntity?.id === entity.id ? `0 0 15px ${c.accentMunin} 33` : 'none'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: c.accentMunin, fontWeight: 800 }}>{entity.category}</span>
                            <Database size={14} color={c.textSecondary} />
                        </div>
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{entity.name}</div>
                        <div style={{ fontSize: '0.8rem', color: c.textSecondary }}>Niveau: {entity.complexity}</div>
                    </div>
                ))}
            </div>

            {selectedEntity ? (
                <div style={{
                    marginTop: 'auto', padding: '1.5rem', borderRadius: '1.25rem',
                    background: 'rgba(0,0,0,0.3)', border: `1px solid ${c.accentMunin} 44`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ color: c.accentMunin }}><Zap size={24} /></div>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>{selectedEntity.name}</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: c.textSecondary, marginBottom: '1.5rem' }}>
                        {selectedEntity.desc}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button style={{
                            padding: '0.6rem 1.2rem', borderRadius: '0.75rem', border: 'none',
                            background: c.accentMunin, color: 'white', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}><Globe size={16} /> Atlas Graph</button>
                        <button style={{
                            padding: '0.6rem 1.2rem', borderRadius: '0.75rem', border: `1px solid ${c.accentMunin} 44`,
                            background: 'transparent', color: c.accentMunin, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}><Database size={16} /> DataSet</button>
                    </div>
                </div>
            ) : (
                <div style={{
                    marginTop: 'auto', textAlign: 'center', padding: '3rem',
                    color: c.textSecondary, border: `1px dashed ${c.borderColor} `, borderRadius: '1.25rem',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    <Brain size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>Sélectionnez une entité scientifique pour simuler l'immersion Munin Atlas</p>
                </div>
            )}
        </div>
    );
};

const HuginImmersion: React.FC<{ theme: any }> = ({ theme }) => {
    const c = theme.colors;
    const [activeTab, setActiveTab] = useState<'chat' | 'modules' | 'lab'>('chat');
    const [selectedModule, setSelectedModule] = useState<string>('bact_blast');

    const huginModules = [
        { id: 'bact_blast', name: 'Bactériologie - BLAST', tools: ['BLASTn', 'BLASTp', 'Species ID', 'GenBank Sync'] },
        { id: 'cell_culture', name: 'Cell Culture Suite', tools: ['Viability Check', 'Growth Index', 'LIMS Stock'] },
        { id: 'hematology', name: 'Hematology Suite', tools: ['Indices Calc', 'DIC Scorer', 'Audit Trail'] },
    ];

    const currentModule = huginModules.find(m => m.id === selectedModule);

    return (
        <div style={{ display: 'flex', gap: '1.5rem', height: '100%', minHeight: '500px' }}>
            {/* Sidebar Nav */}
            <div style={{
                width: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 0',
                border: `1px solid ${c.borderColor} `
            }}>
                <div
                    title="Discussion"
                    onClick={() => setActiveTab('chat')}
                    style={{ color: activeTab === 'chat' ? c.accentHugin : c.textSecondary, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <MessageSquare size={24} />
                </div>
                <div
                    title="Modules Spécialisés"
                    onClick={() => setActiveTab('modules')}
                    style={{ color: activeTab === 'modules' ? c.accentHugin : c.textSecondary, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <Activity size={24} />
                </div>
                <div
                    title="Carnet de Labo"
                    onClick={() => setActiveTab('lab')}
                    style={{ color: activeTab === 'lab' ? c.accentHugin : c.textSecondary, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <FlaskConical size={24} />
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', borderRadius: '1.25rem', padding: '1.5rem', border: `1px solid ${theme.colors.borderColor} ` }}>
                <h3 style={{ marginBottom: '1.5rem', color: theme.colors.accentHugin, fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {activeTab === 'chat' && <><MessageSquare size={20} /> Discussion d'Équipe</>}
                    {activeTab === 'modules' && <><Activity size={20} /> Outils Spécialisés</>}
                    {activeTab === 'lab' && <><FlaskConical size={20} /> Notebook Numérique</>}
                </h3>

                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', maxWidth: '85%', border: `1px solid ${c.borderColor} ` }}>
                                <div style={{ fontSize: '0.7rem', color: theme.colors.accentHugin, fontWeight: 800, marginBottom: '0.25rem' }}>DR. ISSAM (Collaborateur)</div>
                                <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>J'ai mis à jour les stocks pour la culture cellulaire. Peux-tu vérifier le BLAST de la souche B22 ?</div>
                            </div>
                            <div style={{ padding: '0.75rem 1rem', background: `${theme.colors.accentHugin} 15`, borderRadius: '1rem', maxWidth: '85%', alignSelf: 'flex-end', border: `1px solid ${theme.colors.accentHugin} 33` }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginBottom: '0.25rem' }}>VOUS</div>
                                <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>C'est fait, la correspondance est de 99.8%. Je prépare le notebook.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Répondre à l'équipe..."
                                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.colors.borderColor} `, color: 'white', outline: 'none' }}
                            />
                            <button style={{
                                width: '45px', height: '45px', borderRadius: '0.75rem', border: 'none',
                                background: theme.colors.accentHugin, color: 'white', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'modules' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {huginModules.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedModule(m.id)}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '0.75rem', border: `1px solid ${selectedModule === m.id ? theme.colors.accentHugin : theme.colors.borderColor} `,
                                        background: selectedModule === m.id ? `${theme.colors.accentHugin} 15` : 'transparent',
                                        color: selectedModule === m.id ? theme.colors.accentHugin : theme.colors.textSecondary,
                                        cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.85rem'
                                    }}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>

                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1,
                            padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${theme.colors.borderColor} `
                        }}>
                            {currentModule?.tools.map((tool, i) => (
                                <div key={i} style={{
                                    padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', border: `1px solid ${theme.colors.borderColor} `
                                }}>
                                    <div style={{ color: theme.colors.accentHugin }}><Shield size={18} /></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tool}</div>
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, textAlign: 'center' }}>
                            <Shield size={12} /> Tous les outils sont conformes aux normes GLP/ISO.
                        </p>
                    </div>
                )}

                {activeTab === 'lab' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '1rem',
                            border: `1px solid ${theme.colors.borderColor} `, fontFamily: 'monospace', fontSize: '0.9rem',
                            position: 'relative'
                        }}>
                            <div style={{ borderBottom: `1px solid ${theme.colors.borderColor} `, paddingBottom: '0.75rem', marginBottom: '1rem', color: theme.colors.accentHugin, fontWeight: 800 }}>
                                EXP_REF: 2026-02-12_GEN_B22
                            </div>
                            <p style={{ color: '#888', marginBottom: '0.5rem' }}>// Entrées biométriques validées</p>
                            <p style={{ marginBottom: '0.5rem' }}>Statut: <span style={{ color: '#10b981' }}>COMPLÈTE</span></p>
                            <p style={{ marginBottom: '0.5rem' }}>Observations: Alignement BLAST validé à 99.8% avec NCBI.</p>
                            <p style={{ marginBottom: '0.5rem' }}>Température incubateur: 37.2°C stabile.</p>
                            <p>// Signature cryptographique active</p>
                            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                                <FlaskConical size={80} />
                            </div>
                        </div>
                        <button style={{
                            padding: '1rem', borderRadius: '1rem', border: 'none',
                            background: theme.colors.accentHugin, color: 'white', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            boxShadow: `0 8px 16px ${theme.colors.accentHugin} 33`
                        }}>
                            <Database size={18} /> Signer et Certifier le Protocole
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImmersionTest;
