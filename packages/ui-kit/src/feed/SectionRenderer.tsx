import React from 'react';
import { View } from 'react-native';
import type { FeedSection, KindredCardVM, SceneSummaryVM, QuestInviteVM } from '@internal/contracts';
import { KindredCard } from './KindredCard';
import { SceneCarousel } from './SceneCarousel';
import { QuestStack } from './QuestStack';

export interface SectionRendererProps {
  section: FeedSection;
  onSendSignal?: (card: KindredCardVM) => void;
  onSelectScene?: (scene: SceneSummaryVM) => void;
  onJoinQuest?: (quest: QuestInviteVM) => void;
}

export function SectionRenderer({
  section,
  onSendSignal = () => {},
  onSelectScene = () => {},
  onJoinQuest = () => {},
}: SectionRendererProps) {
  switch (section.component) {
    case 'SceneCarousel':
      return <SceneCarousel section={section} onSelectScene={onSelectScene} />;
    case 'QuestStack':
      return <QuestStack section={section} onJoinQuest={onJoinQuest} />;
    case 'KindredList':
      return (
        <View style={{ paddingHorizontal: 16 }}>
          {section.items.map((card) => (
            <KindredCard key={card.userId} card={card} onSendSignal={onSendSignal} />
          ))}
        </View>
      );
    case 'ExploreNichesCTA':
    default:
      return null;
  }
}

export * from './KindredCard';
export * from './SceneCarousel';
export * from './QuestStack';
