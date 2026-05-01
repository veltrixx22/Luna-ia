import type { Cycle, Profile, SymptomLog } from '../types';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { getAverageCycleLength, getAveragePeriodDuration, getMoodPatterns, getMostCommonSymptoms } from '../lib/cycle';
import { formatDate } from '../lib/date';
import { crampsLabels, flowLabels, moodLabels } from '../lib/labels';

export function HistoryPage({ cycles, logs, profile }: { cycles: Cycle[]; logs: SymptomLog[]; profile: Profile | null }) {
  const commonSymptoms = getMostCommonSymptoms(logs);
  const moods = getMoodPatterns(logs);
  const averageCycle = getAverageCycleLength(cycles, profile?.averageCycleLength || 28);
  const averagePeriod = getAveragePeriodDuration(cycles, profile?.averagePeriodDuration || 5);

  return (
    <div className="screen">
      <div className="page-title"><p className="eyebrow">Histórico</p><h1>Seus padrões</h1><p className="muted">Visualize médias e tendências simples a partir dos registros salvos neste aparelho.</p></div>
      <div className="stats-grid">
        <Card className="stat-card"><span>Ciclo médio</span><strong>{averageCycle} dias</strong></Card>
        <Card className="stat-card"><span>Menstruação média</span><strong>{averagePeriod} dias</strong></Card>
        <Card className="stat-card"><span>Ciclos salvos</span><strong>{cycles.length}</strong></Card>
        <Card className="stat-card"><span>Sintomas salvos</span><strong>{logs.length}</strong></Card>
      </div>
      <div className="section-grid">
        <Card>
          <h2>Sintomas mais comuns</h2>
          {!commonSymptoms.length ? <EmptyState title="Sem dados suficientes" description="Registre sintomas para ver padrões aqui." /> : <BarList data={commonSymptoms} />}
        </Card>
        <Card>
          <h2>Humor registrado</h2>
          {!moods.length ? <EmptyState title="Sem humor registrado" description="Registre como você se sente para acompanhar tendências." /> : <BarList data={moods} />}
        </Card>
      </div>
      <Card>
        <h2>Linha do tempo</h2>
        {!cycles.length && !logs.length ? <EmptyState title="Nada registrado" description="Seu histórico aparece depois que você salva ciclos e sintomas." /> : (
          <div className="timeline-list">
            {cycles.map((cycle) => <article key={cycle.id} className="timeline-item"><div><strong>Menstruação · {formatDate(cycle.periodStartDate)}</strong><p>{cycle.periodEndDate ? `Finalizada em ${formatDate(cycle.periodEndDate)}` : 'Fim não informado'}</p></div></article>)}
            {logs.map((log) => <article key={log.id} className="timeline-item"><div><strong>Sintomas · {formatDate(log.date)}</strong><p>Fluxo {flowLabels[log.flowIntensity]} · Cólicas {crampsLabels[log.crampsLevel]} · Humor {moodLabels[log.mood]}</p></div></article>)}
          </div>
        )}
      </Card>
    </div>
  );
}

function BarList({ data }: { data: { name: string; count: number }[] }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  return <div className="bar-list">{data.map((item) => <div key={item.name} className="bar-row"><span>{item.name}</span><div><i style={{ width: `${Math.max(12, (item.count / max) * 100)}%` }} /></div><strong>{item.count}</strong></div>)}</div>;
}
