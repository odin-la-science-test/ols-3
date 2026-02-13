import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Search, Inbox, Plus } from 'lucide-react';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem } from '../../../utils/persistence';
import MobileBottomNav from '../../../components/MobileBottomNav';
import '../../../styles/mobile-app.css';

const MobileMessaging = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = toast?.showToast || (() => {});
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [view, setView] = useState<'list' | 'read' | 'compose'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' });

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await fetchModuleData('messaging');
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.to || !newMessage.subject) {
            showToast('Destinataire et sujet requis', 'error');
            return;
        }

        const message = {
            id: Date.now().toString(),
            from: localStorage.getItem('currentUser') || 'user@ols.com',
            to: newMessage.to,
            subject: newMessage.subject,
            body: newMessage.body,
            date: new Date().toISOString(),
            read: false,
            folder: 'sent'
        };

        await saveModuleItem('messaging', message);
        setMessages([message, ...messages]);
        setNewMessage({ to: '', subject: '', body: '' });
        setView('list');
        showToast('Message envoyé', 'success');
    };

    const filteredMessages = messages.filter(m => 
        m?.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m?.from?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mobile-app">
            {/* Header */}
            <div className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button 
                            onClick={() => view === 'list' ? navigate('/hugin') : setView('list')} 
                            className="mobile-btn-icon"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="mobile-header-title" style={{ fontSize: '1.5rem' }}>Messages</h1>
                            <p className="mobile-header-subtitle">{messages.length} messages</p>
                        </div>
                    </div>
                    {view === 'list' && (
                        <button 
                            onClick={() => setView('compose')} 
                            className="mobile-btn-icon"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mobile-content">
                {view === 'list' && (
                    <>
                        {/* Search */}
                        <div className="mobile-search">
                            <Search size={18} className="mobile-search-icon" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="mobile-input"
                            />
                        </div>

                        {/* Messages List */}
                        {filteredMessages.length === 0 ? (
                            <div className="mobile-empty">
                                <div className="mobile-empty-icon">
                                    <Inbox size={64} />
                                </div>
                                <div className="mobile-empty-title">Aucun message</div>
                                <div className="mobile-empty-subtitle">Votre boîte de réception est vide</div>
                            </div>
                        ) : (
                            <div className="mobile-list">
                                {filteredMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        onClick={() => { setSelectedMessage(msg); setView('read'); }}
                                        className="mobile-list-item"
                                        style={{
                                            background: msg.read ? 'var(--mobile-card)' : 'rgba(102, 126, 234, 0.05)'
                                        }}
                                    >
                                        <div className="mobile-avatar mobile-avatar-sm">
                                            {msg?.from?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="mobile-list-item-content">
                                            <div className="mobile-list-item-title">
                                                {msg.subject}
                                            </div>
                                            <div className="mobile-list-item-subtitle">
                                                {msg.from} • {new Date(msg.date).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                        {!msg.read && (
                                            <span className="mobile-badge mobile-badge-primary">Nouveau</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {view === 'read' && selectedMessage && (
                    <div className="mobile-card mobile-card-elevated">
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--mobile-border)' }}>
                            <div className="mobile-card-title">{selectedMessage.subject}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                                <div className="mobile-avatar mobile-avatar-sm">
                                    {selectedMessage?.from?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedMessage.from}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--mobile-text-secondary)' }}>
                                        {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {selectedMessage.body}
                        </div>
                    </div>
                )}

                {view === 'compose' && (
                    <div className="mobile-card mobile-card-elevated">
                        <h2 className="mobile-card-title" style={{ marginBottom: '1.5rem' }}>Nouveau Message</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>À:</label>
                                <input
                                    type="email"
                                    value={newMessage.to}
                                    onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                                    placeholder="destinataire@email.com"
                                    className="mobile-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Sujet:</label>
                                <input
                                    type="text"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    placeholder="Sujet du message"
                                    className="mobile-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Message:</label>
                                <textarea
                                    value={newMessage.body}
                                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                                    placeholder="Écrivez votre message..."
                                    className="mobile-input"
                                    style={{ height: '200px', resize: 'vertical' }}
                                />
                            </div>
                            <button 
                                onClick={sendMessage}
                                className="mobile-btn mobile-btn-primary"
                                style={{ width: '100%' }}
                            >
                                <Send size={18} />
                                Envoyer
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default MobileMessaging;
