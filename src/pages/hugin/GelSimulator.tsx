import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Download, Info, Ruler } from 'lucide-react';

const GelSimulator = () => {
  const navigate = useNavigate();
  const gelRef = useRef<HTMLDivElement>(null);
  const [samples, setSamples] = useState<any[]>([{ name: 'Échantillon 1', sizes: '500,1000,2000' }]);
  const [gelPercent, setGelPercent] = useState(1.0);
  const [showGel, setShowGel] = useState(false);
  const [useLadder, setUseLadder] = useState(true);
  const [ladderType, setLadderType] = useState('1kb');
  const [voltage, setVoltage] = useState(100);
  const [runTime, setRunTime] = useState(45);

  // Marqueurs de taille courants
  const ladders: { [key: string]: { name: string; sizes: number[] } } = {
    '1kb': { name: '1 kb DNA Ladder', sizes: [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 750, 500, 250] },
    '100bp': { name: '100 bp DNA Ladder', sizes: [1500, 1200, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100] },
    'protein': { name: 'Protein Marker', sizes: [250, 150, 100, 75, 50, 37, 25, 20, 15, 10] }
  };

  const addSample = () => {
    setSamples([...samples, { name: `Échantillon ${samples.length + 1}`, sizes: '' }]);
  };

  const updateSample = (index: number, field: string, value: string) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  const removeSample = (index: number) => {
    setSamples(samples.filter((_, i) => i !== index));
  };

  const calculateMigration = (size: number) => {
    // Formule améliorée basée sur la concentration du gel et les conditions de migration
    const minSize = 100;
    const maxSize = 10000;
    
    // Facteur de correction basé sur la concentration du gel
    const gelFactor = 1 + (gelPercent - 1) * 0.3;
    
    // Facteur de correction basé sur le voltage et le temps
    const migrationFactor = (voltage / 100) * (runTime / 45);
    
    const logSize = Math.log10(size);
    const logMin = Math.log10(minSize);
    const logMax = Math.log10(maxSize);
    
    // Migration de base
    let migration = 100 - ((logSize - logMin) / (logMax - logMin)) * 80;
    
    // Appliquer les corrections
    migration = migration * gelFactor * migrationFactor;
    
    return Math.max(10, Math.min(90, migration));
  };

  const exportGelImage = () => {
    if (!gelRef.current) return;
    
    // Créer un canvas pour l'export
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gelElement = gelRef.current;
    const rect = gelElement.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Dessiner le fond
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les puits et bandes
    const laneWidth = 60;
    const laneSpacing = 80;
    const startX = 50;
    
    const allSamples = useLadder ? [{ name: ladders[ladderType].name, sizes: ladders[ladderType].sizes.join(','), isLadder: true }, ...samples] : samples;
    
    allSamples.forEach((sample, i) => {
      const x = startX + i * laneSpacing;
      
      // Dessiner le puits
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(x, 20, laneWidth, rect.height - 40);
      
      // Dessiner le nom
      ctx.fillStyle = '#888';
      ctx.font = '12px sans-serif';
      ctx.fillText(sample.name, x, 15);
      
      // Dessiner les bandes
      const sizes = sample.sizes.split(',').map((s: string) => parseInt(s.trim())).filter((s: number) => !isNaN(s));
      sizes.forEach((size: number) => {
        const migration = calculateMigration(size);
        const y = (migration / 100) * (rect.height - 40) + 20;
        
        ctx.fillStyle = sample.isLadder ? '#00ccff' : '#00ff88';
        ctx.shadowColor = sample.isLadder ? '#00ccff' : '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fillRect(x + 5, y - 1.5, laneWidth - 10, 3);
        ctx.shadowBlur = 0;
      });
    });
    
    // Télécharger l'image
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gel-simulation-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const runGel = () => {
    if (samples.some(s => !s.sizes.trim())) {
      alert('Veuillez entrer des tailles pour tous les échantillons');
      return;
    }
    setShowGel(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/beta-hub')} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Simulateur de Gel d'Électrophorèse</h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Visualisez la migration de vos fragments d'ADN</p>
            </div>
          </div>
          {showGel && (
            <button onClick={exportGelImage} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Download size={18} /> Exporter l'image
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showGel ? '400px 1fr' : '1fr', gap: '2rem' }}>
          <div>
            {/* Paramètres du gel */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={20} /> Paramètres du gel
              </h3>
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Concentration d'agarose (%)</label>
              <input 
                type="number" 
                value={gelPercent} 
                onChange={(e) => setGelPercent(Number(e.target.value))} 
                min="0.5" 
                max="3" 
                step="0.1" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }} 
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem' }}>
                <div>• 0.5-0.7%: 1-30 kb</div>
                <div>• 1%: 0.5-10 kb</div>
                <div>• 1.5%: 0.2-3 kb</div>
                <div>• 2%: 0.1-2 kb</div>
              </div>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Voltage (V)</label>
              <input 
                type="number" 
                value={voltage} 
                onChange={(e) => setVoltage(Number(e.target.value))} 
                min="50" 
                max="200" 
                step="10" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem' }} 
              />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Temps de migration (min)</label>
              <input 
                type="number" 
                value={runTime} 
                onChange={(e) => setRunTime(Number(e.target.value))} 
                min="15" 
                max="120" 
                step="5" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem' }} 
              />
            </div>

            {/* Marqueur de taille */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ruler size={20} /> Marqueur de taille
              </h3>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={useLadder} 
                  onChange={(e) => setUseLadder(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 600 }}>Utiliser un marqueur</span>
              </label>

              {useLadder && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Type de marqueur</label>
                  <select 
                    value={ladderType} 
                    onChange={(e) => setLadderType(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer' }}
                  >
                    <option value="1kb">1 kb DNA Ladder</option>
                    <option value="100bp">100 bp DNA Ladder</option>
                    <option value="protein">Protein Marker</option>
                  </select>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {ladders[ladderType].sizes.join(', ')} {ladderType === 'protein' ? 'kDa' : 'bp'}
                  </div>
                </div>
              )}
            </div>

            {/* Échantillons */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Échantillons</h3>
              {samples.map((sample, i) => (
                <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <input 
                    type="text" 
                    value={sample.name} 
                    onChange={(e) => updateSample(i, 'name', e.target.value)} 
                    placeholder="Nom de l'échantillon" 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }} 
                  />
                  <input 
                    type="text" 
                    value={sample.sizes} 
                    onChange={(e) => updateSample(i, 'sizes', e.target.value)} 
                    placeholder="Tailles (pb) : 500,1000,2000" 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: '0.5rem' }} 
                  />
                  {samples.length > 1 && (
                    <button 
                      onClick={() => removeSample(i)} 
                      style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button 
                onClick={addSample} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}
              >
                + Ajouter un échantillon
              </button>
              
              <button 
                onClick={runGel} 
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: 'none', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
              >
                <Zap size={20} /> Lancer la migration
              </button>
            </div>
          </div>

          {showGel && (
            <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Résultat de la migration</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Gel {gelPercent}% • {voltage}V • {runTime} min
                </div>
              </div>
              
              <div 
                ref={gelRef}
                style={{ 
                  background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', 
                  borderRadius: '0.5rem', 
                  padding: '2rem', 
                  minHeight: '600px', 
                  position: 'relative',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                }}
              >
                {/* Indicateurs de polarité */}
                <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', color: '#ff6b6b', fontWeight: 700, background: 'rgba(255,107,107,0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem' }}>
                  Cathode (-)
                </div>
                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', color: '#4ecdc4', fontWeight: 700, background: 'rgba(78,205,196,0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem' }}>
                  Anode (+)
                </div>

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', paddingTop: '2rem' }}>
                  {/* Afficher le marqueur en premier si activé */}
                  {useLadder && (
                    <div style={{ position: 'relative', width: '60px' }}>
                      <div style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#00ccff', whiteSpace: 'nowrap', fontWeight: 700 }}>
                        Marqueur
                      </div>
                      <div style={{ width: '100%', height: '550px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.25rem', position: 'relative', border: '1px solid rgba(0,204,255,0.2)' }}>
                        {/* Puits */}
                        <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '20px', background: 'rgba(0,204,255,0.2)', borderRadius: '0.25rem' }} />
                        
                        {ladders[ladderType].sizes.map((size: number, j: number) => {
                          const migration = calculateMigration(size);
                          return (
                            <div key={j} style={{ position: 'relative' }}>
                              <div 
                                style={{ 
                                  position: 'absolute', 
                                  top: `${migration}%`, 
                                  left: '10%', 
                                  right: '10%', 
                                  height: '4px', 
                                  background: '#00ccff', 
                                  boxShadow: '0 0 15px #00ccff', 
                                  borderRadius: '2px' 
                                }} 
                                title={`${size} ${ladderType === 'protein' ? 'kDa' : 'bp'}`} 
                              />
                              <div style={{ position: 'absolute', top: `${migration}%`, right: '-40px', fontSize: '0.7rem', color: '#00ccff', transform: 'translateY(-50%)' }}>
                                {size}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Échantillons */}
                  {samples.map((sample, i) => {
                    const sizes = sample.sizes.split(',').map((s: string) => parseInt(s.trim())).filter((s: number) => !isNaN(s));
                    return (
                      <div key={i} style={{ position: 'relative', width: '60px' }}>
                        <div style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#00ff88', whiteSpace: 'nowrap', fontWeight: 700 }}>
                          {sample.name}
                        </div>
                        <div style={{ width: '100%', height: '550px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.25rem', position: 'relative', border: '1px solid rgba(0,255,136,0.2)' }}>
                          {/* Puits */}
                          <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '20px', background: 'rgba(0,255,136,0.2)', borderRadius: '0.25rem' }} />
                          
                          {sizes.map((size: number, j: number) => {
                            const migration = calculateMigration(size);
                            return (
                              <div 
                                key={j} 
                                style={{ 
                                  position: 'absolute', 
                                  top: `${migration}%`, 
                                  left: '10%', 
                                  right: '10%', 
                                  height: '4px', 
                                  background: '#00ff88', 
                                  boxShadow: '0 0 15px #00ff88', 
                                  borderRadius: '2px' 
                                }} 
                                title={`${size} bp`} 
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Légende */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Légende</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '3px', background: '#00ccff', boxShadow: '0 0 5px #00ccff', borderRadius: '1px' }} />
                    <span>Marqueur de taille</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '3px', background: '#00ff88', boxShadow: '0 0 5px #00ff88', borderRadius: '1px' }} />
                    <span>Échantillons</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GelSimulator;
