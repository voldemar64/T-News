import { createElement, createImage, createButton } from '@/utils';
import { DEFAULT_IMAGES } from '../config/constants';
import type { User } from '@/types';

export interface UserCardViewOptions {
  user: User;
  currentUser: User | null;
  isFollowing?: boolean;
  onFollow?: (userId: string) => void;
  onClick?: (userId: string) => void;
}

export class UserCardView {
  private element: HTMLElement | null = null;
  private followButton: HTMLButtonElement | null = null;
  private options: UserCardViewOptions;

  constructor(options: UserCardViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    const { user, currentUser, isFollowing } = this.options;

    this.element = createElement('div', {
      className: 'user-card',
      dataset: { userId: user.id },
    });

    const avatar = createImage(
      user.avatar || DEFAULT_IMAGES.AVATAR,
      user.username,
      {
        className: 'user-card__avatar',
        width: 48,
        height: 48,
      }
    );
    this.element.appendChild(avatar);

    const info = createElement('div', { className: 'user-card__info' });

    const username = createElement('h3', {
      className: 'user-card__username',
      textContent: user.username,
    });
    info.appendChild(username);

    if (user.bio) {
      const bio = createElement('p', {
        className: 'user-card__bio',
        textContent: user.bio,
      });
      info.appendChild(bio);
    }

    this.element.appendChild(info);

    if (currentUser && user.id !== currentUser.id) {
      this.followButton = createButton(
        isFollowing ? 'Подписаны' : 'Подписаться',
        {
          className: `button ${isFollowing ? 'button--secondary' : 'button--primary'} button--small`,
          dataset: { userId: user.id },
        }
      );
      this.element.appendChild(this.followButton);
    }

    this.attachEvents();

    return this.element;
  }

  private attachEvents(): void {
    const { onFollow, onClick } = this.options;

    if (this.followButton && onFollow) {
      this.followButton.addEventListener('click', e => {
        e.stopPropagation();
        onFollow(this.options.user.id);
      });
    }

    if (this.element && onClick) {
      this.element.addEventListener('click', () => {
        onClick(this.options.user.id);
      });
      this.element.style.cursor = 'pointer';
    }
  }

  updateFollowState(isFollowing: boolean): void {
    if (this.followButton) {
      this.followButton.textContent = isFollowing ? 'Подписаны' : 'Подписаться';
      this.followButton.className = `button ${isFollowing ? 'button--secondary' : 'button--primary'} button--small`;
    }
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.followButton = null;
  }
}
