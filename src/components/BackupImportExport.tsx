import { ChangeEvent, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportData, importData, validateBackup } from '../lib/db';
import { todayISO } from '../lib/date';
import { Button } from './Button';
import { Modal } from './Modal';

export function BackupImportExport({ onImported }: { onImported: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingData, setPendingData] = useState<unknown>(null);
  const [error, setError] = useState('');

  async function handleExport() {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luna-ai-backup-${todayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const parsed = JSON.parse(await file.text());
      validateBackup(parsed);
      setPendingFile(file);
      setPendingData(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível importar este arquivo.');
    } finally {
      event.target.value = '';
    }
  }

  return (
    <div className="backup-box">
      <Button variant="secondary" full onClick={handleExport}><Download size={18} /> Exportar backup</Button>
      <Button variant="ghost" full onClick={() => inputRef.current?.click()}><Upload size={18} /> Importar backup</Button>
      <input ref={inputRef} hidden type="file" accept="application/json" onChange={handleFile} />
      {error ? <p className="error-text">{error}</p> : null}
      <Modal
        open={Boolean(pendingFile)}
        title="Substituir dados atuais?"
        description={`Você está importando ${pendingFile?.name}. Isso vai substituir os dados salvos neste aparelho.`}
        confirmLabel="Importar backup"
        onClose={() => { setPendingFile(null); setPendingData(null); }}
        onConfirm={async () => {
          if (!pendingData) return;
          await importData(validateBackup(pendingData));
          setPendingFile(null);
          setPendingData(null);
          onImported();
        }}
      />
    </div>
  );
}
