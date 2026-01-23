import { createElement, createImage, createButton } from '@/utils';
import { DEFAULT_IMAGES } from '../config/constants';
import type { Comment, User } from '@/types';

export interface CommentViewOptions {
  comment: Comment;
  currentUser: User | null;
  onDelete?: (commentId: string) => void;
  onAuthorClick?: (userId: string) => void;
}

export class CommentView {
  private element: HTMLElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;
  private options: CommentViewOptions;

  constructor(options: CommentViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    const { comment, currentUser } = this.options;

    this.element = createElement('div', {
      className: 'comment',
      dataset: { commentId: comment.id },
    });

    const header = createElement('div', { className: 'comment__header' });

    const avatar = createImage(
      comment.user?.avatar || DEFAULT_IMAGES.AVATAR,
      comment.user?.username || 'Аватар',
      {
        className: 'comment__avatar',
        width: 32,
        height: 32,
      }
    );
    header.appendChild(avatar);

    const username = createElement('span', {
      className: 'comment__username',
      textContent: comment.user?.username || 'Неизвестный',
      dataset: { userId: comment.userId },
    });
    header.appendChild(username);

    this.element.appendChild(header);

    const content = createElement('p', {
      className: 'comment__content',
      textContent: comment.content,
    });
    this.element.appendChild(content);

    if (currentUser && comment.userId === currentUser.id) {
      this.deleteButton = createButton('', {
        className: 'comment__delete icon-button',
        attributes: { 'aria-label': 'Удалить комментарий' },
      });

      const deleteIcon = createImage('/images/delete.svg', '', {
        width: 16,
        height: 16,
      });
      this.deleteButton.appendChild(deleteIcon);
      this.element.appendChild(this.deleteButton);
    }

    this.attachEvents();

    return this.element;
  }

  private attachEvents(): void {
    const { onDelete, onAuthorClick } = this.options;

    if (this.deleteButton && onDelete) {
      this.deleteButton.addEventListener('click', () => {
        onDelete(this.options.comment.id);
      });
    }

    if (this.element && onAuthorClick) {
      const username = this.element.querySelector('.comment__username');
      if (username) {
        username.addEventListener('click', () => {
          onAuthorClick(this.options.comment.userId);
        });
        (username as HTMLElement).style.cursor = 'pointer';
      }
    }
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.deleteButton = null;
  }
}
