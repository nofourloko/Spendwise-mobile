import type {OcrScanRequest, OcrScanResult, OcrExpenseDraft} from '../types/ocr';

/** Today's date as an ISO `YYYY-MM-DD` string — the default for new expenses. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The single native integration point the OCR feature still needs. Wire this to
 * a camera / image-picker library (e.g. `react-native-image-picker` or
 * `react-native-vision-camera`), capture a receipt photo and return it encoded
 * as base64 plus its MIME type.
 *
 * Returning `null` means "no image" (the user cancelled, or no picker is wired
 * yet) and the screen simply keeps the manual form — so the UI degrades
 * gracefully until the native picker is added.
 */
export async function captureReceiptImage(): Promise<OcrScanRequest | null> {
  // TODO(ocr): integrate a camera / gallery picker and return the encoded image.
  return null;
}

/**
 * Map a backend OCR result onto the string-based expense form. Missing fields
 * fall back to empty values (or today's date) so the user fills the gaps.
 */
export function toExpenseDraft(result: OcrScanResult): OcrExpenseDraft {
  return {
    amount: result.amount != null ? String(result.amount) : '',
    category_id: result.category_id ?? '',
    expense_date: result.expense_date ?? todayIso(),
    description: result.description ?? '',
  };
}
