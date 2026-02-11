import { PostView } from '@/views';
import { postService, likeService, commentModalService } from '@/services';
import { getUser, isAuthenticated } from '@/utils';
import { requireElement, clearChildren, createElement } from '@/utils';
import { ROUTES } from '../config/constants';
import type { Post, User } from '@/types';

export class FeedController {
  private container: HTMLElement | null = null;
  private postViews: Map<string, PostView> = new Map();
  private currentUser: User | null = null;

  async init(): Promise<void> {
    this.currentUser = getUser();

    this.container = requireElement<HTMLElement>('.news-feed');

    await this.loadFeed();
  }

  private async loadFeed(): Promise<void> {
    if (!this.container) return;

    try {
      this.showLoading();

      let posts: Post[];

      if (isAuthenticated()) {
        posts = await postService.getFeed();

        if (posts.length === 0) {
          posts = await postService.getAll();
        }
      } else {
        posts = await postService.getAll();
      }

      this.renderPosts(posts);
    } catch (error) {
      console.error('Failed to load feed:', error);
      this.showError('Не удалось загрузить ленту');
    }
  }

  private renderPosts(posts: Post[]): void {
    if (!this.container) return;

    clearChildren(this.container);
    this.postViews.clear();

    if (posts.length === 0) {
      this.showEmptyState();
      return;
    }

    const fragment = document.createDocumentFragment();

    posts.forEach(post => {
      const postView = new PostView({
        post,
        currentUser: this.currentUser,
        onLike: this.handleLike.bind(this),
        onComment: this.handleOpenComments.bind(this),
        onDelete: this.handleDelete.bind(this),
        onAuthorClick: this.handleAuthorClick.bind(this),
      });

      const element = postView.render();
      fragment.appendChild(element);
      this.postViews.set(post.id, postView);
    });

    this.container.appendChild(fragment);
  }

  private async handleLike(postId: string): Promise<void> {
    if (!isAuthenticated()) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    const postView = this.postViews.get(postId);
    if (!postView) return;

    try {
      await likeService.like(postId);

      const posts = await postService.getAll();
      const updatedPost = posts.find(p => p.id === postId);
      if (updatedPost) {
        postView.updateLikes(
          updatedPost.likes,
          updatedPost.likedByUser || false
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }

  private async handleOpenComments(postId: string): Promise<void> {
    await commentModalService.openCommentsModal(
      postId,
      this.postViews,
      this.currentUser
    );
  }

  private async handleDelete(postId: string): Promise<void> {
    try {
      await postService.delete(postId);

      const postView = this.postViews.get(postId);
      postView?.destroy();
      this.postViews.delete(postId);

      if (this.postViews.size === 0) {
        this.showEmptyState();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }

  private handleAuthorClick(userId: string): void {
    window.location.href = `${ROUTES.PROFILE}?id=${userId}`;
  }

  private showLoading(): void {
    if (!this.container) return;
    clearChildren(this.container);

    const loading = createElement('div', {
      className: 'loading',
      textContent: 'Загрузка...',
    });
    this.container.appendChild(loading);
  }

  private showError(message: string): void {
    if (!this.container) return;
    clearChildren(this.container);

    const error = createElement('div', {
      className: 'error-message',
      textContent: message,
    });
    this.container.appendChild(error);
  }

  private showEmptyState(): void {
    if (!this.container) return;
    clearChildren(this.container);

    const empty = createElement('div', { className: 'empty-state' });

    const message = createElement('p', {
      className: 'empty-state__message',
      textContent: 'В вашей ленте пока нет постов',
    });
    empty.appendChild(message);

    const hint = createElement('p', {
      className: 'empty-state__hint',
      textContent: 'Подпишитесь на пользователей, чтобы видеть их посты',
    });
    empty.appendChild(hint);

    this.container.appendChild(empty);
  }
}
