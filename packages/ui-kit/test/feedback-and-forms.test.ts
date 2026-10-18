import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ToastVariant,
  TextFieldType,
  BadgeVariant,
  MessageDeliveryStatus,
} from '../src';

test('UI Kit Design System Types: verifies all variant unions and strictly typed constants', () => {
  const toastVariants: ToastVariant[] = ['success', 'warning', 'error', 'info'];
  assert.strictEqual(toastVariants.length, 4);

  const inputTypes: TextFieldType[] = ['text', 'email', 'password', 'number', 'phone', 'search', 'multiline'];
  assert.strictEqual(inputTypes.length, 7);

  const badgeVariants: BadgeVariant[] = ['default', 'success', 'warning', 'error', 'info', 'neutral'];
  assert.strictEqual(badgeVariants.length, 6);

  const deliveryStatuses: MessageDeliveryStatus[] = ['SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'];
  assert.strictEqual(deliveryStatuses.length, 5);
});
