import {
  createElement,
  createButton,
  clearChildren,
  addListener,
} from '@/utils';

export interface ModalViewOptions {
  title: string;
  onClose?: () => void;
}

export class ModalView {
  private overlay: HTMLElement | null = null;
  private modal: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private options: ModalViewOptions;
  private cleanupListeners: (() => void)[] = [];

  constructor(options: ModalViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    this.overlay = createElement('div', {
      className: 'modal-overlay',
    });

    this.modal = createElement('div', {
      className: 'modal',
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'modal-title',
      },
    });

    const header = createElement('div', { className: 'modal__header' });

    const title = createElement('h2', {
      className: 'modal__title',
      textContent: this.options.title,
      attributes: { id: 'modal-title' },
    });
    header.appendChild(title);

    const closeButton = createButton('×', {
      className: 'modal__close',
      attributes: { 'aria-label': 'Закрыть' },
    });
    header.appendChild(closeButton);

    this.modal.appendChild(header);

    this.content = createElement('div', { className: 'modal__content' });
    this.modal.appendChild(this.content);

    this.overlay.appendChild(this.modal);

    const removeOverlayListener = addListener(this.overlay, 'click', e => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    this.cleanupListeners.push(removeOverlayListener);

    const removeCloseListener = addListener(closeButton, 'click', () => {
      this.close();
    });
    this.cleanupListeners.push(removeCloseListener);

    const removeKeyListener = addListener(
      document.body as unknown as HTMLElement,
      'keydown',
      ((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.close();
        }
      }) as EventListener
    );
    this.cleanupListeners.push(removeKeyListener);

    return this.overlay;
  }

  open(): void {
    if (!this.overlay) {
      this.render();
    }
    if (this.overlay) {
      document.body.appendChild(this.overlay);
      document.body.style.overflow = 'hidden';
      this.overlay.classList.add('modal-overlay--visible');
    }
  }

  close(): void {
    if (this.overlay) {
      this.overlay.classList.remove('modal-overlay--visible');
      document.body.style.overflow = '';
      this.overlay.remove();
    }
    this.options.onClose?.();
  }

  setContent(content: HTMLElement | HTMLElement[]): void {
    if (!this.content) return;

    clearChildren(this.content);

    if (Array.isArray(content)) {
      content.forEach(el => this.content!.appendChild(el));
    } else {
      this.content.appendChild(content);
    }
  }

  appendContent(content: HTMLElement): void {
    this.content?.appendChild(content);
  }

  getContentContainer(): HTMLElement | null {
    return this.content;
  }

  setTitle(title: string): void {
    const titleEl = this.modal?.querySelector('.modal__title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  getElement(): HTMLElement | null {
    return this.overlay;
  }

  destroy(): void {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
    document.body.style.overflow = '';
    this.overlay?.remove();
    this.overlay = null;
    this.modal = null;
    this.content = null;
  }
}
