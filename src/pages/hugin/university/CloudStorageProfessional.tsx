import { useState } from 'react';
import { Cloud, Upload, Folder, File, Share2, Download, Trash2, Search, Grid, List, Lock, History, Users, CheckCircle, Clock, Eye, Edit, Star, Tag, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';

interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt: Date;
  owner: string;
  shared: boolean;
  version: number;
  versions: FileVersion[];
  permissions: Permission[];
  tags: string[];
  isFavorite: boolean;
  isEncrypted: boolean;
  status: 'draft' | 'review' | 'approved' | 'archived';
  signatures: Signature[];
}

interface FileVersion {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  size: number;
  comment: string;
}

interface Permission {
  userId: string;
  userName: string;
  access: 'view' | 'edit' | 'admin';
}

interface Signature {
  userId: string;
  userName: string;
  signedAt: Date;
  signature: string;
}

const CloudStorageProfessional = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState<CloudFile | null>(null);
  const [showShareModal, setShowShareModal] = useState<CloudFile | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'review' | 'approved'>('all');

  const files: CloudFile[] = [
    {
      id: '1',
      name: 'Protocoles TP',
      type: 'folder',
      modifiedAt: new Date('2024-03-01'),
      owner: 'Vous',
      shared: true,
      version: 1,
      versions: [],
      permissions: [
        { userId: '1', userName: 'Dr. Martin', access: 'edit' },
        { userId: '2', userName: 'Équipe Lab', access: 'view' }
      ],
      tags: ['TP', 'Protocoles'],
      isFavorite: true,
      isEncrypted: false,
      status: 'approved',
      signatures: []
    },
    {
      id: '2',
      name: 'Rapport_Microbiologie_v3.pdf',
      type: 'file',
      size: 2500000,
      modifiedAt: new Date('2024-03-02'),
      owner: 'Vous',
      shared: false,
      version: 3,
      versions: [
        { id: 'v1', version: 1, createdAt: new Date('2024-02-28'), createdBy: 'Vous', size: 2000000, comment: 'Version initiale' },
        { id: 'v2', version: 2, createdAt: new Date('2024-03-01'), createdBy: 'Vous', size: 2300000, comment: 'Ajout résultats' },
        { id: 'v3', version: 3, createdAt: new Date('2024-03-02'), createdBy: 'Vous', size: 2500000, comment: 'Corrections finales' }
      ],
      permissions: [],
      tags: ['Rapport', 'Microbiologie'],
      isFavorite: false,
      isEncrypted: true,
      status: 'review',
      signatures: [
        { userId: '1', userName: 'Dr. Martin', signedAt: new Date('2024-03-02'), signature: 'abc123' }
      ]
    },
    {
      id: '3',
      name: 'Données_Expérience.xlsx',
      type: 'file',
      size: 1200000,
      modifiedAt: new Date('2024-03-03'),
      owner: 'Vous',
      shared: true,
      version: 1,
      versions: [],
      permissions: [
        { userId: '3', userName: 'Collaborateur', access: 'edit' }
      ],
      tags: ['Données', 'Excel'],
      isFavorite: true,
      isEncrypted: false,
      status: 'draft',
      signatures: []
    }
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || f.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'review': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'archived': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'review': return 'En révision';
      case 'approved': return 'Approuvé';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', color: 'white' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Cloud size={40} />
            Stockage Cloud Professionnel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Gestion documentaire avec versioning, signatures et collaboration
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input-field"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="review">En révision</option>
            <option value="approved">Approuvé</option>
          </select>

          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ width: '4.2%', height: '100%', background: 'linear-gradient(90deg, var(--accent-hugin), #818cf8)' }} />
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="card glass-panel"
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedFiles.includes(file.id) ? '2px solid var(--accent-hugin)' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}
                onClick={() => toggleFileSelection(file.id)}
              >
                {file.isFavorite && (
                  <Star size={16} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#f59e0b', fill: '#f59e0b' }} />
                )}
                
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
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {file.tags.map(tag => (
                    <span key={tag} style={{ padding: '0.15rem 0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>{formatFileSize(file.size)}</span>
                  <span style={{ padding: '0.15rem 0.5rem', background: `${getStatusColor(file.status)}33`, color: getStatusColor(file.status), borderRadius: '0.25rem', fontSize: '0.7rem' }}>
                    {getStatusLabel(file.status)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {file.shared && <Share2 size={14} style={{ color: 'var(--accent-hugin)' }} />}
                  {file.isEncrypted && <Lock size={14} style={{ color: '#10b981' }} />}
                  {file.version > 1 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <History size={14} />
                      v{file.version}
                    </span>
                  )}
                  {file.signatures.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      {file.signatures.length}
                    </span>
                  )}
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
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
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
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{file.name}</span>
                          {file.isFavorite && <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />}
                          {file.isEncrypted && <Lock size={14} style={{ color: '#10b981' }} />}
                        </div>
                        {file.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                            {file.tags.map(tag => (
                              <span key={tag} style={{ padding: '0.1rem 0.4rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.25rem', fontSize: '0.7rem' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{file.owner}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {file.modifiedAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {formatFileSize(file.size)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: `${getStatusColor(file.status)}33`, color: getStatusColor(file.status), borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                        {getStatusLabel(file.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {file.version > 1 && (
                          <button 
                            className="btn-icon" 
                            title="Historique des versions"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowVersionHistory(file);
                            }}
                          >
                            <History size={16} />
                          </button>
                        )}
                        <button 
                          className="btn-icon" 
                          title="Partager"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowShareModal(file);
                          }}
                        >
                          <Share2 size={16} />
                        </button>
                        <button className="btn-icon" title="Télécharger">
                          <Download size={16} />
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

        {/* Version History Modal */}
        {showVersionHistory && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowVersionHistory(null)}>
            <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={24} />
                Historique des versions - {showVersionHistory.name}
              </h2>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {showVersionHistory.versions.map(version => (
                  <div key={version.id} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', borderLeft: version.version === showVersionHistory.version ? '4px solid var(--accent-hugin)' : '4px solid transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>Version {version.version}</span>
                      {version.version === showVersionHistory.version && (
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-hugin)', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                          Actuelle
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {version.createdBy} • {version.createdAt.toLocaleDateString('fr-FR')} • {formatFileSize(version.size)}
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>{version.comment}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                        <Download size={14} style={{ marginRight: '0.25rem' }} />
                        Télécharger
                      </button>
                      {version.version !== showVersionHistory.version && (
                        <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                          Restaurer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setShowVersionHistory(null)} className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowShareModal(null)}>
            <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '600px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={24} />
                Partager - {showShareModal.name}
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ajouter des personnes</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    placeholder="Email..."
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <select className="input-field" style={{ width: 'auto' }}>
                    <option value="view">Lecture</option>
                    <option value="edit">Édition</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="btn-primary">Ajouter</button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personnes ayant accès</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {showShareModal.permissions.map(perm => (
                    <div key={perm.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{perm.userName}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {perm.access === 'view' ? 'Lecture seule' : perm.access === 'edit' ? 'Peut modifier' : 'Administrateur'}
                        </p>
                      </div>
                      <button className="btn-icon">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setShowShareModal(null)} className="btn-primary" style={{ width: '100%' }}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudStorageProfessional;
