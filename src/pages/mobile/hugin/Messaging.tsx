import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Search, Inbox } from 'lucide-react';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem } from '../../../utils/persistence';

const MobileMessaging = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
            setMessages(data || []);
        } catch (error) {
            console.error('Error loading messages:', error);
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
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.from.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app-viewport">
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => view === 'list' ? navigate('/hugin') : setView('list')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <Mail size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Messages</h1>
                </div>
                {view === 'list' && (
                    <button onClick={() => setView('compose')} style={{ background: 'var(--accent-hugin)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Send size={20} />
                    </button>
                )}
            </div>

            <div className="app-scrollbox">
                {view === 'list' && (
                    <div>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 3rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>

                        {filteredMessages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                                <Inbox size={60} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p>Aucun message</p>
                            </div>
                        ) : (
                            <div>
                                {filteredMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        onClick={() => { setSelectedMessage(msg); setView('read'); }}
                                        style={{
                                            padding: '1rem 1.5rem',
                                            borderBottom: '1px solid var(--border-color)',
                                            background: msg.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <strong style={{ fontSize: '0.9rem' }}>{msg.from}</strong>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {new Date(msg.date).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: msg.read ? 400 : 600, marginBottom: '0.25rem' }}>
                                            {msg.subject}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.body}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'read' && selectedMessage && (
                    <div style={{ padding: '1.5rem' }}>
                        <div className="card-native" style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>De:</div>
                                <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{selectedMessage.from}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedMessage.subject}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                                </div>
                            </div>
                            <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {selectedMessage.body}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'compose' && (
                    <div style={{ padding: '1.5rem' }}>
                        <div className="card-native" style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>À:</label>
                                <input
                                    type="email"
                                    value={newMessage.to}
                                    onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                                    placeholder="destinataire@email.com"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Sujet:</label>
                                <input
                                    type="text"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    placeholder="Sujet du message"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Message:</label>
                                <textarea
                                    value={newMessage.body}
                                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                                    placeholder="Écrivez votre message..."
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        padding: '0.75rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <button 
                                onClick={sendMessage}
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Send size={18} />
                                Envoyer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileMessaging;
