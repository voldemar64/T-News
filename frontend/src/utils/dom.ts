export interface ElementOptions {
  className?: string;
  textContent?: string;
  attributes?: Record<string, string>;
  dataset?: Record<string, string>;
  children?: (HTMLElement | Text)[];
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }

  if (options.children) {
    options.children.forEach(child => {
      element.appendChild(child);
    });
  }

  return element;
}

export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

export function createFragment(
  elements: (HTMLElement | Text)[]
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  elements.forEach(el => fragment.appendChild(el));
  return fragment;
}

export function clearChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function replaceChildren(
  parent: HTMLElement,
  children: (HTMLElement | Text)[]
): void {
  clearChildren(parent);
  const fragment = createFragment(children);
  parent.appendChild(fragment);
}

export function querySelector<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T | null {
  return parent.querySelector<T>(selector);
}

export function requireElement<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}

export function createImage(
  src: string,
  alt: string,
  options: Omit<ElementOptions, 'textContent'> & {
    width?: number;
    height?: number;
  } = {}
): HTMLImageElement {
  const img = createElement('img', {
    className: options.className,
    attributes: options.attributes,
    dataset: options.dataset,
  });
  img.src = src;
  img.alt = alt;
  if (options.width) img.width = options.width;
  if (options.height) img.height = options.height;
  return img;
}

export function createButton(
  textContent: string,
  options: Omit<ElementOptions, 'textContent'> & {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  } = {}
): HTMLButtonElement {
  const button = createElement('button', {
    className: options.className,
    textContent,
    attributes: options.attributes,
    dataset: options.dataset,
  });
  button.type = options.type || 'button';
  if (options.disabled) button.disabled = true;
  return button;
}

export function addListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

export function showElement(element: HTMLElement): void {
  element.style.display = '';
  element.removeAttribute('hidden');
}

export function hideElement(element: HTMLElement): void {
  element.style.display = 'none';
  element.setAttribute('hidden', '');
}

export function toggleElement(element: HTMLElement, show?: boolean): void {
  const shouldShow = show ?? element.style.display === 'none';
  if (shouldShow) {
    showElement(element);
  } else {
    hideElement(element);
  }
}
