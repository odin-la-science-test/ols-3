import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Plus, Trash2,
    Calendar, Flag, Clock, Layers
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface Milestone {
    id: string;
    title: string;
    dueDate: string;
    status: 'Pending' | 'Completed' | 'Overdue';
    priority: 'Low' | 'Medium' | 'High';
}

interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    milestones: Milestone[];
}

const ProjectMind = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchModuleData('hugin_projects');
            if (data && data.length > 0) {
                setProjects(data);
                setSelectedProjectId(data[0].id);
            } else {

                const initial: Project[] = [{
                    id: "p1",
                    name: "Étude CRISPR-Cas9",
                    description: "Optimisation de l'édition génomique sur E. coli.",
                    startDate: "2026-01-01",
                    endDate: "2026-12-31",
                    milestones: [{
                        id: "m1",
                        title: "Extraction ADN",
                        dueDate: "2026-02-15",
                        status: "Completed" as const,
                        priority: "High" as const
                    }]
                }];
                setProjects(initial);
                setSelectedProjectId(initial[0].id);
                await saveModuleItem('hugin_projects', initial[0]);
            }
        };
        loadProjects();
    }, []);

    const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

    const handleAddMilestone = async (projectId: string, milestone: Milestone) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const updatedProject = { ...project, milestones: [...project.milestones, milestone] };
        try {
            await saveModuleItem('hugin_projects', updatedProject);
            setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
            showToast('Jalon ajouté', 'success');
        } catch (e) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (confirm('Supprimer ce projet et tous ses jalons ?')) {
            try {
                await deleteModuleItem('hugin_projects', id);
                setProjects(projects.filter(p => p.id !== id));
                showToast('Projet supprimé', 'success');
            } catch (e) {
                showToast('Erreur de suppression', 'error');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '1rem', color: '#a78bfa' }}>
                            <Layers size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ProjectMind</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gestion de projets & Milestones</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => showToast('Module de création de projet en cours...', 'info')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#a78bfa' }}>
                        <Plus size={18} /> Nouveau Projet
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Projets Actifs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {projects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedProjectId(p.id)}
                                    style={{
                                        padding: '1rem', borderRadius: '1rem', cursor: 'pointer',
                                        background: selectedProjectId === p.id ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${selectedProjectId === p.id ? '#a78bfa' : 'rgba(255,255,255,0.05)'}`,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Exp: {new Date(p.endDate).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    {activeProject ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{activeProject.name}</h2>
                                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{activeProject.description}</p>
                                    </div>
                                    <button onClick={() => handleDeleteProject(activeProject.id)} className="btn-icon" style={{ color: '#ef4444' }}><Trash2 size={20} /></button>
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Début: {activeProject.startDate}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> Fin: {activeProject.endDate}</span>
                                </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Flag color="#a78bfa" /> Milestones & Jalons
                                    </h3>
                                    <button
                                        onClick={() => handleAddMilestone(activeProject.id, { id: Date.now().toString(), title: 'Nouveau Jalon', dueDate: new Date().toISOString().split('T')[0], status: 'Pending', priority: 'Medium' })}
                                        className="btn btn-small" style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <Plus size={16} /> Ajouter
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {activeProject.milestones.map(m => (
                                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: m.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: m.status === 'Completed' ? '#10b981' : 'white' }}>
                                                <Flag size={18} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{m.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Échéance: {new Date(m.dueDate).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '1rem', background: m.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', color: m.priority === 'High' ? '#ef4444' : 'inherit' }}>{m.priority}</span>
                                                <select
                                                    value={m.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value as any;
                                                        setProjects(projects.map(p => p.id === activeProject.id ? { ...p, milestones: p.milestones.map(ms => ms.id === m.id ? { ...ms, status: newStatus } : ms) } : p));
                                                    }}
                                                    style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                                                >
                                                    <option value="Pending">En attente</option>
                                                    <option value="Completed">Terminé</option>
                                                    <option value="Overdue">En retard</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                            Créez votre premier projet pour commencer le suivi.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProjectMind;
