import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Download, Search, Info } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    children?: Node[];
    depth: number;
}

const PhyloGen = () => {
    const navigate = useNavigate();
    const [zoom, setZoom] = useState(1);

    const treeData: Node = {
        id: '1', label: 'LUCA', depth: 0,
        children: [
            {
                id: '2', label: 'Bacteria', depth: 1,
                children: [
                    { id: '4', label: 'Firmicutes', depth: 2 },
                    { id: '5', label: 'Proteobacteria', depth: 2 }
                ]
            },
            {
                id: '3', label: 'Archaea', depth: 1,
                children: [
                    { id: '6', label: 'Euryarchaeota', depth: 2 },
                    { id: '7', label: 'TACK Group', depth: 2 }
                ]
            }
        ]
    };

    const renderNode = (node: Node) => (
        <div key={node.id} style={{ marginLeft: `${node.depth * 2.5}rem`, position: 'relative' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '0.5rem', width: 'fit-content', cursor: 'pointer', transition: 'all 0.2s'
            }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{node.label}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ID: {node.id}</span>
            </div>
            {node.children && (
                <div style={{ borderLeft: '1px solid rgba(139, 92, 246, 0.2)', marginLeft: '0.4rem' }}>
                    {node.children.map(child => renderNode(child))}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '1rem', color: '#8b5cf6' }}>
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>PhyloGen</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyse Phylogénétique & Cladogrammes</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Download size={18} style={{ marginRight: '0.5rem' }} /> Export Newick</button>
                    <button className="btn" style={{ background: '#8b5cf6' }}><Info size={18} style={{ marginRight: '0.5rem' }} /> Aide</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Options de l'Arbre</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ fontSize: '0.8rem' }}>Type: Rectangulaire</div>
                            <div style={{ fontSize: '0.8rem' }}>Labels: Affichés</div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Zoom: {(zoom * 100).toFixed(0)}%</div>
                            <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Recherche de Taxons</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input type="text" placeholder="Rechercher..." style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }} />
                        </div>
                    </div>
                </aside>

                <main className="glass-panel" style={{ padding: '3rem', overflow: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.1s' }}>
                        {renderNode(treeData)}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PhyloGen;
