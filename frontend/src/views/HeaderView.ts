import { createElement, createImage, clearChildren } from '@/utils';
import { DEFAULT_IMAGES, ROUTES } from '../config/constants';
import type { User } from '@/types';

export interface HeaderViewOptions {
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export class HeaderView {
  private headerRight: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private options: HeaderViewOptions;

  constructor(options: HeaderViewOptions = {}) {
    this.options = options;
  }

  init(): void {
    this.headerRight = document.querySelector('.header__right');
    this.searchInput = document.querySelector('.search__input');

    if (this.searchInput && this.options.onSearch) {
      this.searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const query = this.searchInput?.value.trim();
          if (query) {
            this.options.onSearch?.(query);
          }
        }
      });
    }
  }

  renderAuthenticated(user: User): void {
    if (!this.headerRight) return;

    clearChildren(this.headerRight);

    // Nav auth (logout link)
    const nav = createElement('nav', { className: 'nav-auth' });

    const logoutLink = createElement('a', {
      className: 'nav-auth__link',
      attributes: { href: '#' },
    });

    const logoutText = createElement('span', { textContent: 'Выйти' });
    logoutLink.appendChild(logoutText);

    const logoutIcon = createImage('/images/login.svg', '', {
      className: 'nav-auth__icon',
      width: 24,
      height: 24,
    });
    logoutLink.appendChild(logoutIcon);

    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      this.options.onLogout?.();
    });

    nav.appendChild(logoutLink);
    this.headerRight.appendChild(nav);

    const profileLink = createElement('a', {
      className: 'profile-icon',
      attributes: { href: ROUTES.PROFILE },
    });

    const profileImg = createImage(
      user.avatar || DEFAULT_IMAGES.AVATAR,
      'Профиль',
      { className: 'profile-icon__img' }
    );
    profileLink.appendChild(profileImg);

    this.headerRight.appendChild(profileLink);
  }

  renderUnauthenticated(): void {
    if (!this.headerRight) return;

    clearChildren(this.headerRight);

    const nav = createElement('nav', { className: 'nav-auth' });

    const registerLink = createElement('a', {
      className: 'nav-auth__link',
      attributes: { href: ROUTES.REGISTER },
    });

    const registerText = createElement('span', {
      textContent: 'Зарегистроваться',
    });
    registerLink.appendChild(registerText);

    const registerIcon = createImage('/images/login.svg', '', {
      className: 'nav-auth__icon',
      width: 24,
      height: 24,
    });
    registerLink.appendChild(registerIcon);

    nav.appendChild(registerLink);

    const loginLink = createElement('a', {
      className: 'nav-auth__link',
      attributes: { href: ROUTES.LOGIN },
    });

    const loginText = createElement('span', { textContent: 'Войти' });
    loginLink.appendChild(loginText);

    const loginIcon = createImage('/images/login.svg', '', {
      className: 'nav-auth__icon',
      width: 24,
      height: 24,
    });
    loginLink.appendChild(loginIcon);

    nav.appendChild(loginLink);

    this.headerRight.appendChild(nav);
  }

  setSearchValue(value: string): void {
    if (this.searchInput) {
      this.searchInput.value = value;
    }
  }

  getSearchValue(): string {
    return this.searchInput?.value.trim() || '';
  }

  focusSearch(): void {
    this.searchInput?.focus();
  }
}
