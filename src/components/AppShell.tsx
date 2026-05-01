import type { ReactNode } from 'react';
import { Moon, Settings } from 'lucide-react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export function AppShell({ children, currentPath, navigate }: AppShellProps) {
  const showNav = !['/', '/onboarding'].includes(currentPath);
  return (
    <div className="app-shell">
      {showNav ? (
        <header className="app-header">
          <button className="brand-mini" onClick={() => navigate('/dashboard')}>
            <span><Moon size={18} /></span>Luna AI
          </button>
          <button className="icon-button" onClick={() => navigate('/settings')} aria-label="Configurações">
            <Settings size={20} />
          </button>
        </header>
      ) : null}
      <main className={showNav ? 'app-content with-nav' : 'app-content'}>{children}</main>
      {showNav ? <BottomNav currentPath={currentPath} navigate={navigate} /> : null}
    </div>
  );
}
