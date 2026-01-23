import { createElement, createButton } from '@/utils';
import { VALIDATION } from '../config/constants';

export interface PostFormViewOptions {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export class PostFormView {
  private element: HTMLElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private submitButton: HTMLButtonElement | null = null;
  private charCounter: HTMLElement | null = null;
  private options: PostFormViewOptions;

  constructor(options: PostFormViewOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    this.element = createElement('div', {
      className: 'profile-post-form',
    });

    this.textarea = createElement('textarea', {
      className: 'profile-textarea',
      attributes: {
        placeholder: this.options.placeholder || 'Введите свой пост',
        'aria-label': 'Новый пост',
        maxlength: String(VALIDATION.POST_MAX_LENGTH),
      },
    });
    this.element.appendChild(this.textarea);

    this.charCounter = createElement('span', {
      className: 'char-counter',
      textContent: `0/${VALIDATION.POST_MAX_LENGTH}`,
    });
    this.element.appendChild(this.charCounter);

    this.submitButton = createButton('Отправить', {
      className: 'button button--primary button--send',
      type: 'button',
    });
    this.element.appendChild(this.submitButton);

    this.attachEvents();

    return this.element;
  }

  private attachEvents(): void {
    if (this.textarea) {
      this.textarea.addEventListener('input', () => {
        this.updateCharCounter();
      });
    }

    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        this.handleSubmit();
      });
    }

    if (this.textarea) {
      this.textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      });
    }
  }

  private updateCharCounter(): void {
    if (this.textarea && this.charCounter) {
      const length = this.textarea.value.length;
      this.charCounter.textContent = `${length}/${VALIDATION.POST_MAX_LENGTH}`;

      if (length > VALIDATION.POST_MAX_LENGTH * 0.9) {
        this.charCounter.classList.add('char-counter--warning');
      } else {
        this.charCounter.classList.remove('char-counter--warning');
      }
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
      this.updateCharCounter();
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

  getContent(): string {
    return this.textarea?.value.trim() || '';
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.textarea = null;
    this.submitButton = null;
    this.charCounter = null;
  }
}
