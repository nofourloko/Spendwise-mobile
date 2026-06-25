import {useState, useCallback} from 'react';

const now = new Date();

export type MonthYear = {
  month: number;
  year: number;
};

export default function useBudgetMonth() {
  const [selected, setSelected] = useState<MonthYear>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const select = useCallback((month: number, year: number) => {
    setSelected({month, year});
  }, []);

  const label = new Date(selected.year, selected.month - 1).toLocaleDateString(
    'pl-PL',
    {month: 'long', year: 'numeric'},
  );

  return {selected, select, label};
}
