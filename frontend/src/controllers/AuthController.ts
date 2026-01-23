import { authService } from '@/services';
import { validateLoginForm, validateRegisterForm } from '@/utils';
import { isAuthenticated } from '@/utils';
import { ROUTES } from '../config/constants';
import { requireElement, createElement } from '@/utils';

export class AuthController {
  private form: HTMLFormElement | null = null;
  private errorContainer: HTMLElement | null = null;
  private isLoginPage: boolean;

  constructor() {
    this.isLoginPage = window.location.pathname.includes('login');
  }

  init(): void {
    if (isAuthenticated()) {
      window.location.href = ROUTES.HOME;
      return;
    }

    this.form = requireElement<HTMLFormElement>('.auth-card__content');

    this.errorContainer = createElement('div', {
      className: 'auth-card__errors',
    });
    this.form.insertBefore(this.errorContainer, this.form.firstChild);

    this.attachEvents();
  }

  private attachEvents(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private async handleSubmit(): Promise<void> {
    if (!this.form) return;

    this.clearErrors();

    const formData = new FormData(this.form);
    const username = (formData.get('login') as string) || '';
    const password = (formData.get('password') as string) || '';

    if (this.isLoginPage) {
      await this.handleLogin(username, password);
    } else {
      const confirmPassword =
        (formData.get('confirm-password') as string) || '';
      await this.handleRegister(username, password, confirmPassword);
    }
  }

  private async handleLogin(username: string, password: string): Promise<void> {
    const validation = validateLoginForm(username, password);
    if (!validation.valid) {
      this.showErrors(validation.errors);
      return;
    }

    try {
      this.setLoading(true);
      await authService.login({ username, password });
      window.location.href = ROUTES.HOME;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка входа';
      this.showErrors([message]);
    } finally {
      this.setLoading(false);
    }
  }

  private async handleRegister(
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    const validation = validateRegisterForm(
      username,
      password,
      confirmPassword
    );
    if (!validation.valid) {
      this.showErrors(validation.errors);
      return;
    }

    try {
      this.setLoading(true);
      await authService.register({ username, password });
      window.location.href = ROUTES.HOME;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка регистрации';
      this.showErrors([message]);
    } finally {
      this.setLoading(false);
    }
  }

  private showErrors(errors: string[]): void {
    if (!this.errorContainer) return;

    errors.forEach(error => {
      const errorEl = createElement('p', {
        className: 'auth-card__error',
        textContent: error,
      });
      this.errorContainer!.appendChild(errorEl);
    });
  }

  private clearErrors(): void {
    if (this.errorContainer) {
      while (this.errorContainer.firstChild) {
        this.errorContainer.removeChild(this.errorContainer.firstChild);
      }
    }
  }

  private setLoading(loading: boolean): void {
    const submitButton = this.form?.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = loading;
      submitButton.textContent = loading
        ? 'Загрузка...'
        : this.isLoginPage
          ? 'Войти'
          : 'Зарегистроваться';
    }
  }
}
