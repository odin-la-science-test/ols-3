import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, Search, Trash2, Download, Upload,
    History, TrendingUp, Activity, Play, RotateCcw, Beaker, X
} from 'lucide-react';
import Plot from 'react-plotly.js';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface HistoryEntry {
    id: string;
    date: string;
    type: 'creation' | 'repiquage' | 'cryo' | 'reprise' | 'modification';
    details: any;
}

interface Milieu {
    id: string;
    nom: string;
    type: string;
    fournisseur?: string;
    dateAjout?: string;
    composition?: string;
    proprietes?: string;
    stockage?: string;
    notes?: string;
}

interface Culture {
    id: string;
    nom: string;
    date: string;
    lastRepiquage?: string;
    intervalle: number;
    passage: number;
    statut: 'active' | 'terminée' | 'cryoconservée';
    milieuId?: string;
    notes?: string;
    conditions: string[];
    history: HistoryEntry[];

    muMax?: number;
    ks?: number;
    initialPop?: number;
    capacity?: number;
    color?: string;

    cryoDate?: string;
    cryoDuration?: string;
    cryoLocation?: string;
    cryoAgent?: string;
    cryoNotes?: string;
}

interface SimulationResult {
    times: number[];
    species: {
        id: string;
        name: string;
        color: string;
        populations: number[];
    }[];
    substrate: number[];
    antibiotic: number[];
}

const CultureTracking = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [cultures, setCultures] = useState<Culture[]>([]);
    const [milieux, setMilieux] = useState<Milieu[]>([]);
    const [theme] = useState<'dark' | 'light'>('dark');
    const [activeSection, setActiveSection] = useState<'cultures' | 'milieux' | 'cryo'>('cultures');
    const [searchQueries, setSearchQueries] = useState({ cultures: '', milieux: '', cryo: '' });
    const [visibleHeader, setVisibleHeader] = useState(true);
    const lastScrollY = useRef(0);

    const [showCultureModal, setShowCultureModal] = useState(false);
    const [showMilieuModal, setShowMilieuModal] = useState(false);
    const [showCryoModal, setShowCryoModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
    const [envParams, setEnvParams] = useState({
        type: 'batch',
        volume: 100,
        temperature: 37,
        pH: 7.0,
        duration: 24,
        substrate: 10,
        timeStep: 0.1,
        modelType: 'monod'
    });
    const [antibioParams, setAntibioParams] = useState({
        enabled: false,
        name: 'Amoxicilline',
        dose: 10,
        time: 5,
        ec50: 2,
        hill: 2,
        clearance: 0.1
    });

    const [editingCulture, setEditingCulture] = useState<Culture | null>(null);
    const [editingMilieu, setEditingMilieu] = useState<Milieu | null>(null);
    const [cryoSource, setCryoSource] = useState<Culture | null>(null);
    const [historyCulture, setHistoryCulture] = useState<Culture | null>(null);

    const [currentConditions, setCurrentConditions] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadData = async () => {
            const cData = await fetchModuleData('cultures');
            const mData = await fetchModuleData('milieux');
            if (cData) setCultures(cData);
            if (mData) setMilieux(mData);
        };
        loadData();

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setVisibleHeader(false);
            } else {
                setVisibleHeader(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showNotification = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        const toastType = type === 'warning' ? 'info' : type;
        showToast(msg, toastType as any);
    };

    const openCultureModal = (culture: Culture | null = null) => {
        setEditingCulture(culture);
        setCurrentConditions(culture?.conditions || ['Température : 37°C', 'CO2 : 5%']);
        setShowCultureModal(true);
    };

    const openMilieuModal = (milieu: Milieu | null = null) => {
        setEditingMilieu(milieu);
        setShowMilieuModal(true);
    };

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addHistoryEntry = (culture: Culture, type: HistoryEntry['type'], details: any) => {
        const entry: HistoryEntry = {
            id: generateId(),
            date: new Date().toISOString(),
            type,
            details
        };
        culture.history = [entry, ...(culture.history || [])];
    };

    const handleSaveMilieu = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const milieuData: Milieu = {
            id: editingMilieu?.id || generateId(),
            nom: formData.get('nom') as string,
            type: formData.get('type') as string,
            fournisseur: formData.get('fournisseur') as string,
            dateAjout: formData.get('dateAjout') as string,
            composition: formData.get('composition') as string,
            proprietes: formData.get('proprietes') as string,
            stockage: formData.get('stockage') as string,
            notes: formData.get('notes') as string,
        };

        try {
            await saveModuleItem('milieux', milieuData);

            if (editingMilieu) {
                setMilieux(milieux.map(m => m.id === milieuData.id ? milieuData : m));
                showNotification('✅ Milieu modifié');
            } else {
                setMilieux([...milieux, milieuData]);
                showNotification('✅ Milieu créé');
            }
            setShowMilieuModal(false);
            setEditingMilieu(null);
        } catch (error) {
            console.error('Save Milieu Error:', error);
            showNotification('❌ Erreur de sauvegarde', 'error');
        }
    };

    const handleDeleteMilieu = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce milieu ?')) {
            try {
                await deleteModuleItem('milieux', id);
                setMilieux(milieux.filter(m => m.id !== id));
                showNotification('✅ Milieu supprimé');
            } catch (error) {
                console.error('Delete Milieu Error:', error);
                showNotification('❌ Erreur de suppression', 'error');
            }
        }
    };

    const handleSaveCulture = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const cultureData: Culture = {
            id: editingCulture?.id || generateId(),
            nom: formData.get('nom') as string,
            date: formData.get('date') as string,
            lastRepiquage: formData.get('lastRepiquage') as string,
            intervalle: parseInt(formData.get('intervalle') as string),
            passage: parseInt(formData.get('passage') as string) || 0,
            statut: formData.get('statut') as any,
            milieuId: formData.get('milieuId') as string,
            notes: formData.get('notes') as string,
            conditions: currentConditions,
            history: editingCulture?.history || [],

            muMax: parseFloat(formData.get('muMax') as string) || 0.8,
            ks: parseFloat(formData.get('ks') as string) || 0.1,
            initialPop: parseInt(formData.get('initialPop') as string) || 1000000,
            capacity: parseInt(formData.get('capacity') as string) || 1000000000,
            color: editingCulture?.color || getRandomColor(),

            cryoDate: formData.get('cryoDate') as string,
            cryoDuration: formData.get('cryoDuration') as string,
            cryoLocation: formData.get('cryoLocation') as string,
            cryoAgent: formData.get('cryoAgent') as string,
            cryoNotes: formData.get('cryoNotes') as string,
        };

        try {
            await saveModuleItem('cultures', cultureData);

            if (editingCulture) {
                addHistoryEntry(cultureData, 'modification', { changes: 'Culture modifiée', oldStatut: editingCulture.statut, newStatut: cultureData.statut });
                setCultures(cultures.map(c => c.id === cultureData.id ? cultureData : c));
                showNotification('✅ Culture modifiée');
            } else {
                addHistoryEntry(cultureData, 'creation', { date: cultureData.date, statut: cultureData.statut });
                setCultures([...cultures, cultureData]);

                const firstDate = new Date(cultureData.date);
                firstDate.setDate(firstDate.getDate() + cultureData.intervalle);
                scheduleCalendarEvent(cultureData, firstDate.toISOString().split('T')[0]);

                showNotification('✅ Culture créée & Planifiée');
            }
            setShowCultureModal(false);
            setEditingCulture(null);
            setCurrentConditions([]);
        } catch (error) {
            console.error('Save Culture Error:', error);
            showNotification('❌ Erreur de sauvegarde', 'error');
        }
    };

    const handleDeleteCulture = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) {
            try {
                await deleteModuleItem('cultures', id);
                setCultures(cultures.filter(c => c.id !== id));
                showNotification('✅ Culture supprimée');
            } catch (error) {
                console.error('Delete Culture Error:', error);
                showNotification('❌ Erreur de suppression', 'error');
            }
        }
    };

    const scheduleCalendarEvent = async (culture: any, nextDateStr: string) => {
        const currentUser = localStorage.getItem('currentUser') || 'Lars Volkov';
        const eventData = {
            id: Date.now(),
            title: `Repiquage : ${culture.nom}`,
            resource: 'Salle de Culture A',
            time: '09:00',
            date: nextDateStr,
            user: currentUser,
            module: 'Suivi de Culture',
            reminder: true
        };

        try {
            await saveModuleItem('planning', eventData);
        } catch (error) {
            console.error('Error scheduling planning event:', error);
        }
    };

    const handleMarquerRepiquage = (id: string) => {
        const culture = cultures.find(c => c.id === id);
        if (!culture) return;

        const today = new Date().toISOString().split('T')[0];
        if (window.confirm(`Marquer "${culture.nom}" comme repiquée aujourd'hui ?`)) {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + culture.intervalle);
            const nextDateStr = nextDate.toISOString().split('T')[0];

            const nextCultures = cultures.map(c => {
                if (c.id === id) {
                    const newC = { ...c, lastRepiquage: today, passage: c.passage + 1 };
                    addHistoryEntry(newC, 'repiquage', {
                        passage: newC.passage,
                        date: today,
                        nextRepiquage: nextDate.toLocaleDateString('fr-FR')
                    });
                    return newC;
                }
                return c;
            });
            setCultures(nextCultures);
            scheduleCalendarEvent(culture, nextDateStr);
            showNotification(`✅ Culture repiquée ! Prochain passage prévu pour le ${nextDate.toLocaleDateString()}`);
        }
    };


    const handleRemettreEnCulture = (id: string) => {
        const culture = cultures.find(c => c.id === id);
        if (!culture) return;

        const today = new Date().toISOString().split('T')[0];
        if (window.confirm(`Remettre la souche "${culture.nom}" en culture active ?`)) {
            const nextCultures = cultures.map(c => {
                if (c.id === id) {
                    const newC = { ...c, statut: 'active' as const, lastRepiquage: today, date: c.cryoDate || c.date };
                    addHistoryEntry(newC, 'reprise', { date: today, fromCryo: true });
                    return newC;
                }
                return c;
            });
            setCultures(nextCultures);
            showNotification(`🔥 Souche "${culture.nom}" remise en culture active !`);
        }
    };

    const handleSaveCryo = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        if (!cryoSource) return;

        const updatedCulture: Culture = {
            ...cryoSource,
            statut: 'cryoconservée',
            cryoDate: formData.get('date') as string,
            cryoDuration: formData.get('duration') as string,
            cryoLocation: formData.get('location') as string,
            cryoAgent: formData.get('agent') as string,
            cryoNotes: formData.get('notes') as string,
        };

        addHistoryEntry(updatedCulture, 'cryo', {
            date: updatedCulture.cryoDate,
            location: updatedCulture.cryoLocation,
            agent: updatedCulture.cryoAgent,
            duration: updatedCulture.cryoDuration + ' mois'
        });

        setCultures(cultures.map(c => c.id === updatedCulture.id ? updatedCulture : c));
        setShowCryoModal(false);
        setCryoSource(null);
        showNotification(`❄️ Souche "${cryoSource.nom}" cryoconservée !`);
    };

    const simulate = (params: any) => {
        const { duration, timeStep, substrate: S0, modelType, antibioEnabled,
            antibioDose, antibioTime, ec50, hill, clearance, species } = params;

        const steps = Math.floor(duration / timeStep);
        const times: number[] = [];
        const speciesData = species.map((s: any) => ({
            id: s.id,
            name: s.nom,
            color: s.color || getRandomColor(),
            populations: [] as number[],
            muMax: s.muMax || 0.8,
            ks: s.ks || 0.1,
            capacity: s.capacity || 1000000000
        }));

        const substrateConc: number[] = [];
        const antibioConc: number[] = [];

        let populations = species.map((s: any) => s.initialPop || 1000000);
        let S = S0;
        let C = 0; // Antibiotic concentration

        for (let step = 0; step <= steps; step++) {
            const t = step * timeStep;
            times.push(t);

            populations.forEach((pop: number, i: number) => {
                speciesData[i].populations.push(pop);
            });
            substrateConc.push(S);
            antibioConc.push(C);

            if (antibioEnabled && t >= antibioTime && t < antibioTime + timeStep) {
                C += antibioDose;
            }

            const newPopulations = [...populations];
            let dS = 0;

            populations.forEach((N: number, i: number) => {
                const sp = speciesData[i];
                let mu = 0;

                if (modelType === 'logistic') {
                    mu = sp.muMax * (1 - N / sp.capacity);
                } else if (modelType === 'monod' || modelType === 'pkpd') {
                    mu = sp.muMax * (S / (sp.ks + S));
                } else if (modelType === 'lotka-volterra') {
                    let competitionTerm = 0;
                    populations.forEach((Nj: number, j: number) => {
                        const alpha = i === j ? 1 : 0.5; // Competition coefficient
                        competitionTerm += alpha * Nj;
                    });
                    mu = sp.muMax * (1 - competitionTerm / sp.capacity);
                }

                let inhibition = 0;
                if (antibioEnabled && C > 0) {
                    const emax = 0.95; // Maximum effect
                    inhibition = emax * Math.pow(C, hill) / (Math.pow(ec50, hill) + Math.pow(C, hill));
                    mu = mu * (1 - inhibition);
                }

                const dN = mu * N * timeStep;
                newPopulations[i] = Math.max(0, N + dN);

                if (modelType === 'monod' || modelType === 'monod-ext' || modelType === 'pkpd') {
                    const Y = 0.5; // Yield coefficient
                    dS -= (1 / Y) * mu * N * timeStep;
                }
            });

            populations = newPopulations;
            S = Math.max(0, S + dS);

            if (antibioEnabled) {
                C = C * Math.exp(-clearance * timeStep);
            }
        }

        return {
            times,
            species: speciesData,
            substrate: substrateConc,
            antibiotic: antibioConc
        };
    };

    const runSimulation = () => {
        const activeCultures = cultures.filter(c => c.statut === 'active');
        if (activeCultures.length === 0) {
            showNotification('Veuillez ajouter au moins une culture active', 'warning');
            return;
        }

        showNotification('🚀 Simulation en cours...', 'success');

        const results = simulate({
            ...envParams,
            antibioEnabled: antibioParams.enabled,
            ...antibioParams,
            species: activeCultures
        });

        setSimulationResults(results);
    };

    const getRandomColor = () => {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#43e97b', '#fa709a', '#fee140', '#30cfd0',
            '#a8edea', '#fed6e3', '#c471f5', '#fa7d56'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const formatNumber = (num: number) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(0);
    };

    const interpretResults = (results: SimulationResult) => {
        if (!results) return "Aucune donnée de simulation.";

        const lastPop = results.species[0].populations[results.species[0].populations.length - 1];
        const firstPop = results.species[0].populations[0];
        const ratio = lastPop / (firstPop || 1);

        if (ratio < 1) return "📉 Déclin détecté : La population diminue (stress ou manque de nutriments).";
        if (ratio > 100) return "🚀 Croissance explosive : Conditions optimales détectées.";
        if (ratio > 1) return "📈 Croissance stable : La culture évolue normalement.";

        return "⚖️ Équilibre : La population est en phase de plateau.";
    };

    const exportData = () => {
        const data = { cultures, milieux, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hugin-cultures-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showNotification('📥 Données exportées');
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (data.cultures) setCultures(data.cultures);
                if (data.milieux) setMilieux(data.milieux);
                showNotification('📤 Données importées');
            } catch (err) {
                showNotification('⚠️ Erreur d\'import', 'error');
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className={`culture-manager-root ${theme}`} style={{ minHeight: '100vh', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <style>{`
                :root {
                    --cosmic-bg-primary: #0f0f23;
                    --cosmic-bg-secondary: #1a1a2e;
                    --cosmic-bg-card: #16213e;
                    --cosmic-text-primary: #ffffff;
                    --cosmic-text-secondary: #b8b8d1;
                    --cosmic-border: #2d2d44;
                    --cosmic-accent: #667eea;
                    --cosmic-accent-2: #764ba2;
                    --cosmic-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    --cosmic-success: #10b981;
                    --cosmic-danger: #ef4444;
                }

                .culture-manager-root {
                    background: var(--cosmic-bg-primary);
                    color: var(--cosmic-text-primary);
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    min-height: 100vh;
                    padding-top: 100px;
                    transition: all 0.5s ease;
                }

                .header-fixed {
                    background: rgba(26, 26, 46, 0.8);
                    backdrop-filter: blur(15px);
                    padding: 20px 40px;
                    border-bottom: 2px solid var(--cosmic-border);
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 1000;
                    box-shadow: var(--cosmic-shadow);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .header-hidden { transform: translateY(-100%); }

                .panel-card {
                    background: var(--cosmic-bg-secondary);
                    border-radius: 20px;
                    padding: 25px;
                    border: 2px solid var(--cosmic-border);
                    box-shadow: var(--cosmic-shadow);
                    transition: all 0.3s ease;
                }

                .panel-card:hover {
                    border-color: var(--cosmic-accent);
                }

                .panel-title {
                    font-size: 1.3em;
                    font-weight: 700;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .text-gradient {
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .btn-action {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    cursor: pointer;
                    font-size: 0.9em;
                }

                .btn-primary { 
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2)); 
                    color: white; 
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
                }
                .btn-primary:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5); 
                }

                .btn-secondary { 
                    background: var(--cosmic-bg-card); 
                    color: var(--cosmic-text-primary); 
                    border: 2px solid var(--cosmic-border); 
                }
                .btn-secondary:hover { 
                    border-color: var(--cosmic-accent); 
                    transform: translateY(-2px); 
                }
                .btn-secondary.active {
                    background: var(--cosmic-accent);
                    color: white;
                    border-color: var(--cosmic-accent);
                }

                .input-field {
                    width: 100%;
                    padding: 12px 15px;
                    background: var(--cosmic-bg-card);
                    border: 2px solid var(--cosmic-border);
                    border-radius: 10px;
                    color: var(--cosmic-text-primary);
                    font-size: 1em;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .input-field:focus {
                    border-color: var(--cosmic-accent);
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
                }

                .stat-card {
                    background: var(--cosmic-bg-card);
                    padding: 25px;
                    border-radius: 15px;
                    border: 2px solid var(--cosmic-border);
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--cosmic-accent);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
                }

                .stat-value {
                    font-size: 2em;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 5px;
                }

                .simulation-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 30px;
                }

                .chart-container {
                    background: var(--cosmic-bg-card);
                    border-radius: 15px;
                    padding: 10px;
                    border: 2px solid var(--cosmic-border);
                    min-height: 500px;
                }

                .badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    background: rgba(102, 126, 234, 0.1);
                    color: var(--cosmic-accent);
                    border: 1px solid var(--cosmic-accent);
                }

                .culture-item {
                    background: var(--cosmic-bg-card);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    border: 1px solid var(--cosmic-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .culture-item:hover {
                    border-color: var(--cosmic-accent);
                    transform: translateX(5px);
                }
            `}</style>

            {/* Notification */}
            {/* Removed notif display logic as per instruction */}


            {/* Fixed Header */}
            <header className={`header-fixed ${!visibleHeader ? 'header-hidden' : ''}`}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => navigate('/hugin')} style={{ background: 'none', border: 'none', color: 'var(--cosmic-text-secondary)', cursor: 'pointer' }}>
                            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <h1 className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 800 }}>🦠 BactSim Scientifique</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="panel-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px', gap: '5px' }}>
                            <button className={`btn-action btn-secondary ${activeSection === 'cultures' ? 'active' : ''}`} onClick={() => setActiveSection('cultures')}>🔬 Cultures</button>
                            <button className={`btn-action btn-secondary ${activeSection === 'milieux' ? 'active' : ''}`} onClick={() => setActiveSection('milieux')}>🧪 Milieux</button>
                            <button className={`btn-action btn-secondary ${activeSection === 'cryo' ? 'active' : ''}`} onClick={() => setActiveSection('cryo')}>❄️ Cryo</button>
                        </div>
                        <div className="panel-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px', gap: '5px' }}>
                            <button className="btn-action btn-primary" onClick={() => openCultureModal()}>➕ Souche</button>
                            <button className="btn-action btn-secondary" onClick={() => openMilieuModal()}>➕ Milieu</button>
                        </div>
                        <div className="panel-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px', gap: '5px' }}>
                            <button className="btn-action btn-secondary" onClick={exportData} title="Exporter"><Download size={18} /></button>
                            <button className="btn-action btn-secondary" onClick={() => fileInputRef.current?.click()} title="Importer"><Upload size={18} /></button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={importData} style={{ display: 'none' }} accept=".json" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>

                {activeSection === 'cultures' && (
                    <>
                        {/* Simulation Dashboard */}
                        <div className="simulation-grid">
                            <div className="panel-card">
                                <h3 className="panel-title"><Beaker size={20} /> Paramètres d'Environnement</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8em', color: 'var(--cosmic-text-secondary)' }}>Type de Culture</label>
                                        <select className="input-field" value={envParams.type} onChange={e => setEnvParams({ ...envParams, type: e.target.value })}>
                                            <option value="batch">Batch (Fermé)</option>
                                            <option value="fed-batch">Fed-Batch</option>
                                            <option value="chemostat">Chémostat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8em', color: 'var(--cosmic-text-secondary)' }}>Modèle Mathématique</label>
                                        <select className="input-field" value={envParams.modelType} onChange={e => setEnvParams({ ...envParams, modelType: e.target.value })}>
                                            <option value="monod">Monod (Standard)</option>
                                            <option value="logistic">Logistique (Verhulst)</option>
                                            <option value="lotka-volterra">Lotka-Volterra (Compétition)</option>
                                            <option value="pkpd">PK/PD (Antibiotiques)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8em', color: 'var(--cosmic-text-secondary)' }}>Substrat Initial (g/L)</label>
                                        <input type="number" className="input-field" value={envParams.substrate} onChange={e => setEnvParams({ ...envParams, substrate: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8em', color: 'var(--cosmic-text-secondary)' }}>Durée (h)</label>
                                        <input type="number" className="input-field" value={envParams.duration} onChange={e => setEnvParams({ ...envParams, duration: parseFloat(e.target.value) })} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--cosmic-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.9em' }}>Effet Antibiotique</h4>
                                        <input type="checkbox" checked={antibioParams.enabled} onChange={e => setAntibioParams({ ...antibioParams, enabled: e.target.checked })} />
                                    </div>
                                    {antibioParams.enabled && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <input type="text" className="input-field" placeholder="Molécule" value={antibioParams.name} onChange={e => setAntibioParams({ ...antibioParams, name: e.target.value })} />
                                            <input type="number" className="input-field" placeholder="Dose (mg/L)" value={antibioParams.dose} onChange={e => setAntibioParams({ ...antibioParams, dose: parseFloat(e.target.value) })} />
                                            <input type="number" className="input-field" placeholder="Tps Injection (h)" value={antibioParams.time} onChange={e => setAntibioParams({ ...antibioParams, time: parseFloat(e.target.value) })} />
                                            <input type="number" className="input-field" placeholder="Clairance" value={antibioParams.clearance} onChange={e => setAntibioParams({ ...antibioParams, clearance: parseFloat(e.target.value) })} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                                    <button className="btn-action btn-primary" style={{ flex: 2 }} onClick={runSimulation}>
                                        <Play size={18} /> Lancer la Simulation
                                    </button>
                                    <button className="btn-action btn-secondary" style={{ flex: 1 }} onClick={() => setSimulationResults(null)}>
                                        <RotateCcw size={18} /> Reset
                                    </button>
                                </div>
                            </div>

                            <div className="panel-card chart-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 className="panel-title" style={{ marginBottom: 0 }}><TrendingUp size={20} /> Courbe de Croissance</h3>
                                    {simulationResults && <span className="badge">Calculé en t={envParams.timeStep}s</span>}
                                </div>
                                {simulationResults ? (
                                    <Plot
                                        data={[
                                            ...simulationResults.species.map(s => ({
                                                x: simulationResults.times,
                                                y: s.populations,
                                                type: 'scatter',
                                                mode: 'lines',
                                                name: s.name,
                                                line: { color: s.color, width: 3, shape: 'spline' }
                                            })),
                                            {
                                                x: simulationResults.times,
                                                y: simulationResults.substrate,
                                                type: 'scatter',
                                                mode: 'lines',
                                                name: 'Substrat',
                                                yaxis: 'y2',
                                                line: { color: '#fbbf24', width: 2, dash: 'dot' }
                                            },
                                            ...(antibioParams.enabled ? [{
                                                x: simulationResults.times,
                                                y: simulationResults.antibiotic,
                                                type: 'scatter',
                                                mode: 'lines',
                                                name: antibioParams.name,
                                                yaxis: 'y3',
                                                line: { color: '#ef4444', width: 2, dash: 'dash' }
                                            }] : [])
                                        ] as any}
                                        layout={{
                                            autosize: true,
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            showlegend: true,
                                            legend: { font: { color: '#b8b8d1' } },
                                            margin: { t: 30, b: 40, l: 60, r: 60 },
                                            xaxis: {
                                                title: { text: 'Temps (heures)', font: { color: '#b8b8d1' } },
                                                gridcolor: 'rgba(255,255,255,0.05)',
                                                tickfont: { color: '#b8b8d1' }
                                            },
                                            yaxis: {
                                                title: { text: 'Population (CFU)', font: { color: '#b8b8d1' } },
                                                gridcolor: 'rgba(255,255,255,0.05)',
                                                tickfont: { color: '#b8b8d1' },
                                                type: 'log'
                                            },
                                            yaxis2: {
                                                title: { text: 'Substrat', font: { color: '#fbbf24' } },
                                                overlaying: 'y',
                                                side: 'right',
                                                showgrid: false,
                                                tickfont: { color: '#fbbf24' }
                                            }
                                        }}
                                        config={{ responsive: true, displayModeBar: false }}
                                        style={{ width: '100%', height: '400px' }}
                                    />
                                ) : (
                                    <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--cosmic-text-secondary)', gap: '15px' }}>
                                        <Activity size={48} style={{ opacity: 0.2 }} />
                                        <p>En attente des paramètres pour générer la courbe...</p>
                                    </div>
                                )}
                                {simulationResults && (
                                    <div style={{ marginTop: '15px', padding: '15px', borderRadius: '10px', background: 'rgba(102, 126, 234, 0.05)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                                        <p style={{ margin: 0, fontSize: '0.9em' }}>
                                            <strong>Interprétation Algorithmique :</strong> {interpretResults(simulationResults)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Species & Culture List */}
                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 className="panel-title" style={{ marginBottom: 0 }}><Activity size={20} /> Souches en Culture</h3>
                                <div style={{ position: 'relative', width: '300px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cosmic-accent)' }} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="Filtrer souches..."
                                        value={searchQueries.cultures}
                                        onChange={e => setSearchQueries({ ...searchQueries, cultures: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                                {cultures.filter(c => c.statut === 'active' && c.nom.toLowerCase().includes(searchQueries.cultures.toLowerCase())).map(culture => (
                                    <div key={culture.id} className="panel-card" style={{ borderLeft: `5px solid ${culture.color || 'var(--cosmic-accent)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{culture.nom}</h4>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span className="badge">Passage {culture.passage}</span>
                                                    <span className="badge" style={{ color: '#10b981', borderColor: '#10b981' }}>{culture.muMax || 0.8} µMax</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button className="btn-action btn-secondary" style={{ padding: '5px' }} onClick={() => openCultureModal(culture)}><History size={16} /></button>
                                                <button className="btn-action btn-secondary" style={{ padding: '5px', color: 'var(--cosmic-danger)' }} onClick={() => handleDeleteCulture(culture.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85em' }}>
                                            <div style={{ color: 'var(--cosmic-text-secondary)' }}>Pop. Initiale:</div>
                                            <div>{formatNumber(culture.initialPop || 1000000)} CFU</div>
                                            <div style={{ color: 'var(--cosmic-text-secondary)' }}>Intervalle:</div>
                                            <div>{culture.intervalle} jours</div>
                                        </div>
                                        <button className="btn-action btn-secondary" style={{ width: '100%', marginTop: '15px', justifyContent: 'center' }} onClick={() => handleMarquerRepiquage(culture.id)}>
                                            <RotateCcw size={16} /> Marquer Repiquage
                                        </button>
                                    </div>
                                ))}
                                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', cursor: 'pointer', minHeight: '150px' }} onClick={() => openCultureModal()}>
                                    <div style={{ padding: '15px', borderRadius: '50%', background: 'rgba(102, 126, 234, 0.1)', color: 'var(--cosmic-accent)', marginBottom: '10px' }}>
                                        <Play size={24} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>Ajouter une Souche</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === 'milieux' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {milieux.filter(m => m.nom.toLowerCase().includes(searchQueries.milieux.toLowerCase())).map(milieu => (
                            <div key={milieu.id} className="panel-card">
                                <h4 style={{ margin: '0 0 10px 0' }}>{milieu.nom}</h4>
                                <p style={{ fontSize: '0.9em', color: 'var(--cosmic-text-secondary)', marginBottom: '15px' }}>{milieu.type}</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-action btn-secondary" onClick={() => openMilieuModal(milieu)}>Modifier</button>
                                    <button className="btn-action btn-secondary" style={{ color: 'var(--cosmic-danger)' }} onClick={() => handleDeleteMilieu(milieu.id)}>Supprimer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'cryo' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {cultures.filter(c => c.statut === 'cryoconservée' && c.nom.toLowerCase().includes(searchQueries.cryo.toLowerCase())).map(culture => {
                            const milieu = milieux.find(m => m.id === culture.milieuId);
                            return (
                                <div key={culture.id} className="panel-card">
                                    <h4 style={{ margin: '0 0 10px 0' }}>{culture.nom}</h4>
                                    <p style={{ fontSize: '0.9em', color: 'var(--cosmic-text-secondary)', marginBottom: '5px' }}>
                                        Milieu: {milieu?.nom || 'N/A'}
                                    </p>
                                    <p style={{ fontSize: '0.9em', color: 'var(--cosmic-text-secondary)', marginBottom: '15px' }}>
                                        Date: {culture.date}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn-action btn-secondary" onClick={() => { setEditingCulture(culture); setShowCultureModal(true); }}>Modifier</button>
                                        <button className="btn-action btn-secondary" onClick={() => handleRemettreEnCulture(culture.id)}>Reprendre</button>
                                        <button className="btn-action btn-secondary" onClick={() => { setHistoryCulture(culture); setShowHistoryModal(true); }}>Historique</button>
                                        <button className="btn-action btn-secondary" style={{ color: 'var(--cosmic-danger)' }} onClick={() => handleDeleteCulture(culture.id)}>Supprimer</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Modals Implementation */}
            {showCultureModal && (
                <div className="modal-overlay">
                    <div className="panel-card modal-content-panel" style={{ maxWidth: '600px' }}>
                        <h2 className="panel-title">{editingCulture ? 'Éditer Souche' : 'Nouvelle Souche'}</h2>
                        <form onSubmit={handleSaveCulture}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label>Nom de la Souche</label>
                                    <input type="text" name="nom" className="input-field" defaultValue={editingCulture?.nom} required />
                                </div>
                                <div>
                                    <label>µMax (h-1)</label>
                                    <input type="number" step="0.01" name="muMax" className="input-field" defaultValue={editingCulture?.muMax || 0.8} />
                                </div>
                                <div>
                                    <label>Ks (Saturation)</label>
                                    <input type="number" step="0.01" name="ks" className="input-field" defaultValue={editingCulture?.ks || 0.1} />
                                </div>
                                <div>
                                    <label>Population Initiale</label>
                                    <input type="number" name="initialPop" className="input-field" defaultValue={editingCulture?.initialPop || 1000000} />
                                </div>
                                <div>
                                    <label>Capacité K</label>
                                    <input type="number" name="capacity" className="input-field" defaultValue={editingCulture?.capacity || 1000000000} />
                                </div>
                                <div>
                                    <label>Intervalle Repiq. (j)</label>
                                    <input type="number" name="intervalle" className="input-field" defaultValue={editingCulture?.intervalle || 7} required />
                                </div>
                                <div>
                                    <label>Date Mise en Culture</label>
                                    <input type="date" name="date" className="input-field" defaultValue={editingCulture?.date || new Date().toISOString().split('T')[0]} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-action btn-secondary" onClick={() => setShowCultureModal(false)}>Annuler</button>
                                <button type="submit" className="btn-action btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Milieu Modal */}
            {
                showMilieuModal && (
                    <div className="modal-overlay">
                        <form className="modal-content-panel" onSubmit={handleSaveMilieu}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                                <h2 className="text-gradient">{editingMilieu ? '✏️ Modifier Milieu' : '➕ Nouveau Milieu'}</h2>
                                <X size={24} className="cursor-pointer" onClick={() => setShowMilieuModal(false)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Nom du milieu *</label>
                                    <input name="nom" defaultValue={editingMilieu?.nom} className="input-field" required />
                                </div>
                                <div className="form-group">
                                    <label>Type (DMEM, RPMI...) *</label>
                                    <input name="type" defaultValue={editingMilieu?.type} className="input-field" required />
                                </div>
                                <div className="form-group">
                                    <label>Fournisseur</label>
                                    <input name="fournisseur" defaultValue={editingMilieu?.fournisseur} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label>Date d'ajout</label>
                                    <input type="date" name="dateAjout" defaultValue={editingMilieu?.dateAjout || new Date().toISOString().split('T')[0]} className="input-field" />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Composition (Additifs...)</label>
                                <textarea name="composition" defaultValue={editingMilieu?.composition} className="input-field" rows={3} placeholder="Sérum, antibiotiques..." />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Propriétés / Stockage</label>
                                <textarea name="proprietes" defaultValue={editingMilieu?.proprietes} className="input-field" rows={2} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                                <button type="button" className="btn-action btn-secondary" onClick={() => setShowMilieuModal(false)}>Annuler</button>
                                <button type="submit" className="btn-action btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* History Modal */}
            {
                showHistoryModal && historyCulture && (
                    <div className="modal-overlay">
                        <div className="modal-content-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                                <h2 className="text-gradient">📜 Historique : {historyCulture.nom}</h2>
                                <X size={24} className="cursor-pointer" onClick={() => setShowHistoryModal(false)} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {(historyCulture.history || []).map(entry => (
                                    <div key={entry.id} className="timeline-item">
                                        <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>{new Date(entry.date).toLocaleString()}</div>
                                        <div style={{ fontWeight: 700, margin: '5px 0' }}>{
                                            entry.type === 'creation' ? '🎉 Création' :
                                                entry.type === 'repiquage' ? '🔄 Repiquage' :
                                                    entry.type === 'cryo' ? '❄️ Cryoconservation' :
                                                        entry.type === 'reprise' ? '🔥 Remise en culture' : '✏️ Modification'
                                        }</div>
                                        <div style={{ fontSize: '0.9em' }}>{JSON.stringify(entry.details, null, 2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Cryo Modal */}
            {
                showCryoModal && cryoSource && (
                    <div className="modal-overlay">
                        <form className="modal-content-panel" onSubmit={handleSaveCryo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                                <h2 className="text-gradient">❄️ Cryoconservation : {cryoSource.nom}</h2>
                                <X size={24} className="cursor-pointer" onClick={() => setShowCryoModal(false)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field" required />
                                </div>
                                <div className="form-group">
                                    <label>Durée prévue (mois) *</label>
                                    <input type="number" name="duration" className="input-field" defaultValue={12} required />
                                </div>
                                <div className="form-group">
                                    <label>Localisation (Azote) *</label>
                                    <input name="location" className="input-field" placeholder="Ex: Tank A, Cane 5..." required />
                                </div>
                                <div className="form-group">
                                    <label>Agent protecteur *</label>
                                    <input name="agent" className="input-field" placeholder="Ex: DMSO 10%" required />
                                </div>
                            </div>
                            <textarea name="notes" className="input-field" placeholder="Notes additionnelles..." style={{ marginTop: '20px' }} rows={3} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                                <button type="button" className="btn-action btn-secondary" onClick={() => setShowCryoModal(false)}>Annuler</button>
                                <button type="submit" className="btn-action btn-primary" style={{ background: 'var(--info-gradient)' }}>❄️ Cryoconserver</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    );
};

export default CultureTracking;
