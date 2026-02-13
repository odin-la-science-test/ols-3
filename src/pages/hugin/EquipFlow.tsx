import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, Plus, Trash2, ChevronLeft,
    X, Save, Activity
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface Reservation {
    id: string;
    equipId: string;
    userId: string;
    userName: string;
    startTime: string;
    endTime: string;
    date: string;
    purpose: string;
}

interface Equipment {
    id: string;
    name: string;
    type: string;
    status: 'Operational' | 'Maintenance' | 'Down';
    location: string;
    description?: string;
}

const EquipFlow = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            const equipData = await fetchModuleData('hugin_equip_list');
            if (equipData && equipData.length > 0) {
                setEquipment(equipData);
            } else {
                const initial: Equipment[] = [
                    { id: "e1", name: "Centrifugeuse à froid", type: "Centrifugeuse", status: "Operational", location: "Salle 101" },
                    { id: "e2", name: "PCR en temps réel", type: "PCR", status: "Operational", location: "Salle 102" }
                ];
                setEquipment(initial);
                for (const item of initial) await saveModuleItem('hugin_equip_list', item);
            }

            const resData = await fetchModuleData('hugin_equip_reservations');
            if (resData) setReservations(resData);
        };
        loadAll();
    }, []);

    const handleAddReservation = async (res: Reservation) => {

        const conflict = reservations.find(r =>
            r.equipId === res.equipId &&
            r.date === res.date &&
            ((res.startTime >= r.startTime && res.startTime < r.endTime) ||
                (res.endTime > r.startTime && res.endTime <= r.endTime))
        );

        if (conflict) {
            showToast('Conflit de réservation détecté !', 'error');
            return;
        }

        try {
            await saveModuleItem('hugin_equip_reservations', res);
            setReservations([...reservations, res]);
            setIsAddingNew(false);
            showToast('Réservation confirmée', 'success');
        } catch (e) {
            showToast('Erreur lors de la réservation', 'error');
        }
    };

    const handleDeleteReservation = async (id: string) => {
        try {
            await deleteModuleItem('hugin_equip_reservations', id);
            setReservations(reservations.filter(r => r.id !== id));
            showToast('Réservation annulée', 'success');
        } catch (e) {
            showToast('Erreur lors de l\'annulation', 'error');
        }
    };

    const dailyReservations = reservations.filter(r => r.date === selectedDate);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '1rem', color: '#ef4444' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>EquipFlow</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Réservation d'équipement</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAddingNew(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444' }}>
                        <Plus size={18} /> Réserver
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sélecteur de Date</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>État des Machines</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {equipment.map(e => (
                                <div key={e.id} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{e.name}</span>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.status === 'Operational' ? '#10b981' : (e.status === 'Maintenance' ? '#f59e0b' : '#ef4444') }} />
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{e.type} • {e.location}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Calendar size={20} color="#ef4444" /> Programme du {new Date(selectedDate).toLocaleDateString()}
                        </h3>

                        {dailyReservations.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                                <Clock size={48} style={{ marginBottom: '1rem' }} />
                                <p>Aucune réservation pour aujourd'hui.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {dailyReservations.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(res => {
                                    const equip = equipment.find(e => e.id === res.equipId);
                                    return (
                                        <div key={res.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', borderLeft: '4px solid #ef4444' }}>
                                            <div style={{ minWidth: '100px', fontSize: '1.1rem', fontWeight: 700 }}>{res.startTime} - {res.endTime}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{equip?.name || 'Inconnu'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Utilisateur: {res.userName} • Motif: {res.purpose}</div>
                                            </div>
                                            <button onClick={() => handleDeleteReservation(res.id)} className="btn-icon" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {isAddingNew && (
                <ReservationModal
                    equipment={equipment}
                    selectedDate={selectedDate}
                    onClose={() => setIsAddingNew(false)}
                    onSave={handleAddReservation}
                />
            )}
        </div>
    );
};

const ReservationModal = ({ equipment, selectedDate, onClose, onSave }: any) => {
    const [formData, setFormData] = useState<Reservation>({
        id: Date.now().toString(),
        equipId: equipment[0]?.id || '',
        userId: 'u1',
        userName: 'Chercheur Principal', // Mocked user
        startTime: '09:00',
        endTime: '10:00',
        date: selectedDate,
        purpose: ''
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Réserver un Équipement</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Équipement</label>
                        <select
                            value={formData.equipId}
                            onChange={(e) => setFormData({ ...formData, equipId: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        >
                            {equipment.filter((e: any) => e.status === 'Operational').map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Début</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Fin</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Motif de l'utilisation</label>
                        <textarea
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            placeholder="Ex: Fractionnement de culture, Extraction ADN..."
                            style={{ width: '100%', height: '80px', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave(formData)} className="btn" style={{ background: '#ef4444', padding: '0.75rem 2rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipFlow;
