import { Bot, CalendarDays, HeartPulse, Home, UserRound } from 'lucide-react';

const items = [
  { path: '/dashboard', label: 'Início', icon: Home },
  { path: '/cycle', label: 'Ciclo', icon: CalendarDays },
  { path: '/symptoms', label: 'Sintomas', icon: HeartPulse },
  { path: '/ai', label: 'Luna AI', icon: Bot },
  { path: '/profile', label: 'Perfil', icon: UserRound }
];

export function BottomNav({ currentPath, navigate }: { currentPath: string; navigate: (path: string) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => {
        const Icon = item.icon;
        const active = currentPath === item.path;
        return (
          <button key={item.path} className={active ? 'active' : ''} onClick={() => navigate(item.path)} aria-label={item.label}>
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
