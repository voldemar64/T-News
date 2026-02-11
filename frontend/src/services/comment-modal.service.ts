import { CommentView, CommentFormView, ModalView } from '@/views';
import { commentService } from './comment.service';
import { isAuthenticated } from '@/utils';
import { createElement } from '@/utils';
import type { Comment, User } from '@/types';
import type { PostView } from '@/views/PostView';

export class CommentModalService {
  private commentsModal: ModalView | null = null;
  private currentPostId: string | null = null;
  private postViews: Map<string, PostView> | null = null;
  private currentUser: User | null = null;

  async openCommentsModal(
    postId: string,
    postViews: Map<string, PostView>,
    currentUser: User | null
  ): Promise<void> {
    this.currentPostId = postId;
    this.postViews = postViews;
    this.currentUser = currentUser;

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

      const postView = this.postViews?.get(this.currentPostId);
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

      const postView = this.postViews?.get(this.currentPostId);
      postView?.updateCommentsCount(comments.length);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }
}

export const commentModalService = new CommentModalService();
