import { Bot, CalendarPlus, History, HeartPulse } from 'lucide-react';
import type { Cycle, Prediction, Profile, SymptomLog } from '../types';
import { Card } from '../components/Card';
import { CycleSummaryCard } from '../components/CycleSummaryCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../lib/date';
import { flowLabels, moodLabels } from '../lib/labels';

export function Dashboard({ profile, cycles, logs, prediction, navigate }: { profile: Profile | null; cycles: Cycle[]; logs: SymptomLog[]; prediction: Prediction | null; navigate: (path: string) => void }) {
  const latestLog = logs[0];
  return (
    <div className="screen">
      <div className="page-title">
        <p className="eyebrow">Olá{profile?.name ? `, ${profile.name}` : ''}</p>
        <h1>Seu painel de hoje</h1>
        <p className="muted">Tudo salvo localmente neste aparelho. As previsões são estimativas.</p>
      </div>

      <CycleSummaryCard prediction={prediction} />

      <div className="quick-grid">
        <button onClick={() => navigate('/cycle')}><CalendarPlus size={22} /><span>Registrar menstruação</span></button>
        <button onClick={() => navigate('/symptoms')}><HeartPulse size={22} /><span>Registrar sintomas</span></button>
        <button onClick={() => navigate('/ai')}><Bot size={22} /><span>Falar com Luna AI</span></button>
        <button onClick={() => navigate('/history')}><History size={22} /><span>Ver histórico</span></button>
      </div>

      <div className="section-grid">
        <Card>
          <h2>Último registro</h2>
          {cycles.length ? (
            <p className="big-line">Menstruação iniciada em <strong>{formatDate(cycles[0].periodStartDate)}</strong></p>
          ) : (
            <EmptyState title="Sem ciclo registrado" description="Adicione sua última menstruação para ativar as previsões." action={<Button onClick={() => navigate('/cycle')}>Adicionar ciclo</Button>} />
          )}
        </Card>
        <Card>
          <h2>Sintomas recentes</h2>
          {latestLog ? (
            <div className="mini-list">
              <p><strong>{formatDate(latestLog.date)}</strong></p>
              <p>Fluxo: {flowLabels[latestLog.flowIntensity]} · Humor: {moodLabels[latestLog.mood]}</p>
              {latestLog.symptoms.length ? <p>{latestLog.symptoms.join(', ')}</p> : <p>Nenhum sintoma marcado.</p>}
            </div>
          ) : (
            <EmptyState icon="💗" title="Sem sintomas" description="Registre como você está se sentindo hoje." action={<Button onClick={() => navigate('/symptoms')}>Registrar agora</Button>} />
          )}
        </Card>
      </div>
    </div>
  );
}
