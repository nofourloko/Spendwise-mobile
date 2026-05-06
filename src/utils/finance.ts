export function calculateSaldo(budget: number, expenses: number): number {
  return budget - expenses;
}

export function formatCurrency(amount: number): string {
  return (
    new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' zł'
  );
}
