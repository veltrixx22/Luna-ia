import { Card } from '../components/Card';
import { AIChatBox } from '../components/AIChatBox';

export function AIPage() {
  return (
    <div className="screen chat-screen">
      <div className="page-title"><p className="eyebrow">Luna AI</p><h1>Assistente educativo</h1><p className="muted">Conversa local com respostas seguras sobre ciclo menstrual. Não é diagnóstico médico.</p></div>
      <Card className="chat-card"><AIChatBox /></Card>
    </div>
  );
}
