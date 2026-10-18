import { Injectable, Logger } from '@nestjs/common';
import { coarsenLocation, isPresent, unique, withTimeout, type AuthUser } from '@internal/server-kit';
import type { HomeFeedResponse, FeedSection } from '@internal/contracts';
import { MockDomainServices, type ProfileCardSummary } from '../services/domain-services';
import type { ClientCtx } from '../common/client-context.decorator';
import { FeedViewModelMapper, type MapperContext } from './feed.mapper';

const BUDGET_MS = {
  scenes: 250,
  matching: 450,
  quests: 250,
  profiles: 300,
  safety: 200,
} as const;

@Injectable()
export class FeedOrchestrator {
  private readonly logger = new Logger(FeedOrchestrator.name);

  constructor(
    private readonly domainServices: MockDomainServices,
    private readonly mapper: FeedViewModelMapper
  ) {}

  async buildHomeFeed(
    user: AuthUser,
    query: { lat: number; lng: number; cursor?: string; limit?: number },
    client: ClientCtx
  ): Promise<HomeFeedResponse> {
    const degraded = new Set<string>();

    const safeFetch = <T>(res: PromiseSettledResult<T> | { status: 'fulfilled'; value: T }, name: string): T | null => {
      if (res.status === 'fulfilled') return res.value;
      degraded.add(name);
      this.logger.warn(`Downstream service failed or timed out: ${name}`);
      return null;
    };

    // Coarsen coordinates for user privacy
    const geo = coarsenLocation(query.lat, query.lng, 3);

    // ── Stage 1: Independent Fan-out with per-service latency budgets ──
    const [scenesRes, kindredRes, questsRes] = await Promise.allSettled([
      withTimeout(
        () =>
          this.domainServices.getLiveScenesNearby({
            lat: geo.lat,
            lng: geo.lng,
            radiusKm: 5,
            limit: 6,
          }),
        BUDGET_MS.scenes
      ),
      withTimeout(
        () => this.domainServices.getKindredCandidates(user.id),
        BUDGET_MS.matching
      ),
      withTimeout(
        () => this.domainServices.getOpenQuests(user.id),
        BUDGET_MS.quests
      ),
    ]);

    const liveScenesData = safeFetch(scenesRes, 'scenes');
    const kindredData = safeFetch(kindredRes, 'matching');
    const questsData = safeFetch(questsRes, 'quests');

    // ── Stage 2: Batched Profile Hydration & Trust/Safety Filter ──
    const personIds = unique([
      ...(kindredData?.candidates.map((c: { userId: string }) => c.userId) ?? []),
      ...(liveScenesData?.attendeePreviewIds ?? []),
    ]);

    const [cardsRes, visibleRes] = personIds.length
      ? await Promise.allSettled([
          withTimeout(
            () => this.domainServices.batchGetProfileCards(user.id, personIds),
            BUDGET_MS.profiles
          ),
          withTimeout(
            () => this.domainServices.filterVisible(user.id, personIds),
            BUDGET_MS.safety
          ),
        ])
      : ([{ status: 'fulfilled', value: [] }, { status: 'fulfilled', value: [] }] as [any, any]);

    const cards = safeFetch<ProfileCardSummary[]>(cardsRes, 'profiles') ?? [];
    // Trust & Safety FAILS CLOSED: if blocked list query fails, show 0 candidates to protect users
    const visibleIds = safeFetch<string[]>(visibleRes, 'safety') ?? [];

    const mapperCtx: MapperContext = {
      viewerId: user.id,
      locale: client.locale,
      visibleUserIds: new Set(visibleIds),
      cardsMap: new Map(cards.map((c: { userId: string }) => [c.userId, c as any])),
    };

    // ── Stage 3: Shape into UI Kit View Models & Filter by Client Capabilities ──
    const sections: FeedSection[] = [];

    if (liveScenesData?.scenes.length) {
      sections.push(this.mapper.sceneCarousel(liveScenesData.scenes));
    }

    if (questsData?.length) {
      sections.push(this.mapper.questStack(questsData));
    }

    if (kindredData?.candidates.length && mapperCtx.visibleUserIds.size > 0) {
      sections.push(this.mapper.kindredList(kindredData.candidates, mapperCtx));
    }

    // Filter out any section component the client app's UI kit version cannot yet render
    const filteredSections = sections.filter((s) => client.capabilities.has(s.component));

    return {
      schemaVersion: 3,
      generatedAt: new Date().toISOString(),
      sections: filteredSections,
      pagination: {
        nextCursor: kindredData?.nextCursor ?? null,
      },
      meta: {
        degraded: Array.from(degraded),
        requestId: client.requestId,
      },
    };
  }
}
