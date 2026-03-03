import { useState } from 'react';
import { Microscope, Search, BookOpen, AlertTriangle, Wrench, ArrowLeft, Video, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  applications: string[];
  specifications: { [key: string]: string };
  safety: string[];
  maintenance: string[];
}

const LabEquipment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const equipment: Equipment[] = [
    {
      id: 'microscope-optique',
      name: 'Microscope Optique',
      category: 'Microscopie',
      description: 'Microscope à lumière visible pour l\'observation de cellules et tissus. Grossissement jusqu\'à 1000x avec objectifs à immersion.',
      applications: ['Observation cellulaire', 'Histologie', 'Bactériologie', 'Parasitologie'],
      specifications: {
        'Grossissement': '40x - 1000x',
        'Résolution': '0.2 µm',
        'Éclairage': 'LED ou halogène',
        'Objectifs': '4x, 10x, 40x, 100x (immersion)'
      },
      safety: ['Porter des gants lors de la manipulation', 'Ne pas toucher les lentilles', 'Nettoyer avec papier optique uniquement'],
      maintenance: ['Nettoyer les objectifs après chaque utilisation', 'Couvrir après usage', 'Vérifier l\'alignement mensuel']
    },
    {
      id: 'spectrophotometre',
      name: 'Spectrophotomètre UV-Vis',
      category: 'Spectroscopie',
      description: 'Appareil mesurant l\'absorbance de la lumière UV-visible par les échantillons. Utilisé pour quantifier ADN, protéines, et autres molécules.',
      applications: ['Dosage ADN/ARN', 'Dosage protéines', 'Cinétique enzymatique', 'Analyse de pureté'],
      specifications: {
        'Plage spectrale': '190-1100 nm',
        'Précision': '±0.002 Abs',
        'Volume': '50-3000 µL',
        'Température': '15-35°C'
      },
      safety: ['Utiliser des cuvettes propres', 'Éviter les bulles d\'air', 'Manipuler avec précaution les UV'],
      maintenance: ['Calibration hebdomadaire', 'Nettoyer les cuvettes', 'Vérifier la lampe tous les 6 mois']
    }
  ];

  const categories = ['all', 'Microscopie', 'Spectroscopie', 'Chromatographie', 'Biologie moléculaire', 'Culture cellulaire'];

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Microscope size={40} />
            Fiches Machines de Laboratoire
          </h1>
          <p style={{ color: 'white', fontSize: '1.1rem' }}>
            Guides d\'utilisation et schémas des équipements
          </p>
        </header>

        {!selectedEquipment ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-hugin)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un équipement..."
                  className="input-field"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: selectedCategory === cat ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredEquipment.map(eq => (
                <div
                  key={eq.id}
                  className="card glass-panel"
                  onClick={() => setSelectedEquipment(eq)}
                  style={{ cursor: 'pointer', padding: '1.5rem', transition: 'all 0.2s' }}
                >
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white' }}>{eq.name}</h3>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                    color: 'white'
                  }}>
                    {eq.category}
                  </span>
                  <p style={{ color: 'white', fontSize: '0.9rem' }}>{eq.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <button onClick={() => setSelectedEquipment(null)} className="btn-secondary" style={{ marginBottom: '1.5rem' }}>
              ← Retour
            </button>

            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>{selectedEquipment.name}</h2>
            <p style={{ color: 'white', marginBottom: '2rem' }}>{selectedEquipment.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>Spécifications</h3>
                {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '0.5rem', color: 'white' }}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-hugin)' }}>Applications</h3>
                <ul style={{ paddingLeft: '1.5rem', color: 'white' }}>
                  {selectedEquipment.applications.map((app, idx) => (
                    <li key={idx}>{app}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabEquipment;
