import { useState, useEffect } from 'react';
import { ChevronRight, Calendar as CalendarIcon, Clock, Plus, Trash2, ExternalLink, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

type Event = {
    id: string;
    title: string;
    resource: string;
    time: string;
    date: string;
    user: string;
    module?: string;
    reminder: boolean;
};

const RESOURCES = ['Salle de Culture A', 'Microscope 1', 'Microscope 2', 'Centrifugeuse', 'Poste de Sécurité Microbiologique'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const MODULES = [
    { id: 'inventory', name: 'Inventaire', path: '/hugin/inventory' },
    { id: 'culture', name: 'Suivi de Culture', path: '/hugin/culture' },
    { id: 'documents', name: 'Documents', path: '/hugin/documents' }
];

const Planning = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const currentUser = localStorage.getItem('currentUser') || 'Utilisateur';

    const [events, setEvents] = useState<Event[]>([]);
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [isCreating, setIsCreating] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        time: '09:00',
        resource: RESOURCES[0],
        module: '',
        reminder: true
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const navigateDate = (direction: 'prev' | 'next') => {
        const date = new Date(selectedDate);
        if (viewMode === 'day') {
            date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
        } else if (viewMode === 'week') {
            date.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
        } else if (viewMode === 'month') {
            date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const loadEvents = async () => {
        const data = await fetchModuleData('planning');
        if (data) setEvents(data);
    };

    const handleCreateEvent = async () => {
        if (!newEvent.title) {
            showToast('Veuillez entrer un titre', 'error');
            return;
        }

        const eventData: Event = {
            id: Date.now().toString(),
            title: newEvent.title,
            resource: newEvent.resource,
            time: newEvent.time,
            date: selectedDate,
            user: currentUser,
            module: newEvent.module,
            reminder: newEvent.reminder
        };

        try {
            await saveModuleItem('planning', eventData);
            setEvents([...events, eventData]);

            if (eventData.reminder) {
                await saveModuleItem('messaging', {
                    id: `rem_${Date.now()}`,
                    sender: 'Système Planning',
                    recipient: currentUser,
                    subject: `Rappel : ${eventData.title}`,
                    preview: `Rappel pour votre activité...`,
                    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    body: `Ceci est un rappel automatique pour votre session : \n\nÉvénement : ${eventData.title}\nLieu/Ressource : ${eventData.resource}\nHeure : ${eventData.time}\nDate : ${eventData.date}\n\nBon travail au laboratoire !`,
                    folder: 'inbox'
                });
                showToast('Rappel envoyé', 'success');
            } else {
                showToast('Événement créé', 'success');
            }

            setIsCreating(false);
            setNewEvent({ title: '', time: '09:00', resource: RESOURCES[0], module: '', reminder: true });
        } catch (error) {
            showToast('Erreur lors de la création', 'error');
        }
    };

    const handleDeleteEvent = async (id: string) => {
        try {
            await deleteModuleItem('planning', id);
            setEvents(events.filter(e => e.id !== id));
            showToast('Événement supprimé', 'info');
        } catch (error) {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const archiveEvent = async (event: Event) => {
        try {
            const archiveItem = {
                id: `arch_pl_${event.id}_${Date.now()}`,
                name: `Event: ${event.title}`,
                category: 'Network',
                size: 'N/A',
                date: event.date,
                description: `Plannification archivée pour ${event.resource} à ${event.time}.`
            };

            await saveModuleItem('hugin_it_archives', archiveItem);
            await handleDeleteEvent(event.id);
            showToast('Événement archivé', 'success');
        } catch (e) {
            showToast('Erreur lors de l\'archivage', 'error');
        }
    };

    const getWeekDates = () => {
        const start = new Date(selectedDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d.toISOString().split('T')[0];
        });
    };

    const getMonthDates = () => {
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dates: (string | null)[] = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(new Date(year, month, i).toISOString().split('T')[0]);
        }
        return dates;
    };

    const renderEventsList = (date: string) => {
        const dayEvents = events.filter(e => e.date === date);
        if (dayEvents.length === 0) return <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.5, fontStyle: 'italic' }}>Aucune manipulation</p>;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {dayEvents.sort((a, b) => a.time.localeCompare(b.time)).map(event => (
                    <div key={event.id} className="glass-panel" style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-hugin)' }}>{event.time}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => archiveEvent(event)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', opacity: 0.6, padding: 0 }} title="Archiver">
                                    <Archive size={14} />
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', opacity: 0.8, padding: 0 }} title="Supprimer">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{event.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={10} /> {event.resource}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Header Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => navigate('/hugin')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Retour au Labo
                </button>

                <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '8px', gap: '0.25rem' }}>
                    {(['day', 'week', 'month'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className="btn"
                            style={{
                                background: viewMode === mode ? 'var(--bg-primary)' : 'transparent',
                                color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                border: 'none'
                            }}
                        >
                            {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => navigateDate('prev')} className="btn" style={{ padding: '0.5rem', background: 'var(--bg-secondary)' }}>
                            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button onClick={() => navigateDate('next')} className="btn" style={{ padding: '0.5rem', background: 'var(--bg-secondary)' }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input-field"
                            style={{ marginBottom: 0, paddingRight: '2.5rem' }}
                        />
                        <CalendarIcon size={16} style={{ position: 'absolute', right: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Planning Général</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Vue d'overview des manipulations du laboratoire.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                {/* Main Content Area */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                            {viewMode === 'day'
                                ? new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                : viewMode === 'week'
                                    ? `Semaine du ${new Date(getWeekDates()[0]).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                                    : new Date(selectedDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                            }
                        </h2>
                        <button
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus size={18} /> Planifier une tâche
                        </button>
                    </div>

                    {isCreating && (
                        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-hugin)' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Nouvelle manipulation</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="label">Titre</label>
                                    <input type="text" className="input-field" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Nom de la tâche" />
                                </div>
                                <div>
                                    <label className="label">Heure</label>
                                    <select className="input-field" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}>
                                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Lieu/Ressource</label>
                                    <select className="input-field" value={newEvent.resource} onChange={e => setNewEvent({ ...newEvent, resource: e.target.value })}>
                                        {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Lien Module</label>
                                    <select className="input-field" value={newEvent.module} onChange={e => setNewEvent({ ...newEvent, module: e.target.value })}>
                                        <option value="">Aucun</option>
                                        {MODULES.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" id="rem" checked={newEvent.reminder} onChange={e => setNewEvent({ ...newEvent, reminder: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-hugin)' }} />
                                    <label htmlFor="rem" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>M'envoyer un rappel</label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn" style={{ color: 'var(--text-primary)' }} onClick={() => setIsCreating(false)}>Annuler</button>
                                    <button className="btn btn-primary" onClick={handleCreateEvent}>Enregistrer</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Conditional Rendering of Views */}
                    {viewMode === 'day' && (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {renderEventsList(selectedDate)}
                        </div>
                    )}

                    {viewMode === 'week' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                            {getWeekDates().map((date, idx) => (
                                <div
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    style={{
                                        opacity: date === selectedDate ? 1 : 0.8,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '0.5rem',
                                        background: date === selectedDate ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                                        borderRadius: '4px 4px 0 0',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        color: date === selectedDate ? 'white' : 'var(--text-secondary)'
                                    }}>
                                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][idx]} {new Date(date).getDate()}
                                    </div>
                                    <div className="glass-panel" style={{
                                        padding: '0.5rem',
                                        minHeight: '350px',
                                        background: date === selectedDate ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                                        border: date === selectedDate ? '1px solid var(--accent-hugin)' : '1px solid transparent',
                                        borderRadius: '0 0 4px 4px'
                                    }}>
                                        {renderEventsList(date)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'month' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{d}</div>)}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                                {getMonthDates().map((date, i) => (
                                    <div
                                        key={i}
                                        onClick={() => date && setSelectedDate(date)}
                                        style={{
                                            minHeight: '80px',
                                            padding: '0.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border-color)',
                                            background: date === selectedDate ? 'rgba(59, 130, 246, 0.1)' : (date ? 'rgba(255,255,255,0.02)' : 'transparent'),
                                            cursor: date ? 'pointer' : 'default',
                                            opacity: date ? 1 : 0.3
                                        }}
                                    >
                                        {date && (
                                            <>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: date === selectedDate ? 'var(--accent-hugin)' : 'inherit' }}>
                                                    {new Date(date).getDate()}
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                                                    {events.filter(e => e.date === date).map(e => (
                                                        <div key={e.id} title={e.title} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-hugin)' }} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Links Sidebar (at bottom on mobile) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ExternalLink size={18} /> Accès Rapide Modules
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {MODULES.map(m => (
                                <button key={m.id} onClick={() => navigate(m.path)} className="btn" style={{ flex: 1, minWidth: '150px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planning;
