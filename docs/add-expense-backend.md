# Add Expense — backend contract

This document lists **everything the backend must provide** for the new
`AddExpense` screen (`src/screens/AddExpense`) to work end-to-end, including the
OCR ("scan a receipt") flow.

The mobile app talks to the API through RTK Query (`src/services/api`). Two
conventions apply to **every** endpoint below:

1. **Auth** — every request carries `Authorization: Bearer <accessToken>`. A
   `401` triggers a single silent refresh against `POST /api/auth/refresh`, then
   the original request is retried. Protect all of these routes.
2. **Response envelope** — successful responses must be wrapped as
   `{ "data": <payload> }`. The client automatically unwraps `.data`, so the
   shapes below describe the value of that `data` field. Errors should return a
   non-2xx status with `{ "message": "<human readable>" }` (or `{ "error": ... }`).

Base URL used in development: `http://10.0.2.2:3000/api` (Android emulator →
host machine). See `src/services/api/index.ts`.

---

## 1. `GET /api/categories` — list categories (already used)

Populates the category picker. The screen cannot submit until a category is
selected, so this must return the user's selectable categories.

**Response** (`data`): `Category[]`

```ts
type Category = {
  id: string;     // UUID — sent back as `category_id` when creating an expense
  name: string;   // display label, e.g. "Jedzenie"
  icon: string;   // Ionicons name, e.g. "cart-outline"
  color: string;  // hex colour, e.g. "#00C48C"
};
```

> Already consumed elsewhere in the app; listed here because the form depends on
> it. No changes needed if it already returns the shape above.

---

## 2. `POST /api/expenses` — create an expense (manual **and** OCR)

Called when the user taps **Zapisz wydatek**. Used for both manually typed
expenses and OCR-prefilled ones (only the `source` field differs).

**Request body** (`CreateExpensePayload`, see `src/types/expense.ts`):

```ts
{
  user_id: string;            // UUID of the owner
  category_id: string;        // UUID, must reference an existing category
  amount: number;             // > 0, already parsed to a number (max 2 decimals)
  description?: string;       // optional; omitted entirely when blank
  expense_date: string;       // ISO date "YYYY-MM-DD" (never in the future)
  source?: 'manual' | 'ocr';  // defaults to 'manual' if absent
}
```

**Validation the backend must enforce** (client validates too, but never trust
the client):

- `category_id` belongs to the authenticated user / is a valid category.
- `amount` is a positive number.
- `expense_date` is a valid `YYYY-MM-DD` and not in the future.
- `source` is one of `manual` | `ocr` (default `manual`).
- `user_id` matches the authenticated user (or is derived from the token —
  preferred — rather than trusted from the body).

**Response** (`data`): the persisted expense, `ExpenseInDb`:

```ts
{
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date: string;        // "YYYY-MM-DD"
  source: 'manual' | 'ocr';
  created_at: string;          // ISO timestamp
  category_name: string;       // denormalised for list rendering
  category_icon: string;
  category_color: string;
}
```

> The client invalidates the `EXPENSES` and `EXPENSE_SUMMARY` caches on success,
> so the Dashboard / Expenses lists refetch automatically. Make sure those list
> endpoints reflect the new row immediately.

---

## 3. `POST /api/expenses/ocr/scan` — parse a receipt (NEW, required for OCR)

This is the **new endpoint** the OCR flow needs. It receives a receipt image,
runs OCR, and returns a best-effort parsed draft. It must **not** persist
anything — the user reviews the prefilled form and then calls
`POST /api/expenses` (with `source: 'ocr'`) to actually save.

**Request body** (`OcrScanRequest`, see `src/types/ocr.ts`):

```ts
{
  image: string;     // base64-encoded image bytes, WITHOUT the "data:" prefix
  mimeType: string;  // e.g. "image/jpeg" or "image/png"
}
```

> The client currently sends base64 JSON for simplicity. If you would rather
> accept `multipart/form-data` (raw file upload), tell us and we will adjust
> `scanReceipt` in `src/services/api/expensesApi.ts` and the
> `captureReceiptImage` util — the screen logic stays the same.

**What the backend should do:**

1. Decode the image and run it through an OCR / receipt-parsing pipeline
   (e.g. a cloud OCR service or a receipt-understanding model).
2. Extract: total **amount**, purchase **date**, and a **merchant / summary**
   for the description.
3. **Resolve a category**: map the merchant / line items to one of the user's
   categories and return its `category_id`. If no confident match, return
   `null` so the user picks one.
4. Return a **confidence** score so the UI can later flag low-confidence parses.
5. Leave any field it cannot read confidently as `null` — the user fills the gaps.

**Response** (`data`): `OcrScanResult`:

```ts
{
  amount: number | null;        // detected total, or null
  category_id: string | null;   // resolved category UUID, or null
  expense_date: string | null;  // "YYYY-MM-DD", or null
  description: string | null;    // merchant / summary, or null
  confidence: number;            // 0..1, overall parse confidence
  raw_text?: string;             // optional full OCR text (debugging / corrections)
}
```

**Error handling:** if OCR fails (unreadable image, downstream service down),
return a non-2xx with `{ "message": "..." }`. The screen shows a friendly alert
and the user can still fill the form manually.

---

## Remaining client-side work for full OCR (not backend)

The only missing piece on the app side is the **native image capture**. It is
isolated in one function — `captureReceiptImage()` in `src/utils/ocr.ts` — which
currently returns `null` (so the button shows "coming soon" and the manual form
keeps working). To finish OCR end-to-end:

1. Add a camera / gallery picker dependency
   (`react-native-image-picker` or `react-native-vision-camera`).
2. Implement `captureReceiptImage()` to capture a photo and return
   `{ image: <base64>, mimeType: <type> }`.

Once that returns a real image, the existing flow (`scanReceipt` →
`toExpenseDraft` → prefill form → `createExpense` with `source: 'ocr'`) works
without further changes.

---

## Quick checklist for backend

- [ ] `GET /api/categories` returns `Category[]` (id, name, icon, color).
- [ ] `POST /api/expenses` accepts `CreateExpensePayload`, validates it, and
      returns `ExpenseInDb` (with denormalised `category_*` fields).
- [ ] `POST /api/expenses/ocr/scan` accepts `{ image, mimeType }` and returns
      `OcrScanResult` **without persisting**.
- [ ] All three are auth-protected and return the `{ data: ... }` envelope.
- [ ] Creating an expense is reflected in the expenses list & summary endpoints.
