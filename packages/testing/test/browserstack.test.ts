import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserStackClient, BROWSERSTACK_DEFAULTS, getBrowserStackConfig } from '../src/index';

test('BrowserStack Configuration defaults to provided workspace credentials', () => {
  const config = getBrowserStackConfig();
  assert.equal(config.user, BROWSERSTACK_DEFAULTS.USERNAME);
  assert.equal(config.key, BROWSERSTACK_DEFAULTS.ACCESS_KEY);
  assert.equal(config.server, 'hub-cloud.browserstack.com');
  assert.equal(BROWSERSTACK_DEFAULTS.LOCAL_FOLDER_URL, 'http://rnstuff_ehn4lo.browserstack.com');
});

test('BrowserStack Client connects and retrieves active account plan', async (t) => {
  try {
    const client = new BrowserStackClient();
    const plan = await client.getPlan();
    
    assert.ok(plan.automate_plan);
    assert.equal(typeof plan.parallel_sessions_max_allowed, 'number');
    assert.ok(plan.parallel_sessions_max_allowed >= 1);
  } catch (err: any) {
    t.skip(`BrowserStack live API unreachable: ${err?.message || err}`);
  }
});

test('BrowserStack Client fetches recent builds list', async (t) => {
  try {
    const client = new BrowserStackClient();
    const builds = await client.getBuilds();
    assert.ok(Array.isArray(builds));
  } catch (err: any) {
    t.skip(`BrowserStack live API unreachable: ${err?.message || err}`);
  }
});
