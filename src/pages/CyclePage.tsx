import { FormEvent, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Cycle, Prediction, Profile } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CalendarCycleView } from '../components/CalendarCycleView';
import { EmptyState } from '../components/EmptyState';
import { Field, Input, Textarea } from '../components/Input';
import { Modal } from '../components/Modal';
import { addCycle, deleteCycle, updateCycle } from '../lib/db';
import { calculatePeriodDuration } from '../lib/cycle';
import { formatDate } from '../lib/date';

export function CyclePage({ cycles, prediction, profile, refresh }: { cycles: Cycle[]; prediction: Prediction | null; profile: Profile | null; refresh: () => Promise<void> }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState<Cycle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cycle | null>(null);
  const [error, setError] = useState('');

  function resetForm() {
    setStart('');
    setEnd('');
    setNotes('');
    setEditing(null);
    setError('');
  }

  function startEdit(cycle: Cycle) {
    setEditing(cycle);
    setStart(cycle.periodStartDate);
    setEnd(cycle.periodEndDate || '');
    setNotes(cycle.notes || '');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!start) return setError('Informe a data de início da menstruação.');
    if (end && end < start) return setError('A data final não pode ser antes da data inicial.');
    const periodDuration = calculatePeriodDuration(start, end) || profile?.averagePeriodDuration || 5;
    const payload = { periodStartDate: start, periodEndDate: end, notes, periodDuration, cycleLength: profile?.averageCycleLength || 28 };
    if (editing) await updateCycle(editing.id, payload);
    else await addCycle(payload);
    resetForm();
    await refresh();
  }

  return (
    <div className="screen">
      <div className="page-title"><p className="eyebrow">Ciclo</p><h1>Calendário menstrual</h1><p className="muted">Marque dias de menstruação e veja estimativas de próximo período, ovulação e janela fértil.</p></div>
      <CalendarCycleView cycles={cycles} prediction={prediction} />
      <Card>
        <h2>{editing ? 'Editar menstruação' : 'Registrar menstruação'}</h2>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="two-col">
            <Field label="Início"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} required /></Field>
            <Field label="Fim opcional"><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          </div>
          <Field label="Notas"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: fluxo intenso no primeiro dia..." /></Field>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="row-actions"><Button type="submit">{editing ? 'Salvar alteração' : 'Adicionar registro'}</Button>{editing ? <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button> : null}</div>
        </form>
      </Card>
      <Card>
        <h2>Histórico de ciclos</h2>
        {!cycles.length ? <EmptyState title="Nada por aqui ainda" description="Quando registrar menstruações, elas aparecem nesta lista." /> : (
          <div className="timeline-list">
            {cycles.map((cycle) => (
              <article key={cycle.id} className="timeline-item">
                <div><strong>{formatDate(cycle.periodStartDate)}</strong><p>{cycle.periodEndDate ? `até ${formatDate(cycle.periodEndDate)}` : 'Fim não informado'} · {cycle.periodDuration || profile?.averagePeriodDuration || 5} dia(s)</p>{cycle.notes ? <small>{cycle.notes}</small> : null}</div>
                <div className="item-actions"><button onClick={() => startEdit(cycle)} aria-label="Editar"><Pencil size={17} /></button><button onClick={() => setDeleteTarget(cycle)} aria-label="Excluir"><Trash2 size={17} /></button></div>
              </article>
            ))}
          </div>
        )}
      </Card>
      <Modal open={Boolean(deleteTarget)} title="Excluir registro?" description="Essa ação remove este ciclo apenas deste aparelho." danger confirmLabel="Excluir" onClose={() => setDeleteTarget(null)} onConfirm={async () => { if (deleteTarget) await deleteCycle(deleteTarget.id); setDeleteTarget(null); await refresh(); }} />
    </div>
  );
}
