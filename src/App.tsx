import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import MobileHome from './pages/mobile/Home';
import Login from './pages/Login';
import Munin from './pages/Munin';
import MobileMunin from './pages/mobile/Munin';
import Discipline from './pages/Discipline';
import EntityDetail from './pages/EntityDetail';
import PropertyDetail from './pages/PropertyDetail';
import CompareEntities from './pages/CompareEntities';
import Hugin from './pages/Hugin';
import MobileHugin from './pages/mobile/Hugin';
import Messaging from './pages/hugin/Messaging';
import MobileMessaging from './pages/mobile/hugin/Messaging';
import Inventory from './pages/hugin/Inventory';
import Planning from './pages/hugin/Planning';
import MobilePlanning from './pages/mobile/hugin/Planning';
import Documents from './pages/hugin/Documents';
import CultureTracking from './pages/hugin/CultureTracking';
import ITArchive from './pages/hugin/ITArchive';
import Meetings from './pages/hugin/Meetings';
import ScientificResearch from './pages/hugin/ScientificResearch';
import TableurLab from './pages/hugin/TableurLab';
import Mimir from './pages/hugin/Mimir';
import Bibliography from './pages/hugin/Bibliography';
import LabNotebook from './pages/hugin/LabNotebook';
import StockManager from './pages/hugin/StockManager';
import CryoKeeper from './pages/hugin/CryoKeeper';
import EquipFlow from './pages/hugin/EquipFlow';
import GrantBudget from './pages/hugin/GrantBudget';
import SOPLibrary from './pages/hugin/SOPLibrary';
import BioToolBox from './pages/hugin/BioToolBox';
import SequenceLens from './pages/hugin/SequenceLens';
import ColonyVision from './pages/hugin/ColonyVision';
import ProjectMind from './pages/hugin/ProjectMind';
import SafetyHub from './pages/hugin/SafetyHub';
import FlowAnalyzer from './pages/hugin/FlowAnalyzer';
import SpectrumViewer from './pages/hugin/SpectrumViewer';
import GelPro from './pages/hugin/GelPro';
import PhyloGen from './pages/hugin/PhyloGen';
import MoleculeBox from './pages/hugin/MoleculeBox';
import KineticsLab from './pages/hugin/KineticsLab';
import PlateMapper from './pages/hugin/PlateMapper';
import SolutionMixer from './pages/hugin/SolutionMixer';
import PrimerStep from './pages/hugin/PrimerStep';
import CellTracker from './pages/hugin/CellTracker';
import AdvancedModule from './pages/hugin/AdvancedModule';
import BlastNCBI from './pages/hugin/BlastNCBI';
import PhyloMega from './pages/hugin/PhyloMega';
import BioNumerics from './pages/hugin/BioNumerics';
import Artemis from './pages/hugin/Artemis';
import Qiime2 from './pages/hugin/Qiime2';
import Whonet from './pages/hugin/Whonet';
import ExcelTest from './pages/hugin/ExcelTest';
import BioAnalyzer from './pages/hugin/BioAnalyzer';
import MobileBioAnalyzer from './pages/mobile/hugin/BioAnalyzer';
import ImageAnalyzer from './pages/hugin/ImageAnalyzer';
import StatisticsLab from './pages/hugin/StatisticsLab';
import Register from './pages/Register';
import WhyOdin from './pages/WhyOdin';
import Enterprise from './pages/Enterprise';
import Pricing from './pages/Pricing';
import MobileApps from './pages/MobileApps';
import Support from './pages/Support';
import Blog from './pages/Blog';
import Company from './pages/Company';
import Careers from './pages/Careers';
import Congratulations from './pages/Congratulations';
import Settings from './pages/Settings';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import Documentation from './pages/Documentation';
import Features from './pages/Features';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import OpenSourceTools from './pages/OpenSourceTools';
import Tutorial from './pages/Tutorial';
import ResponsiveRoute from './components/ResponsiveRoute';
import ShortcutManager from './components/ShortcutManager';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { checkHasAccess, getAccessData } from './utils/ShieldUtils';
import { ToastProvider } from './components/ToastContext';
import { LanguageProvider } from './components/LanguageContext';
import { ThemeProvider } from './components/ThemeContext';
import CommandPalette from './components/CommandPalette';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';

import type { ReactNode } from 'react';

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
                  desktopComponent={Home} 
                  mobileComponent={MobileHome} 
                />
              </ProtectedRoute>
            } />
            <Route path="/munin" element={
              <ProtectedRoute module="munin">
                <ResponsiveRoute 
                  desktopComponent={Munin} 
                  mobileComponent={MobileMunin} 
                />
              </ProtectedRoute>
            } />
            <Route path="/munin/:id" element={
              <ProtectedRoute module="munin">
                <Discipline />
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
                  desktopComponent={Hugin} 
                  mobileComponent={MobileHugin} 
                />
              </ProtectedRoute>
            } />
            <Route path="/hugin/messaging" element={
              <ProtectedRoute module="hugin_core">
                <ResponsiveRoute 
                  desktopComponent={Messaging} 
                  mobileComponent={MobileMessaging} 
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
                  desktopComponent={Planning} 
                  mobileComponent={MobilePlanning} 
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
            <Route path="/hugin/advanced/:moduleId" element={
              <ProtectedRoute module="hugin_lab">
                <AdvancedModule />
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
                <ResponsiveRoute 
                  desktopComponent={BioAnalyzer} 
                  mobileComponent={MobileBioAnalyzer} 
                />
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
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </LanguageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
