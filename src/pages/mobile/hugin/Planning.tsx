import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Clock, MapPin, User } from 'lucide-react';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../../utils/persistence';

const MobilePlanning = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [view, setView] = useState<'list' | 'add'>('list');
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        resource: '',
        description: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await fetchModuleData('planning');
            setEvents(data || []);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const addEvent = async () => {
        if (!newEvent.title || !newEvent.date) {
            showToast('Titre et date requis', 'error');
            return;
        }

        const event = {
            id: Date.now().toString(),
            ...newEvent,
            createdBy: localStorage.getItem('currentUser') || 'user@ols.com'
        };

        await saveModuleItem('planning', event);
        setEvents([...events, event]);
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], time: '09:00', resource: '', description: '' });
        setView('list');
        showToast('Événement ajouté', 'success');
    };

    const deleteEvent = async (id: string) => {
        await deleteModuleItem('planning', id);
        setEvents(events.filter(e => e.id !== id));
        showToast('Événement supprimé', 'success');
    };

    const todayEvents = events.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));

    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                date: date.toISOString().split('T')[0],
                day: date.getDate(),
                dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                isToday: date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
            });
        }
        return days;
    };

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
                    <Calendar size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Planning</h1>
                </div>
                {view === 'list' && (
                    <button onClick={() => setView('add')} style={{ background: 'var(--accent-hugin)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Plus size={20} />
                    </button>
                )}
            </div>

            <div className="app-scrollbox">
                {view === 'list' && (
                    <div>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', minWidth: 'max-content' }}>
                                {getNextDays().map(day => (
                                    <button
                                        key={day.date}
                                        onClick={() => setSelectedDate(day.date)}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '1rem',
                                            border: selectedDate === day.date ? '2px solid var(--accent-hugin)' : '1px solid var(--border-color)',
                                            background: selectedDate === day.date ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-secondary)',
                                            color: selectedDate === day.date ? 'var(--accent-hugin)' : 'var(--text-primary)',
                                            cursor: 'pointer',
                                            minWidth: '70px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                            {day.dayName}
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                            {day.day}
                                        </div>
                                        {day.isToday && (
                                            <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.7 }}>
                                                Aujourd'hui
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {todayEvents.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                                    <Calendar size={60} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>Aucun événement ce jour</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {todayEvents.map(event => (
                                        <div key={event.id} className="card-native" style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                                        {event.title}
                                                    </h3>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <Clock size={14} />
                                                            {event.time}
                                                        </div>
                                                        {event.resource && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <MapPin size={14} />
                                                                {event.resource}
                                                            </div>
                                                        )}
                                                        {event.createdBy && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <User size={14} />
                                                                {event.createdBy.split('@')[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {event.description && (
                                                        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => deleteEvent(event.id)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: 'none',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.5rem',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        marginLeft: '1rem'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'add' && (
                    <div style={{ padding: '1.5rem' }}>
                        <div className="card-native" style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Titre *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="Réunion, Analyse, etc."
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Date *</label>
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
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
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Heure</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
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
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Lieu/Ressource</label>
                                <input
                                    type="text"
                                    value={newEvent.resource}
                                    onChange={(e) => setNewEvent({ ...newEvent, resource: e.target.value })}
                                    placeholder="Salle A, Équipement X, etc."
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

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Détails de l'événement..."
                                    style={{
                                        width: '100%',
                                        height: '100px',
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
                                onClick={addEvent}
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={18} />
                                Ajouter l'événement
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobilePlanning;
