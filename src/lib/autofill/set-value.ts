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

export function getCurrentValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string {
  return element.value ?? '';
}
