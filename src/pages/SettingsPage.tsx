import { useState } from 'react';
import type { Settings, ThemePreference } from '../types';
import { BackupImportExport } from '../components/BackupImportExport';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InstallPWAButton } from '../components/InstallPWAButton';
import { Field, Select } from '../components/Input';
import { Modal } from '../components/Modal';
import { clearAllData, saveSettings } from '../lib/db';

export function SettingsPage({ settings, refresh, navigate }: { settings: Settings | null; refresh: () => Promise<void>; navigate: (path: string) => void }) {
  const [theme, setTheme] = useState<ThemePreference>(settings?.theme || 'system');
  const [confirmClear, setConfirmClear] = useState(false);

  async function changeTheme(value: ThemePreference) {
    setTheme(value);
    await saveSettings({ theme: value });
    document.documentElement.dataset.theme = value;
    await refresh();
  }

  return (
    <div className="screen">
      <div className="page-title"><p className="eyebrow">Configurações</p><h1>Privacidade e app</h1><p className="muted">Controle instalação, backup e aparência da Luna AI.</p></div>
      <Card>
        <h2>Aparência</h2>
        <Field label="Tema"><Select value={theme} onChange={(e) => changeTheme(e.target.value as ThemePreference)}><option value="system">Automático</option><option value="light">Claro</option><option value="dark">Escuro</option></Select></Field>
      </Card>
      <Card>
        <h2>Instalar como app</h2>
        <p className="muted">No Android, você pode instalar a Luna AI na tela inicial e usar como PWA.</p>
        <InstallPWAButton />
      </Card>
      <Card>
        <h2>Privacidade local</h2>
        <p>Seus dados ficam salvos localmente neste aparelho, usando o armazenamento do navegador. A Luna AI não envia seus registros para um banco externo. Se você limpar os dados do navegador, trocar de aparelho ou desinstalar o app, seus dados podem ser perdidos. Use a opção de exportar backup para guardar uma cópia.</p>
      </Card>
      <Card>
        <h2>Aviso médico</h2>
        <p>A Luna AI oferece informações educativas e estimativas com base nos dados informados. Ela não substitui médicos, exames, diagnósticos ou tratamentos profissionais.</p>
      </Card>
      <Card>
        <h2>Backup</h2>
        <BackupImportExport onImported={async () => { await refresh(); navigate('/dashboard'); }} />
        <Button variant="danger" full onClick={() => setConfirmClear(true)}>Limpar todos os dados</Button>
      </Card>
      <Modal open={confirmClear} title="Apagar dados locais?" description="Todos os dados salvos neste navegador serão removidos. Essa ação não pode ser desfeita sem um backup." danger confirmLabel="Apagar tudo" onClose={() => setConfirmClear(false)} onConfirm={async () => { await clearAllData(); await refresh(); setConfirmClear(false); navigate('/'); }} />
    </div>
  );
}
