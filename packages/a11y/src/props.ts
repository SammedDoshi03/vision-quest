import type { AccessibilityActionEvent, AccessibilityProps, Role } from 'react-native';

export interface AccessibleButtonOptions {
  label: string;
  hint?: string;
  disabled?: boolean;
  busy?: boolean;
}

export interface AccessibleAdjustableOptions {
  label: string;
  valueText: string;
  hint?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  actions?: { name: string; label: string }[];
  onCustomAction?: (name: string) => void;
}

export const a11y = {
  button: (opts: AccessibleButtonOptions): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: opts.label,
    accessibilityHint: opts.hint,
    accessibilityState: {
      disabled: Boolean(opts.disabled),
      busy: Boolean(opts.busy),
    },
  }),

  heading: (): AccessibilityProps => ({
    accessibilityRole: 'header',
  }),

  dialog: (opts: { label: string }): AccessibilityProps & { role: Role } => ({
    accessible: true,
    role: 'dialog',
    accessibilityLabel: opts.label,
    accessibilityViewIsModal: true,
  }),

  image: (opts: { alt: string; decorative?: boolean }): AccessibilityProps => {
    if (opts.decorative) {
      return {
        accessible: false,
        importantForAccessibility: 'no',
      };
    }
    return {
      accessible: true,
      accessibilityRole: 'image',
      accessibilityLabel: opts.alt,
    };
  },

  tab: (opts: { label: string; selected: boolean }): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: opts.label,
    accessibilityState: {
      selected: opts.selected,
    },
  }),

  adjustable: (opts: AccessibleAdjustableOptions): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'adjustable',
    accessibilityLabel: opts.label,
    accessibilityHint: opts.hint,
    accessibilityValue: { text: opts.valueText },
    accessibilityActions: [
      { name: 'increment', label: 'Increment' },
      { name: 'decrement', label: 'Decrement' },
      ...(opts.actions ?? []),
    ],
    onAccessibilityAction: (e: AccessibilityActionEvent) => {
      const name = e.nativeEvent.actionName;
      if (name === 'increment') {
        opts.onIncrement();
      } else if (name === 'decrement') {
        opts.onDecrement();
      } else {
        opts.onCustomAction?.(name);
      }
    },
  }),
};
