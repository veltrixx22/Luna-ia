import { FormEvent, useState } from 'react';
import type { CycleRegularity, Profile, UsageGoal } from '../types';
import { BackupImportExport } from '../components/BackupImportExport';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/Input';
import { Modal } from '../components/Modal';
import { clearAllData, updateProfile } from '../lib/db';

export function ProfilePage({ profile, refresh, navigate }: { profile: Profile | null; refresh: () => Promise<void>; navigate: (path: string) => void }) {
  const [name, setName] = useState(profile?.name || '');
  const [cycleLength, setCycleLength] = useState(profile?.averageCycleLength || 28);
  const [periodDuration, setPeriodDuration] = useState(profile?.averagePeriodDuration || 5);
  const [regularity, setRegularity] = useState<CycleRegularity>(profile?.cycleRegularity || 'unknown');
  const [usageGoal, setUsageGoal] = useState<UsageGoal>(profile?.usageGoal || 'track');
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await updateProfile({ name, averageCycleLength: cycleLength, averagePeriodDuration: periodDuration, cycleRegularity: regularity, usageGoal });
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="screen">
      <div className="page-title"><p className="eyebrow">Perfil</p><h1>Suas preferências</h1><p className="muted">Edite médias do ciclo, objetivo de uso e backup local.</p></div>
      <Card>
        <h2>Dados do ciclo</h2>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Nome opcional"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <div className="two-col">
            <Field label="Ciclo médio"><Input type="number" min={15} max={60} value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} /></Field>
            <Field label="Duração média"><Input type="number" min={1} max={15} value={periodDuration} onChange={(e) => setPeriodDuration(Number(e.target.value))} /></Field>
          </div>
          <Field label="Regularidade"><Select value={regularity} onChange={(e) => setRegularity(e.target.value as CycleRegularity)}><option value="regular">Regular</option><option value="irregular">Irregular</option><option value="unknown">Não sei</option></Select></Field>
          <Field label="Objetivo"><Select value={usageGoal} onChange={(e) => setUsageGoal(e.target.value as UsageGoal)}><option value="track">Apenas acompanhar meu ciclo</option><option value="symptoms">Entender sintomas</option><option value="pregnancy">Planejar gravidez</option><option value="avoid">Evitar gravidez</option><option value="other">Outro</option></Select></Field>
          <Button type="submit" full>Salvar perfil</Button>
          {saved ? <p className="success-text">Perfil salvo neste aparelho.</p> : null}
        </form>
      </Card>
      <Card>
        <h2>Backup e dados</h2>
        <p className="muted">Exporte uma cópia JSON para guardar seus registros. Importar backup substitui os dados atuais.</p>
        <BackupImportExport onImported={async () => { await refresh(); navigate('/dashboard'); }} />
        <Button variant="danger" full onClick={() => setConfirmClear(true)}>Limpar todos os dados</Button>
      </Card>
      <Modal open={confirmClear} title="Resetar Luna AI?" description="Isso apaga perfil, ciclos, sintomas, mensagens e configurações salvos neste navegador." danger confirmLabel="Apagar tudo" onClose={() => setConfirmClear(false)} onConfirm={async () => { await clearAllData(); await refresh(); setConfirmClear(false); navigate('/'); }} />
    </div>
  );
}
