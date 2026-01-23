import { PostView, CommentView, CommentFormView, ModalView } from '@/views';
import { postService, likeService, commentService } from '@/services';
import { getUser, isAuthenticated } from '@/utils';
import { requireElement, clearChildren, createElement } from '@/utils';
import { ROUTES } from '../config/constants';
import type { Post, Comment, User } from '@/types';

export class FeedController {
  private container: HTMLElement | null = null;
  private postViews: Map<string, PostView> = new Map();
  private currentUser: User | null = null;
  private commentsModal: ModalView | null = null;
  private currentPostId: string | null = null;

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
    this.currentPostId = postId;

    try {
      const comments = await commentService.getByPost(postId);
      this.showCommentsModal(comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  private showCommentsModal(comments: Comment[]): void {
    this.commentsModal = new ModalView({
      title: 'Комментарии',
      onClose: () => {
        this.commentsModal?.destroy();
        this.commentsModal = null;
        this.currentPostId = null;
      },
    });

    this.commentsModal.render();

    const content = createElement('div', { className: 'comments-list' });

    if (comments.length === 0) {
      const emptyState = createElement('p', {
        className: 'comments-empty',
        textContent: 'Комментариев пока нет',
      });
      content.appendChild(emptyState);
    } else {
      comments.forEach(comment => {
        const commentView = new CommentView({
          comment,
          currentUser: this.currentUser,
          onDelete: this.handleDeleteComment.bind(this),
        });
        content.appendChild(commentView.render());
      });
    }

    this.commentsModal.setContent(content);

    if (isAuthenticated()) {
      const commentForm = new CommentFormView({
        onSubmit: this.handleAddComment.bind(this),
      });
      this.commentsModal.appendContent(commentForm.render());
    }

    this.commentsModal.open();
  }

  private async handleAddComment(content: string): Promise<void> {
    if (!this.currentPostId) return;

    try {
      await commentService.create(this.currentPostId, { content });

      const comments = await commentService.getByPost(this.currentPostId);
      this.commentsModal?.destroy();
      this.showCommentsModal(comments);

      const postView = this.postViews.get(this.currentPostId);
      postView?.updateCommentsCount(comments.length);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  private async handleDeleteComment(commentId: string): Promise<void> {
    if (!this.currentPostId) return;

    try {
      await commentService.delete(commentId);

      const comments = await commentService.getByPost(this.currentPostId);
      this.commentsModal?.destroy();
      this.showCommentsModal(comments);

      const postView = this.postViews.get(this.currentPostId);
      postView?.updateCommentsCount(comments.length);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
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
