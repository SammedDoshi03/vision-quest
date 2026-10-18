import test from 'node:test';
import assert from 'node:assert/strict';
import { HomeFeedResponseSchema } from '@internal/contracts';
import { FeedController } from '../src/feed/feed.controller';
import { FeedOrchestrator } from '../src/feed/feed.orchestrator';
import { FeedViewModelMapper } from '../src/feed/feed.mapper';
import { MockDomainServices } from '../src/services/domain-services';
import type { ClientCtx } from '../src/common/client-context.decorator';
import type { AuthUser } from '@internal/server-kit/auth';

test('FeedController returns schema-valid HomeFeedResponse with anti-swipe sections', async () => {
  const domainServices = new MockDomainServices();
  const mapper = new FeedViewModelMapper();
  const orchestrator = new FeedOrchestrator(domainServices, mapper);
  const controller = new FeedController(orchestrator);

  const mockUser: AuthUser = {
    id: 'user_viewer_01',
    phoneNumber: '+919876543210',
    status: 'active',
    roles: ['user'],
  };

  const mockClient: ClientCtx = {
    requestId: 'req_test_integration_01',
    locale: 'en-IN',
    platform: 'ios',
    appVersion: '1.0.0',
    uiKitVersion: '1.0.0',
    capabilities: new Set(['KindredList', 'SceneCarousel', 'QuestStack', 'ExploreNichesCTA']),
  };

  const response = await controller.getHomeFeed(
    mockUser,
    { lat: 12.9716, lng: 77.5946, limit: 10 },
    mockClient
  );

  // Validate strictly with Zod schema from @internal/contracts
  const parsed = HomeFeedResponseSchema.parse(response);

  assert.strictEqual(parsed.schemaVersion, 3);
  assert.ok(parsed.sections.length >= 2, 'Expected at least 2 sections');

  const sceneSection = parsed.sections.find((s) => s.component === 'SceneCarousel');
  assert.ok(sceneSection, 'Expected SceneCarousel section');

  const kindredSection = parsed.sections.find((s) => s.component === 'KindredList');
  assert.ok(kindredSection, 'Expected KindredList section');
  if (kindredSection && kindredSection.component === 'KindredList') {
    assert.ok(kindredSection.items.length > 0);
    const firstCard = kindredSection.items[0];
    assert.strictEqual(firstCard.displayName, 'Asha');
    assert.ok(firstCard.a11y.label.includes('Asha'));
  }
});
