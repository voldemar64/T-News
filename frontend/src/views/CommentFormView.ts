import { createElement, createButton } from '@/utils';
import { VALIDATION } from '../config/constants';

export interface CommentFormViewOptions {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export class CommentFormView {
  private element: HTMLElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private submitButton: HTMLButtonElement | null = null;
  private options: CommentFormViewOptions;

  constructor(options: CommentFormViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    this.element = createElement('div', {
      className: 'comment-form',
    });

    this.textarea = createElement('textarea', {
      className: 'comment-form__textarea',
      attributes: {
        placeholder: this.options.placeholder || 'Введите свой комментарий',
        'aria-label': 'Новый комментарий',
        maxlength: String(VALIDATION.COMMENT_MAX_LENGTH),
        rows: '2',
      },
    });
    this.element.appendChild(this.textarea);

    this.submitButton = createButton('Отправить', {
      className: 'button button--primary button--small',
      type: 'button',
    });
    this.element.appendChild(this.submitButton);

    this.attachEvents();

    return this.element;
  }

  private attachEvents(): void {
    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        this.handleSubmit();
      });
    }

    if (this.textarea) {
      this.textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      });
    }
  }

  private handleSubmit(): void {
    if (!this.textarea) return;

    const content = this.textarea.value.trim();
    if (content.length === 0) return;

    this.options.onSubmit(content);
  }

  clear(): void {
    if (this.textarea) {
      this.textarea.value = '';
    }
  }

  disable(): void {
    if (this.textarea) this.textarea.disabled = true;
    if (this.submitButton) this.submitButton.disabled = true;
  }

  enable(): void {
    if (this.textarea) this.textarea.disabled = false;
    if (this.submitButton) this.submitButton.disabled = false;
  }

  focus(): void {
    this.textarea?.focus();
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.textarea = null;
    this.submitButton = null;
  }
}
