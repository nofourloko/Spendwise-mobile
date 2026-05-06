export type TransactionCategory =
  | 'Jedzenie'
  | 'Transport'
  | 'Rozrywka'
  | 'Zdrowie'
  | 'Ubrania'
  | 'Mieszkanie'
  | 'Edukacja'
  | 'Elektronika'
  | 'Sport'
  | 'Inne';

export type TransactionMethod = 'OCR' | 'Manualnie';

export type Transaction = {
  id: string;
  name: string;
  category: TransactionCategory;
  method: TransactionMethod;
  date: Date;
  price: number;
};
