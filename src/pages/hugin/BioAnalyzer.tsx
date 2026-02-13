import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, BarChart3, Calculator, Download } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import Plot from 'react-plotly.js';

const BioAnalyzer = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [sequence, setSequence] = useState('');
    const [activeTab, setActiveTab] = useState<'composition' | 'gc' | 'translate' | 'restriction'>('composition');
    const [results, setResults] = useState<any>(null);

    const analyzeSequence = () => {
        if (!sequence) {
            showToast('Veuillez entrer une séquence', 'error');
            return;
        }

        const cleanSeq = sequence.replace(/[^ATCGUatcgu]/g, '').toUpperCase();
        
        if (cleanSeq.length === 0) {
            showToast('Séquence invalide', 'error');
            return;
        }

        const composition = {
            A: (cleanSeq.match(/A/g) || []).length,
            T: (cleanSeq.match(/T/g) || []).length,
            G: (cleanSeq.match(/G/g) || []).length,
            C: (cleanSeq.match(/C/g) || []).length,
            U: (cleanSeq.match(/U/g) || []).length
        };

        const total = cleanSeq.length;
        const gcContent = ((composition.G + composition.C) / total * 100).toFixed(2);
        
        const gcWindow = 100;
        const gcProfile = [];
        for (let i = 0; i <= cleanSeq.length - gcWindow; i += 10) {
            const window = cleanSeq.substring(i, i + gcWindow);
            const gc = ((window.match(/[GC]/g) || []).length / gcWindow * 100);
            gcProfile.push({ position: i + gcWindow/2, gc });
        }

        const codonTable: { [key: string]: string } = {
            'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
            'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
            'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
            'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
            'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
            'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
            'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
            'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
            'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
            'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
            'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
            'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
            'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
            'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
            'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
            'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
        };

        let protein = '';
        for (let i = 0; i < cleanSeq.length - 2; i += 3) {
            const codon = cleanSeq.substring(i, i + 3);
            protein += codonTable[codon] || 'X';
        }

        const restrictionSites = {
            'EcoRI': { pattern: /GAATTC/g, sequence: 'GAATTC' },
            'BamHI': { pattern: /GGATCC/g, sequence: 'GGATCC' },
            'HindIII': { pattern: /AAGCTT/g, sequence: 'AAGCTT' },
            'PstI': { pattern: /CTGCAG/g, sequence: 'CTGCAG' },
            'SmaI': { pattern: /CCCGGG/g, sequence: 'CCCGGG' },
            'XbaI': { pattern: /TCTAGA/g, sequence: 'TCTAGA' }
        };

        const foundSites: any[] = [];
        Object.entries(restrictionSites).forEach(([enzyme, { pattern, sequence }]) => {
            let match;
            while ((match = pattern.exec(cleanSeq)) !== null) {
                foundSites.push({
                    enzyme,
                    position: match.index + 1,
                    sequence
                });
            }
        });

        setResults({
            sequence: cleanSeq,
            length: total,
            composition,
            gcContent,
            gcProfile,
            protein,
            restrictionSites: foundSites
        });

        showToast('Analyse terminée', 'success');
    };

    const exportResults = () => {
        if (!results) return;

        const data = `Analyse de Séquence - ${new Date().toLocaleString()}

Longueur: ${results.length} bp
Contenu GC: ${results.gcContent}%

Composition:
A: ${results.composition.A} (${(results.composition.A/results.length*100).toFixed(2)}%)
T: ${results.composition.T} (${(results.composition.T/results.length*100).toFixed(2)}%)
G: ${results.composition.G} (${(results.composition.G/results.length*100).toFixed(2)}%)
C: ${results.composition.C} (${(results.composition.C/results.length*100).toFixed(2)}%)

Séquence:
${results.sequence}

Protéine traduite:
${results.protein}

Sites de restriction trouvés: ${results.restrictionSites.length}
${results.restrictionSites.map((s: any) => `${s.enzyme}: position ${s.position}`).join('\n')}
`;

        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sequence_analysis_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Résultats exportés', 'success');
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/hugin')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <Dna size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>BioAnalyzer</h1>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={analyzeSequence} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calculator size={18} />
                        Analyser
                    </button>
                    {results && (
                        <button onClick={exportResults} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} />
                            Exporter
                        </button>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '400px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Séquence ADN/ARN
                        </label>
                        <textarea
                            value={sequence}
                            onChange={(e) => setSequence(e.target.value)}
                            placeholder="Entrez votre séquence (ATCG ou AUCG)..."
                            style={{
                                width: '100%',
                                height: '300px',
                                padding: '1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.5rem',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Longueur: {sequence.replace(/[^ATCGUatcgu]/g, '').length} bp
                        </div>
                    </div>

                    {results && (
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Résumé</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Longueur:</span>
                                    <strong>{results.length} bp</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Contenu GC:</span>
                                    <strong>{results.gcContent}%</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Protéine:</span>
                                    <strong>{results.protein.length} aa</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Sites restriction:</span>
                                    <strong>{results.restrictionSites.length}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    {results ? (
                        <>
                            <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', background: 'var(--bg-secondary)' }}>
                                {[
                                    { id: 'composition', label: 'Composition', icon: <BarChart3 size={16} /> },
                                    { id: 'gc', label: 'Profil GC', icon: <BarChart3 size={16} /> },
                                    { id: 'translate', label: 'Traduction', icon: <Dna size={16} /> },
                                    { id: 'restriction', label: 'Sites Restriction', icon: <Calculator size={16} /> }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        style={{
                                            padding: '1rem 1.5rem',
                                            border: 'none',
                                            background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                                            borderBottom: activeTab === tab.id ? '2px solid var(--accent-hugin)' : '2px solid transparent',
                                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontWeight: activeTab === tab.id ? 600 : 400
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
                                {activeTab === 'composition' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Composition Nucléotidique</h2>
                                        <Plot
                                            data={[{
                                                type: 'bar' as const,
                                                x: Object.keys(results.composition).filter(k => results.composition[k] > 0),
                                                y: Object.values(results.composition).filter((v: any) => v > 0) as number[],
                                                marker: { color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }
                                            }]}
                                            layout={{
                                                title: { text: 'Distribution des nucléotides' },
                                                xaxis: { title: { text: 'Nucléotide' } },
                                                yaxis: { title: { text: 'Nombre' } },
                                                paper_bgcolor: 'transparent',
                                                plot_bgcolor: 'transparent',
                                                font: { color: '#cbd5e1' }
                                            }}
                                            style={{ width: '100%', height: '400px' }}
                                            config={{ responsive: true }}
                                        />
                                    </div>
                                )}

                                {activeTab === 'gc' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Profil GC</h2>
                                        <Plot
                                            data={[{
                                                type: 'scatter' as const,
                                                mode: 'lines' as const,
                                                x: results.gcProfile.map((p: any) => p.position),
                                                y: results.gcProfile.map((p: any) => p.gc),
                                                line: { color: '#3b82f6', width: 2 }
                                            }]}
                                            layout={{
                                                title: { text: 'Contenu GC le long de la séquence (fenêtre 100bp)' },
                                                xaxis: { title: { text: 'Position (bp)' } },
                                                yaxis: { title: { text: 'GC (%)' } },
                                                paper_bgcolor: 'transparent',
                                                plot_bgcolor: 'transparent',
                                                font: { color: '#cbd5e1' }
                                            }}
                                            style={{ width: '100%', height: '400px' }}
                                            config={{ responsive: true }}
                                        />
                                    </div>
                                )}

                                {activeTab === 'translate' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Traduction Protéique</h2>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '0.5rem',
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.8,
                                            wordBreak: 'break-all'
                                        }}>
                                            {results.protein}
                                        </div>
                                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            Longueur: {results.protein.length} acides aminés
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'restriction' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Sites de Restriction</h2>
                                        {results.restrictionSites.length === 0 ? (
                                            <p style={{ color: 'var(--text-secondary)' }}>Aucun site de restriction trouvé</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {results.restrictionSites.map((site: any, i: number) => (
                                                    <div key={i} style={{
                                                        padding: '1rem',
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: '0.5rem',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div>
                                                            <strong style={{ fontSize: '1.1rem' }}>{site.enzyme}</strong>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                                Séquence: {site.sequence}
                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-hugin)' }}>
                                                            Position: {site.position}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <Dna size={80} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Entrez une séquence pour commencer</h3>
                            <p>Collez votre séquence ADN ou ARN et cliquez sur Analyser</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BioAnalyzer;
