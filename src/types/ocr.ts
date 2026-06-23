/**
 * Types for the receipt-OCR flow. The screen captures a receipt image, sends it
 * to the backend OCR endpoint and receives an `OcrScanResult` that is mapped
 * onto the regular expense form so the user can review and confirm before
 * saving. None of these touch the persisted expense shape — they only describe
 * the transient scan-and-prefill step.
 */

export type OcrScanStatus = 'idle' | 'scanning' | 'success' | 'error';

/** Image payload sent to the OCR endpoint. */
export type OcrScanRequest = {
  /** Base64-encoded image bytes (without the `data:` URI prefix). */
  image: string;
  /** MIME type of the encoded image, e.g. `image/jpeg`. */
  mimeType: string;
};

/**
 * Parsed receipt returned by the backend OCR pipeline. Every field is nullable
 * because OCR is best-effort: anything the model cannot read confidently is left
 * for the user to fill in manually.
 */
export type OcrScanResult = {
  /** Detected total amount, or `null` if it could not be read. */
  amount: number | null;
  /**
   * Category id the backend resolved against the user's categories (best guess),
   * or `null` when no confident match was found.
   */
  category_id: string | null;
  /** Detected purchase date as ISO `YYYY-MM-DD`, or `null`. */
  expense_date: string | null;
  /** Merchant name / line-item summary used to prefill the description. */
  description: string | null;
  /** Model confidence in the overall parse, `0..1`. */
  confidence: number;
  /** Full recognised text, kept for debugging and manual correction. */
  raw_text?: string;
};

/** OCR result mapped onto the string-based expense form fields. */
export type OcrExpenseDraft = {
  amount: string;
  category_id: string;
  expense_date: string;
  description: string;
};
