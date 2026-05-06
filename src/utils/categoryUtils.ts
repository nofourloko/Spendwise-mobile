import { IoniconsName } from '../assets/icons';
import {TransactionCategory} from '../types/transaction';

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Jedzenie: '#00C48C',
  Transport: '#2D7DD2',
  Rozrywka: '#7B2FBE',
  Zdrowie: '#FF4757',
  Ubrania: '#FF6B9D',
  Mieszkanie: '#FF6B35',
  Edukacja: '#00B4D8',
  Elektronika: '#4361EE',
  Sport: '#C8E600',
  Inne: '#8D8D8D',
};

const CATEGORY_ICONS: Record<TransactionCategory, IoniconsName> = {
  Jedzenie: 'cart-outline',
  Transport: 'bus-outline',
  Rozrywka: 'game-controller-outline',
  Zdrowie: 'heart-outline',
  Ubrania: 'shirt-outline',
  Mieszkanie: 'home-outline',
  Edukacja: 'book-outline',
  Elektronika: 'laptop-outline',
  Sport: 'fitness-outline',
  Inne: 'ellipsis-horizontal-outline',
};

export function getCategoryColor(category: TransactionCategory): string {
  return CATEGORY_COLORS[category];
}

export function getCategoryIcon(category: TransactionCategory): IoniconsName {
  return CATEGORY_ICONS[category];
}

export function getCategoryEntries(): {name: TransactionCategory; color: string}[] {
  return (Object.keys(CATEGORY_COLORS) as TransactionCategory[]).map(name => ({
    name,
    color: CATEGORY_COLORS[name],
  }));
}
