import { VALIDATION } from '../config/constants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push('Имя пользователя обязательно');
    return { valid: false, errors };
  }

  const trimmed = username.trim();

  if (trimmed.length < VALIDATION.USERNAME_MIN_LENGTH) {
    errors.push(
      `Имя пользователя должно быть не менее ${VALIDATION.USERNAME_MIN_LENGTH} символов`
    );
  }

  if (trimmed.length > VALIDATION.USERNAME_MAX_LENGTH) {
    errors.push(
      `Имя пользователя должно быть не более ${VALIDATION.USERNAME_MAX_LENGTH} символов`
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    errors.push(
      'Имя пользователя может содержать только буквы, цифры и подчеркивания'
    );
  }

  return { valid: errors.length === 0, errors };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password || password.length === 0) {
    errors.push('Пароль обязателен');
    return { valid: false, errors };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(
      `Пароль должен быть не менее ${VALIDATION.PASSWORD_MIN_LENGTH} символов`
    );
  }

  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    errors.push(
      `Пароль должен быть не более ${VALIDATION.PASSWORD_MAX_LENGTH} символов`
    );
  }

  return { valid: errors.length === 0, errors };
}

export function validatePasswordConfirm(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = [];

  if (password !== confirmPassword) {
    errors.push('Пароли не совпадают');
  }

  return { valid: errors.length === 0, errors };
}


export function validateBio(bio: string): ValidationResult {
  const errors: string[] = [];

  if (bio.length > VALIDATION.BIO_MAX_LENGTH) {
    errors.push(
      `Биография должна быть не более ${VALIDATION.BIO_MAX_LENGTH} символов`
    );
  }

  return { valid: errors.length === 0, errors };
}

export function validateLoginForm(
  username: string,
  password: string
): ValidationResult {
  const usernameResult = validateUsername(username);
  const passwordResult = validatePassword(password);

  return {
    valid: usernameResult.valid && passwordResult.valid,
    errors: [...usernameResult.errors, ...passwordResult.errors],
  };
}

export function validateRegisterForm(
  username: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const usernameResult = validateUsername(username);
  const passwordResult = validatePassword(password);
  const confirmResult = validatePasswordConfirm(password, confirmPassword);

  return {
    valid: usernameResult.valid && passwordResult.valid && confirmResult.valid,
    errors: [
      ...usernameResult.errors,
      ...passwordResult.errors,
      ...confirmResult.errors,
    ],
  };
}
