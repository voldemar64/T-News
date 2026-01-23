import { createElement, createImage, createButton } from '@/utils';
import { DEFAULT_IMAGES } from '../config/constants';
import type { Post, User } from '@/types';

export interface PostViewOptions {
  post: Post;
  currentUser: User | null;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onAuthorClick?: (userId: string) => void;
}

export class PostView {
  private element: HTMLElement | null = null;
  private likeButton: HTMLButtonElement | null = null;
  private likeCount: HTMLElement | null = null;
  private commentButton: HTMLButtonElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;
  private options: PostViewOptions;

  constructor(options: PostViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    const { post, currentUser, onDelete } = this.options;

    this.element = createElement('article', {
      className: 'news-card',
      dataset: { postId: post.id },
    });

    const header = this.createHeader();
    this.element.appendChild(header);

    const body = this.createBody();
    this.element.appendChild(body);

    const footer = this.createFooter();
    this.element.appendChild(footer);

    if (currentUser && post.userId === currentUser.id && onDelete) {
      this.deleteButton = createButton('Удалить', {
        className: 'button button--danger button--small',
        dataset: { postId: post.id },
      });
      footer.appendChild(this.deleteButton);
    }

    this.attachEvents();

    return this.element;
  }

  private createHeader(): HTMLElement {
    const { post } = this.options;

    const header = createElement('div', { className: 'news-card__header' });

    const avatar = createImage(
      post.user?.avatar || DEFAULT_IMAGES.AVATAR,
      post.user?.username || 'Аватар',
      { className: 'news-card__avatar-img' }
    );
    header.appendChild(avatar);

    const author = createElement('h2', {
      className: 'news-card__author',
      textContent: post.user?.username || 'Неизвестный',
      dataset: { userId: post.userId },
    });
    header.appendChild(author);

    return header;
  }

  private createBody(): HTMLElement {
    const { post } = this.options;

    const body = createElement('div', { className: 'news-card__body' });

    const content = createElement('p', {
      className: 'news-card__content',
      textContent: post.content,
    });
    body.appendChild(content);

    return body;
  }

  private createFooter(): HTMLElement {
    const { post } = this.options;

    const footer = createElement('div', { className: 'news-card__footer' });

    this.likeButton = createElement('button', {
      className: `like-button${post.likedByUser ? ' like-button--active' : ''}`,
      attributes: {
        type: 'button',
        'aria-label': 'Нравится',
      },
      dataset: { postId: post.id },
    });

    const heartIcon = createImage('/images/heart.svg', '', {
      className: 'like-button__icon',
      width: 16,
      height: 16,
    });
    this.likeButton.appendChild(heartIcon);

    this.likeCount = createElement('span', {
      className: 'like-button__count',
      textContent: String(post.likes || 0),
    });
    this.likeButton.appendChild(this.likeCount);
    footer.appendChild(this.likeButton);

    const commentsCount = post.comments?.length || 0;
    this.commentButton = createButton(`Комментарии ${commentsCount}`, {
      className: 'button button--secondary button--small',
      attributes: { 'aria-label': 'Комментарии' },
      dataset: { postId: post.id },
    });
    footer.appendChild(this.commentButton);

    return footer;
  }

  private attachEvents(): void {
    const { onLike, onComment, onDelete, onAuthorClick } = this.options;

    if (this.likeButton && onLike) {
      this.likeButton.addEventListener('click', () => {
        onLike(this.options.post.id);
      });
    }

    if (this.commentButton && onComment) {
      this.commentButton.addEventListener('click', () => {
        onComment(this.options.post.id);
      });
    }

    if (this.element && onAuthorClick) {
      const author = this.element.querySelector('.news-card__author');
      if (author) {
        author.addEventListener('click', () => {
          onAuthorClick(this.options.post.userId);
        });
        (author as HTMLElement).style.cursor = 'pointer';
      }
    }

    if (this.deleteButton && onDelete) {
      this.deleteButton.addEventListener('click', () => {
        onDelete(this.options.post.id);
      });
    }
  }

  updateLikes(count: number, isLiked: boolean): void {
    if (this.likeCount) {
      this.likeCount.textContent = String(count);
    }
    if (this.likeButton) {
      if (isLiked) {
        this.likeButton.classList.add('like-button--active');
      } else {
        this.likeButton.classList.remove('like-button--active');
      }
    }
  }

  updateCommentsCount(count: number): void {
    if (this.commentButton) {
      this.commentButton.textContent = `Комментарии ${count}`;
    }
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.likeButton = null;
    this.likeCount = null;
    this.commentButton = null;
    this.deleteButton = null;
  }
}
