import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import { initAutoWatchService } from './services/autoWatchService';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { SecurityManager } from './utils/advancedSecurity';
import { useElectron } from './hooks/useElectron';
import SplashScreen from './components/SplashScreen';
import { runMigrationIfNeeded } from './utils/migrateUserProfiles';

// Composants critiques chargés immédiatement
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import DesktopHome from './pages/DesktopHome';
import DesktopMunin from './pages/DesktopMunin';
import DesktopHugin from './pages/DesktopHugin';
import Login from './pages/Login';
import Register from './pages/Register';
import TermsOfService from './pages/TermsOfService';
import RGPD from './pages/RGPD';
import Admin from './pages/Admin';
import ShortcutManager from './components/ShortcutManager';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import QuickNotes from './components/QuickNotes';
import { ToastProvider } from './components/ToastContext';
import { ThemeProvider } from './components/ThemeContext';
import MimirFloatingButton from './components/MimirFloatingButton';
import CommandPalette from './components/CommandPalette';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import ElectronWrapper from './components/ElectronWrapper';
import DesktopLogin from './pages/DesktopLogin';

// Lazy loading pour les composants moins critiques
const Munin = lazy(() => import('./pages/Munin'));
const Discipline = lazy(() => import('./pages/Discipline'));
const EntityDetail = lazy(() => import('./pages/EntityDetail'));
const MobileEntityDetail = lazy(() => import('./pages/mobile/EntityDetail'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const CompareEntities = lazy(() => import('./pages/CompareEntities'));
const Hugin = lazy(() => import('./pages/Hugin'));
const Messaging = lazy(() => import('./pages/hugin/Messaging'));
const Inventory = lazy(() => import('./pages/hugin/Inventory'));
const Planning = lazy(() => import('./pages/hugin/Planning'));
const Documents = lazy(() => import('./pages/hugin/Documents'));
const CultureTracking = lazy(() => import('./pages/hugin/CultureTracking'));
const CultureCells = lazy(() => import('./pages/hugin/CultureCells'));
const ITArchive = lazy(() => import('./pages/hugin/ITArchive'));
const Meetings = lazy(() => import('./pages/hugin/Meetings'));
const ScientificResearch = lazy(() => import('./pages/hugin/ScientificResearch'));
const TableurLab = lazy(() => import('./pages/hugin/TableurLab'));
const Bibliography = lazy(() => import('./pages/hugin/Bibliography'));
const LabNotebook = lazy(() => import('./pages/hugin/LabNotebook').then(module => ({ default: module.LabNotebook })));
const CryoKeeper = lazy(() => import('./pages/hugin/CryoKeeper'));
const EquipFlow = lazy(() => import('./pages/hugin/EquipFlow'));
const GrantBudget = lazy(() => import('./pages/hugin/GrantBudget'));
const SOPLibrary = lazy(() => import('./pages/hugin/SOPLibrary'));
const BioTools = lazy(() => import('./pages/hugin/BioTools'));
const AIAssistant = lazy(() => import('./pages/hugin/AIAssistant'));
const SequenceLens = lazy(() => import('./pages/hugin/SequenceLens'));
const ColonyVision = lazy(() => import('./pages/hugin/ColonyVision'));
const ProjectMind = lazy(() => import('./pages/hugin/ProjectMind'));
const SafetyHub = lazy(() => import('./pages/hugin/SafetyHub'));
const FlowAnalyzer = lazy(() => import('./pages/hugin/FlowAnalyzer'));
const SpectrumViewer = lazy(() => import('./pages/hugin/SpectrumViewer'));
const GelPro = lazy(() => import('./pages/hugin/GelPro'));
const PhyloGen = lazy(() => import('./pages/hugin/PhyloGen'));
const MoleculeBox = lazy(() => import('./pages/hugin/MoleculeBox'));
const KineticsLab = lazy(() => import('./pages/hugin/KineticsLab'));
const PlateMapper = lazy(() => import('./pages/hugin/PlateMapper'));
const SolutionMixer = lazy(() => import('./pages/hugin/SolutionMixer'));
const PrimerStep = lazy(() => import('./pages/hugin/PrimerStep'));
const CellTracker = lazy(() => import('./pages/hugin/CellTracker'));
const BlastNCBI = lazy(() => import('./pages/hugin/BlastNCBI'));
const PhyloMega = lazy(() => import('./pages/hugin/PhyloMega'));
const BioNumerics = lazy(() => import('./pages/hugin/BioNumerics'));
const Artemis = lazy(() => import('./pages/hugin/Artemis'));
const Qiime2 = lazy(() => import('./pages/hugin/Qiime2'));
const Whonet = lazy(() => import('./pages/hugin/Whonet'));
const ExcelTest = lazy(() => import('./pages/hugin/ExcelTest'));
const BioAnalyzer = lazy(() => import('./pages/hugin/BioAnalyzer'));
const ImageAnalyzer = lazy(() => import('./pages/hugin/ImageAnalyzer'));
const StatisticsLab = lazy(() => import('./pages/hugin/StatisticsLab'));
const PosterMaker = lazy(() => import('./pages/hugin/PosterMaker'));
const WordProcessor = lazy(() => import('./pages/hugin/WordProcessor'));
const ProteinFold = lazy(() => import('./pages/hugin/ProteinFold'));
const PredictiveDashboard = lazy(() => import('./pages/hugin/PredictiveDashboard'));
const LabTimer = lazy(() => import('./pages/hugin/LabTimer'));
const BufferCalc = lazy(() => import('./pages/hugin/BufferCalc'));
const PCRDesigner = lazy(() => import('./pages/hugin/PCRDesigner'));
const GelSimulator = lazy(() => import('./pages/hugin/GelSimulator'));
const ProteinCalculator = lazy(() => import('./pages/hugin/ProteinCalculator'));
const RestrictionMapper = lazy(() => import('./pages/hugin/RestrictionMapper'));
const CloningAssistant = lazy(() => import('./pages/hugin/CloningAssistant'));
const BacterialGrowthPredictor = lazy(() => import('./pages/hugin/BacterialGrowthPredictor'));
const ResistancePhenotypes = lazy(() => import('./pages/hugin/ResistancePhenotypes'));
const LabEquipment = lazy(() => import('./pages/hugin/LabEquipment'));
const QCMMultiDisciplines = lazy(() => import('./pages/hugin/university/ExamsProfessional'));
const LearningManagement = lazy(() => import('./pages/hugin/university/LMSProfessional'));
const CloudStorage = lazy(() => import('./pages/hugin/university/CloudStorageProfessional'));
const WhyOdin = lazy(() => import('./pages/WhyOdin'));
const Enterprise = lazy(() => import('./pages/Enterprise'));
const Pricing = lazy(() => import('./pages/Pricing'));
const MobileApps = lazy(() => import('./pages/MobileApps'));
const Support = lazy(() => import('./pages/Support'));
const Blog = lazy(() => import('./pages/Blog'));
const Company = lazy(() => import('./pages/Company'));
const Careers = lazy(() => import('./pages/Careers'));
const Congratulations = lazy(() => import('./pages/Congratulations'));
const Settings = lazy(() => import('./pages/Settings'));
const Account = lazy(() => import('./pages/Account'));
const LicenseManagement = lazy(() => import('./pages/LicenseManagement'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Features = lazy(() => import('./pages/Features'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const OpenSourceTools = lazy(() => import('./pages/OpenSourceTools'));
const Tutorial = lazy(() => import('./pages/Tutorial'));

// Beta pages
const BetaHub = lazy(() => import('./pages/BetaHub'));
const BetaLabNotebook = lazy(() => import('./pages/beta/BetaLabNotebook'));
const BetaProtocolBuilder = lazy(() => import('./pages/beta/BetaProtocolBuilder'));
const BetaChemicalInventory = lazy(() => import('./pages/beta/BetaChemicalInventory'));
const BetaBackupManager = lazy(() => import('./pages/beta/BetaBackupManager'));
const BetaEquipmentBooking = lazy(() => import('./pages/beta/BetaEquipmentBooking'));
const BetaExperimentPlanner = lazy(() => import('./pages/beta/BetaExperimentPlanner'));
const BetaGelSimulator = lazy(() => import('./pages/beta/BetaGelSimulator'));

// Mobile pages
const MobileHome = lazy(() => import('./pages/mobile/Home'));
const MobileMunin = lazy(() => import('./pages/mobile/Munin'));
const MobileHugin = lazy(() => import('./pages/mobile/Hugin'));
const MobileSettings = lazy(() => import('./pages/mobile/Settings'));
const MobileDiscipline = lazy(() => import('./pages/mobile/Discipline'));
const MobilePlanning = lazy(() => import('./pages/mobile/hugin/Planning'));
const MobileMessaging = lazy(() => import('./pages/mobile/hugin/Messaging'));
const MobileSafetyHub = lazy(() => import('./pages/mobile/hugin/SafetyHub'));
const MobileLandingPage = lazy(() => import('./pages/mobile/LandingPage'));
const MobileAccount = lazy(() => import('./pages/mobile/AccountWrapper'));

// ResponsiveRoute component
import ResponsiveRoute from './components/ResponsiveRoute';

import type { ReactNode } from 'react';
import { checkHasAccess, getAccessData } from './utils/ShieldUtils';

// Composant de chargement
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(59, 130, 246, 0.3)',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p>Chargement...</p>
    </div>
  </div>
);

// Enhanced protection wrapper with module check
const ProtectedRoute = ({ children, module }: { children: ReactNode, module?: string }) => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return <Navigate to="/" replace />;

  const { sub, hiddenTools } = getAccessData(userStr);

  if (module) {
    const hasAccess = checkHasAccess(module, userStr, sub || undefined, hiddenTools);
    if (!hasAccess) {
      return <Navigate to="/hugin?denied=true" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useDeviceDetection();
  const { isElectron } = useElectron();
  const [tempSessionActive, setTempSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showSplash, setShowSplash] = useState(false); // Désactivé car le splash HTML natif le remplace

  // Gérer le splash screen
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Le splash screen HTML natif s'affiche maintenant, pas besoin du React splash
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Initialiser le gestionnaire de sécurité
  useEffect(() => {
    // Exécuter la migration des profils utilisateurs
    runMigrationIfNeeded();
    
    SecurityManager.initialize({
      enableClickjackingProtection: true,
      enableBotDetection: true,
      enableDataExfiltrationProtection: true,
      enableDevToolsDetection: false, // Désactivé pour ne pas gêner le développement
      enableTabnabbingProtection: true,
      onDevToolsDetect: () => {
        console.warn('DevTools détecté - Activité surveillée');
      }
    });
  }, []);

  // Protection contre le retour arrière - déconnexion automatique
  useEffect(() => {
    const protectedRoutes = ['/home', '/munin', '/hugin', '/account', '/settings', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (isProtectedRoute && localStorage.getItem('isLoggedIn') === 'true') {
      const handlePopState = (e: PopStateEvent) => {
        const confirmLogout = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
        
        if (confirmLogout) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          // Empêcher le retour arrière
          window.history.pushState(null, '', window.location.href);
        }
      };

      // Ajouter un état dans l'historique pour détecter le retour arrière
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, navigate]);

  // Initialize Auto-Watch Service
  useEffect(() => {
    // Désactivé temporairement pour éviter les erreurs
    // L'auto-watch peut être lancé manuellement depuis l'interface
    /*
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email) {
          console.log('Initializing Auto-Watch Service for:', user.email);
          initAutoWatchService(user.email);
        }
      } catch (e) {
        console.error('Error initializing auto-watch:', e);
      }
    }
    */
  }, []);

  useEffect(() => {
    let keys: string[] = [];
    const secretCode = 'qczcqcz';
    const tutorialCode = '159357456852';

    const handleKeyDown = (e: KeyboardEvent) => {
      // User requested "ctrl qczcqcz" for demo mode
      if (e.ctrlKey) {
        keys.push(e.key.toLowerCase());
        keys = keys.slice(-secretCode.length);

        if (keys.join('') === secretCode) {
          setTempSessionActive(true);
          // Simulate a full registered user
          const demoUser = {
            email: 'demo@ols-scientist.com',
            name: 'Demo Admin',
            role: 'admin',
            firstName: 'Demo',
            lastName: 'Admin',
            isDemo: true
          };
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserRole', 'admin');
          navigate('/');
        }
      } else {
        // Tutorial code without Ctrl
        keys.push(e.key);
        keys = keys.slice(-tutorialCode.length);

        if (keys.join('') === tutorialCode) {
          navigate('/tutorial');
          keys = []; // Reset
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    let timer: any;
    if (tempSessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && tempSessionActive) {
      setTempSessionActive(false);
      localStorage.clear();
      navigate('/');
      window.location.reload();
    }
    return () => clearInterval(timer);
  }, [tempSessionActive, timeLeft, navigate]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <ElectronWrapper>
          <ShortcutManager />
          <KeyboardShortcuts />
          <CommandPalette />
          {location.pathname !== '/' && <QuickNotes showFloatingButton={false} />}
          <ScrollToTop />
          <BackToTop />
          {tempSessionActive && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
              background: 'red', zIndex: 10000, width: `${(timeLeft / 60) * 100}%`,
              transition: 'width 1s linear'
            }} />
          )}
          {tempSessionActive && (
            <div style={{
              position: 'fixed', bottom: '20px', right: '20px',
              background: 'rgba(255,0,0,0.8)', color: 'white', padding: '10px 20px',
              borderRadius: '30px', zIndex: 10000, fontWeight: 800,
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)', pointerEvents: 'none'
            }}>
              SESSION DEMO : {timeLeft}s RESTANTES
            </div>
          )}
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={
              <ResponsiveRoute 
                desktop={<LandingPage />}
                mobile={<MobileLandingPage />}
              />
            } />
            <Route path="/login" element={isElectron ? <DesktopLogin /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/rgpd" element={<RGPD />} />
            <Route path="/why-odin" element={<WhyOdin />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/mobile-apps" element={<MobileApps />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/company" element={<Company />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/congratulations" element={<Congratulations />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/features" element={<Features />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/opensource-tools" element={<OpenSourceTools />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <ResponsiveRoute 
                  desktop={isElectron ? <DesktopHome /> : <Home />}
                  mobile={<MobileHome />}
                />
              </ProtectedRoute>
            } />
            
            {/* Routes Desktop dédiées */}
            <Route path="/desktop-home" element={
              <ProtectedRoute>
                {isElectron ? <DesktopHome /> : <Navigate to="/home" replace />}
              </ProtectedRoute>
            } />
            <Route path="/desktop-munin" element={
              <ProtectedRoute>
                {isElectron ? <DesktopMunin /> : <Navigate to="/munin" replace />}
              </ProtectedRoute>
            } />
            <Route path="/desktop-hugin" element={
              <ProtectedRoute>
                {isElectron ? <DesktopHugin /> : <Navigate to="/hugin" replace />}
              </ProtectedRoute>
            } />
            <Route path="/desktop-login" element={
              isElectron ? <DesktopLogin /> : <Navigate to="/login" replace />
            } />
            
            <Route path="/munin" element={
              <ProtectedRoute module="munin">
                <ResponsiveRoute 
                  desktop={<Munin />}
                  mobile={<MobileMunin />}
                />
              </ProtectedRoute>
            } />
            <Route path="/munin/:id" element={
              <ProtectedRoute module="munin">
                <ResponsiveRoute 
                  desktop={<Discipline />}
                  mobile={<MobileDiscipline />}
                />
              </ProtectedRoute>
            } />
            <Route path="/munin/:disciplineId/:entityId" element={
              <ProtectedRoute module="munin">
                <ResponsiveRoute 
                  desktop={<EntityDetail />}
                  mobile={<MobileEntityDetail />}
                />
              </ProtectedRoute>
            } />
            <Route path="/munin/:id/compare" element={
              <ProtectedRoute module="munin">
                <CompareEntities />
              </ProtectedRoute>
            } />
            <Route path="/discipline/:id" element={
              <ProtectedRoute module="munin">
                <Discipline />
              </ProtectedRoute>
            } />
            <Route path="/entity/:id" element={
              <ProtectedRoute module="munin">
                <EntityDetail />
              </ProtectedRoute>
            } />
            <Route path="/property/:id" element={
              <ProtectedRoute module="munin">
                <PropertyDetail />
              </ProtectedRoute>
            } />
            <Route path="/compare" element={
              <ProtectedRoute module="munin">
                <CompareEntities />
              </ProtectedRoute>
            } />
            <Route path="/hugin" element={
              <ProtectedRoute>
                <ResponsiveRoute 
                  desktop={<Hugin />}
                  mobile={<MobileHugin />}
                />
              </ProtectedRoute>
            } />
            <Route path="/hugin/messaging" element={
              <ProtectedRoute module="hugin_core">
                <ResponsiveRoute 
                  desktop={<Messaging />}
                  mobile={<MobileMessaging />}
                />
              </ProtectedRoute>
            } />
            <Route path="/hugin/inventory" element={
              <ProtectedRoute module="hugin_core">
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/hugin/planning" element={
              <ProtectedRoute module="hugin_core">
                <ResponsiveRoute 
                  desktop={<Planning />}
                  mobile={<MobilePlanning />}
                />
              </ProtectedRoute>
            } />
            <Route path="/hugin/documents" element={
              <ProtectedRoute module="hugin_core">
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/hugin/culture" element={
              <ProtectedRoute module="hugin_lab">
                <CultureTracking />
              </ProtectedRoute>
            } />
            <Route path="/hugin/culture-cells" element={
              <ProtectedRoute module="hugin_lab">
                <CultureCells />
              </ProtectedRoute>
            } />
            <Route path="/hugin/it-archive" element={
              <ProtectedRoute module="hugin_core">
                <ITArchive />
              </ProtectedRoute>
            } />
            <Route path="/hugin/meetings" element={
              <ProtectedRoute module="hugin_core">
                <Meetings />
              </ProtectedRoute>
            } />
            <Route path="/hugin/research" element={
              <ProtectedRoute module="hugin_lab">
                <ScientificResearch />
              </ProtectedRoute>
            } />
            <Route path="/hugin/tableur" element={
              <ProtectedRoute module="hugin_core">
                <TableurLab />
              </ProtectedRoute>
            } />
            <Route path="/hugin/bibliography" element={
              <ProtectedRoute module="hugin_lab">
                <Bibliography />
              </ProtectedRoute>
            } />
            <Route path="/hugin/notebook" element={
              <ProtectedRoute module="hugin_lab">
                <LabNotebook />
              </ProtectedRoute>
            } />
            <Route path="/hugin/stock" element={<Navigate to="/hugin" replace />} />
            <Route path="/hugin/cryo" element={
              <ProtectedRoute module="hugin_lab">
                <CryoKeeper />
              </ProtectedRoute>
            } />
            <Route path="/hugin/equip" element={
              <ProtectedRoute module="hugin_lab">
                <EquipFlow />
              </ProtectedRoute>
            } />
            <Route path="/hugin/budget" element={
              <ProtectedRoute module="hugin_lab">
                <GrantBudget />
              </ProtectedRoute>
            } />
            <Route path="/hugin/sop" element={
              <ProtectedRoute module="hugin_lab">
                <SOPLibrary />
              </ProtectedRoute>
            } />
            <Route path="/hugin/biotools" element={
              <Suspense fallback={<div>Chargement...</div>}>
                <ProtectedRoute module="hugin_analysis">
                  <BioTools />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/hugin/ai-assistant" element={
              <Suspense fallback={<div>Chargement...</div>}>
                <ProtectedRoute module="hugin_analysis">
                  <AIAssistant />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/hugin/sequence" element={
              <Suspense fallback={<div>Chargement...</div>}>
                <ProtectedRoute module="hugin_analysis">
                  <SequenceLens />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/hugin/colony" element={
              <ProtectedRoute module="hugin_analysis">
                <ColonyVision />
              </ProtectedRoute>
            } />
            <Route path="/hugin/projects" element={
              <ProtectedRoute module="hugin_core">
                <ProjectMind />
              </ProtectedRoute>
            } />
            <Route path="/hugin/safety" element={
              <ProtectedRoute module="hugin_lab">
                <ResponsiveRoute 
                  desktop={<SafetyHub />}
                  mobile={<MobileSafetyHub />}
                />
              </ProtectedRoute>
            } />
            <Route path="/hugin/flow" element={
              <ProtectedRoute module="hugin_analysis">
                <FlowAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/spectrum" element={
              <ProtectedRoute module="hugin_analysis">
                <SpectrumViewer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/gel" element={
              <ProtectedRoute module="hugin_analysis">
                <GelPro />
              </ProtectedRoute>
            } />
            <Route path="/hugin/phylo" element={
              <ProtectedRoute module="hugin_analysis">
                <PhyloGen />
              </ProtectedRoute>
            } />
            <Route path="/hugin/molecules" element={
              <ProtectedRoute module="hugin_analysis">
                <MoleculeBox />
              </ProtectedRoute>
            } />
            <Route path="/hugin/kinetics" element={
              <ProtectedRoute module="hugin_analysis">
                <KineticsLab />
              </ProtectedRoute>
            } />
            <Route path="/hugin/plates" element={
              <ProtectedRoute module="hugin_analysis">
                <PlateMapper />
              </ProtectedRoute>
            } />
            <Route path="/hugin/mixer" element={
              <ProtectedRoute module="hugin_analysis">
                <SolutionMixer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/primers" element={
              <ProtectedRoute module="hugin_analysis">
                <PrimerStep />
              </ProtectedRoute>
            } />
            <Route path="/hugin/cells" element={
              <ProtectedRoute module="hugin_analysis">
                <CellTracker />
              </ProtectedRoute>
            } />
            <Route path="/hugin/blast" element={
              <ProtectedRoute>
                <BlastNCBI />
              </ProtectedRoute>
            } />
            <Route path="/hugin/mega" element={
              <ProtectedRoute>
                <PhyloMega />
              </ProtectedRoute>
            } />
            <Route path="/hugin/bionumerics" element={
              <ProtectedRoute>
                <BioNumerics />
              </ProtectedRoute>
            } />
            <Route path="/hugin/artemis" element={
              <ProtectedRoute>
                <Artemis />
              </ProtectedRoute>
            } />
            <Route path="/hugin/qiime2" element={
              <ProtectedRoute>
                <Qiime2 />
              </ProtectedRoute>
            } />
            <Route path="/hugin/whonet" element={
              <ProtectedRoute>
                <Whonet />
              </ProtectedRoute>
            } />
            <Route path="/hugin/bioanalyzer" element={
              <ProtectedRoute module="bioanalyzer">
                <BioAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/imageanalyzer" element={
              <ProtectedRoute module="imageanalyzer">
                <ImageAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/statistics" element={
              <ProtectedRoute module="statistics">
                <StatisticsLab />
              </ProtectedRoute>
            } />
            <Route path="/hugin/poster-maker" element={
              <ProtectedRoute module="hugin_core">
                <PosterMaker />
              </ProtectedRoute>
            } />
            <Route path="/hugin/word-processor" element={
              <ProtectedRoute module="hugin_core">
                <WordProcessor />
              </ProtectedRoute>
            } />
            <Route path="/hugin/protein-fold" element={
              <ProtectedRoute module="hugin_core">
                <ProteinFold />
              </ProtectedRoute>
            } />
            <Route path="/hugin/PredictiveDashboard" element={
              <ProtectedRoute module="hugin_core">
                <PredictiveDashboard />
              </ProtectedRoute>
            } />
            <Route path="/hugin/lab-timer" element={
              <ProtectedRoute module="hugin_core">
                <LabTimer />
              </ProtectedRoute>
            } />
            <Route path="/hugin/buffer-calc" element={
              <ProtectedRoute module="hugin_core">
                <BufferCalc />
              </ProtectedRoute>
            } />
            <Route path="/hugin/pcr-designer" element={
              <ProtectedRoute module="hugin_analysis">
                <PCRDesigner />
              </ProtectedRoute>
            } />
            <Route path="/hugin/gel-simulator" element={
              <ProtectedRoute module="hugin_analysis">
                <GelSimulator />
              </ProtectedRoute>
            } />
            <Route path="/hugin/protein-calculator" element={
              <ProtectedRoute module="hugin_analysis">
                <ProteinCalculator />
              </ProtectedRoute>
            } />
            <Route path="/hugin/restriction-mapper" element={
              <ProtectedRoute module="hugin_analysis">
                <RestrictionMapper />
              </ProtectedRoute>
            } />
            <Route path="/hugin/cloning-assistant" element={
              <ProtectedRoute module="hugin_analysis">
                <CloningAssistant />
              </ProtectedRoute>
            } />
            <Route path="/hugin/bacterial-growth" element={
              <ProtectedRoute module="hugin_analysis">
                <BacterialGrowthPredictor />
              </ProtectedRoute>
            } />
            
            {/* Hugin Scholar Modules - Nouveaux modules éducatifs avancés */}
            <Route path="/hugin/resistance-phenotypes" element={
              <ProtectedRoute module="hugin_analysis">
                <ResistancePhenotypes />
              </ProtectedRoute>
            } />
            <Route path="/hugin/lab-equipment" element={
              <ProtectedRoute module="hugin_core">
                <LabEquipment />
              </ProtectedRoute>
            } />
            <Route path="/hugin/qcm-multi-disciplines" element={
              <ProtectedRoute module="hugin_core">
                <QCMMultiDisciplines />
              </ProtectedRoute>
            } />
            <Route path="/hugin/learning-management" element={
              <ProtectedRoute module="hugin_core">
                <LearningManagement />
              </ProtectedRoute>
            } />
            <Route path="/hugin/cloud-storage" element={
              <ProtectedRoute module="hugin_core">
                <CloudStorage />
              </ProtectedRoute>
            } />
            
            <Route path="/hugin/biotools" element={
              <ProtectedRoute module="hugin_analysis">
                <BioTools />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <ResponsiveRoute 
                  desktop={<Account />}
                  mobile={<MobileAccount />}
                />
              </ProtectedRoute>
            } />
            <Route path="/license-management" element={
              <ProtectedRoute>
                <LicenseManagement />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <ResponsiveRoute 
                  desktop={<Settings />}
                  mobile={<MobileSettings />}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Beta Test Routes - Accès restreint aux super admins */}
            <Route path="/beta-hub" element={
              <ProtectedRoute>
                <BetaHub />
              </ProtectedRoute>
            } />
            <Route path="/beta/lab-notebook" element={
              <ProtectedRoute>
                <BetaLabNotebook />
              </ProtectedRoute>
            } />
            <Route path="/beta/protocol-builder" element={
              <ProtectedRoute>
                <BetaProtocolBuilder />
              </ProtectedRoute>
            } />
            <Route path="/beta/chemical-inventory" element={
              <ProtectedRoute>
                <BetaChemicalInventory />
              </ProtectedRoute>
            } />
            <Route path="/beta/backup-manager" element={
              <ProtectedRoute>
                <BetaBackupManager />
              </ProtectedRoute>
            } />
            <Route path="/beta/gel-simulator" element={
              <ProtectedRoute>
                <BetaGelSimulator />
              </ProtectedRoute>
            } />
            <Route path="/beta/equipment-booking" element={
              <ProtectedRoute>
                <BetaEquipmentBooking />
              </ProtectedRoute>
            } />
            <Route path="/beta/experiment-planner" element={
              <ProtectedRoute>
                <BetaExperimentPlanner />
              </ProtectedRoute>
            } />
          </Routes>
          </Suspense>
          <CookieConsent />
          <MimirFloatingButton />
        </ElectronWrapper>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
