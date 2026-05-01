import type { AiMessage, Cycle, LunaBackup, Profile, Settings, SymptomLog } from '../types';

const DB_NAME = 'luna_ai_local_db';
const DB_VERSION = 1;
const SETTINGS_ID = 'default';
const PROFILE_ID = 'default';

type StoreName = 'profile' | 'cycles' | 'symptomLogs' | 'aiMessages' | 'settings';

function now(): string {
  return new Date().toISOString();
}

export function createId(prefix = 'item'): string {
  const random = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `${prefix}_${random}`;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Erro no IndexedDB.'));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Erro ao salvar dados locais.'));
    tx.onabort = () => reject(tx.error || new Error('Operação cancelada no IndexedDB.'));
  });
}

export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

export function initDB(): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error('Não foi possível acessar o armazenamento local deste navegador.'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('cycles')) {
        const store = db.createObjectStore('cycles', { keyPath: 'id' });
        store.createIndex('periodStartDate', 'periodStartDate');
      }
      if (!db.objectStoreNames.contains('symptomLogs')) {
        const store = db.createObjectStore('symptomLogs', { keyPath: 'id' });
        store.createIndex('date', 'date');
      }
      if (!db.objectStoreNames.contains('aiMessages')) {
        const store = db.createObjectStore('aiMessages', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Erro ao abrir banco local.'));
  });
}

async function getStore(storeName: StoreName, mode: IDBTransactionMode = 'readonly') {
  const db = await initDB();
  const tx = db.transaction(storeName, mode);
  return { db, tx, store: tx.objectStore(storeName) };
}

async function getAll<T>(storeName: StoreName): Promise<T[]> {
  const { db, store } = await getStore(storeName);
  try {
    return await requestToPromise<T[]>(store.getAll());
  } finally {
    db.close();
  }
}

async function put<T extends { id: string; createdAt?: string; updatedAt?: string }>(storeName: StoreName, value: T): Promise<T> {
  const { db, tx, store } = await getStore(storeName, 'readwrite');
  try {
    store.put(value);
    await txDone(tx);
    return value;
  } finally {
    db.close();
  }
}

async function remove(storeName: StoreName, id: string): Promise<void> {
  const { db, tx, store } = await getStore(storeName, 'readwrite');
  try {
    store.delete(id);
    await txDone(tx);
  } finally {
    db.close();
  }
}

export async function getProfile(): Promise<Profile | null> {
  const { db, store } = await getStore('profile');
  try {
    return (await requestToPromise<Profile | undefined>(store.get(PROFILE_ID))) || null;
  } finally {
    db.close();
  }
}

export async function saveProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
  const timestamp = now();
  return put('profile', { ...profile, id: PROFILE_ID, createdAt: timestamp, updatedAt: timestamp });
}

export async function updateProfile(profile: Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Profile> {
  const current = await getProfile();
  const timestamp = now();
  const updated: Profile = {
    id: PROFILE_ID,
    name: '',
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    cycleRegularity: 'unknown',
    usageGoal: 'track',
    createdAt: current?.createdAt || timestamp,
    updatedAt: timestamp,
    ...current,
    ...profile
  };
  return put('profile', updated);
}

export async function getCycles(): Promise<Cycle[]> {
  return (await getAll<Cycle>('cycles')).sort((a, b) => b.periodStartDate.localeCompare(a.periodStartDate));
}

export async function addCycle(cycle: Omit<Cycle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cycle> {
  const timestamp = now();
  const cycleLength = cycle.cycleLength;
  return put('cycles', { ...cycle, cycleLength, id: createId('cycle'), createdAt: timestamp, updatedAt: timestamp });
}

export async function updateCycle(id: string, cycle: Partial<Omit<Cycle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Cycle> {
  const cycles = await getCycles();
  const current = cycles.find((item) => item.id === id);
  if (!current) throw new Error('Registro de ciclo não encontrado.');
  const updated: Cycle = { ...current, ...cycle, updatedAt: now() };
  return put('cycles', updated);
}

export async function deleteCycle(id: string): Promise<void> {
  return remove('cycles', id);
}

export async function getSymptomLogs(): Promise<SymptomLog[]> {
  return (await getAll<SymptomLog>('symptomLogs')).sort((a, b) => b.date.localeCompare(a.date));
}

export async function addSymptomLog(log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<SymptomLog> {
  const timestamp = now();
  return put('symptomLogs', { ...log, id: createId('symptom'), createdAt: timestamp, updatedAt: timestamp });
}

export async function updateSymptomLog(id: string, log: Partial<Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SymptomLog> {
  const logs = await getSymptomLogs();
  const current = logs.find((item) => item.id === id);
  if (!current) throw new Error('Registro de sintomas não encontrado.');
  return put('symptomLogs', { ...current, ...log, updatedAt: now() });
}

export async function deleteSymptomLog(id: string): Promise<void> {
  return remove('symptomLogs', id);
}

export async function getMessages(): Promise<AiMessage[]> {
  return (await getAll<AiMessage>('aiMessages')).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addMessage(message: Omit<AiMessage, 'id' | 'createdAt'>): Promise<AiMessage> {
  return put('aiMessages', { ...message, id: createId('msg'), createdAt: now() });
}

export async function clearMessages(): Promise<void> {
  const messages = await getMessages();
  await Promise.all(messages.map((message) => remove('aiMessages', message.id)));
}

export async function getSettings(): Promise<Settings> {
  const { db, store } = await getStore('settings');
  try {
    const found = await requestToPromise<Settings | undefined>(store.get(SETTINGS_ID));
    if (found) return found;
  } finally {
    db.close();
  }
  return saveSettings({ theme: 'system', onboardingCompleted: false, installPromptDismissed: false });
}

export async function saveSettings(settings: Partial<Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Settings> {
  const current = await (async () => {
    try {
      const { db, store } = await getStore('settings');
      try {
        return await requestToPromise<Settings | undefined>(store.get(SETTINGS_ID));
      } finally {
        db.close();
      }
    } catch {
      return undefined;
    }
  })();
  const timestamp = now();
  return put('settings', {
    id: SETTINGS_ID,
    theme: 'system',
    onboardingCompleted: false,
    installPromptDismissed: false,
    createdAt: current?.createdAt || timestamp,
    updatedAt: timestamp,
    ...current,
    ...settings
  });
}

export async function exportData(): Promise<LunaBackup> {
  return {
    app: 'Luna AI',
    version: 1,
    exportedAt: now(),
    profile: await getProfile(),
    cycles: await getCycles(),
    symptomLogs: await getSymptomLogs(),
    aiMessages: await getMessages(),
    settings: await getSettings()
  };
}

export function validateBackup(input: unknown): LunaBackup {
  const data = input as Partial<LunaBackup>;
  if (!data || data.app !== 'Luna AI' || data.version !== 1) {
    throw new Error('Arquivo de backup inválido ou incompatível.');
  }
  if (!Array.isArray(data.cycles) || !Array.isArray(data.symptomLogs) || !Array.isArray(data.aiMessages)) {
    throw new Error('O backup está corrompido ou incompleto.');
  }
  return data as LunaBackup;
}

export async function importData(data: LunaBackup): Promise<void> {
  const backup = validateBackup(data);
  const db = await initDB();
  const tx = db.transaction(['profile', 'cycles', 'symptomLogs', 'aiMessages', 'settings'], 'readwrite');
  try {
    tx.objectStore('profile').clear();
    tx.objectStore('cycles').clear();
    tx.objectStore('symptomLogs').clear();
    tx.objectStore('aiMessages').clear();
    tx.objectStore('settings').clear();
    if (backup.profile) tx.objectStore('profile').put(backup.profile);
    backup.cycles.forEach((cycle) => tx.objectStore('cycles').put(cycle));
    backup.symptomLogs.forEach((log) => tx.objectStore('symptomLogs').put(log));
    backup.aiMessages.forEach((message) => tx.objectStore('aiMessages').put(message));
    if (backup.settings) tx.objectStore('settings').put(backup.settings);
    await txDone(tx);
  } finally {
    db.close();
  }
}

export async function clearAllData(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(['profile', 'cycles', 'symptomLogs', 'aiMessages', 'settings'], 'readwrite');
  try {
    tx.objectStore('profile').clear();
    tx.objectStore('cycles').clear();
    tx.objectStore('symptomLogs').clear();
    tx.objectStore('aiMessages').clear();
    tx.objectStore('settings').clear();
    await txDone(tx);
  } finally {
    db.close();
  }
}
