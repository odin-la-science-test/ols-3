import { useState } from 'react';
import {
    Search, Dna, ChevronRight,
    ArrowLeft, Download, RefreshCw, Info, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const BlastNCBI = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [blastType, setBlastType] = useState<'blastn' | 'blastp'>('blastn');
    const [db, setDb] = useState('nr/nt');
    const [results, setResults] = useState<any[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleBlast = () => {
        if (!query.trim()) return;
        setIsSearching(true);
        setTimeout(() => {
            const res = ScientificEngine.bacteriology.blastSearch(query, blastType === 'blastn' ? 'dna' : 'protein');
            setResults(res);
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '1rem', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Dna className="text-gradient" /> BLAST (NCBI)
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Basic Local Alignment Search Tool • Identification Moléculaire</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Input Area */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-hugin)' }}>Séquence Query (Format FASTA)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setQuery('>Sequence_Sample\nATGCGTCGTAGCTAGCTAGCTAGCTGATCGATCGTAG')}
                                        style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                    >
                                        Charger un exemple
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Entrez la séquence nucléotidique ou protéique ici..."
                                style={{
                                    width: '100%', minHeight: '200px', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc',
                                    padding: '1.5rem', borderRadius: '1rem', fontFamily: 'monospace',
                                    fontSize: '1rem', resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Search Action */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-primary"
                                onClick={handleBlast}
                                disabled={isSearching}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                            >
                                {isSearching ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                                Lancer la recherche BLAST
                            </button>
                            <button
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', cursor: 'pointer' }}
                                onClick={() => { setResults(null); setQuery(''); }}
                            >
                                Réinitialiser
                            </button>
                        </div>

                        {/* Results Section */}
                        {results && (
                            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--accent-hugin)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Résultats de l'alignement</h2>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                                        <Download size={16} /> Exporter (CSV/JSON)
                                    </button>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Accession</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Hits Description</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Max Score</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>E-Value</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Per. Identity</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((r, i) => (
                                                <tr key={i} className="hover-effect" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '1rem', color: 'var(--accent-hugin)', fontWeight: 600 }}>{r.accession}</td>
                                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{r.description}</td>
                                                    <td style={{ padding: '1rem' }}>{r.score}</td>
                                                    <td style={{ padding: '1rem', color: r.score > 20 ? '#10b981' : '#f59e0b' }}>{r.eValue}</td>
                                                    <td style={{ padding: '1rem', fontWeight: 700 }}>{r.identity}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Sidebar Filters/Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={18} color="var(--accent-hugin)" /> Paramètres
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Programme</label>
                                    <select
                                        value={blastType}
                                        onChange={(e: any) => setBlastType(e.target.value)}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '0.5rem' }}
                                    >
                                        <option value="blastn">blastn (Nucleotide)</option>
                                        <option value="blastp">blastp (Protein)</option>
                                        <option value="blastx">blastx (Translated DNA)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Base de Données</label>
                                    <select
                                        value={db}
                                        onChange={(e) => setDb(e.target.value)}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '0.5rem' }}
                                    >
                                        <option value="nr/nt">nr/nt (Standard)</option>
                                        <option value="refseq">RefSeq (Genomes)</option>
                                        <option value="pdb">PDB (Structural)</option>
                                        <option value="16s">16S rRNA (Bacteria)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Organisme (Filtre)</label>
                                    <input placeholder="Ex: Escherichia coli" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '0.5rem' }} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={18} color="var(--accent-hugin)" /> Informations
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                BLAST permet de trouver des régions de similarité locale entre séquences.
                                <br /><br />
                                <strong style={{ color: 'white' }}>E-Value :</strong> Plus elle est basse, plus l'alignement est statistiquement significatif.
                                <br /><br />
                                <strong style={{ color: 'white' }}>Identité :</strong> Pourcentage de correspondance exacte entre les bases/résidus.
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Statistiques de Session</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: 'var(--accent-hugin)', fontWeight: 700, fontSize: '1.2rem' }}>24</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Requêtes</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>98%</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Succès</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlastNCBI;
