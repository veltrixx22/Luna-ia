import { Heart, LockKeyhole, Moon, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Welcome({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="welcome-page">
      <div className="hero-orb orb-one" />
      <div className="hero-orb orb-two" />
      <section className="welcome-card">
        <div className="logo-mark"><Moon size={34} /></div>
        <p className="eyebrow">Luna AI</p>
        <h1>Seu ciclo, seus sintomas e sua saúde íntima com mais clareza.</h1>
        <p className="hero-subtitle">Acompanhe sua menstruação, sintomas e previsões diretamente no seu celular, sem precisar criar conta.</p>
        <div className="welcome-actions">
          <Button full onClick={() => navigate('/onboarding')}>Começar agora</Button>
          <Button full variant="secondary" onClick={() => navigate('/dashboard')}>Já uso a Luna AI</Button>
        </div>
      </section>

      <div className="info-grid">
        <Card className="soft-info"><LockKeyhole size={20} /><strong>Privacidade local</strong><p>Seus dados ficam salvos apenas neste aparelho.</p></Card>
        <Card className="soft-info"><ShieldCheck size={20} /><strong>Sem login</strong><p>Abra, registre e acompanhe. Sem email, senha ou conta.</p></Card>
        <Card className="soft-info"><Heart size={20} /><strong>Cuidado educativo</strong><p>A Luna AI oferece informações educativas e estimativas. Ela não substitui médicos, exames ou tratamentos profissionais.</p></Card>
      </div>
    </div>
  );
}
