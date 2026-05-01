import { CalendarHeart, Sparkles } from 'lucide-react';
import type { Prediction } from '../types';
import { formatDate, formatShortDate } from '../lib/date';
import { Card } from './Card';

export function CycleSummaryCard({ prediction }: { prediction: Prediction | null }) {
  if (!prediction) {
    return (
      <Card className="hero-summary">
        <div className="summary-icon"><CalendarHeart size={28} /></div>
        <h2>Comece registrando seu ciclo</h2>
        <p>Com a última menstruação, a Luna AI consegue estimar próximo período, ovulação e janela fértil.</p>
      </Card>
    );
  }

  return (
    <Card className="hero-summary">
      <div className="summary-topline"><Sparkles size={18} /> Previsão estimada</div>
      <div className="cycle-day">Dia {prediction.currentCycleDay}</div>
      <p className="summary-main">
        {prediction.daysUntilNextPeriod >= 0
          ? `Faltam ${prediction.daysUntilNextPeriod} dia(s) para a próxima menstruação.`
          : `A próxima menstruação estava prevista há ${Math.abs(prediction.daysUntilNextPeriod)} dia(s).`}
      </p>
      <div className="summary-grid">
        <span><strong>Próximo período</strong>{formatDate(prediction.nextPeriodDate)}</span>
        <span><strong>Ovulação</strong>{formatDate(prediction.ovulationDate)}</span>
        <span><strong>Janela fértil</strong>{formatShortDate(prediction.fertileWindowStart)} – {formatShortDate(prediction.fertileWindowEnd)}</span>
      </div>
      <small>Estimativas baseadas nos dados informados. Não use como método médico ou contraceptivo.</small>
    </Card>
  );
}
