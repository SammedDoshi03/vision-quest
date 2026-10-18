import { Injectable } from '@nestjs/common';
import type {
  KindredCardVM,
  KindredListSection,
  SceneCarouselSection,
  QuestStackSection,
  SceneSummaryVM,
  QuestInviteVM,
} from '@internal/contracts';
import type { KindredMatchCandidate, ProfileCardSummary } from '../services/domain-services';

const RARE_IDF_THRESHOLD = 4.0;

export interface MapperContext {
  viewerId: string;
  locale: string;
  visibleUserIds: Set<string>;
  cardsMap: Map<string, ProfileCardSummary>;
}

@Injectable()
export class FeedViewModelMapper {
  kindredList(
    candidates: KindredMatchCandidate[],
    ctx: MapperContext
  ): KindredListSection {
    const items: KindredCardVM[] = [];

    for (const c of candidates) {
      if (!ctx.visibleUserIds.has(c.userId)) continue;
      const card = ctx.cardsMap.get(c.userId);
      if (!card) continue;

      // Sort shared cultural tags with rarest tags first
      const sortedTags = [...c.sharedTags].sort((a, b) => b.idf - a.idf);
      const topTags = sortedTags.slice(0, 3);
      const rarestTag = topTags[0];

      // Privacy: server-side progressive blur query params
      const photoUri =
        card.revealLevel < 2
          ? `${card.primaryPhoto.uri}?blur=40`
          : card.primaryPhoto.uri;

      const hookText =
        c.origin === 'scene'
          ? `Co-present at ${c.originTitle || 'Scene'}`
          : `Deep alignment in ${rarestTag?.label || 'shared culture'}`;

      const cardVM: KindredCardVM = {
        userId: card.userId,
        displayName: card.displayName,
        age: card.age,
        photo: {
          uri: photoUri,
          blurhash: card.primaryPhoto.blurhash,
          aspectRatio: card.primaryPhoto.width / card.primaryPhoto.height,
          alt: card.primaryPhoto.altText || `Photo of ${card.displayName}`,
        },
        hook: {
          kind: c.origin,
          text: hookText,
        },
        sharedTags: topTags.map((t) => ({
          id: t.tagId,
          label: t.label,
          emphasis: t.idf >= RARE_IDF_THRESHOLD ? 'rare' : 'common',
        })),
        primaryAction: {
          type: 'OPEN_SIGNAL_COMPOSER',
          label: 'Send Cultural Wave',
          promptId: c.suggestedPromptId,
        },
        a11y: {
          label: `${card.displayName}, ${card.age}. ${topTags.length} shared cultural interests, including ${rarestTag?.label || ''}.`,
          hint: 'Double tap to open signal composer',
        },
      };

      items.push(cardVM);
    }

    return {
      id: 'kindred',
      type: 'kindred',
      component: 'KindredList',
      title: 'Kindred Alignment',
      items,
    };
  }

  sceneCarousel(scenes: SceneSummaryVM[]): SceneCarouselSection {
    return {
      id: 'scenes',
      type: 'scenes',
      component: 'SceneCarousel',
      title: 'Scenes Near You (Now)',
      items: scenes,
    };
  }

  questStack(quests: QuestInviteVM[]): QuestStackSection {
    return {
      id: 'quests',
      type: 'quests',
      component: 'QuestStack',
      title: 'Collaborative Co-Op Quests',
      items: quests,
    };
  }
}
