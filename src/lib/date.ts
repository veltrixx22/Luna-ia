const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(value: string | Date, days: number): string {
  const date = typeof value === 'string' ? parseISODate(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function diffDays(a: string | Date, b: string | Date): number {
  const first = typeof a === 'string' ? parseISODate(a) : a;
  const second = typeof b === 'string' ? parseISODate(b) : b;
  const start = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const end = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();
  return Math.round((end - start) / MS_PER_DAY);
}

export function formatDate(value?: string): string {
  if (!value) return 'Não informado';
  return parseISODate(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatShortDate(value?: string): string {
  if (!value) return '—';
  return parseISODate(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
