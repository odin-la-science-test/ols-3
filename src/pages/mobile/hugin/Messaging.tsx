import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Inbox, Star, Trash2, Archive, Search, Paperclip } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../../components/MobileBottomNav';
import '../../../styles/mobile-app.css';

const MobileMessaging = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { fetchModuleData } = await import('../../../utils/persistence');
        const data = await fetchModuleData('messaging');
        if (data && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();
  }, []);

  const folders = [
    { id: 'inbox', label: 'Boîte de réception', icon: Inbox },
    { id: 'starred', label: 'Favoris', icon: Star },
    { id: 'sent', label: 'Envoyés', icon: Send },
    { id: 'archive', label: 'Archives', icon: Archive },
    { id: 'trash', label: 'Corbeille', icon: Trash2 }
  ];

  const filteredMessages = messages
    .filter(m => m.folder === selectedFolder)
    .filter(m => 
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.from?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = messages.filter(m => m.folder === 'inbox' && !m.read).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
  };

  const handleBack = () => {
    if (selectedMessage) {
      setSelectedMessage(null);
    } else {
      navigate('/hugin');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return 'var(--mobile-text-secondary)';
    }
  };

  // Vue détaillée d'un message
  if (selectedMessage) {
    return (
      <div className="mobile-container">
        <div className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--mobile-text)',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 className="mobile-title" style={{ marginBottom: 0, fontSize: '1.1rem' }}>
                {selectedMessage.from}
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--mobile-text-secondary)', marginTop: '0.25rem' }}>
                {formatDate(selectedMessage.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="mobile-content">
          {/* Actions rapides */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--mobile-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mobile-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Send size={16} />
              Répondre
            </button>
            <button
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--mobile-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mobile-text)',
                cursor: 'pointer'
              }}
            >
              <Star size={18} />
            </button>
            <button
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--mobile-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mobile-text)',
                cursor: 'pointer'
              }}
            >
              <Archive size={18} />
            </button>
            <button
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Sujet */}
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              {selectedMessage.subject}
            </h2>
            
            {/* Métadonnées */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {selectedMessage.priority && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  background: `${getPriorityColor(selectedMessage.priority)}15`,
                  color: getPriorityColor(selectedMessage.priority),
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPriorityColor(selectedMessage.priority) }} />
                  {selectedMessage.priority === 'high' ? 'Priorité haute' : selectedMessage.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                </div>
              )}
              {selectedMessage.attachments && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--mobile-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  <Paperclip size={12} />
                  {selectedMessage.attachments} pièce(s) jointe(s)
                </div>
              )}
            </div>

            {/* Corps du message */}
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.75rem',
              border: '1px solid var(--mobile-border)',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              {selectedMessage.body || 'Contenu du message...'}
            </div>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/hugin')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--mobile-text)',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>Messagerie</h1>
        </div>
      </div>

      <div className="mobile-content">
        {/* Folders */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          overflowX: 'auto', 
          marginBottom: '1rem',
          paddingBottom: '0.5rem'
        }}>
          {folders.map(folder => {
            const Icon = folder.icon;
            const isActive = selectedFolder === folder.id;
            const count = folder.id === 'inbox' ? unreadCount : 0;

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: isActive ? 'var(--mobile-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? 'white' : 'var(--mobile-text)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Icon size={16} />
                {folder.label}
                {count > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mobile-search">
          <Search className="mobile-search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher un message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Messages List */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Messages ({filteredMessages.length})
        </h2>

        {filteredMessages.length === 0 ? (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Mail size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--mobile-text-secondary)' }} />
            <p style={{ color: 'var(--mobile-text-secondary)' }}>
              Aucun message
            </p>
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <div
              key={index}
              className="mobile-card"
              onClick={() => handleMessageClick(message)}
              style={{
                marginBottom: '0.75rem',
                borderLeft: message.read ? 'none' : '3px solid var(--mobile-primary)',
                background: message.read ? 'var(--mobile-card-bg)' : 'rgba(99, 102, 241, 0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--mobile-primary), var(--mobile-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {(message.from?.[0] || 'U').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: message.read ? 500 : 700,
                      margin: 0
                    }}>
                      {message.from}
                    </h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--mobile-text-secondary)',
                      flexShrink: 0,
                      marginLeft: '0.5rem'
                    }}>
                      {formatDate(message.date)}
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: message.read ? 400 : 600,
                    marginBottom: '0.25rem',
                    color: message.read ? 'var(--mobile-text)' : 'var(--mobile-primary)'
                  }}>
                    {message.subject}
                  </p>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--mobile-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {message.preview || message.body?.substring(0, 50)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileMessaging;
