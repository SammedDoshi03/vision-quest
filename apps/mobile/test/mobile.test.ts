import test from 'node:test';
import assert from 'node:assert/strict';

test('apps/mobile project configuration is properly wired', () => {
  const pkg = require('../package.json');
  assert.strictEqual(pkg.name, '@resonance/mobile');
  assert.ok(pkg.dependencies['@internal/ui-kit']);
  assert.ok(pkg.dependencies['@internal/a11y']);
  assert.ok(pkg.dependencies['@internal/auth']);
  assert.ok(pkg.dependencies['@internal/network']);
  assert.ok(pkg.dependencies['@internal/contracts']);
});
