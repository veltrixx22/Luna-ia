import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPWAButton() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return <p className="tiny-note">Luna AI instalada neste aparelho.</p>;

  return (
    <Button
      variant="secondary"
      full
      disabled={!promptEvent}
      onClick={async () => {
        if (!promptEvent) return;
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') setInstalled(true);
        setPromptEvent(null);
      }}
    >
      <Download size={18} /> Instalar no celular
    </Button>
  );
}
