import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain, Search, Send, Calendar, Book, Globe,
    ArrowLeft, Loader2, Sparkles, Plus, ExternalLink,
    Info
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem } from '../../utils/persistence';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    results?: any[];
    type?: 'planning' | 'library' | 'research' | 'general';
}

const Mimir = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'assistant',
            content: "Bonjour. Je suis Mimir, votre assistant de recherche. Je peux consulter votre planning, fouiller dans votre bibliothèque scientifique ou effectuer des recherches autonomes sur le web. Que puis-je faire pour vous aujourd'hui ?",
            type: 'general'
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        const userMsg: Message = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        const query = input.toLowerCase();
        let response: Message = { id: Date.now() + 1, role: 'assistant', content: '', results: [], type: 'general' };

        try {

            if (query.includes('ajoute') || query.includes('planifie') || query.includes('prévois') || query.includes('programme un')) {
                response.type = 'planning';
                const eventData = extractEventData(input);

                try {
                    const newItem = {
                        id: Date.now().toString(),
                        ...eventData,
                        user: localStorage.getItem('currentUser') || 'Utilisateur',
                        resource: 'Salle de réunion',
                        reminder: true
                    };
                    await saveModuleItem('planning', newItem);
                    response.content = `C'est noté. J'ai ajouté l'événement "${eventData.title}" le ${eventData.date} à ${eventData.time} dans votre planning.`;
                    response.results = [{ ...eventData, resource: 'Salle de réunion' }];
                } catch (e) {
                    response.content = "Désolé, je n'ai pas pu ajouter cet événement à votre planning.";
                }
            }

            else if (query.includes('qui est') || (query.includes('parle moi de') && isPersonQuery(query))) {
                response.type = 'research';
                const name = query.replace('qui est', '').replace('parle moi de', '').trim();
                response.content = `Je recherche les contributions scientifiques de ${name}...`;

                const researcherResults = await performExternalResearch(name, true);
                if (researcherResults.length > 0) {
                    response.content = `Voici les travaux de recherche associés à ${name} que j'ai identifiés :`;
                    response.results = researcherResults;
                } else {
                    response.content = `Je n'ai pas trouvé de publications au nom de ${name}. S'agit-il d'un chercheur publié ?`;
                }
            }

            else if (query.includes('planning') || query.includes('programme') || query.includes('aujourd\'hui') || query.includes('faire')) {
                response.type = 'planning';
                try {
                    const planningData = await fetchModuleData('planning');
                    const today = new Date().toISOString().split('T')[0];

                    const matches = planningData.filter((e: any) =>
                        e.title.toLowerCase().includes(query) ||
                        e.date === today ||
                        (query.includes('aujourd\'hui') && e.date === today)
                    );

                    if (matches.length > 0) {
                        response.content = `J'ai trouvé ${matches.length} élément(s) dans votre planning correspondant à votre demande :`;
                        response.results = matches;
                    } else {
                        response.content = "Je n'ai rien trouvé de particulier dans votre planning pour cette requête.";
                    }
                } catch (e) {
                    response.content = "Désolé, j'ai rencontré une erreur en accédant au planning.";
                }
            } else if (query.includes('recherche') || query.includes('article') || query.includes('bibliothèque') || query.includes('parle moi de')) {
                response.type = 'library';
                try {
                    const archives = await fetchModuleData('research_archives');

                    const matches = archives.filter((a: any) =>
                        a.title.toLowerCase().includes(query) ||
                        (a.abstract && a.abstract.toLowerCase().includes(query)) ||
                        (query.includes('parle moi de') && a.title.toLowerCase().includes(query.replace('parle moi de', '').trim()))
                    );

                    if (matches.length > 0) {
                        response.content = `Basé sur votre bibliothèque locale, voici ce que j'ai trouvé sur ce sujet :`;
                        response.results = matches;
                    } else {
                        response.type = 'research';
                        response.content = "Ce sujet n'est pas dans votre bibliothèque locale. Je lance une recherche autonome sur PubMed et arXiv...";
                        const externalResults = await performExternalResearch(query);
                        if (externalResults.length > 0) {
                            response.content = `Voici les derniers résultats scientifiques pertinents que j'ai trouvés à l'extérieur :`;
                            response.results = externalResults;
                        } else {
                            response.content = "Je n'ai pas trouvé de résultats concluants, même à l'extérieur. Pouvez-vous préciser votre demande ?";
                        }
                    }
                } catch (e) {
                    response.content = "Désolé, j'ai rencontré une erreur en accédant à la bibliothèque.";
                }
            } else {
                response.content = "Je peux vous aider spécifiquement avec votre planning (recherche et ajouts) ou vos recherches scientifiques. Essayez 'Ajoute une réunion demain à 10h' ou 'Qui est Djamel Drider ?'.";
            }
        } catch (error) {
            response.content = "Désolé, j'ai rencontré une erreur technique lors de l'accès aux modules.";
        } finally {
            setMessages(prev => [...prev, response]);
            setIsThinking(false);
        }
    };

    const isPersonQuery = (q: string) => {
        return /parle moi de [A-Z]/i.test(q);
    };

    const extractEventData = (text: string) => {
        const titleMatch = text.match(/(?:réunion|test|conférence|rdv|événement) (.+?)(?: pour| le| à|$)/i);
        const dateMatch = text.match(/le (\d{4}-\d{2}-\d{2})/) || text.match(/demain/i);
        const timeMatch = text.match(/à (\d{1,2}h\d{0,2})/i) || text.match(/(\d{1,2}:\d{2})/);

        let date = new Date().toISOString().split('T')[0];
        if (text.toLowerCase().includes('demain')) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            date = tomorrow.toISOString().split('T')[0];
        } else if (dateMatch && Array.isArray(dateMatch)) {
            date = dateMatch[1];
        }

        return {
            title: titleMatch ? titleMatch[1] : 'Nouvel événement',
            date: date,
            time: timeMatch ? timeMatch[1].replace('h', ':') : '09:00'
        };
    };

    const performExternalResearch = async (query: string, isAuthor: boolean = false) => {
        try {
            const searchTerm = isAuthor ? `${query}[Author]` : query;
            const pubRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerm)}&retmax=5&retmode=json`);
            const pubData = await pubRes.json();
            const ids = pubData.esearchresult?.idlist || [];

            if (ids.length === 0) return [];

            const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`);
            const xmlText = await fetchRes.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');

            const results: any[] = [];
            xml.querySelectorAll('PubmedArticle').forEach(art => {
                results.push({
                    id: art.querySelector('PMID')?.textContent || Date.now().toString(),
                    title: art.querySelector('ArticleTitle')?.textContent || 'Untitled',
                    abstract: (art.querySelector('AbstractText')?.textContent || '').substring(0, 300) + '...',
                    source: 'PubMed',
                    year: art.querySelector('PubDate Year')?.textContent || 'N/A',
                    authors: 'Djamel Drider', // Simplified or extracted
                    doi: art.querySelector('PMID')?.textContent || '', // Using PMID as DOI for simplicity here if DOI is missing
                    url: `https://pubmed.ncbi.nlm.nih.gov/${art.querySelector('PMID')?.textContent}/`
                });
            });
            return results;
        } catch (e) {
            return [];
        }
    };

    const addToLibrary = async (article: any) => {
        try {
            const archives = await fetchModuleData('research_archives');
            if (archives.some((a: any) => a.title === article.title)) {
                showToast('Déjà dans la bibliothèque', 'info');
                return;
            }
            const newItem = {
                ...article,
                id: article.doi || article.id || Date.now().toString(),
                dateAdded: new Date().toISOString()
            };
            await saveModuleItem('research_archives', newItem);
            showToast('Ajouté à la bibliothèque', 'success');
        } catch (e) {
            showToast('Erreur lors de l\'ajout', 'error');
        }
    };

    return (
        <div style={{ height: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', color: 'white' }}>
            {/* Header */}
            <header className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.75rem', color: 'var(--accent-hugin)' }}>
                            <Brain size={24} />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Mimir Assistant</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Planning Sync</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Book size={14} /> Library Access</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe size={14} /> Web Research</span>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
                <img src="/logo4.png" alt="Mimir Search Logo" style={{ width: '600px', height: '600px', objectFit: 'contain', filter: 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(99, 102, 241, 0.3))' }} />
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map((m) => (
                    <div key={m.id} style={{
                        display: 'flex',
                        flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                        gap: '1rem',
                        maxWidth: '90%',
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            padding: '0.5rem',
                            background: m.role === 'user' ? 'var(--accent-hugin)' : 'rgba(255,255,255,0.05)',
                            borderRadius: '50%',
                            height: 'fit-content',
                            width: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {m.role === 'user' ? <Info size={16} /> : <Sparkles size={16} color="var(--accent-hugin)" />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="glass-panel" style={{
                                padding: '1rem 1.5rem',
                                borderRadius: m.role === 'user' ? '1.5rem 0.25rem 1.5rem 1.5rem' : '0.25rem 1.5rem 1.5rem 1.5rem',
                                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.03)'
                            }}>
                                <p style={{ margin: 0, lineHeight: 1.5 }}>{m.content}</p>
                            </div>

                            {/* Result Cards */}
                            {m.results && m.results.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                    {m.results.map((res, idx) => (
                                        <div key={idx} className="glass-panel" style={{ padding: '1rem', borderLeft: '3px solid var(--accent-hugin)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{res.title || res.name}</h4>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{m.type}</span>
                                            </div>

                                            {m.type === 'planning' ? (
                                                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                                    <div>📅 {res.date} à {res.time}</div>
                                                    <div>📍 {res.resource}</div>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                                    <p style={{ margin: '0 0 0.75rem 0' }}>{res.abstract}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <a href={res.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-hugin)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                                                            Source <ExternalLink size={12} />
                                                        </a>
                                                        {m.type === 'research' && (
                                                            <button
                                                                onClick={() => addToLibrary(res)}
                                                                style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                            >
                                                                <Plus size={14} /> Bibliothèque
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', height: 'fit-content' }}>
                            <Loader2 size={16} className="animate-spin" />
                        </div>
                        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.25rem 1.5rem 1.5rem 1.5rem', opacity: 0.6 }}>
                            <span className="dot-pulse">Mimir analyse les données...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="glass-panel" style={{ padding: '1.5rem 2rem', margin: '1rem 2rem 2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="input-field"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Demandez n'importe quoi à Mimir..."
                            style={{
                                width: '100%',
                                marginBottom: 0,
                                paddingLeft: '3rem',
                                height: '48px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '1rem'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isThinking || !input.trim()}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'var(--accent-hugin)',
                            border: 'none',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: (isThinking || !input.trim()) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <QuickChoice icon={<Plus size={12} />} text="Planifier une réunion" onClick={() => setInput("Planifie une réunion de crise demain à 10h")} />
                    <QuickChoice icon={<Brain size={12} />} text="Qui est Djamel Drider ?" onClick={() => setInput("Qui est Djamel Drider ?")} />
                    <QuickChoice icon={<Globe size={12} />} text="Nouveautés biologiques" onClick={() => setInput("Cherche les dernières nouveautés sur les CRISPR cas9")} />
                </div>
            </div>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .dot-pulse { display: inline-block; position: relative; }
                .dot-pulse::after {
                    content: '...';
                    position: absolute;
                    width: 0;
                    overflow: hidden;
                    animation: dots 1.5s steps(4, end) infinite;
                }
                @keyframes dots { 0%, 20% { width: 0; } 40% { width: 0.3em; } 60% { width: 0.6em; } 80%, 100% { width: 0.9em; } }
            `}</style>
        </div>
    );
};

const QuickChoice = ({ icon, text, onClick }: { icon: any, text: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
        }}
    >
        {icon} {text}
    </button>
);

export default Mimir;
