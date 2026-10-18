import test from 'node:test';
import assert from 'node:assert/strict';
import { HomeFeedResponseSchema } from '@internal/contracts';
import { createHomeFeedResponseFixture } from '../src/factories';

test('createHomeFeedResponseFixture satisfies HomeFeedResponseSchema validation', () => {
  const fixture = createHomeFeedResponseFixture();
  const parsed = HomeFeedResponseSchema.parse(fixture);
  assert.strictEqual(parsed.schemaVersion, 3);
  assert.strictEqual(parsed.sections.length, 3);
});
