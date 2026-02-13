import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Upload, Plus, FileSpreadsheet, Trash2, FileText, Beaker, Calculator, TrendingUp } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';
import Spreadsheet from 'x-data-spreadsheet';
import 'x-data-spreadsheet/dist/xspreadsheet.css';

type SavedSheet = {
    id: string;
    name: string;
    data: string;
    lastModified: string;
    user: string;
};

const TEMPLATES = {
    dilutions: {
        name: 'Calcul de Dilutions',
        icon: <Beaker size={20} />,
        data: [
            {
                name: 'Dilutions',
                rows: {
                    0: { cells: { 0: { text: 'Concentration initiale (mg/mL)' }, 1: { text: '100' }, 2: { text: '' }, 3: { text: 'Facteur de dilution' }, 4: { text: '10' } } },
                    1: { cells: { 0: { text: 'Volume final (mL)' }, 1: { text: '10' }, 2: { text: '' }, 3: { text: 'Concentration finale' }, 4: { text: '=B1/E1', style: 2 } } },
                    2: { cells: { 0: { text: '' } } },
                    3: { cells: { 0: { text: 'Dilution' }, 1: { text: 'Volume stock (mL)' }, 2: { text: 'Volume solvant (mL)' }, 3: { text: 'Concentration (mg/mL)' } } },
                    4: { cells: { 0: { text: '1:10' }, 1: { text: '=B2/E1' }, 2: { text: '=B2-B5' }, 3: { text: '=B1/E1' } } },
                    5: { cells: { 0: { text: '1:100' }, 1: { text: '=B2/100' }, 2: { text: '=B2-B6' }, 3: { text: '=B1/100' } } },
                    6: { cells: { 0: { text: '1:1000' }, 1: { text: '=B2/1000' }, 2: { text: '=B2-B7' }, 3: { text: '=B1/1000' } } }
                },
                styles: [
                    { bgcolor: '#f0f0f0', bold: true },
                    { bgcolor: '#e3f2fd' },
                    { bgcolor: '#fff3e0', bold: true }
                ]
            }
        ]
    },
    croissance: {
        name: 'Courbe de Croissance',
        icon: <TrendingUp size={20} />,
        data: [
            {
                name: 'Croissance',
                rows: {
                    0: { cells: { 0: { text: 'Temps (h)' }, 1: { text: 'DO 600nm' }, 2: { text: 'Log(DO)' }, 3: { text: 'UFC/mL' } } },
                    1: { cells: { 0: { text: '0' }, 1: { text: '0.05' }, 2: { text: '=LOG10(B2)' }, 3: { text: '=B2*1000000' } } },
                    2: { cells: { 0: { text: '2' }, 1: { text: '0.12' }, 2: { text: '=LOG10(B3)' }, 3: { text: '=B3*1000000' } } },
                    3: { cells: { 0: { text: '4' }, 1: { text: '0.28' }, 2: { text: '=LOG10(B4)' }, 3: { text: '=B4*1000000' } } },
                    4: { cells: { 0: { text: '6' }, 1: { text: '0.65' }, 2: { text: '=LOG10(B5)' }, 3: { text: '=B5*1000000' } } },
                    5: { cells: { 0: { text: '8' }, 1: { text: '1.42' }, 2: { text: '=LOG10(B6)' }, 3: { text: '=B6*1000000' } } },
                    6: { cells: { 0: { text: '10' }, 1: { text: '2.15' }, 2: { text: '=LOG10(B7)' }, 3: { text: '=B7*1000000' } } },
                    7: { cells: { 0: { text: '12' }, 1: { text: '2.38' }, 2: { text: '=LOG10(B8)' }, 3: { text: '=B8*1000000' } } },
                    8: { cells: { 0: { text: '' } } },
                    9: { cells: { 0: { text: 'Taux de croissance (μ)' }, 1: { text: '=SLOPE(C2:C8,A2:A8)' } } }
                }
            }
        ]
    },
    pcr: {
        name: 'Calcul PCR',
        icon: <Calculator size={20} />,
        data: [
            {
                name: 'PCR Mix',
                rows: {
                    0: { cells: { 0: { text: 'Composant' }, 1: { text: 'Conc. stock' }, 2: { text: 'Conc. finale' }, 3: { text: 'Vol/réaction (μL)' }, 4: { text: 'Nb réactions' }, 5: { text: 'Volume total (μL)' } } },
                    1: { cells: { 0: { text: 'Tampon 10X' }, 1: { text: '10X' }, 2: { text: '1X' }, 3: { text: '2.5' }, 4: { text: '10' }, 5: { text: '=D2*E2' } } },
                    2: { cells: { 0: { text: 'dNTPs' }, 1: { text: '10 mM' }, 2: { text: '0.2 mM' }, 3: { text: '0.5' }, 4: { text: '10' }, 5: { text: '=D3*E3' } } },
                    3: { cells: { 0: { text: 'Primer F' }, 1: { text: '10 μM' }, 2: { text: '0.5 μM' }, 3: { text: '1.25' }, 4: { text: '10' }, 5: { text: '=D4*E4' } } },
                    4: { cells: { 0: { text: 'Primer R' }, 1: { text: '10 μM' }, 2: { text: '0.5 μM' }, 3: { text: '1.25' }, 4: { text: '10' }, 5: { text: '=D5*E5' } } },
                    5: { cells: { 0: { text: 'Taq polymerase' }, 1: { text: '5 U/μL' }, 2: { text: '0.025 U/μL' }, 3: { text: '0.125' }, 4: { text: '10' }, 5: { text: '=D6*E6' } } },
                    6: { cells: { 0: { text: 'ADN template' }, 1: { text: '50 ng/μL' }, 2: { text: '50 ng' }, 3: { text: '1' }, 4: { text: '10' }, 5: { text: '=D7*E7' } } },
                    7: { cells: { 0: { text: 'H2O' }, 1: { text: '' }, 2: { text: '' }, 3: { text: '18.375' }, 4: { text: '10' }, 5: { text: '=D8*E8' } } },
                    8: { cells: { 0: { text: '' } } },
                    9: { cells: { 0: { text: 'Volume total/réaction' }, 3: { text: '=SUM(D2:D8)' }, 5: { text: '=SUM(F2:F8)' } } }
                }
            }
        ]
    },
    inventaire: {
        name: 'Inventaire Réactifs',
        icon: <FileText size={20} />,
        data: [
            {
                name: 'Inventaire',
                rows: {
                    0: { cells: { 0: { text: 'Réactif' }, 1: { text: 'Référence' }, 2: { text: 'Quantité' }, 3: { text: 'Unité' }, 4: { text: 'Date réception' }, 5: { text: 'Date expiration' }, 6: { text: 'Emplacement' }, 7: { text: 'Statut' } } },
                    1: { cells: { 0: { text: 'Tryptone' }, 1: { text: 'T7293' }, 2: { text: '500' }, 3: { text: 'g' }, 4: { text: '2026-01-15' }, 5: { text: '2028-01-15' }, 6: { text: 'Armoire A3' }, 7: { text: 'OK' } } },
                    2: { cells: { 0: { text: 'Agar' }, 1: { text: 'A1296' }, 2: { text: '1000' }, 3: { text: 'g' }, 4: { text: '2026-01-10' }, 5: { text: '2029-01-10' }, 6: { text: 'Armoire A3' }, 7: { text: 'OK' } } },
                    3: { cells: { 0: { text: 'NaCl' }, 1: { text: 'S9888' }, 2: { text: '250' }, 3: { text: 'g' }, 4: { text: '2025-12-20' }, 5: { text: '2030-12-20' }, 6: { text: 'Armoire B1' }, 7: { text: 'OK' } } },
                    4: { cells: { 0: { text: 'Glucose' }, 1: { text: 'G7021' }, 2: { text: '100' }, 3: { text: 'g' }, 4: { text: '2026-02-01' }, 5: { text: '2028-02-01' }, 6: { text: 'Armoire A2' }, 7: { text: 'Faible' } } },
                    5: { cells: { 0: { text: 'Antibiotique X' }, 1: { text: 'AB123' }, 2: { text: '50' }, 3: { text: 'mL' }, 4: { text: '2025-11-15' }, 5: { text: '2026-05-15' }, 6: { text: 'Frigo 4°C' }, 7: { text: 'Périmé' } } }
                }
            }
        ]
    }
};

const TableurLab = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const spreadsheetRef = useRef<any>(null);
    const [savedSheets, setSavedSheets] = useState<SavedSheet[]>([]);
    const [currentSheetId, setCurrentSheetId] = useState<string>('');
    const [sheetName, setSheetName] = useState<string>('Nouveau Tableur');
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        loadSavedSheets();
        initializeSpreadsheet();

        return () => {
            if (spreadsheetRef.current) {
                spreadsheetRef.current = null;
            }
        };
    }, []);

    const loadSavedSheets = async () => {
        const data = await fetchModuleData('hugin_spreadsheets');
        if (data && Array.isArray(data)) {
            setSavedSheets(data);
        }
    };

    const initializeSpreadsheet = (templateData?: any) => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        const options = {
            mode: 'edit',
            showToolbar: true,
            showGrid: true,
            showContextmenu: true,
            view: {
                height: () => window.innerHeight - 200,
                width: () => window.innerWidth - 320,
            },
            row: {
                len: 100,
                height: 25,
            },
            col: {
                len: 26,
                width: 100,
                indexWidth: 60,
                minWidth: 60,
            },
            style: {
                bgcolor: '#ffffff',
                align: 'left',
                valign: 'middle',
                textwrap: false,
                strike: false,
                underline: false,
                color: '#0a0a0a',
                font: {
                    name: 'Arial',
                    size: 10,
                    bold: false,
                    italic: false,
                },
            },
        };

        try {
            spreadsheetRef.current = new Spreadsheet(containerRef.current, options);
            if (templateData) {
                spreadsheetRef.current.loadData(templateData);
            }
        } catch (error) {
            console.error('Spreadsheet initialization error:', error);
            showToast('Erreur d\'initialisation du tableur', 'error');
        }
    };

    const handleSave = async () => {
        if (!spreadsheetRef.current) {
            showToast('Tableur non initialisé', 'error');
            return;
        }

        try {
            const data = spreadsheetRef.current.getData();
            const sheetData: SavedSheet = {
                id: currentSheetId || `sheet_${Date.now()}`,
                name: sheetName,
                data: JSON.stringify(data),
                lastModified: new Date().toISOString(),
                user: localStorage.getItem('currentUser') || 'Utilisateur'
            };

            await saveModuleItem('hugin_spreadsheets', sheetData);
            setCurrentSheetId(sheetData.id);
            showToast('Tableur sauvegardé avec succès', 'success');
            loadSavedSheets();
        } catch (error) {
            console.error('Save error:', error);
            showToast('Erreur lors de la sauvegarde', 'error');
        }
    };

    const handleLoad = (sheet: SavedSheet) => {
        try {
            const data = JSON.parse(sheet.data);
            if (spreadsheetRef.current) {
                spreadsheetRef.current.loadData(data);
                setCurrentSheetId(sheet.id);
                setSheetName(sheet.name);
                showToast(`Tableur "${sheet.name}" chargé`, 'success');
            }
        } catch (error) {
            console.error('Load error:', error);
            showToast('Erreur lors du chargement', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce tableur ?')) return;

        try {
            await deleteModuleItem('hugin_spreadsheets', id);
            showToast('Tableur supprimé', 'success');
            loadSavedSheets();
            if (currentSheetId === id) {
                handleNew();
            }
        } catch (error) {
            showToast('Erreur de suppression', 'error');
        }
    };

    const handleNew = () => {
        if (spreadsheetRef.current) {
            spreadsheetRef.current.loadData([{ name: 'Sheet1', rows: {} }]);
            setCurrentSheetId('');
            setSheetName('Nouveau Tableur');
            showToast('Nouveau tableur créé', 'success');
        }
    };

    const handleTemplate = (templateKey: string) => {
        const template = TEMPLATES[templateKey as keyof typeof TEMPLATES];
        if (template && spreadsheetRef.current) {
            spreadsheetRef.current.loadData(template.data);
            setSheetName(template.name);
            setCurrentSheetId('');
            setShowTemplates(false);
            showToast(`Modèle "${template.name}" chargé`, 'success');
        }
    };

    const handleExport = () => {
        if (!spreadsheetRef.current) return;

        try {
            const data = spreadsheetRef.current.getData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sheetName.replace(/\s+/g, '_')}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Tableur exporté', 'success');
        } catch (error) {
            showToast('Erreur d\'export', 'error');
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (spreadsheetRef.current) {
                    spreadsheetRef.current.loadData(data);
                    setSheetName(file.name.replace('.json', ''));
                    setCurrentSheetId('');
                    showToast('Tableur importé', 'success');
                }
            } catch (error) {
                showToast('Erreur d\'import - fichier invalide', 'error');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
            <aside style={{
                width: '280px',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        className="btn"
                        style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={18} />
                        Retour au Labo
                    </button>
                    <button
                        onClick={handleNew}
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                    >
                        <Plus size={18} />
                        Nouveau Tableur
                    </button>
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="btn"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                    >
                        <FileText size={18} />
                        Modèles
                    </button>
                </div>

                {showTemplates && (
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Modèles de laboratoire
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.entries(TEMPLATES).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => handleTemplate(key)}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        justifyContent: 'flex-start',
                                        padding: '0.75rem',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {template.icon}
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        Tableurs sauvegardés ({savedSheets.length})
                    </h3>
                    {savedSheets.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                            Aucun tableur sauvegardé
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {savedSheets.map(sheet => (
                                <div
                                    key={sheet.id}
                                    style={{
                                        padding: '0.75rem',
                                        background: currentSheetId === sheet.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                                        border: `1px solid ${currentSheetId === sheet.id ? 'var(--accent-hugin)' : 'var(--border-color)'}`,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => handleLoad(sheet)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>{sheet.name}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(sheet.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '0.25rem'
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {new Date(sheet.lastModified).toLocaleString('fr-FR')}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        Par: {sheet.user}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FileSpreadsheet size={24} color="var(--accent-hugin)" />
                        <input
                            type="text"
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                outline: 'none',
                                width: '300px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <label className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <Upload size={18} />
                            Importer
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                        </label>

                        <button
                            onClick={handleExport}
                            className="btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Download size={18} />
                            Exporter
                        </button>

                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            Sauvegarder
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        background: '#fff'
                    }}
                />

                <div style={{
                    padding: '0.75rem 1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>Tableur de laboratoire • Basé sur x-spreadsheet (Open Source)</span>
                    <span>Formules Excel • Graphiques • Multi-feuilles</span>
                </div>
            </main>
        </div>
    );
};

export default TableurLab;
