import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The backend only models per-category limits, so the user-defined "overall
 * budget" (a master cap the categories draw from) has nowhere to live server
 * side. We persist it on the device instead, scoped per user and per month, and
 * hide AsyncStorage behind this small interface — mirroring `tokenStorage` — so
 * callers stay decoupled from the storage engine.
 */
const keyFor = (userId: string, month: number, year: number) =>
  `@spendwise/overall_budget/${userId}/${year}-${month}`;

async function load(
  userId: string,
  month: number,
  year: number,
): Promise<number | null> {
  const raw = await AsyncStorage.getItem(keyFor(userId, month, year));
  if (raw == null) {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

async function save(
  userId: string,
  month: number,
  year: number,
  value: number,
): Promise<void> {
  await AsyncStorage.setItem(keyFor(userId, month, year), String(value));
}

export const overallBudgetStorage = {load, save};
