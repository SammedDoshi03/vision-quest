export const MIN_TOUCH_TARGET_SIZE = 44; // 44pt iOS / 48dp Android guidelines

export function toMeetTouchTarget(element: { props?: { style?: Record<string, unknown> } }) {
  const style = element?.props?.style || {};
  const width = (style.minWidth || style.width || 0) as number;
  const height = (style.minHeight || style.height || 0) as number;
  const pass = width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;

  return {
    pass,
    message: () =>
      pass
        ? `Expected element not to meet minimum touch target of ${MIN_TOUCH_TARGET_SIZE}x${MIN_TOUCH_TARGET_SIZE}, but it did (${width}x${height})`
        : `Expected element to meet minimum touch target of ${MIN_TOUCH_TARGET_SIZE}x${MIN_TOUCH_TARGET_SIZE}, but received width=${width}, height=${height}`,
  };
}

export function toHaveAccessibleName(element: { props?: Record<string, unknown> }, expectedName: string) {
  const label = element?.props?.accessibilityLabel;
  const pass = label === expectedName;

  return {
    pass,
    message: () =>
      pass
        ? `Expected element not to have accessible name "${expectedName}"`
        : `Expected accessible name "${expectedName}", but received "${label}"`,
  };
}
