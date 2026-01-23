import {
  PostView,
  PostFormView,
  CommentView,
  CommentFormView,
  ModalView,
} from '@/views';
import {
  postService,
  userService,
  likeService,
  commentService,
  followService,
} from '@/services';
import { getUser, setUser, isAuthenticated } from '@/utils';
import {
  querySelector,
  clearChildren,
  createElement,
  createButton,
} from '@/utils';
import { ROUTES, DEFAULT_IMAGES } from '../config/constants';
import { validateBio } from '@/utils';
import type { Post, Comment, User } from '@/types';

export class ProfileController {
  private postsContainer: HTMLElement | null = null;
  private postViews: Map<string, PostView> = new Map();
  private currentUser: User | null = null;
  private profileUser: User | null = null;
  private isOwnProfile: boolean = false;
  private postForm: PostFormView | null = null;
  private commentsModal: ModalView | null = null;
  private currentPostId: string | null = null;

  async init(): Promise<void> {
    this.currentUser = getUser();

    const urlParams = new URLSearchParams(window.location.search);
    const profileUserId = urlParams.get('id') || this.currentUser?.id;

    if (!profileUserId) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    this.isOwnProfile = this.currentUser?.id === profileUserId;

    try {
      this.profileUser = await userService.getById(profileUserId);
      this.renderProfileHeader();
      await this.loadUserPosts();

      if (this.isOwnProfile) {
        this.initPostForm();
        this.initEditHandlers();
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.showError('Не удалось загрузить профиль');
    }
  }

  private renderProfileHeader(): void {
    if (!this.profileUser) return;

    const avatarImg = querySelector<HTMLImageElement>(
      '.profile-header__avatar-img'
    );
    if (avatarImg) {
      avatarImg.src = this.profileUser.avatar || DEFAULT_IMAGES.AVATAR;
      avatarImg.alt = this.profileUser.username;
    }

    const nameEl = querySelector<HTMLElement>('.profile-header__name');
    if (nameEl) {
      nameEl.textContent = this.profileUser.username;
    }

    const bioEl = querySelector<HTMLElement>('.profile-header__bio');
    if (bioEl) {
      bioEl.textContent = this.profileUser.bio || 'Нет описания';
    }

    const settingsBtn = querySelector<HTMLButtonElement>('.button--outline');
    const photoBtn = querySelector<HTMLButtonElement>('.button--blue');
    const postForm = querySelector<HTMLElement>('.profile-post-form');

    const editButtons = document.querySelectorAll('.icon-button');
    editButtons.forEach(btn => {
      (btn as HTMLElement).style.display = this.isOwnProfile ? '' : 'none';
    });

    if (this.isOwnProfile) {
      if (settingsBtn) settingsBtn.style.display = 'none';
      if (photoBtn) photoBtn.style.display = '';
      if (postForm) postForm.style.display = '';
    } else {
      if (settingsBtn) settingsBtn.style.display = 'none';
      if (photoBtn) photoBtn.style.display = 'none';
      if (postForm) postForm.style.display = 'none';

      if (this.currentUser) {
        this.renderFollowButton();
      }
    }
  }

  private renderFollowButton(): void {
    if (!this.profileUser) return;

    const profileHeaderInfo = querySelector<HTMLElement>(
      '.profile-header__info'
    );
    if (!profileHeaderInfo) return;

    const isFollowing =
      this.currentUser?.following?.includes(this.profileUser.id) || false;

    const followBtn = createButton(isFollowing ? 'Подписаны' : 'Подписаться', {
      className: `button ${isFollowing ? 'button--secondary' : 'button--primary'} profile-follow-btn`,
      dataset: { userId: this.profileUser.id },
    });

    followBtn.addEventListener('click', () => this.handleFollow());

    profileHeaderInfo.after(followBtn);
  }

  private async handleFollow(): Promise<void> {
    if (!this.profileUser || !this.currentUser) return;

    const isFollowing =
      this.currentUser.following?.includes(this.profileUser.id) || false;

    try {
      await followService.toggle(this.profileUser.id, isFollowing);

      if (isFollowing) {
        this.currentUser.following = this.currentUser.following?.filter(
          id => id !== this.profileUser!.id
        );
      } else {
        this.currentUser.following = [
          ...(this.currentUser.following || []),
          this.profileUser.id,
        ];
      }

      setUser(this.currentUser);

      const followBtn = querySelector<HTMLButtonElement>('.profile-follow-btn');
      if (followBtn) {
        followBtn.textContent = !isFollowing ? 'Подписаны' : 'Подписаться';
        followBtn.className = `button ${!isFollowing ? 'button--secondary' : 'button--primary'} profile-follow-btn`;
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }

  private initPostForm(): void {
    const formContainer = querySelector<HTMLElement>('.profile-post-form');
    if (!formContainer) return;

    clearChildren(formContainer);

    this.postForm = new PostFormView({
      onSubmit: this.handleCreatePost.bind(this),
      placeholder: 'Введите свой пост',
    });

    const formElement = this.postForm.render();
    while (formElement.firstChild) {
      formContainer.appendChild(formElement.firstChild);
    }
  }

  private initEditHandlers(): void {
    const bioEditBtn = document.querySelector(
      '.profile-header__bio-edit .icon-button'
    );
    if (bioEditBtn) {
      bioEditBtn.addEventListener('click', () => this.handleEditBio());
    }

    const nameEditBtn = document.querySelector(
      '.profile-header__name-edit .icon-button'
    );
    if (nameEditBtn) {
      nameEditBtn.addEventListener('click', () => this.handleEditName());
    }

    const photoBtn = querySelector<HTMLButtonElement>('.button--blue');
    if (photoBtn) {
      photoBtn.addEventListener('click', () => this.handleChangePhoto());
    }
  }

  private handleEditBio(): void {
    const bioEl = querySelector<HTMLElement>('.profile-header__bio');
    if (!bioEl || !this.profileUser) return;

    const currentBio = this.profileUser.bio || '';

    const textarea = createElement('textarea', {
      className: 'profile-edit-textarea',
      attributes: {
        rows: '3',
        placeholder: 'Введите описание',
      },
    });
    textarea.value = currentBio;

    const saveBtn = createButton('Сохранить', {
      className: 'button button--primary button--small',
    });

    const cancelBtn = createButton('Отмена', {
      className: 'button button--secondary button--small',
    });

    const container = createElement('div', {
      className: 'profile-edit-container',
      children: [textarea, saveBtn, cancelBtn],
    });

    bioEl.replaceWith(container);

    saveBtn.addEventListener('click', async () => {
      const newBio = textarea.value.trim();
      const validation = validateBio(newBio);

      if (!validation.valid) {
        alert(validation.errors.join('\n'));
        return;
      }

      try {
        const updated = await userService.update(this.profileUser!.id, {
          bio: newBio,
        });
        this.profileUser = updated;

        if (this.isOwnProfile) {
          setUser(updated);
          this.currentUser = updated;
        }

        const newBioEl = createElement('p', {
          className: 'profile-header__bio',
          textContent: newBio || 'Нет описания',
        });
        container.replaceWith(newBioEl);
      } catch (error) {
        console.error('Failed to update bio:', error);
        alert('Не удалось обновить описание');
      }
    });

    cancelBtn.addEventListener('click', () => {
      const newBioEl = createElement('p', {
        className: 'profile-header__bio',
        textContent: currentBio || 'Нет описания',
      });
      container.replaceWith(newBioEl);
    });

    textarea.focus();
  }

  private handleEditName(): void {
    const nameEl = querySelector<HTMLElement>('.profile-header__name');
    if (!nameEl || !this.profileUser) return;

    const currentName = this.profileUser.username;

    const input = createElement('input', {
      className: 'profile-edit-input',
      attributes: {
        type: 'text',
        placeholder: 'Введите имя пользователя',
        maxlength: '20',
      },
    });
    input.value = currentName;

    const saveBtn = createButton('Сохранить', {
      className: 'button button--primary button--small',
    });

    const cancelBtn = createButton('Отмена', {
      className: 'button button--secondary button--small',
    });

    const container = createElement('div', {
      className: 'profile-edit-container profile-edit-container--inline',
      children: [input, saveBtn, cancelBtn],
    });

    nameEl.replaceWith(container);

    saveBtn.addEventListener('click', async () => {
      const newName = input.value.trim();

      if (newName.length < 3) {
        alert('Имя пользователя должно содержать минимум 3 символа');
        return;
      }

      if (newName.length > 20) {
        alert('Имя пользователя должно содержать максимум 20 символов');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(newName)) {
        alert('Имя может содержать только буквы, цифры и подчеркивания');
        return;
      }

      try {
        const updated = await userService.update(this.profileUser!.id, {
          username: newName,
        });
        this.profileUser = updated;

        if (this.isOwnProfile) {
          setUser(updated);
          this.currentUser = updated;
        }

        const newNameEl = createElement('h1', {
          className: 'profile-header__name',
          textContent: newName,
        });
        container.replaceWith(newNameEl);
      } catch (error) {
        console.error('Failed to update name:', error);
        alert('Не удалось обновить имя. Возможно, оно уже занято.');
      }
    });

    cancelBtn.addEventListener('click', () => {
      const newNameEl = createElement('h1', {
        className: 'profile-header__name',
        textContent: currentName,
      });
      container.replaceWith(newNameEl);
    });

    input.focus();
    input.select();
  }

  private handleChangePhoto(): void {
    const newUrl = prompt(
      'Введите URL нового аватара:',
      this.profileUser?.avatar || ''
    );
    if (newUrl === null) return;

    this.updateAvatar(newUrl);
  }

  private async updateAvatar(url: string): Promise<void> {
    if (!this.profileUser) return;

    try {
      const updated = await userService.update(this.profileUser.id, {
        avatar: url,
      });
      this.profileUser = updated;

      if (this.isOwnProfile) {
        setUser(updated);
        this.currentUser = updated;
      }

      const avatarImg = querySelector<HTMLImageElement>(
        '.profile-header__avatar-img'
      );
      if (avatarImg) {
        avatarImg.src = url || DEFAULT_IMAGES.AVATAR;
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
      alert('Не удалось обновить аватар');
    }
  }

  private async loadUserPosts(): Promise<void> {
    if (!this.profileUser) return;

    const existingCards = document.querySelectorAll('.profile .news-card');
    if (existingCards.length > 0) {
      this.postsContainer = existingCards[0].parentElement;
    } else {
      const profile = querySelector<HTMLElement>('.profile');
      if (profile) {
        this.postsContainer = createElement('div', {
          className: 'profile-posts',
        });
        profile.appendChild(this.postsContainer);
      }
    }

    if (!this.postsContainer) return;

    try {
      const posts = await postService.getUserPosts(this.profileUser.id);
      this.renderPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  private renderPosts(posts: Post[]): void {
    if (!this.postsContainer) return;

    const existingCards = this.postsContainer.querySelectorAll('.news-card');
    existingCards.forEach(card => card.remove());
    this.postViews.clear();

    if (posts.length === 0) {
      const empty = createElement('p', {
        className: 'profile-posts__empty',
        textContent: 'Постов пока нет',
      });
      this.postsContainer.appendChild(empty);
      return;
    }

    posts.forEach(post => {
      if (!post.user && this.profileUser) {
        post.user = this.profileUser;
      }

      const postView = new PostView({
        post,
        currentUser: this.currentUser,
        onLike: this.handleLike.bind(this),
        onComment: this.handleOpenComments.bind(this),
        onDelete: this.handleDelete.bind(this),
      });

      const element = postView.render();
      this.postsContainer!.appendChild(element);
      this.postViews.set(post.id, postView);
    });
  }

  private async handleCreatePost(content: string): Promise<void> {
    if (!this.currentUser) return;

    this.postForm?.disable();

    try {
      const newPost = await postService.create(this.currentUser.id, {
        content,
      });
      newPost.user = this.currentUser;

      const postView = new PostView({
        post: newPost,
        currentUser: this.currentUser,
        onLike: this.handleLike.bind(this),
        onComment: this.handleOpenComments.bind(this),
        onDelete: this.handleDelete.bind(this),
      });

      const element = postView.render();

      const emptyEl = this.postsContainer?.querySelector(
        '.profile-posts__empty'
      );
      if (emptyEl) emptyEl.remove();

      const firstPost = this.postsContainer?.querySelector('.news-card');
      if (firstPost) {
        this.postsContainer?.insertBefore(element, firstPost);
      } else {
        this.postsContainer?.appendChild(element);
      }

      this.postViews.set(newPost.id, postView);
      this.postForm?.clear();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Не удалось создать пост');
    } finally {
      this.postForm?.enable();
    }
  }

  private async handleLike(postId: string): Promise<void> {
    if (!isAuthenticated()) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    try {
      await likeService.like(postId);

      if (this.profileUser) {
        const posts = await postService.getUserPosts(this.profileUser.id);
        const updatedPost = posts.find(p => p.id === postId);
        const postView = this.postViews.get(postId);
        if (updatedPost && postView) {
          postView.updateLikes(
            updatedPost.likes,
            updatedPost.likedByUser || false
          );
        }
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

      if (this.postViews.size === 0 && this.postsContainer) {
        const empty = createElement('p', {
          className: 'profile-posts__empty',
          textContent: 'Постов пока нет',
        });
        this.postsContainer.appendChild(empty);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }

  private showError(message: string): void {
    const profile = querySelector<HTMLElement>('.profile');
    if (profile) {
      clearChildren(profile);
      const error = createElement('div', {
        className: 'error-message',
        textContent: message,
      });
      profile.appendChild(error);
    }
  }
}
