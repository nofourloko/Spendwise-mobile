import { ExpenseInDb } from '../types/expense';
import {Transaction, TransactionCategory} from '../types/transaction';

export function toTransactions(expenses: ExpenseInDb[]): Transaction[] {
  return expenses.map(e => ({
    id: e.id,
    name: e.description || e.category_name,
    category: e.category_name as TransactionCategory,
    method: e.source === 'ocr' ? 'OCR' : 'Manualnie',
    date: new Date(e.expense_date),
    price: -e.amount,
  }));
}