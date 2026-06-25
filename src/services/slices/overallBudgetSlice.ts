import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

/**
 * Shared, reactive source of truth for the locally-stored overall budget. It
 * lives in Redux (not per-component state) so that editing the budget on the
 * Budgets screen instantly updates anything else that reads it — e.g. the
 * dashboard balance banner. Values are keyed per user and month so switching
 * either does not leak across keys. AsyncStorage remains the persistence layer;
 * this slice only mirrors it in memory.
 */
type OverallBudgetState = {
  /** key (`userId:year-month`) -> budget amount */
  values: Record<string, number>;
  /** key -> whether it has been read from storage already */
  hydrated: Record<string, boolean>;
};

const initialState: OverallBudgetState = {
  values: {},
  hydrated: {},
};

export const overallBudgetKey = (
  userId: string,
  month: number,
  year: number,
) => `${userId}:${year}-${month}`;

export const overallBudgetSlice = createSlice({
  name: 'overallBudget',
  initialState,
  reducers: {
    /** Seed a key from persisted storage (only flips `hydrated`, no write-back). */
    hydrateOverallBudget: (
      state,
      action: PayloadAction<{key: string; value: number}>,
    ) => {
      state.values[action.payload.key] = action.payload.value;
      state.hydrated[action.payload.key] = true;
    },
    /** User-driven change; persistence to storage is handled by the caller. */
    setOverallBudgetValue: (
      state,
      action: PayloadAction<{key: string; value: number}>,
    ) => {
      state.values[action.payload.key] = action.payload.value;
      state.hydrated[action.payload.key] = true;
    },
  },
});

export const {hydrateOverallBudget, setOverallBudgetValue} =
  overallBudgetSlice.actions;
export default overallBudgetSlice.reducer;
