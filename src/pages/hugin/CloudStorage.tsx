import { useState } from 'react';
import { Cloud, Upload, Folder, File, Share2, Download, Trash2, Search, Grid, List, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt: Date;
  owner: string;
  shared: boolean;
}

const CloudStorage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const files: CloudFile[] = [
    {
      id: '1',
      name: 'Protocoles TP',
      type: 'folder',
      modifiedAt: new Date('2024-03-01'),
      owner: 'Vous',
      shared: true
    },
    {
      id: '2',
      name: 'Rapport_Microbiologie.pdf',
      type: 'file',
      size: 2500000,
      modifiedAt: new Date('2024-03-02'),
      owner: 'Vous',
      shared: false
    },
    {
      id: '3',
      name: 'Données_Expérience.xlsx',
      type: 'file',
      size: 1200000,
      modifiedAt: new Date('2024-03-03'),
      owner: 'Vous',
      shared: true
    },
    {
      id: '4',
      name: 'Images_Microscope',
      type: 'folder',
      modifiedAt: new Date('2024-02-28'),
      owner: 'Vous',
      shared: false
    }
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', color: 'white' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Cloud size={40} />
            Stockage Cloud Sécurisé
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Stockez et partagez vos fichiers en toute sécurité
          </p>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-hugin)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des fichiers..."
              className="input-field"
              style={{ paddingLeft: '3rem' }}
            />
          </div>

          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Upload size={20} />
            Téléverser
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'grid' ? 'var(--accent-hugin)' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'list' ? 'var(--accent-hugin)' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Espace de stockage</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                4.2 GB utilisés sur 100 GB
              </p>
            </div>
            <div style={{ width: '200px' }}>
              <div style={{ 
                width: '100%', 
                height: '12px', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '4.2%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--accent-hugin), #818cf8)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="card glass-panel"
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedFiles.includes(file.id) ? '2px solid var(--accent-hugin)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  {file.type === 'folder' ? (
                    <Folder size={48} style={{ color: 'var(--accent-hugin)' }} />
                  ) : (
                    <File size={48} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', wordBreak: 'break-word' }}>
                  {file.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{formatFileSize(file.size)}</span>
                  {file.shared && <Share2 size={14} style={{ color: 'var(--accent-hugin)' }} />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card glass-panel" style={{ padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Propriétaire</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Modifié</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Taille</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <tr 
                    key={file.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      background: selectedFiles.includes(file.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {file.type === 'folder' ? <Folder size={20} /> : <File size={20} />}
                      <span>{file.name}</span>
                      {file.shared && <Share2 size={14} style={{ color: 'var(--accent-hugin)' }} />}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{file.owner}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {file.modifiedAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {formatFileSize(file.size)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-icon" title="Télécharger">
                          <Download size={16} />
                        </button>
                        <button className="btn-icon" title="Partager">
                          <Share2 size={16} />
                        </button>
                        <button className="btn-icon" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudStorage;
