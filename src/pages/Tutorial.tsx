import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Code, Zap, Image, BarChart3, Dna, 
    Copy, Check, ArrowLeft, Terminal,
    Lightbulb, AlertCircle, CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Tutorial = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('notifications');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const sections = [
        { id: 'notifications', title: 'Centre de Notifications', icon: <Zap size={20} /> },
        { id: 'shortcuts', title: 'Raccourcis Clavier', icon: <Terminal size={20} /> },
        { id: 'bioanalyzer', title: 'BioAnalyzer', icon: <Dna size={20} /> },
        { id: 'imageanalyzer', title: 'ImageAnalyzer', icon: <Image size={20} /> },
        { id: 'statistics', title: 'StatisticsLab', icon: <BarChart3 size={20} /> },
        { id: 'newmodule', title: 'Créer un Module', icon: <Code size={20} /> }
    ];

    const CodeBlock = ({ code, id }: any) => (
        <div style={{
            position: 'relative',
            background: '#1e293b',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <button
                onClick={() => copyCode(code, id)}
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <pre style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                overflow: 'auto'
            }}>
                <code>{code}</code>
            </pre>
        </div>
    );

    const InfoBox = ({ type = 'info', children }: any) => {
        const colors = {
            info: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', icon: <AlertCircle size={20} /> },
            success: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: <CheckCircle size={20} /> },
            warning: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: <Lightbulb size={20} /> }
        };
        const style = colors[type as keyof typeof colors];

        return (
            <div style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
            }}>
                <div style={{ color: style.border, marginTop: '0.125rem' }}>
                    {style.icon}
                </div>
                <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        📚 Tutoriel des Modifications
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Guide complet pour utiliser et personnaliser les nouveaux modules
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '1rem',
                            padding: '1rem'
                        }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                                Sections
                            </h3>
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        background: activeSection === section.id ? 'var(--accent-hugin)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: activeSection === section.id ? 'white' : 'var(--text-primary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.9rem',
                                        fontWeight: activeSection === section.id ? 600 : 400,
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                >
                                    {section.icon}
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '1rem',
                        padding: '2rem'
                    }}>
                        {activeSection === 'notifications' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Zap size={32} color="var(--accent-hugin)" />
                                    Centre de Notifications
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Le centre de notifications permet d'afficher des alertes et messages importants aux utilisateurs.
                                    Il apparaît dans la barre de navigation avec un badge indiquant le nombre de notifications non lues.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    💻 Utilisation de Base
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>
                                    Pour afficher une notification depuis n'importe quel composant:
                                </p>

                                <CodeBlock id="notif-1" code={`import { addNotification } from '../components/NotificationCenter';

// Notification de succès
addNotification(
  'success',
  'Analyse terminée',
  'Vos résultats sont prêts'
);

// Notification d'erreur
addNotification(
  'error',
  'Échec du chargement',
  'Impossible de charger le fichier'
);`} />

                                <InfoBox type="info">
                                    <strong>Types disponibles:</strong> 'success', 'error', 'info', 'warning'
                                </InfoBox>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    🎯 Exemples Pratiques
                                </h3>

                                <CodeBlock id="notif-2" code={`// Dans un module d'analyse
const analyzeData = () => {
  try {
    // Votre code d'analyse
    addNotification('success', 'Analyse réussie', 'Les données ont été traitées');
  } catch (error) {
    addNotification('error', 'Erreur d\'analyse', error.message);
  }
};

// Avertissement d'espace disque
if (storageUsed > 90) {
  addNotification('warning', 'Espace limité', 'Il reste 10% d\'espace');
}

// Information générale
addNotification('info', 'Mise à jour', 'Une nouvelle version est disponible');`} />

                                <InfoBox type="success">
                                    Les notifications sont automatiquement sauvegardées dans le localStorage et persistent entre les sessions.
                                </InfoBox>
                            </div>
                        )}

                        {activeSection === 'shortcuts' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Terminal size={32} color="var(--accent-hugin)" />
                                    Raccourcis Clavier
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Les raccourcis clavier permettent une navigation rapide dans l'application.
                                    Appuyez sur <kbd style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-primary)', borderRadius: '0.25rem', fontFamily: 'monospace' }}>Ctrl+R</kbd> pour afficher l'aide.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    ⌨️ Raccourcis Disponibles
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                    {[
                                        { keys: 'Ctrl + R', desc: 'Afficher/masquer l\'aide des raccourcis' },
                                        { keys: 'Ctrl + H', desc: 'Aller à l\'accueil' },
                                        { keys: 'Ctrl + M', desc: 'Ouvrir Munin Atlas' },
                                        { keys: 'Ctrl + L', desc: 'Ouvrir Hugin Lab' },
                                        { keys: 'Ctrl + S', desc: 'Ouvrir les paramètres' },
                                        { keys: 'Esc', desc: 'Fermer les dialogues' }
                                    ].map((shortcut, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '0.5rem',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <span>{shortcut.desc}</span>
                                            <kbd style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'var(--bg-primary)',
                                                borderRadius: '0.375rem',
                                                fontFamily: 'monospace',
                                                fontSize: '0.85rem',
                                                color: 'var(--accent-hugin)',
                                                fontWeight: 600
                                            }}>
                                                {shortcut.keys}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    🔧 Ajouter un Raccourci
                                </h3>

                                <CodeBlock id="shortcut-1" code={`// Dans KeyboardShortcuts.tsx
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'n':  // Nouveau raccourci Ctrl+N
        e.preventDefault();
        navigate('/nouveau-module');
        break;
    }
  }
};

// Ajouter à la liste d'aide
const shortcuts = [
  { keys: ['Ctrl', 'N'], description: 'Ouvrir le nouveau module' },
  // ... autres raccourcis
];`} />

                                <InfoBox type="warning">
                                    N'oubliez pas d'appeler <code>e.preventDefault()</code> pour éviter le comportement par défaut du navigateur.
                                </InfoBox>
                            </div>
                        )}

                        {activeSection === 'bioanalyzer' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Dna size={32} color="var(--accent-hugin)" />
                                    BioAnalyzer
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Module d'analyse de séquences ADN/ARN avec calcul de composition, profil GC, traduction protéique et détection de sites de restriction.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    🧬 Fonctionnalités
                                </h3>

                                <ul style={{ lineHeight: 2, marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                                    <li>Analyse de composition nucléotidique (A, T, G, C, U)</li>
                                    <li>Calcul du contenu GC avec profil le long de la séquence</li>
                                    <li>Traduction protéique (code génétique standard)</li>
                                    <li>Détection de 6 sites de restriction courants</li>
                                    <li>Visualisations graphiques interactives</li>
                                    <li>Export des résultats en format texte</li>
                                </ul>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    💻 Exemple d'Utilisation
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>Séquence test à copier:</p>

                                <CodeBlock id="bio-1" code={`ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG
GAATTCGGATCCAAGCTTCTGCAGCCCGGGAGATCT`} />

                                <InfoBox type="info">
                                    Le module accepte les séquences au format FASTA ou texte brut. Les caractères non-nucléotidiques sont automatiquement ignorés.
                                </InfoBox>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    🔧 Personnalisation
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>Ajouter une enzyme de restriction:</p>

                                <CodeBlock id="bio-2" code={`const restrictionSites = {
  'EcoRI': { pattern: /GAATTC/g, sequence: 'GAATTC' },
  'BglII': { pattern: /AGATCT/g, sequence: 'AGATCT' },  // Nouvelle enzyme
};`} />

                                <p style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Modifier la taille de la fenêtre GC:</p>

                                <CodeBlock id="bio-3" code={`const gcWindow = 100;  // Changez cette valeur (défaut: 100bp)`} />
                            </div>
                        )}

                        {activeSection === 'imageanalyzer' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Image size={32} color="var(--accent-hugin)" />
                                    ImageAnalyzer
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Module de traitement d'images microscopiques avec ajustements et filtres en temps réel.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    🖼️ Workflow Typique
                                </h3>

                                <ol style={{ lineHeight: 2, marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                                    <li>Charger une image (PNG, JPEG, GIF, BMP, WebP)</li>
                                    <li>Ajuster la luminosité et le contraste</li>
                                    <li>Sélectionner un filtre (niveaux de gris, seuillage, contours)</li>
                                    <li>Cliquer sur "Appliquer" pour voir le résultat</li>
                                    <li>Exporter l'image traitée</li>
                                </ol>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    🔧 Ajouter un Filtre Personnalisé
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>Exemple: Filtre Sépia</p>

                                <CodeBlock id="img-1" code={`// Étape 1: Ajouter le type
const [activeFilter, setActiveFilter] = useState<
  'none' | 'grayscale' | 'threshold' | 'edge' | 'sepia'
>('none');

// Étape 2: Implémenter le filtre
else if (activeFilter === 'sepia') {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Étape 3: Ajouter le bouton
{ id: 'sepia', label: 'Sépia' }`} />

                                <InfoBox type="success">
                                    Le traitement se fait directement dans le navigateur avec Canvas API - aucun serveur requis!
                                </InfoBox>
                            </div>
                        )}

                        {activeSection === 'statistics' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <BarChart3 size={32} color="var(--accent-hugin)" />
                                    StatisticsLab
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Module d'analyses statistiques avec tests descriptifs, t de Student, corrélations et visualisations.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    📊 Tests Disponibles
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                    {[
                                        { title: 'Descriptives', desc: 'Moyenne, médiane, écart-type, quartiles' },
                                        { title: 'Test t', desc: 'Comparaison à une moyenne théorique' },
                                        { title: 'Corrélation', desc: 'Coefficient de Pearson et R²' }
                                    ].map((test, i) => (
                                        <div key={i} style={{
                                            padding: '1.5rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                                {test.title}
                                            </h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {test.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    💻 Format des Données
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>Les données peuvent être séparées par espaces, virgules ou points-virgules:</p>

                                <CodeBlock id="stat-1" code={`12.5, 14.2, 13.8, 15.1, 14.9, 13.2

ou

12.5 14.2 13.8 15.1 14.9 13.2

ou

12.5; 14.2; 13.8; 15.1; 14.9; 13.2`} />

                                <InfoBox type="info">
                                    Pour la corrélation, entrez d'abord les valeurs X puis les valeurs Y. Le module les séparera automatiquement.
                                </InfoBox>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    🔧 Ajouter un Test
                                </h3>

                                <CodeBlock id="stat-2" code={`// Exemple: Test de Chi-carré
const calculateChiSquare = (observed: number[], expected: number[]) => {
  let chiSquare = 0;
  for (let i = 0; i < observed.length; i++) {
    chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
  }
  const df = observed.length - 1;
  return { chiSquare, df };
};`} />
                            </div>
                        )}

                        {activeSection === 'newmodule' && (
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Code size={32} color="var(--accent-hugin)" />
                                    Créer un Nouveau Module
                                </h2>

                                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                                    Guide complet pour ajouter un nouveau module à Hugin Lab en 6 étapes simples.
                                </p>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    📋 Étape 1: Créer le Fichier
                                </h3>

                                <p style={{ marginBottom: '1rem' }}>Créez un nouveau fichier dans <code>src/pages/hugin/</code>:</p>

                                <CodeBlock id="new-1" code={`// src/pages/hugin/MonModule.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MonIcon } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const MonModule = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <button onClick={() => navigate('/hugin')} className="btn">
                    <ArrowLeft size={18} /> Retour
                </button>
                <h1>Mon Module</h1>
            </div>
            <div style={{ flex: 1, padding: '2rem' }}>
                {/* Votre contenu ici */}
            </div>
        </div>
    );
};

export default MonModule;`} />

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    📋 Étape 2: Ajouter la Route
                                </h3>

                                <CodeBlock id="new-2" code={`// Dans src/App.tsx

// Import
import MonModule from './pages/hugin/MonModule';

// Route (vers ligne 450)
<Route path="/hugin/mon-module" element={
    <ProtectedRoute module="mon_module">
        <MonModule />
    </ProtectedRoute>
} />`} />

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    📋 Étape 3: Ajouter au Menu
                                </h3>

                                <CodeBlock id="new-3" code={`// Dans src/pages/Hugin.tsx (ligne ~50)

const modules = [
    // ... autres modules
    { 
        id: 'mon_module', 
        icon: <MonIcon size={24} />, 
        category: 'Analysis',
        path: '/hugin/mon-module' 
    },
];`} />

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    📋 Étape 4: Ajouter les Traductions
                                </h3>

                                <CodeBlock id="new-4" code={`// Dans src/translations/index.ts

// Section FR
mon_module: "Mon Module",
mon_module_desc: "Description en français",

// Section EN
mon_module: "My Module",
mon_module_desc: "English description",`} />

                                <InfoBox type="success">
                                    Votre module est maintenant accessible depuis le tableau de bord Hugin!
                                </InfoBox>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
                                    💡 Bonnes Pratiques
                                </h3>

                                <ul style={{ lineHeight: 2, paddingLeft: '1.5rem' }}>
                                    <li>Utilisez les variables CSS pour les couleurs (<code>var(--accent-hugin)</code>)</li>
                                    <li>Ajoutez des notifications pour les actions importantes</li>
                                    <li>Gérez les erreurs avec try/catch</li>
                                    <li>Testez sur différents navigateurs</li>
                                    <li>Documentez votre code avec des commentaires</li>
                                </ul>
                            </div>
                        )}

                        <div style={{
                            marginTop: '3rem',
                            padding: '1.5rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '0.75rem',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Besoin d'aide?
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Consultez la documentation complète ou contactez l'équipe de développement
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button 
                                    onClick={() => navigate('/documentation')}
                                    className="btn btn-primary"
                                >
                                    Documentation
                                </button>
                                <button 
                                    onClick={() => navigate('/hugin')}
                                    className="btn"
                                >
                                    Essayer les Modules
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
