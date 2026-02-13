export interface Tool {
    id: string;
    label: string;
    icon: string;
    description: string;
    type: 'calculator' | 'analyzer' | 'registry' | 'simulation' | 'monitor';
}

export interface AdvancedModuleDef {
    id: string;
    name: string;
    category: 'Bacteriology' | 'Cell Culture' | 'Hematology' | 'Bio Production' | 'Biochemistry';
    description: string;
    managementTools: Tool[];
    informaticsTools: Tool[];
}

const getMgmtTools = (prefix: string): Tool[] => [
    { id: `${prefix}_lims`, label: 'LIMS Connector', icon: 'Database', description: 'Centralized sample tracking.', type: 'registry' },
    { id: `${prefix}_stock`, label: 'Reagent Stock', icon: 'Package', description: 'Inventory management.', type: 'registry' },
    { id: `${prefix}_qc`, label: 'QC Validator', icon: 'CheckCircle', description: 'Quality control monitoring.', type: 'monitor' },
    { id: `${prefix}_sop`, label: 'Step Guide', icon: 'BookOpen', description: 'Protocol instructions.', type: 'registry' },
    { id: `${prefix}_audit`, label: 'Audit Trail', icon: 'ShieldCheck', description: 'Compliance logging.', type: 'registry' }
];

const getPlaceholderTools = (prefix: string): Tool[] => [
    { id: `${prefix}_placeholder_1`, label: 'Outil en attente', icon: 'Clock', description: 'Module en cours de spécialisation.', type: 'registry' },
    { id: `${prefix}_placeholder_2`, label: 'Outil en attente', icon: 'Clock', description: 'Module en cours de spécialisation.', type: 'registry' }
];

export const advancedModules: AdvancedModuleDef[] = [
    // === BACTERIOLOGY (Specialized Module 1/6) ===
    {
        id: 'bact_blast', name: 'BLAST (NCBI)', category: 'Bacteriology',
        description: 'Identification moléculaire par comparaison de séquences ADN/Protéines.',
        managementTools: getMgmtTools('bact_blast'),
        informaticsTools: [
            { id: 'bact_blast_n', label: 'BLASTn', icon: 'Search', description: 'Recherche de nucléotides (ex: 16S rRNA).', type: 'calculator' },
            { id: 'bact_blast_p', label: 'BLASTp', icon: 'Search', description: 'Recherche de séquences protéiques.', type: 'calculator' },
            { id: 'bact_id_expert', label: 'Species ID', icon: 'Target', description: 'Identification taxonomique automatisée.', type: 'analyzer' },
            { id: 'bact_e_value', label: 'E-Value Calc', icon: 'BarChart3', description: 'Calcul de la significativité statistique.', type: 'calculator' },
            { id: 'bact_db_sync', label: 'GenBank Sync', icon: 'RefreshCw', description: 'Synchronisation avec les bases NCBI.', type: 'registry' }
        ]
    },
    {
        id: 'bact_mega', name: 'MEGA (Prochainement)', category: 'Bacteriology',
        description: 'Analyses phylogénétiques et comparaison de souches.',
        managementTools: getMgmtTools('bact_mega'),
        informaticsTools: getPlaceholderTools('bact_mega')
    },
    {
        id: 'bact_bionumerics', name: 'BioNumerics (Prochainement)', category: 'Bacteriology',
        description: 'Typage bactérien professionnel (PFGE, MLST).',
        managementTools: getMgmtTools('bact_bio'),
        informaticsTools: getPlaceholderTools('bact_bio')
    },
    {
        id: 'bact_artemis', name: 'Artemis (Prochainement)', category: 'Bacteriology',
        description: 'Visualisation et annotation de génomes.',
        managementTools: getMgmtTools('bact_art'),
        informaticsTools: getPlaceholderTools('bact_art')
    },
    {
        id: 'bact_qiime', name: 'QIIME 2 (Prochainement)', category: 'Bacteriology',
        description: 'Analyse de métagénomique et du microbiote.',
        managementTools: getMgmtTools('bact_qii'),
        informaticsTools: getPlaceholderTools('bact_qii')
    },
    {
        id: 'bact_whonet', name: 'WHONET (Prochainement)', category: 'Bacteriology',
        description: 'Surveillance de la résistance (OMS).',
        managementTools: getMgmtTools('bact_who'),
        informaticsTools: getPlaceholderTools('bact_who')
    },

    // --- OTHER CATEGORIES (Isolated) ---
    {
        id: 'cell_culture_suite', name: 'Cell Culture Suite', category: 'Cell Culture',
        description: 'Maintenance et analyse des lignées cellulaires.',
        managementTools: getMgmtTools('cell_core'),
        informaticsTools: [
            { id: 'cell_viability', label: 'Viability Check', icon: 'CheckCircle2', description: 'Assessment of live/dead cells.', type: 'calculator' },
            { id: 'cell_doubling', label: 'Growth Index', icon: 'TrendingUp', description: 'PDL calculations.', type: 'calculator' }
        ]
    },
    {
        id: 'hematology_suite', name: 'Hematology Suite', category: 'Hematology',
        description: 'Analyse sanguine et coagulation.',
        managementTools: getMgmtTools('hem_core'),
        informaticsTools: [
            { id: 'hem_indices', label: 'Indices Calc', icon: 'Calculator', description: 'MCV/MCH/MCHC derivation.', type: 'calculator' },
            { id: 'hem_coa_score', label: 'DIC Scorer', icon: 'AlertCircle', description: 'ISTH based grading.', type: 'calculator' }
        ]
    },
    {
        id: 'bioprod_suite', name: 'Bio Production Suite', category: 'Bio Production',
        description: 'Gestion des bioréacteurs et purification.',
        managementTools: getMgmtTools('bio_core'),
        informaticsTools: [
            { id: 'bio_pid_tune', label: 'PID Tuner', icon: 'Settings', description: 'Control loop optimization.', type: 'simulation' },
            { id: 'bio_mass_bal', label: 'Mass Balance', icon: 'Scale', description: 'Inputs reconciliation.', type: 'calculator' }
        ]
    },
    {
        id: 'biochem_suite', name: 'Biochemistry Suite', category: 'Biochemistry',
        description: 'Analyse des protéines et cinétique.',
        managementTools: getMgmtTools('bc_core'),
        informaticsTools: [
            { id: 'bc_mm_fit', label: 'M-M Fit', icon: 'TrendingUp', description: 'Km and Vmax determination.', type: 'calculator' },
            { id: 'bc_pka_calc', label: 'Buffer Design', icon: 'FlaskConical', description: 'pH formulator.', type: 'calculator' }
        ]
    }
];
