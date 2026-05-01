import { Trash2 } from 'lucide-react';
import type { SymptomLog } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { SymptomForm } from '../components/SymptomForm';
import { addSymptomLog, deleteSymptomLog } from '../lib/db';
import { formatDate } from '../lib/date';
import { crampsLabels, flowLabels, moodLabels } from '../lib/labels';

export function SymptomsPage({ logs, refresh }: { logs: SymptomLog[]; refresh: () => Promise<void> }) {
  return (
    <div className="screen">
      <div className="page-title"><p className="eyebrow">Sintomas</p><h1>Como você está hoje?</h1><p className="muted">Registre fluxo, cólicas, humor e sintomas. Tudo fica salvo localmente.</p></div>
      <Card><SymptomForm onSubmit={async (value) => { await addSymptomLog(value); await refresh(); }} /></Card>
      <Card>
        <h2>Registros recentes</h2>
        {!logs.length ? <EmptyState icon="🌸" title="Nenhum sintoma registrado" description="Quando você salvar um registro, ele aparece aqui." /> : (
          <div className="timeline-list">
            {logs.map((log) => (
              <article key={log.id} className="timeline-item">
                <div>
                  <strong>{formatDate(log.date)}</strong>
                  <p>Fluxo {flowLabels[log.flowIntensity]} · Cólicas {crampsLabels[log.crampsLevel]} · Humor {moodLabels[log.mood]}</p>
                  {log.symptoms.length ? <small>{log.symptoms.join(', ')}</small> : <small>Nenhum sintoma marcado.</small>}
                  {log.notes ? <small>{log.notes}</small> : null}
                </div>
                <div className="item-actions"><button onClick={async () => { await deleteSymptomLog(log.id); await refresh(); }} aria-label="Excluir"><Trash2 size={17} /></button></div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
