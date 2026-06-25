import type {OcrScanResult, OcrExpenseDraft} from '../types/ocr';

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function toExpenseDraft(result: OcrScanResult): OcrExpenseDraft {
  return {
    amount: result.amount != null ? String(result.amount) : '',
    category_id: result.category_id ?? '',
    expense_date: result.expense_date ?? todayIso(),
    description: result.description ?? '',
  };
}
