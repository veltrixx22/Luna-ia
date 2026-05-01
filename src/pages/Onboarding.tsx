import { FormEvent, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/Input';
import { addCycle, saveProfile, saveSettings } from '../lib/db';
import { calculatePeriodDuration } from '../lib/cycle';
import type { CycleRegularity, UsageGoal } from '../types';

export function Onboarding({ navigate, refresh }: { navigate: (path: string) => void; refresh: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [regularity, setRegularity] = useState<CycleRegularity>('regular');
  const [usageGoal, setUsageGoal] = useState<UsageGoal>('track');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!lastPeriod) {
      setError('Informe a data da última menstruação para gerar previsões.');
      return;
    }
    if (cycleLength < 15 || cycleLength > 60) {
      setError('A duração média do ciclo precisa estar entre 15 e 60 dias.');
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ name: name.trim(), averageCycleLength: cycleLength, averagePeriodDuration: periodDuration, cycleRegularity: regularity, usageGoal });
      await addCycle({
        periodStartDate: lastPeriod,
        periodEndDate: '',
        cycleLength,
        periodDuration: calculatePeriodDuration(lastPeriod, '') || periodDuration,
        notes: 'Registro inicial criado no onboarding.'
      });
      await saveSettings({ onboardingCompleted: true });
      await refresh();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar os dados.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen narrow-screen">
      <Card className="onboarding-card">
        <p className="eyebrow">Primeiro uso</p>
        <h1>Vamos ajustar a Luna AI para você</h1>
        <p className="muted">Essas informações ficam salvas localmente no seu aparelho usando IndexedDB.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Nome opcional"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ana" /></Field>
          <Field label="Data da última menstruação"><Input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} required /></Field>
          <div className="two-col">
            <Field label="Ciclo médio"><Input type="number" min={15} max={60} value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} /></Field>
            <Field label="Duração média"><Input type="number" min={1} max={15} value={periodDuration} onChange={(e) => setPeriodDuration(Number(e.target.value))} /></Field>
          </div>
          <Field label="Seu ciclo costuma ser regular?">
            <Select value={regularity} onChange={(e) => setRegularity(e.target.value as CycleRegularity)}>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
              <option value="unknown">Não sei</option>
            </Select>
          </Field>
          <Field label="Objetivo principal">
            <Select value={usageGoal} onChange={(e) => setUsageGoal(e.target.value as UsageGoal)}>
              <option value="track">Apenas acompanhar meu ciclo</option>
              <option value="symptoms">Entender sintomas</option>
              <option value="pregnancy">Planejar gravidez</option>
              <option value="avoid">Evitar gravidez</option>
              <option value="other">Outro</option>
            </Select>
          </Field>
          {error ? <p className="error-text">{error}</p> : null}
          <Button full type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Entrar na Luna AI'}</Button>
        </form>
      </Card>
    </div>
  );
}
