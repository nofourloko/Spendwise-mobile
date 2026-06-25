import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {overallBudgetStorage} from '../services/budget/overallBudgetStorage';
import {
  hydrateOverallBudget,
  overallBudgetKey,
  setOverallBudgetValue,
} from '../services/slices/overallBudgetSlice';

/**
 * Reads and persists the overall budget for the given user and month, backed by
 * a shared Redux slice so every consumer (Budgets screen, dashboard banner)
 * stays in sync: a change anywhere re-renders them all. The value is hydrated
 * from AsyncStorage on first access for a key and written through on update.
 */
export default function useOverallBudget(
  userId: string | undefined,
  month: number,
  year: number,
) {
  const dispatch = useAppDispatch();
  const key = userId ? overallBudgetKey(userId, month, year) : null;

  const value = useAppSelector(state =>
    key ? state.overallBudget.values[key] ?? 0 : 0,
  );
  const hydrated = useAppSelector(state =>
    key ? !!state.overallBudget.hydrated[key] : true,
  );

  useEffect(() => {
    if (!key || !userId || hydrated) {
      return;
    }
    let active = true;
    overallBudgetStorage.load(userId, month, year).then(stored => {
      if (active) {
        dispatch(hydrateOverallBudget({key, value: stored ?? 0}));
      }
    });
    return () => {
      active = false;
    };
  }, [key, userId, month, year, hydrated, dispatch]);

  const setValue = useCallback(
    (next: number) => {
      if (!key || !userId) {
        return;
      }
      const safe = Math.max(0, Math.round(next));
      dispatch(setOverallBudgetValue({key, value: safe}));
      overallBudgetStorage.save(userId, month, year, safe);
    },
    [key, userId, month, year, dispatch],
  );

  return {value, setValue, loaded: hydrated};
}
