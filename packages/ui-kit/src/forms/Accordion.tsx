import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';

export interface AccordionSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  sections: AccordionSection[];
  allowMultipleExpanded?: boolean;
  initialExpandedIds?: string[];
  testID?: string;
}

export function Accordion({
  sections,
  allowMultipleExpanded = false,
  initialExpandedIds = [],
  testID = 'accordion',
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(initialExpandedIds);

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const isExpanded = prev.includes(id);
      if (isExpanded) {
        return prev.filter((item) => item !== id);
      } else {
        return allowMultipleExpanded ? [...prev, id] : [id];
      }
    });
  };

  return (
    <View style={styles.container} testID={testID}>
      {sections.map((sec) => (
        <AccordionItem
          key={sec.id}
          section={sec}
          isExpanded={expandedIds.includes(sec.id)}
          onToggle={() => toggleSection(sec.id)}
        />
      ))}
    </View>
  );
}

function AccordionItem({
  section,
  isExpanded,
  onToggle,
}: {
  section: AccordionSection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const arrowAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(arrowAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, arrowAnim]);

  const rotateZ = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.itemWrapper}>
      <Pressable
        style={styles.headerBtn}
        onPress={onToggle}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={section.title}
      >
        {section.icon && <Text style={styles.headerIcon}>{section.icon}</Text>}
        <View style={styles.headerTextCol}>
          <Text style={styles.titleText}>{section.title}</Text>
          {section.subtitle && <Text style={styles.subtitleText}>{section.subtitle}</Text>}
        </View>

        <Animated.View style={{ transform: [{ rotateZ }] }}>
          <Text style={styles.arrowIcon}>›</Text>
        </Animated.View>
      </Pressable>

      {isExpanded && <View style={styles.contentBody}>{section.content}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  headerIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B',
  },
  contentBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#090D16',
  },
});
