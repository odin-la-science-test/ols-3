import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';

// Composants critiques chargés immédiatement
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShortcutManager from './components/ShortcutManager';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { ToastProvider } from './components/ToastContext';
import { LanguageProvider } from './components/LanguageContext';
import { ThemeProvider } from './components/ThemeContext';
import CommandPalette from './components/CommandPalette';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import VersionBadge from './components/VersionBadge';

// Lazy loading pour les composants moins critiques
const Munin = lazy(() => import('./pages/Munin'));
const Discipline = lazy(() => import('./pages/Discipline'));
const EntityDetail = lazy(() => import('./pages/EntityDetail'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const CompareEntities = lazy(() => import('./pages/CompareEntities'));
const Hugin = lazy(() => import('./pages/Hugin'));
const Messaging = lazy(() => import('./pages/hugin/Messaging'));
const Inventory = lazy(() => import('./pages/hugin/Inventory'));
const Planning = lazy(() => import('./pages/hugin/Planning'));
const Documents = lazy(() => import('./pages/hugin/Documents'));
const CultureTracking = lazy(() => import('./pages/hugin/CultureTracking'));
const ITArchive = lazy(() => import('./pages/hugin/ITArchive'));
const Meetings = lazy(() => import('./pages/hugin/Meetings'));
const ScientificResearch = lazy(() => import('./pages/hugin/ScientificResearch'));
const TableurLab = lazy(() => import('./pages/hugin/TableurLab'));
const Mimir = lazy(() => import('./pages/hugin/Mimir'));
const Bibliography = lazy(() => import('./pages/hugin/Bibliography'));
const LabNotebook = lazy(() => import('./pages/hugin/LabNotebook'));
const StockManager = lazy(() => import('./pages/hugin/StockManager'));
const CryoKeeper = lazy(() => import('./pages/hugin/CryoKeeper'));
const EquipFlow = lazy(() => import('./pages/hugin/EquipFlow'));
const GrantBudget = lazy(() => import('./pages/hugin/GrantBudget'));
const SOPLibrary = lazy(() => import('./pages/hugin/SOPLibrary'));
const BioToolBox = lazy(() => import('./pages/hugin/BioToolBox'));
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
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Features = lazy(() => import('./pages/Features'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const OpenSourceTools = lazy(() => import('./pages/OpenSourceTools'));
const Tutorial = lazy(() => import('./pages/Tutorial'));

// Mobile pages
const MobileHome = lazy(() => import('./pages/mobile/Home'));
const MobileMunin = lazy(() => import('./pages/mobile/Munin'));
const MobileHugin = lazy(() => import('./pages/mobile/Hugin'));
const MobileSettings = lazy(() => import('./pages/mobile/Settings'));
const MobileDiscipline = lazy(() => import('./pages/mobile/Discipline'));
const MobilePlanning = lazy(() => import('./pages/mobile/hugin/Planning'));
const MobileMessaging = lazy(() => import('./pages/mobile/hugin/Messaging'));

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
  const [tempSessionActive, setTempSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

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
        <LanguageProvider>
          <ShortcutManager />
          <KeyboardShortcuts />
          <CommandPalette />
          <ScrollToTop />
          <BackToTop />
          <VersionBadge position="bottom-right" />
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                  desktop={<Home />}
                  mobile={<MobileHome />}
                />
              </ProtectedRoute>
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
                <EntityDetail />
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
            <Route path="/hugin/mimir" element={
              <ProtectedRoute module="hugin_lab">
                <Mimir />
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
            <Route path="/hugin/stock" element={
              <ProtectedRoute module="hugin_lab">
                <StockManager />
              </ProtectedRoute>
            } />
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
              <ProtectedRoute module="hugin_analysis">
                <BioToolBox />
              </ProtectedRoute>
            } />
            <Route path="/hugin/sequence" element={
              <ProtectedRoute module="hugin_analysis">
                <SequenceLens />
              </ProtectedRoute>
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
                <SafetyHub />
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
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
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
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          </Suspense>
        </LanguageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
