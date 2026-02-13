import { useState, useEffect } from 'react';
import {
    Mail, Send, Trash2, Plus, Search, Inbox,
    FileText, Trash, Archive, MoreVertical, Reply,
    Forward, ArrowLeft, Paperclip
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';
import { getUserSignature, generateSignatureText, hasOLSSignature } from '../../utils/signatures';

type Attachment = {
    name: string;
    type: string;
    size: number;
    content: string; // base64
};

type Message = {
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    preview: string;
    date: string;
    read: boolean;
    body: string;
    folder: 'inbox' | 'sent' | 'trash' | 'drafts';
    flagged?: boolean;
    attachments?: Attachment[];
};

const Messaging = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const currentUser = localStorage.getItem('currentUser') || 'Utilisateur';

    const [messages, setMessages] = useState<Message[]>([]);
    const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'trash' | 'drafts'>('inbox');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [composeData, setComposeData] = useState<{ to: string, subject: string, body: string, attachments: Attachment[] }>({
        to: '',
        subject: '',
        body: '',
        attachments: []
    });

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newAttachment: Attachment = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    content: base64String
                };
                setComposeData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, newAttachment]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index: number) => {
        setComposeData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const downloadAttachment = (att: Attachment) => {
        const link = document.createElement('a');
        link.href = att.content;
        link.download = att.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadMessages = async () => {
        const data = await fetchModuleData('messaging');
        if (data) setMessages(data);
    };

    const handleSend = async () => {
        if (!composeData.to || !composeData.subject) {
            showToast('Destinataire et sujet requis', 'error');
            return;
        }

        let messageBody = composeData.body;
        if (hasOLSSignature(currentUser)) {
            const signature = getUserSignature(currentUser.toLowerCase());
            if (signature) {
                messageBody = composeData.body + '\n\n' + generateSignatureText(signature);
            }
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: currentUser.trim(),
            recipient: composeData.to.trim(),
            subject: composeData.subject.trim(),
            preview: composeData.body.substring(0, 50) + '...',
            date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
            read: false,
            body: messageBody,
            folder: 'inbox',
            attachments: composeData.attachments
        };

        try {
            await saveModuleItem('messaging', newMessage);
            setMessages([newMessage, ...messages]);
            setIsComposing(false);
            setComposeData({ to: '', subject: '', body: '', attachments: [] });
            showToast('Message envoyé', 'success');
            setActiveFolder('sent');
        } catch (error) {
            console.error('Send error:', error);
            showToast('Erreur d\'envoi', 'error');
        }
    };

    const moveToTrash = async (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;

        if (msg.folder === 'trash') {
            try {
                await deleteModuleItem('messaging', id);
                setMessages(messages.filter(m => m.id !== id));
                setSelectedId(null);
                showToast('Message supprimé définitivement', 'info');
            } catch (e) { showToast('Erreur suppression', 'error'); }
        } else {
            const updated = { ...msg, folder: 'trash' };
            try {
                await saveModuleItem('messaging', updated);
                setMessages(messages.map(m => m.id === id ? (updated as Message) : m));
                setSelectedId(null);
                showToast('Placé dans la corbeille', 'info');
            } catch (e) { showToast('Erreur déplacement', 'error'); }
        }
    };

    const markAsRead = async (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg || msg.read) return;

        const updated = { ...msg, read: true };
        try {
            await saveModuleItem('messaging', updated);
            setMessages(messages.map(m => m.id === id ? (updated as Message) : m));
        } catch (e) { }
    };

    const archiveMessage = async (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;

        try {
            const archiveItem = {
                id: `arch_msg_${msg.id}_${Date.now()}`,
                name: `Message: ${msg.subject}`,
                category: 'Internal',
                size: `${(Number(JSON.stringify(msg).length) / 1024).toFixed(1)} KB`,
                date: new Date().toISOString().split('T')[0],
                description: `Archived message from ${msg.sender} regarding ${msg.subject}.`
            };

            await saveModuleItem('hugin_it_archives', archiveItem);
            await deleteModuleItem('messaging', id);

            setMessages(messages.filter(m => m.id !== id));
            setSelectedId(null);
            showToast('Message transféré aux archives IT', 'success');
        } catch (e) {
            console.error('Archive error:', e);
            showToast('Erreur lors de l\'archivage', 'error');
        }
    };

    const normalizedUser = currentUser.trim().toLowerCase();

    const filteredMessages = messages
        .filter(m => {
            const isSender = m.sender.trim().toLowerCase() === normalizedUser;
            const isRecipient = m.recipient.trim().toLowerCase() === normalizedUser;

            if (m.folder === 'trash') {
                return activeFolder === 'trash' && (isSender || isRecipient);
            }

            if (activeFolder === 'inbox') return isRecipient;
            if (activeFolder === 'sent') return isSender;
            if (activeFolder === 'drafts') return isSender && m.folder === 'drafts';

            return false;
        })
        .filter(m =>
            m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.recipient.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => Number(b.id) - Number(a.id));

    const selectedMessage = messages.find(m => m.id === selectedId);

    return (
        <div style={{ height: 'calc(100vh - 80px)', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>

            {/* Column 1: Navigation Sidebar */}
            <aside style={{ width: '240px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '1.5rem' }}>
                    <button
                        onClick={() => { setIsComposing(true); setSelectedId(null); }}
                        className="btn btn-primary"
                        style={{ width: '100%', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Nouveau message
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '0 0.75rem' }}>
                    {[
                        { id: 'inbox', label: 'Boîte de réception', icon: Inbox },
                        { id: 'sent', label: 'Messages envoyés', icon: Send },
                        { id: 'drafts', label: 'Brouillons', icon: FileText },
                        { id: 'trash', label: 'Corbeille', icon: Trash },
                    ].map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => { setActiveFolder(folder.id as any); setSelectedId(null); setIsComposing(false); }}
                            style={{
                                width: '100%', border: 'none', background: activeFolder === folder.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                color: activeFolder === folder.id ? 'var(--accent-hugin)' : 'var(--text-secondary)',
                                padding: '0.75rem 1rem', borderRadius: '6px', textAlign: 'left', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <folder.icon size={18} />
                            <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: activeFolder === folder.id ? 600 : 400 }}>{folder.label}</span>
                            {folder.id === 'inbox' && messages.filter(m => !m.read && m.recipient.trim().toLowerCase() === normalizedUser && m.folder !== 'trash').length > 0 && (
                                <span style={{ background: 'var(--accent-hugin)', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                                    {messages.filter(m => !m.read && m.recipient.trim().toLowerCase() === normalizedUser && m.folder !== 'trash').length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Retour au Labo
                    </button>
                </div>
            </aside>

            {/* Column 2: Message List */}
            <main style={{ width: '380px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Rechercher..."
                            style={{ paddingLeft: '2.5rem', marginBottom: 0, fontSize: '0.9rem' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredMessages.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                            Aucun message dans ce dossier
                        </div>
                    ) : (
                        filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => { setSelectedId(msg.id); markAsRead(msg.id); setIsComposing(false); }}
                                style={{
                                    padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
                                    background: selectedId === msg.id ? 'rgba(59, 130, 246, 0.05)' : (!msg.read && activeFolder === 'inbox' ? 'rgba(255,255,255,0.02)' : 'transparent'),
                                    borderLeft: selectedId === msg.id ? '4px solid var(--accent-hugin)' : '4px solid transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: !msg.read ? 700 : 500, fontSize: '0.9rem', color: !msg.read ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                        {activeFolder === 'sent' ? `À: ${msg.recipient}` : msg.sender}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{msg.date.split(',')[0]}</span>
                                </div>
                                <div style={{ fontWeight: !msg.read ? 700 : 500, fontSize: '0.85rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {msg.subject}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {msg.preview}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Column 3: Content Preview / Compose */}
            <section style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                {isComposing ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Nouveau message</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setIsComposing(false)} className="btn" style={{ background: 'transparent', color: 'var(--text-primary)' }}>Annuler</button>
                                <button onClick={handleSend} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Envoyer <Send size={16} />
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', width: '40px' }}>À</span>
                                <input
                                    type="text"
                                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }}
                                    placeholder="email@example.com"
                                    value={composeData.to}
                                    onChange={e => setComposeData({ ...composeData, to: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', width: '40px' }}>Sujet</span>
                                <input
                                    type="text"
                                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontWeight: 600 }}
                                    placeholder="Objet du message"
                                    value={composeData.subject}
                                    onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                                />
                            </div>
                            <textarea
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', resize: 'none', fontSize: '1rem', lineHeight: 1.6, paddingTop: '1rem' }}
                                placeholder="Écrire votre message ici..."
                                value={composeData.body}
                                onChange={e => setComposeData({ ...composeData, body: e.target.value })}
                            />
                            {composeData.attachments.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {composeData.attachments.map((att, idx) => (
                                        <div key={idx} style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: 'var(--accent-hugin)'
                                        }}>
                                            <Paperclip size={14} />
                                            <span>{att.name} ({(att.size / 1024).toFixed(1)} KB)</span>
                                            <button
                                                onClick={() => removeAttachment(idx)}
                                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0, display: 'flex' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <input
                                    type="file"
                                    id="file-attachment"
                                    style={{ display: 'none' }}
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="file-attachment"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                                >
                                    <Paperclip size={18} /> Joindre un fichier
                                </label>
                            </div>
                        </div>
                    </div>
                ) : selectedMessage ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Action Toolbar */}
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }} title="Répondre"><Reply size={18} /></button>
                                <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }} title="Transférer"><Forward size={18} /></button>
                                <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }} title="Supprimer" onClick={() => moveToTrash(selectedMessage.id)}><Trash2 size={18} /></button>
                                <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }} title="Archiver" onClick={() => archiveMessage(selectedMessage.id)}><Archive size={18} /></button>
                            </div>
                            <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }}><MoreVertical size={18} /></button>
                        </div>

                        {/* Message Content */}
                        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                            <header style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                    {selectedMessage.subject}
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-hugin)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                                        {selectedMessage.sender[0].toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{selectedMessage.sender}</strong>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedMessage.date}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            À: {selectedMessage.recipient}
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                {selectedMessage.body}
                                <br /><br />
                                ---
                                <br />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Envoyé via Hugin Lab Professional Mail
                                </span>
                            </div>

                            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                                <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Paperclip size={16} /> Pièces jointes ({selectedMessage.attachments.length})
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {selectedMessage.attachments.map((att, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => downloadAttachment(att)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="attachment-item"
                                            >
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '4px',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <FileText size={18} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {att.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {(att.size / 1024).toFixed(1)} KB
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                        <Mail size={80} style={{ marginBottom: '1.5rem' }} />
                        <h3>Sélectionnez un message pour le lire</h3>
                        <p style={{ fontSize: '0.9rem' }}>Ou composez-en un nouveau pour commencer.</p>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{messages.filter(m => m.sender.trim().toLowerCase() === normalizedUser || m.recipient.trim().toLowerCase() === normalizedUser).length}</div>
                                <div style={{ fontSize: '0.8rem' }}>Messages</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>{messages.filter(m => !m.read && m.recipient.trim().toLowerCase() === normalizedUser && m.folder !== 'trash').length}</div>
                                <div style={{ fontSize: '0.8rem' }}>Non lus</div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Messaging;
