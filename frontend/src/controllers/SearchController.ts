import { PostView, UserCardView } from '@/views';
import { searchService, followService } from '@/services';
import { getUser, setUser, isAuthenticated } from '@/utils';
import {
  requireElement,
  querySelector,
  clearChildren,
  createElement,
  createButton,
} from '@/utils';
import { ROUTES, TIMEOUTS } from '../config/constants';
import type { Post, User, SearchType } from '@/types';

export class SearchController {
  private resultsContainer: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private typeButtons: HTMLButtonElement[] = [];
  private currentType: SearchType = 'users';
  private currentUser: User | null = null;
  private debounceTimer: number | null = null;

  init(): void {
    this.currentUser = getUser();

    this.resultsContainer = requireElement<HTMLElement>('.search-results');
    this.searchInput = querySelector<HTMLInputElement>('.search__input');

    this.initTypeButtons();
    this.attachEvents();

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const type = urlParams.get('type') as SearchType;

    if (type && (type === 'users' || type === 'posts')) {
      this.currentType = type;
      this.updateTypeButtons();
    }

    if (query) {
      if (this.searchInput) {
        this.searchInput.value = query;
      }
      this.performSearch(query);
    }
  }

  private initTypeButtons(): void {
    const usersBtn = querySelector<HTMLButtonElement>(
      '.search-type__btn--users'
    );
    const postsBtn = querySelector<HTMLButtonElement>(
      '.search-type__btn--posts'
    );

    if (usersBtn && postsBtn) {
      this.typeButtons = [usersBtn, postsBtn];
    } else {
      const typeContainer = querySelector<HTMLElement>('.search-type');
      if (typeContainer) {
        const usersButton = createButton('Пользователи', {
          className:
            'search-type__btn search-type__btn--users search-type__btn--active',
        });
        const postsButton = createButton('Посты', {
          className: 'search-type__btn search-type__btn--posts',
        });

        typeContainer.appendChild(usersButton);
        typeContainer.appendChild(postsButton);

        this.typeButtons = [usersButton, postsButton];
      }
    }

    this.updateTypeButtons();
  }

  private updateTypeButtons(): void {
    this.typeButtons.forEach(btn => {
      const isUsers = btn.classList.contains('search-type__btn--users');
      const isActive =
        (isUsers && this.currentType === 'users') ||
        (!isUsers && this.currentType === 'posts');

      if (isActive) {
        btn.classList.add('search-type__btn--active');
      } else {
        btn.classList.remove('search-type__btn--active');
      }
    });
  }

  private attachEvents(): void {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.handleSearchInput();
      });

      this.searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const query = this.searchInput?.value.trim();
          if (query) {
            this.performSearch(query);
          }
        }
      });
    }

    this.typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isUsers = btn.classList.contains('search-type__btn--users');
        this.currentType = isUsers ? 'users' : 'posts';
        this.updateTypeButtons();

        const query = this.searchInput?.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    });
  }

  private handleSearchInput(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      const query = this.searchInput?.value.trim();
      if (query && query.length >= 2) {
        this.performSearch(query);
      }
    }, TIMEOUTS.DEBOUNCE_SEARCH);
  }

  private async performSearch(query: string): Promise<void> {
    if (!this.resultsContainer) return;

    const urlParams = new URLSearchParams({
      q: query,
      type: this.currentType,
    });
    window.history.replaceState(
      null,
      '',
      `${ROUTES.SEARCH}?${urlParams.toString()}`
    );

    try {
      this.showLoading();

      if (this.currentType === 'users') {
        const users = await searchService.searchUsers(query);
        this.renderUserResults(users);
      } else {
        const posts = await searchService.searchPosts(query);
        this.renderPostResults(posts);
      }
    } catch (error) {
      console.error('Search failed:', error);
      this.showError('Ошибка поиска');
    }
  }

  private renderUserResults(users: User[]): void {
    if (!this.resultsContainer) return;

    clearChildren(this.resultsContainer);

    if (users.length === 0) {
      this.showEmptyState('Пользователи не найдены');
      return;
    }

    users.forEach(user => {
      const isFollowing =
        this.currentUser?.following?.includes(user.id) || false;

      const userCard = new UserCardView({
        user,
        currentUser: this.currentUser,
        isFollowing,
        onFollow: this.handleFollow.bind(this),
        onClick: this.handleUserClick.bind(this),
      });

      this.resultsContainer!.appendChild(userCard.render());
    });
  }

  private renderPostResults(posts: Post[]): void {
    if (!this.resultsContainer) return;

    clearChildren(this.resultsContainer);

    if (posts.length === 0) {
      this.showEmptyState('Посты не найдены');
      return;
    }

    posts.forEach(post => {
      const postView = new PostView({
        post,
        currentUser: this.currentUser,
        onAuthorClick: this.handleUserClick.bind(this),
      });

      this.resultsContainer!.appendChild(postView.render());
    });
  }

  private async handleFollow(userId: string): Promise<void> {
    if (!isAuthenticated()) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    if (!this.currentUser) return;

    const isFollowing = this.currentUser.following?.includes(userId) || false;

    try {
      await followService.toggle(userId, isFollowing);

      if (isFollowing) {
        this.currentUser.following = this.currentUser.following?.filter(
          id => id !== userId
        );
      } else {
        this.currentUser.following = [
          ...(this.currentUser.following || []),
          userId,
        ];
      }

      setUser(this.currentUser);

      const query = this.searchInput?.value.trim();
      if (query) {
        this.performSearch(query);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }

  private handleUserClick(userId: string): void {
    window.location.href = `${ROUTES.PROFILE}?id=${userId}`;
  }

  private showLoading(): void {
    if (!this.resultsContainer) return;
    clearChildren(this.resultsContainer);

    const loading = createElement('div', {
      className: 'search-loading',
      textContent: 'Поиск...',
    });
    this.resultsContainer.appendChild(loading);
  }

  private showError(message: string): void {
    if (!this.resultsContainer) return;
    clearChildren(this.resultsContainer);

    const error = createElement('div', {
      className: 'search-error',
      textContent: message,
    });
    this.resultsContainer.appendChild(error);
  }

  private showEmptyState(message: string): void {
    if (!this.resultsContainer) return;

    const empty = createElement('div', {
      className: 'search-empty',
      textContent: message,
    });
    this.resultsContainer.appendChild(empty);
  }
}
