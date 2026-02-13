import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, Calculator } from 'lucide-react';
import { useToast } from '../../../components/ToastContext';

const MobileBioAnalyzer = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [sequence, setSequence] = useState('');
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

        setResults({
            sequence: cleanSeq,
            length: total,
            composition,
            gcContent,
            protein
        });

        showToast('Analyse terminée', 'success');
    };

    return (
        <div className="app-viewport">
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--bg-secondary)'
            }}>
                <button onClick={() => navigate('/hugin')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}>
                    <ArrowLeft size={24} />
                </button>
                <Dna size={24} color="var(--accent-hugin)" />
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>BioAnalyzer</h1>
            </div>

            <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                        Séquence ADN/ARN
                    </label>
                    <textarea
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
                        placeholder="Entrez votre séquence (ATCG ou AUCG)..."
                        style={{
                            width: '100%',
                            height: '150px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.75rem',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Longueur: {sequence.replace(/[^ATCGUatcgu]/g, '').length} bp
                    </div>
                </div>

                <button 
                    onClick={analyzeSequence} 
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Calculator size={18} />
                    Analyser
                </button>

                {results && (
                    <div>
                        <div className="card-native" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Résumé</h3>
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
                            </div>
                        </div>

                        <div className="card-native" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Composition</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                {Object.entries(results.composition).filter(([_, v]) => (v as number) > 0).map(([base, count]: any) => (
                                    <div key={base} style={{
                                        padding: '1rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '0.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>
                                            {count}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {base}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-native" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Protéine Traduite</h3>
                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-primary)',
                                borderRadius: '0.5rem',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                lineHeight: 1.6,
                                wordBreak: 'break-all',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {results.protein}
                            </div>
                        </div>
                    </div>
                )}

                {!results && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <Dna size={60} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>Entrez une séquence pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileBioAnalyzer;
