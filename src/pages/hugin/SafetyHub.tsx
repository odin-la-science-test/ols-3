import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert, ChevronLeft, Search, FileText,
    AlertTriangle, Download, ExternalLink,
    CheckCircle
} from 'lucide-react';

interface SDS {
    id: string;
    chemical: string;
    hazardSymbols: string[];
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
    storage: string;
    lastChecked: string;
}

const SafetyHub = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [sdsList] = useState<SDS[]>([
        { id: '1', chemical: 'Ethanol 70%', hazardSymbols: ['🔥', '⚠️'], riskLevel: 'Moderate', storage: 'Armoire solvants', lastChecked: '2026-01-10' },
        { id: '2', chemical: 'Chloroforme', hazardSymbols: ['💀', '☢️'], riskLevel: 'Extreme', storage: 'Hotte ventilée', lastChecked: '2025-12-05' },
        { id: '3', chemical: 'Ether de Pétrole', hazardSymbols: ['🔥'], riskLevel: 'High', storage: 'Local ATEX', lastChecked: '2026-02-01' },
    ]);

    const filteredSDS = sdsList.filter(s => s.chemical.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '1rem', color: '#f43f5e' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SafetyHub</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sécurité Labo & Fiches SDS</p>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
                <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit chimique..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText color="#f43f5e" /> Fiches de Sécurité (SDS)
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredSDS.map(s => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '1.5rem' }}>{s.hazardSymbols.join(' ')}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.chemical}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Stockage: {s.storage} • Risque: <span style={{ color: s.riskLevel === 'Extreme' ? '#f43f5e' : (s.riskLevel === 'High' ? '#fbbf24' : '#10b981') }}>{s.riskLevel}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-icon" title="Télécharger"><Download size={18} /></button>
                                        <button className="btn-icon" title="Ouvrir"><ExternalLink size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <AlertTriangle size={20} /> Urgences & Contacts
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <EmergencyCard label="Secours (SAMU)" value="15" />
                            <EmergencyCard label="Pompier" value="18" />
                            <EmergencyCard label="Responsable Sécurité" value="Poste 4432" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={20} color="#10b981" /> Règles d'Or
                        </h3>
                        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <li style={{ display: 'flex', gap: '0.75rem' }}><div style={{ color: '#10b981' }}>✔</div> Port de l'EPI (Blouse, Gants) obligatoire.</li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}><div style={{ color: '#10b981' }}>✔</div> Pas de nourriture ni boisson en zone Bio.</li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}><div style={{ color: '#10b981' }}>✔</div> Étiquetage systématique des récipients.</li>
                            <li style={{ display: 'flex', gap: '0.75rem' }}><div style={{ color: '#10b981' }}>✔</div> Nettoyage du poste après manipulation.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const EmergencyCard = ({ label, value }: any) => (
    <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '1rem', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f43f5e' }}>{value}</div>
    </div>
);

export default SafetyHub;
