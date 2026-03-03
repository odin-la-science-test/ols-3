import { useState } from 'react';
import { Shield, Search, BookOpen, Dna, AlertTriangle, Microscope, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface ResistanceMechanism {
  id: string;
  name: string;
  category: 'enzymatic' | 'target' | 'permeability' | 'efflux';
  antibiotics: string[];
  genes: string[];
  description: string;
  clinicalImpact: string;
  detection: string[];
  diagram?: string;
}

const ResistancePhenotypes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMechanism, setSelectedMechanism] = useState<ResistanceMechanism | null>(null);

  const mechanisms: ResistanceMechanism[] = [
    {
      id: 'blse',
      name: 'β-Lactamases à Spectre Étendu (BLSE)',
      category: 'enzymatic',
      antibiotics: ['Pénicillines', 'Céphalosporines 3G', 'Aztréonam'],
      genes: ['blaCTX-M', 'blaSHV', 'blaTEM'],
      description: 'Enzymes qui hydrolysent les β-lactamines par clivage du cycle β-lactame. Les BLSE confèrent une résistance aux pénicillines et céphalosporines de 3ème génération.',
      clinicalImpact: 'Infections nosocomiales graves, options thérapeutiques limitées aux carbapénèmes',
      detection: ['Test de synergie (double disque)', 'E-test BLSE', 'PCR pour gènes blaCTX-M']
    },
    {
      id: 'carbapenemase',
      name: 'Carbapénémases',
      category: 'enzymatic',
      antibiotics: ['Carbapénèmes', 'Toutes β-lactamines'],
      genes: ['blaKPC', 'blaNDM', 'blaOXA-48', 'blaVIM', 'blaIMP'],
      description: 'Enzymes capables d\'hydrolyser les carbapénèmes, antibiotiques de dernier recours. Classification : Classe A (KPC), Classe B (métallo-β-lactamases), Classe D (OXA).',
      clinicalImpact: 'Résistance critique, mortalité élevée, transmission nosocomiale rapide',
      detection: ['Test de Hodge modifié', 'Test à l\'EDTA (MBL)', 'PCR multiplex', 'Spectrométrie de masse MALDI-TOF']
    },
    {
      id: 'vre',
      name: 'Résistance aux Glycopeptides (VRE)',
      category: 'target',
      antibiotics: ['Vancomycine', 'Teicoplanine'],
      genes: ['vanA', 'vanB', 'vanC'],
      description: 'Modification de la cible D-Ala-D-Ala en D-Ala-D-Lac, réduisant l\'affinité de la vancomycine. VanA: résistance élevée, VanB: résistance variable, VanC: résistance intrinsèque faible.',
      clinicalImpact: 'Entérocoques résistants, infections difficiles à traiter, colonisation intestinale',
      detection: ['CMI vancomycine/teicoplanine', 'PCR vanA/vanB', 'Culture sélective']
    },
    {
      id: 'qrdr',
      name: 'Résistance aux Quinolones (QRDR)',
      category: 'target',
      antibiotics: ['Fluoroquinolones', 'Ciprofloxacine', 'Lévofloxacine'],
      genes: ['gyrA', 'gyrB', 'parC', 'parE'],
      description: 'Mutations dans les gènes codant pour l\'ADN gyrase et la topoisomérase IV, réduisant la liaison des quinolones. Mécanisme chromosomique principal.',
      clinicalImpact: 'Résistance croisée entre quinolones, échecs thérapeutiques fréquents',
      detection: ['CMI quinolones', 'Séquençage QRDR', 'PCR-RFLP']
    },
    {
      id: 'aminoglycoside',
      name: 'Résistance aux Aminosides',
      category: 'enzymatic',
      antibiotics: ['Gentamicine', 'Tobramycine', 'Amikacine'],
      genes: ['aac', 'aph', 'ant'],
      description: 'Enzymes modificatrices: acétyltransférases (AAC), phosphotransférases (APH), nucléotidyltransférases (ANT). Modification chimique empêche la liaison au ribosome.',
      clinicalImpact: 'Résistance variable selon l\'enzyme, amikacine souvent épargnée',
      detection: ['CMI aminosides', 'PCR gènes de résistance', 'Phénotype de résistance']
    },
    {
      id: 'efflux',
      name: 'Pompes d\'Efflux',
      category: 'efflux',
      antibiotics: ['Multiples classes'],
      genes: ['mexAB-oprM', 'acrAB-tolC', 'mefA'],
      description: 'Systèmes de transport actif expulsant les antibiotiques hors de la cellule. Familles: RND, MFS, ABC, SMR, MATE. Résistance multi-drogues.',
      clinicalImpact: 'Résistance multiple, difficile à détecter, rôle dans la résistance intrinsèque',
      detection: ['Inhibiteurs de pompes (PAβN)', 'Expression génique (RT-qPCR)', 'Accumulation d\'antibiotiques']
    },
    {
      id: 'porin',
      name: 'Perte de Porines',
      category: 'permeability',
      antibiotics: ['β-lactamines', 'Carbapénèmes'],
      genes: ['ompC', 'ompF', 'oprD'],
      description: 'Diminution ou perte de porines membranaires réduisant la perméabilité aux antibiotiques hydrophiles. Souvent associée à d\'autres mécanismes.',
      clinicalImpact: 'Résistance modérée, synergie avec β-lactamases',
      detection: ['Western blot', 'Profil protéique', 'Séquençage gènes porines']
    },
    {
      id: 'mdr',
      name: 'Résistance Multiple (MDR/XDR/PDR)',
      category: 'enzymatic',
      antibiotics: ['Multiples classes'],
      genes: ['Multiples'],
      description: 'MDR: résistance à ≥3 classes. XDR: résistance à toutes sauf 1-2 classes. PDR: résistance à toutes les classes disponibles. Accumulation de mécanismes.',
      clinicalImpact: 'Impasse thérapeutique, mortalité très élevée, isolement strict',
      detection: ['Antibiogramme complet', 'Séquençage génome entier', 'PCR multiplex']
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: <Shield size={20} /> },
    { id: 'enzymatic', name: 'Enzymatique', icon: <Microscope size={20} /> },
    { id: 'target', name: 'Cible modifiée', icon: <Dna size={20} /> },
    { id: 'permeability', name: 'Perméabilité', icon: <AlertTriangle size={20} /> },
    { id: 'efflux', name: 'Efflux', icon: <ArrowLeft size={20} /> }
  ];

  const filteredMechanisms = mechanisms.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.antibiotics.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={40} />
            Phénotypes de Résistance
          </h1>
          <p style={{ color: 'white', fontSize: '1.1rem' }}>
            Mécanismes de résistance aux antibiotiques avec schémas explicatifs
          </p>
        </header>

        {!selectedMechanism ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-hugin)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un mécanisme ou antibiotique..."
                  className="input-field"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: selectedCategory === cat.id ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredMechanisms.map(mechanism => (
                <div
                  key={mechanism.id}
                  className="card glass-panel"
                  onClick={() => setSelectedMechanism(mechanism)}
                  style={{ cursor: 'pointer', padding: '1.5rem', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      padding: '0.75rem', 
                      background: 'rgba(239, 68, 68, 0.15)', 
                      borderRadius: '0.75rem', 
                      color: '#ef4444',
                      flexShrink: 0
                    }}>
                      <Shield size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {mechanism.name}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        color: 'var(--accent-hugin)'
                      }}>
                        {categories.find(c => c.id === mechanism.category)?.name}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {mechanism.description.substring(0, 120)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {mechanism.antibiotics.slice(0, 3).map((ab, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#ef4444'
                      }}>
                        {ab}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <button
              onClick={() => setSelectedMechanism(null)}
              className="btn-secondary"
              style={{ marginBottom: '1.5rem' }}
            >
              ← Retour à la liste
            </button>

            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield size={32} style={{ color: '#ef4444' }} />
              {selectedMechanism.name}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>
                  <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Description
                </h3>
                <p style={{ color: 'white', lineHeight: 1.6 }}>
                  {selectedMechanism.description}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>
                  <Dna size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Gènes impliqués
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedMechanism.genes.map((gene, idx) => (
                    <span key={idx} style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '0.5rem',
                      fontFamily: 'monospace',
                      color: 'var(--accent-hugin)'
                    }}>
                      {gene}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>
                Antibiotiques concernés
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {selectedMechanism.antibiotics.map((ab, idx) => (
                  <span key={idx} style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '0.5rem',
                    color: '#ef4444',
                    fontWeight: 500
                  }}>
                    {ab}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>
                <AlertTriangle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Impact clinique
              </h3>
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.75rem'
              }}>
                <p style={{ color: 'white', lineHeight: 1.6, margin: 0 }}>
                  {selectedMechanism.clinicalImpact}
                </p>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>
                <Microscope size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Méthodes de détection
              </h3>
              <ul style={{ color: 'white', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                {selectedMechanism.detection.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResistancePhenotypes;
