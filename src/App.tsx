import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Cycle, Profile, Settings, SymptomLog } from './types';
import { getCycles, getProfile, getSettings, getSymptomLogs, initDB } from './lib/db';
import { buildPrediction } from './lib/cycle';
import { AppShell } from './components/AppShell';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { CyclePage } from './pages/CyclePage';
import { SymptomsPage } from './pages/SymptomsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AIPage } from './pages/AIPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function getInitialPath() {
  const path = window.location.pathname;
  return path === '/index.html' ? '/' : path;
}

export function App() {
  const [path, setPath] = useState(getInitialPath);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  const navigate = useCallback((nextPath: string) => {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const refresh = useCallback(async () => {
    try {
      await initDB();
      const [loadedProfile, loadedSettings, loadedCycles, loadedLogs] = await Promise.all([
        getProfile(),
        getSettings(),
        getCycles(),
        getSymptomLogs()
      ]);
      setProfile(loadedProfile);
      setSettings(loadedSettings);
      setCycles(loadedCycles);
      setLogs(loadedLogs);
      document.documentElement.dataset.theme = loadedSettings.theme;
      setStorageError('');
    } catch (err) {
      setStorageError(err instanceof Error ? err.message : 'Não foi possível acessar o armazenamento local deste navegador.');
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    const onPop = () => setPath(getInitialPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [refresh]);

  useEffect(() => {
    if (loading || storageError) return;
    const publicRoutes = ['/', '/onboarding'];
    if (!profile && !publicRoutes.includes(path)) navigate('/');
    if (profile && path === '/') navigate('/dashboard');
  }, [loading, storageError, profile, path, navigate]);

  const prediction = useMemo(() => buildPrediction(profile, cycles), [profile, cycles]);

  let content = null;
  if (loading) content = <LoadingSpinner label="Abrindo Luna AI..." />;
  else if (storageError) content = <div className="screen narrow-screen"><div className="storage-error"><h1>Armazenamento indisponível</h1><p>{storageError}</p><p>Tente usar outro navegador ou verificar se o modo privado está bloqueando o armazenamento local.</p></div></div>;
  else {
    switch (path) {
      case '/':
        content = <Welcome navigate={navigate} />;
        break;
      case '/onboarding':
        content = <Onboarding navigate={navigate} refresh={refresh} />;
        break;
      case '/dashboard':
        content = <Dashboard profile={profile} cycles={cycles} logs={logs} prediction={prediction} navigate={navigate} />;
        break;
      case '/cycle':
        content = <CyclePage profile={profile} cycles={cycles} prediction={prediction} refresh={refresh} />;
        break;
      case '/symptoms':
        content = <SymptomsPage logs={logs} refresh={refresh} />;
        break;
      case '/history':
        content = <HistoryPage profile={profile} cycles={cycles} logs={logs} />;
        break;
      case '/ai':
        content = <AIPage />;
        break;
      case '/profile':
        content = <ProfilePage profile={profile} refresh={refresh} navigate={navigate} />;
        break;
      case '/settings':
        content = <SettingsPage settings={settings} refresh={refresh} navigate={navigate} />;
        break;
      default:
        content = <Welcome navigate={navigate} />;
    }
  }

  return <AppShell currentPath={path} navigate={navigate}>{content}</AppShell>;
}
