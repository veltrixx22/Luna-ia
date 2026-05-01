import type { Cycle, Prediction } from '../types';
import { addDays, formatShortDate, parseISODate, todayISO, toISODate } from '../lib/date';

function daysBetween(start: string, end: string): string[] {
  const days: string[] = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

export function CalendarCycleView({ cycles, prediction }: { cycles: Cycle[]; prediction: Prediction | null }) {
  const today = todayISO();
  const startDate = addDays(today, -15);
  const days = Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
  const periodDays = new Set<string>();
  const predictedDays = new Set<string>();
  const fertileDays = new Set<string>();

  cycles.forEach((cycle) => {
    const end = cycle.periodEndDate || addDays(cycle.periodStartDate, Math.max(0, (cycle.periodDuration || 5) - 1));
    daysBetween(cycle.periodStartDate, end).forEach((day) => periodDays.add(day));
  });

  if (prediction) {
    daysBetween(prediction.nextPeriodDate, addDays(prediction.nextPeriodDate, 4)).forEach((day) => predictedDays.add(day));
    daysBetween(prediction.fertileWindowStart, prediction.fertileWindowEnd).forEach((day) => fertileDays.add(day));
  }

  return (
    <div className="calendar-card">
      <div className="calendar-strip">
        {days.map((day) => {
          const date = parseISODate(day);
          const classes = [
            'calendar-day',
            day === today ? 'is-today' : '',
            periodDays.has(day) ? 'is-period' : '',
            predictedDays.has(day) ? 'is-predicted' : '',
            fertileDays.has(day) ? 'is-fertile' : ''
          ].join(' ');
          return (
            <div key={day} className={classes} title={toISODate(date)}>
              <small>{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small>
              <strong>{date.getDate()}</strong>
            </div>
          );
        })}
      </div>
      <div className="legend">
        <span><i className="dot period" /> Menstruação</span>
        <span><i className="dot fertile" /> Fértil</span>
        <span><i className="dot predicted" /> Próximo período</span>
      </div>
      {prediction ? <p className="tiny-note">Próximo período estimado: {formatShortDate(prediction.nextPeriodDate)}</p> : null}
    </div>
  );
}
