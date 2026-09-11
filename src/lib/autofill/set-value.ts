/**
 * Sets a value on native and React-controlled inputs by writing through the
 * value setter and dispatching input/change events frameworks listen for.
 */
export function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string,
): void {
  if (element instanceof HTMLSelectElement) {
    const option = Array.from(element.options).find(
      (item) =>
        item.value.toLowerCase() === value.toLowerCase() ||
        item.text.toLowerCase() === value.toLowerCase(),
    );
    if (option) {
      element.value = option.value;
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
  descriptor?.set?.call(element, value);

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

export function fileMatchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return name.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
}

export function setNativeFile(input: HTMLInputElement, file: File): boolean {
  if (input.disabled || (input.accept && !fileMatchesAccept(file, input.accept))) {
    return false;
  }

  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return (input.files?.length ?? 0) > 0;
}

export function getCurrentValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string {
  if (element instanceof HTMLInputElement && element.type === 'file') {
    return element.files?.[0]?.name ?? '';
  }
  return element.value ?? '';
}
