import { FormEvent, useState } from 'react';
import type { CrampsLevel, FlowIntensity, Mood, SymptomLog } from '../types';
import { crampsLabels, flowLabels, moodLabels, symptomsOptions } from '../lib/labels';
import { todayISO } from '../lib/date';
import { Button } from './Button';
import { Field, Select, Textarea } from './Input';

interface SymptomFormProps {
  initial?: Partial<SymptomLog>;
  onSubmit: (value: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
}

export function SymptomForm({ initial, onSubmit }: SymptomFormProps) {
  const [date, setDate] = useState(initial?.date || todayISO());
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>(initial?.flowIntensity || 'none');
  const [crampsLevel, setCrampsLevel] = useState<CrampsLevel>(initial?.crampsLevel || 'none');
  const [mood, setMood] = useState<Mood>(initial?.mood || 'calm');
  const [symptoms, setSymptoms] = useState<string[]>(initial?.symptoms || []);
  const [notes, setNotes] = useState(initial?.notes || '');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit({ date, flowIntensity, crampsLevel, mood, symptoms, notes });
    setSymptoms([]);
    setNotes('');
  }

  function toggleSymptom(symptom: string) {
    setSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]);
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <Field label="Data"><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
      <div className="two-col">
        <Field label="Fluxo">
          <Select value={flowIntensity} onChange={(e) => setFlowIntensity(e.target.value as FlowIntensity)}>
            {Object.entries(flowLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Cólicas">
          <Select value={crampsLevel} onChange={(e) => setCrampsLevel(e.target.value as CrampsLevel)}>
            {Object.entries(crampsLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Humor">
        <Select value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
          {Object.entries(moodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </Field>
      <div className="chip-grid" role="group" aria-label="Sintomas">
        {symptomsOptions.map((symptom) => (
          <button type="button" key={symptom} className={symptoms.includes(symptom) ? 'chip selected' : 'chip'} onClick={() => toggleSymptom(symptom)}>
            {symptom}
          </button>
        ))}
      </div>
      <Field label="Notas"><Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: dor leve à noite, muito cansaço..." /></Field>
      <Button type="submit" full>Salvar sintomas</Button>
    </form>
  );
}
