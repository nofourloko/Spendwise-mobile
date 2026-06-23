/**
 * Lightweight, framework-agnostic validators for the auth forms. Each returns a
 * Polish error message or `null` when the value is valid, so screens can stay
 * declarative and free of validation logic.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Podaj adres e-mail';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Nieprawidłowy adres e-mail';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Podaj hasło';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków`;
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'Podaj imię i nazwisko';
  }
  if (name.trim().length < 2) {
    return 'Imię jest za krótkie';
  }
  return null;
}

export function validatePasswordConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) {
    return 'Powtórz hasło';
  }
  if (password !== confirm) {
    return 'Hasła nie są takie same';
  }
  return null;
}
