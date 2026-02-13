import { useState, useEffect } from 'react';
import { StickyNote, Plus, X, Save, Trash2 } from 'lucide-react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  color: string;
}

interface QuickNotesProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const QuickNotes = ({ isOpen: isOpenProp, onClose: onCloseProp }: QuickNotesProps = {}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isMobile } = useDeviceDetection();

  // Utiliser les props si fournies (mode mobile contrôlé), sinon utiliser l'état local
  const isModalOpen = isOpenProp !== undefined ? isOpenProp : isOpen;
  const handleClose = () => {
    if (onCloseProp) {
      onCloseProp();
    } else {
      setIsOpen(false);
    }
  };

  const colors = ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#e0e7ff'];

  useEffect(() => {
    const stored = localStorage.getItem('quickNotes');
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        createdAt: new Date().toISOString(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      saveNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, content } : n));
    setEditingId(null);
  };

  if (!isModalOpen) {
    // Ne pas afficher le bouton flottant en mode mobile si contrôlé par props
    if (isMobile && isOpenProp !== undefined) {
      return null;
    }
    
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '100px' : '2rem',
          left: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <StickyNote size={24} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '100px' : '2rem',
        left: '2rem',
        width: isMobile ? 'calc(100% - 2rem)' : '400px',
        maxHeight: isMobile ? 'calc(100vh - 200px)' : '600px',
        background: isMobile ? '#1e293b' : '#1e293b',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0f172a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StickyNote size={20} style={{ color: '#f59e0b' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>Notes rapides</h3>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* New Note Input */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: '#1e293b' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Nouvelle note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#f1f5f9',
              fontSize: '0.9rem'
            }}
          />
          <button
            onClick={addNote}
            style={{
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: '#1e293b'
      }}>
        {notes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#94a3b8'
          }}>
            <StickyNote size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>Aucune note pour le moment</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                padding: '1rem',
                background: note.color,
                borderRadius: '0.75rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                color: '#1f2937',
                transition: 'all 0.2s'
              }}
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    defaultValue={note.content}
                    onBlur={(e) => updateNote(note.id, e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#1f2937',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              ) : (
                <p
                  onClick={() => setEditingId(note.id)}
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {note.content}
                </p>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickNotes;
