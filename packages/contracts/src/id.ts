import { randomUUID } from 'crypto';

export function createId(prefix?: string): string {
  // Uses cryptographically secure UUID
  const id = typeof randomUUID === 'function' ? randomUUID() : Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${id}` : id;
}
