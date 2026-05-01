import type { Cycle, Prediction, Profile, SymptomLog } from '../types';
import { addDays, diffDays, todayISO } from './date';

export function sortCycles(cycles: Cycle[]): Cycle[] {
  return [...cycles].sort((a, b) => b.periodStartDate.localeCompare(a.periodStartDate));
}

export function getLatestCycle(cycles: Cycle[]): Cycle | undefined {
  return sortCycles(cycles)[0];
}

export function calculatePeriodDuration(start: string, end?: string): number | undefined {
  if (!end) return undefined;
  const duration = diffDays(start, end) + 1;
  return duration > 0 ? duration : undefined;
}

export function buildPrediction(profile: Profile | null | undefined, cycles: Cycle[]): Prediction | null {
  const latest = getLatestCycle(cycles);
  if (!profile || !latest) return null;

  let nextPeriodDate = addDays(latest.periodStartDate, profile.averageCycleLength);
  const today = todayISO();
  while (diffDays(today, nextPeriodDate) < -profile.averageCycleLength) {
    nextPeriodDate = addDays(nextPeriodDate, profile.averageCycleLength);
  }

  const daysSinceStart = diffDays(latest.periodStartDate, today) + 1;
  const cycleDay = Math.max(1, ((daysSinceStart - 1) % profile.averageCycleLength) + 1);
  const ovulationDate = addDays(nextPeriodDate, -14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  return {
    currentCycleDay: cycleDay,
    nextPeriodDate,
    daysUntilNextPeriod: diffDays(today, nextPeriodDate),
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd
  };
}

export function getAverageCycleLength(cycles: Cycle[], fallback = 28): number {
  const sorted = [...cycles].sort((a, b) => a.periodStartDate.localeCompare(b.periodStartDate));
  if (sorted.length < 2) return fallback;
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const interval = diffDays(sorted[i - 1].periodStartDate, sorted[i].periodStartDate);
    if (interval >= 15 && interval <= 60) intervals.push(interval);
  }
  if (!intervals.length) return fallback;
  return Math.round(intervals.reduce((sum, item) => sum + item, 0) / intervals.length);
}

export function getAveragePeriodDuration(cycles: Cycle[], fallback = 5): number {
  const durations = cycles.map((cycle) => cycle.periodDuration).filter((duration): duration is number => Boolean(duration && duration > 0));
  if (!durations.length) return fallback;
  return Math.round(durations.reduce((sum, item) => sum + item, 0) / durations.length);
}

export function getMostCommonSymptoms(logs: SymptomLog[], limit = 5): { name: string; count: number }[] {
  const counter = new Map<string, number>();
  logs.forEach((log) => log.symptoms.forEach((symptom) => counter.set(symptom, (counter.get(symptom) || 0) + 1)));
  return [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, count]) => ({ name, count }));
}

export function getMoodPatterns(logs: SymptomLog[]): { name: string; count: number }[] {
  const labels: Record<string, string> = {
    happy: 'Feliz',
    sad: 'Triste',
    irritated: 'Irritada',
    anxious: 'Ansiosa',
    calm: 'Calma',
    tired: 'Cansada'
  };
  const counter = new Map<string, number>();
  logs.forEach((log) => counter.set(labels[log.mood] || log.mood, (counter.get(labels[log.mood] || log.mood) || 0) + 1));
  return [...counter.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}
