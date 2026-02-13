import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wallet, Plus, Trash2, ChevronLeft,
    X, Save, TrendingUp, TrendingDown, DollarSign,
    FileText
} from 'lucide-react';
import Plotly from 'react-plotly.js';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    grantId: string;
}

interface Grant {
    id: string;
    name: string;
    totalAmount: number;
    spent: number;
    expiryDate: string;
    funder: string;
}

const GrantBudget = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [grants, setGrants] = useState<Grant[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [selectedGrantId, setSelectedGrantId] = useState<string>('');

    useEffect(() => {
        const loadFinanceData = async () => {
            const gData = await fetchModuleData('hugin_grants');
            const eData = await fetchModuleData('hugin_expenses');

            if (gData && gData.length > 0) {
                setGrants(gData);
                setSelectedGrantId(gData[0].id);
            } else {
                const initialGrants: Grant[] = [
                    { id: "g1", name: "ANR-CRISPR-2026", totalAmount: 150000, spent: 45000, expiryDate: "2027-12-31", funder: "ANR" },
                    { id: "g2", name: "ERC-BioSim", totalAmount: 80000, spent: 12000, expiryDate: "2026-06-30", funder: "ERC" }
                ];
                setGrants(initialGrants);
                setSelectedGrantId(initialGrants[0].id);
                for (const g of initialGrants) {
                    await saveModuleItem('hugin_grants', g);
                }
            }

            if (eData) {
                setExpenses(eData);
            }
        };
        loadFinanceData();
    }, []);

    const handleAddExpense = async (expense: Expense) => {
        try {
            await saveModuleItem('hugin_expenses', expense);
            setExpenses([expense, ...expenses]);

            const grant = grants.find(g => g.id === expense.grantId);
            if (grant) {
                const updatedGrant = { ...grant, spent: grant.spent + expense.amount };
                await saveModuleItem('hugin_grants', updatedGrant);
                setGrants(grants.map(g => g.id === expense.grantId ? updatedGrant : g));
            }

            setIsAddingExpense(false);
            showToast('Dépense enregistrée', 'success');
        } catch (e) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const handleDeleteExpense = async (id: string) => {
        const expense = expenses.find(e => e.id === id);
        if (!expense) return;

        try {
            await deleteModuleItem('hugin_expenses', id);
            setExpenses(expenses.filter(e => e.id !== id));

            const grant = grants.find(g => g.id === expense.grantId);
            if (grant) {
                const updatedGrant = { ...grant, spent: grant.spent - expense.amount };
                await saveModuleItem('hugin_grants', updatedGrant);
                setGrants(grants.map(g => g.id === expense.grantId ? updatedGrant : g));
            }
            showToast('Dépense supprimée', 'success');
        } catch (e) {
            showToast('Erreur de suppression', 'error');
        }
    };

    const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];
    const grantExpenses = expenses.filter(e => e.grantId === selectedGrantId);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '1rem', color: '#10b981' }}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>GrantBudget</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gestion financière de la recherche</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAddingExpense(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981' }}>
                        <Plus size={18} /> Nouvelle Dépense
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Projets & Financements</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {grants.map(g => (
                                <div
                                    key={g.id}
                                    onClick={() => setSelectedGrantId(g.id)}
                                    style={{
                                        padding: '1rem', borderRadius: '1rem', cursor: 'pointer',
                                        background: selectedGrantId === g.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${selectedGrantId === g.id ? '#10b981' : 'rgba(255,255,255,0.05)'}`
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{g.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{g.funder} • Exp: {new Date(g.expiryDate).toLocaleDateString()}</div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                                            <span>{Math.round((g.spent / g.totalAmount) * 100)}% consommé</span>
                                            <span>{g.spent.toLocaleString()} / {g.totalAmount.toLocaleString()} €</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(g.spent / g.totalAmount) * 100}%`, height: '100%', background: '#10b981' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {activeGrant && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <FileText size={20} color="#10b981" /> Historique des Dépenses
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {grantExpenses.length === 0 ? (
                                        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>Aucune dépense enregistrée.</div>
                                    ) : (
                                        grantExpenses.map(exp => (
                                            <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                                                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}><DollarSign size={18} /></div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600 }}>{exp.description}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{exp.category} • {new Date(exp.date).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ef4444' }}>- {exp.amount.toLocaleString()} €</div>
                                                <button onClick={() => handleDeleteExpense(exp.id)} className="btn-icon" style={{ opacity: 0.5 }}><Trash2 size={16} /></button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', width: '100%' }}>Répartition du Budget</h3>
                                <Plotly
                                    data={[{
                                        values: [activeGrant.spent, activeGrant.totalAmount - activeGrant.spent],
                                        labels: ['Dépensé', 'Restant'],
                                        type: 'pie',
                                        marker: { colors: ['#ef4444', '#10b981'] },
                                        textinfo: 'percent',
                                        hole: 0.4
                                    }]}
                                    layout={{
                                        width: 350, height: 350,
                                        paper_bgcolor: 'transparent',
                                        plot_bgcolor: 'transparent',
                                        font: { color: 'white' },
                                        showlegend: true,
                                        legend: { orientation: 'h', x: 0, y: -0.2 },
                                        margin: { t: 0, b: 0, l: 0, r: 0 }
                                    }}
                                    config={{ displayModeBar: false }}
                                />
                                <div style={{ marginTop: '1.5rem', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <StatCard icon={<TrendingDown size={18} color="#ef4444" />} label="Dépensé" value={`${activeGrant.spent.toLocaleString()} €`} />
                                    <StatCard icon={<TrendingUp size={18} color="#10b981" />} label="Restant" value={`${(activeGrant.totalAmount - activeGrant.spent).toLocaleString()} €`} />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {isAddingExpense && (
                <ExpenseModal
                    grants={grants}
                    selectedGrantId={selectedGrantId}
                    onClose={() => setIsAddingExpense(false)}
                    onSave={handleAddExpense}
                />
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }: any) => (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
            {icon} {label}
        </div>
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{value}</div>
    </div>
);

const ExpenseModal = ({ grants, selectedGrantId, onClose, onSave }: any) => {
    const [formData, setFormData] = useState<Expense>({
        id: Date.now().toString(),
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Consommables',
        grantId: selectedGrantId
    });

    const categories = ['Consommables', 'Equipement', 'Prestashop', 'Voyages', 'Frais de publication', 'Autre'];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Enregistrer une Dépense</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Projet / Financement</label>
                        <select
                            value={formData.grantId}
                            onChange={(e) => setFormData({ ...formData, grantId: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        >
                            {grants.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ex: Achat Taq Polymerase..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Montant (€)</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave(formData)} className="btn" style={{ background: '#10b981', padding: '0.75rem 2rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GrantBudget;
