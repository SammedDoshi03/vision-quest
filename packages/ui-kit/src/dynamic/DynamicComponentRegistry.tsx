import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, TextInput } from 'react-native';
import { DynamicComponentDefinition, DynamicAction } from '@internal/contracts';
import { UniversalEntityCard } from '../components/UniversalEntityCard';
import { Button } from '../components/Button';
import { useTheme } from '../theme';
import { SDUIComponentBoundary } from './SDUIComponentBoundary';
import { MetricCardSkeleton, EntityCardSkeleton, StatusBannerSkeleton } from './SDUISkeletons';

export interface DynamicComponentProps {
  definition: DynamicComponentDefinition;
  onDispatchAction?: (action: DynamicAction) => void;
  activeRole: 'primary' | 'secondary';
  toggleStates?: Record<string, boolean>;
  onToggleChange?: (id: string, value: boolean) => void;
}

export function DynamicComponentRegistry(props: DynamicComponentProps) {
  const { definition } = props;

  // Role visibility filter check
  if (
    definition.roleVisibility &&
    definition.roleVisibility.length > 0 &&
    !definition.roleVisibility.includes(props.activeRole)
  ) {
    return null;
  }

  return (
    <SDUIComponentBoundary componentId={definition.id} componentType={definition.type}>
      <InnerDynamicComponent {...props} />
    </SDUIComponentBoundary>
  );
}

// Attach static 1:1 skeleton twins
DynamicComponentRegistry.MetricSkeleton = MetricCardSkeleton;
DynamicComponentRegistry.EntitySkeleton = EntityCardSkeleton;
DynamicComponentRegistry.BannerSkeleton = StatusBannerSkeleton;

function InnerDynamicComponent({
  definition,
  onDispatchAction,
  activeRole,
  toggleStates = {},
  onToggleChange,
}: DynamicComponentProps) {
  const theme = useTheme();
  const { type, props, action, testID } = definition;

  // Internal state for interactive elements
  const [isMaskRevealed, setIsMaskRevealed] = useState(false);
  const [otpValue, setOtpValue] = useState(props.defaultValue || '');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  switch (type) {
    // ==========================================
    // 1. Layout Primitives
    // ==========================================
    case 'BOX':
      return (
        <View
          style={[
            styles.box,
            props.padding && { padding: props.padding },
            props.backgroundColor && { backgroundColor: props.backgroundColor },
            props.borderRadius && { borderRadius: props.borderRadius },
          ]}
          testID={testID}
        >
          {props.children?.map((childDef: DynamicComponentDefinition) => (
            <DynamicComponentRegistry
              key={childDef.id}
              definition={childDef}
              onDispatchAction={onDispatchAction}
              activeRole={activeRole}
              toggleStates={toggleStates}
              onToggleChange={onToggleChange}
            />
          ))}
        </View>
      );

    case 'HSTACK':
      return (
        <View
          style={[
            styles.hStack,
            props.gap && { gap: props.gap },
            props.justify && { justifyContent: props.justify },
          ]}
          testID={testID}
        >
          {props.children?.map((childDef: DynamicComponentDefinition) => (
            <DynamicComponentRegistry
              key={childDef.id}
              definition={childDef}
              onDispatchAction={onDispatchAction}
              activeRole={activeRole}
              toggleStates={toggleStates}
              onToggleChange={onToggleChange}
            />
          ))}
        </View>
      );

    case 'VSTACK':
      return (
        <View
          style={[
            styles.vStack,
            props.gap && { gap: props.gap },
            props.align && { alignItems: props.align },
          ]}
          testID={testID}
        >
          {props.children?.map((childDef: DynamicComponentDefinition) => (
            <DynamicComponentRegistry
              key={childDef.id}
              definition={childDef}
              onDispatchAction={onDispatchAction}
              activeRole={activeRole}
              toggleStates={toggleStates}
              onToggleChange={onToggleChange}
            />
          ))}
        </View>
      );

    case 'SPACER':
      return <View style={{ height: props.size || 16 }} testID={testID} />;

    case 'DIVIDER':
      return <View style={styles.divider} testID={testID} />;

    // ==========================================
    // 2. Form & Composite Primitives
    // ==========================================
    case 'OTP_INPUT':
      return (
        <View style={styles.otpCard} testID={testID}>
          <Text style={styles.otpLabel}>{props.label || 'Enter 4-Digit Code'}</Text>
          <View style={styles.otpBoxesRow}>
            {[0, 1, 2, 3].map((idx) => (
              <View key={idx} style={styles.otpBox}>
                <Text style={styles.otpChar}>{otpValue[idx] || '—'}</Text>
              </View>
            ))}
          </View>
          <TextInput
            style={styles.hiddenInput}
            value={otpValue}
            maxLength={4}
            keyboardType="number-pad"
            onChangeText={(val) => {
              setOtpValue(val);
              if (val.length === 4 && action) {
                onDispatchAction?.({ ...action, payload: { ...action.payload, code: val } });
              }
            }}
            placeholder="Tap to enter code"
            placeholderTextColor="#64748B"
          />
          {props.hint && <Text style={styles.otpHint}>{props.hint}</Text>}
        </View>
      );

    case 'SECURE_MASKED_FIELD':
      return (
        <View style={styles.maskedCard} testID={testID}>
          <View style={{ flex: 1 }}>
            <Text style={styles.maskedLabel}>{props.label || 'CVV / PIN'}</Text>
            <Text style={styles.maskedValue}>
              {isMaskRevealed ? props.value : '••••'}
            </Text>
          </View>
          <Pressable
            style={styles.revealBtn}
            onPress={() => setIsMaskRevealed((prev) => !prev)}
          >
            <Text style={styles.revealBtnText}>{isMaskRevealed ? 'Hide' : 'Reveal'}</Text>
          </Pressable>
        </View>
      );

    case 'SEGMENTED_BAR':
      return (
        <View style={styles.gaugeContainer} testID={testID}>
          <View style={styles.gaugeHeader}>
            <Text style={styles.gaugeTitle}>{props.title || 'Storage Allocation'}</Text>
            <Text style={styles.gaugeFraction}>{props.fraction || '102 GB / 200 GB'}</Text>
          </View>
          <View style={styles.gaugeTrack}>
            {(props.segments || [
              { width: '45%', color: '#38BDF8', label: 'Photos' },
              { width: '25%', color: '#818CF8', label: 'Docs' },
              { width: '10%', color: '#F43F5E', label: 'System' },
            ]).map((seg: any, i: number) => (
              <View
                key={i}
                style={[styles.gaugeSegment, { width: seg.width, backgroundColor: seg.color }]}
              />
            ))}
          </View>
          <View style={styles.segmentLegendRow}>
            {(props.segments || []).map((seg: any, i: number) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
                <Text style={styles.legendText}>{seg.label}</Text>
              </View>
            ))}
          </View>
        </View>
      );

    case 'CHECKLIST_GROUP':
      return (
        <View style={styles.checklistCard} testID={testID}>
          <Text style={styles.checklistTitle}>{props.title || 'Safety & Verification Checklist'}</Text>
          {(props.items || []).map((item: any) => {
            const isDone = checkedItems[item.id] ?? false;
            return (
              <Pressable
                key={item.id}
                style={styles.checklistItem}
                onPress={() => {
                  const updated = { ...checkedItems, [item.id]: !isDone };
                  setCheckedItems(updated);
                  if (action) {
                    onDispatchAction?.({ ...action, payload: { ...action.payload, checked: updated } });
                  }
                }}
              >
                <View style={[styles.checkCircle, isDone && styles.checkCircleActive]}>
                  {isDone && <Text style={styles.checkCheckmark}>✓</Text>}
                </View>
                <Text style={[styles.checkItemLabel, isDone && styles.checkItemLabelDone]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      );

    case 'SCANNER_VIEWPORT':
      return (
        <View style={styles.scannerCard} testID={testID}>
          <View style={styles.scannerFrame}>
            <Text style={styles.scannerIcon}>📷</Text>
            <Text style={styles.scannerText}>{props.prompt || 'Scan UPI QR Code'}</Text>
          </View>
          <Button
            label={props.actionLabel || 'Simulate QR Detection'}
            variant="secondary"
            onPress={action ? () => onDispatchAction?.(action) : () => {}}
          />
        </View>
      );

    case 'HARDWARE_PROBE_CARD':
      return (
        <View style={styles.probeCard} testID={testID}>
          <View style={styles.probeHeader}>
            <Text style={styles.probeIcon}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.probeTitle}>{props.title || 'Optical Meter BLE Probe'}</Text>
              <Text style={styles.probeStatus}>{props.status || 'Beacon Scanning...'}</Text>
            </View>
          </View>
          <Button
            label={props.actionLabel || 'Connect Probe'}
            variant="primary"
            onPress={action ? () => onDispatchAction?.(action) : () => {}}
          />
        </View>
      );

    // ==========================================
    // 3. Classic Dashboard & Interactive Molecules
    // ==========================================
    case 'METRIC_CARD':
      return (
        <View style={styles.metricCard} testID={testID}>
          <Text style={styles.metricLabel}>{props.label}</Text>
          <Text style={[styles.metricValue, { color: props.accentColor || '#FFFFFF' }]}>
            {props.value}
          </Text>
          {props.delta && <Text style={styles.metricDelta}>{props.delta}</Text>}
        </View>
      );

    case 'ENTITY_LIST':
      return (
        <UniversalEntityCard
          title={props.title}
          subtitle={props.subtitle}
          badge={props.badge ? { label: props.badge, variant: 'neutral' } : undefined}
          metadata={props.value ? [{ label: 'Price / Value', value: props.value }] : []}
          primaryAction={
            props.actionLabel
              ? {
                  label: props.actionLabel,
                  onPress: () => {
                    if (action) onDispatchAction?.(action);
                  },
                }
              : undefined
          }
        />
      );

    case 'STATUS_BANNER':
      const isCritical = props.level === 'CRITICAL';
      return (
        <Pressable
          style={[styles.banner, isCritical ? styles.bannerCritical : styles.bannerInfo]}
          onPress={action ? () => onDispatchAction?.(action) : undefined}
          testID={testID}
        >
          <Text style={[styles.bannerTitle, isCritical && styles.bannerTitleCritical]}>
            {props.title}
          </Text>
          <Text style={styles.bannerMessage}>{props.message}</Text>
        </Pressable>
      );

    case 'TOGGLE_ROW':
      const isChecked = toggleStates[definition.id] ?? Boolean(props.initialValue);
      return (
        <View style={styles.toggleRow} testID={testID}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>{props.title}</Text>
            {props.subtitle && <Text style={styles.toggleSubtitle}>{props.subtitle}</Text>}
          </View>
          <Switch
            value={isChecked}
            onValueChange={(val) => {
              onToggleChange?.(definition.id, val);
              if (action) {
                onDispatchAction?.({ ...action, payload: { ...action.payload, value: val } });
              }
            }}
          />
        </View>
      );

    case 'ACTION_BUTTON':
      return (
        <View style={styles.buttonWrapper} testID={testID}>
          <Button
            label={props.label || 'Action'}
            onPress={action ? () => onDispatchAction?.(action) : () => {}}
            variant={props.variant || 'primary'}
          />
        </View>
      );

    case 'PROGRESS_GAUGE':
      return (
        <View style={styles.gaugeContainer} testID={testID}>
          <View style={styles.gaugeHeader}>
            <Text style={styles.gaugeTitle}>{props.title}</Text>
            <Text style={styles.gaugeFraction}>{props.fraction}</Text>
          </View>
          <View style={styles.gaugeTrack}>
            {(props.segments || [{ width: '70%', color: '#38BDF8' }]).map((seg: any, i: number) => (
              <View
                key={i}
                style={[styles.gaugeSegment, { width: seg.width, backgroundColor: seg.color }]}
              />
            ))}
          </View>
          {props.legend && <Text style={styles.gaugeLegend}>{props.legend}</Text>}
        </View>
      );

    case 'AUDIO_SOUNDBOX':
      return (
        <View style={styles.soundboxCard} testID={testID}>
          <View style={styles.soundboxSpeaker}>
            <Text style={styles.speakerIcon}>🔊</Text>
            <View>
              <Text style={styles.soundboxModel}>{props.title || 'Soundbox 4G Pro'}</Text>
              <Text style={styles.soundboxStatus}>{props.status || 'Ready for incoming payments'}</Text>
            </View>
          </View>
          <Pressable
            style={styles.soundboxBtn}
            onPress={action ? () => onDispatchAction?.(action) : undefined}
          >
            <Text style={styles.soundboxBtnText}>▶ {props.actionLabel || 'Test Chime'}</Text>
          </Pressable>
        </View>
      );

    case 'FORM_INPUT':
      return (
        <View style={styles.inputContainer} testID={testID}>
          <Text style={styles.inputLabel}>{props.label}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={props.placeholder}
            placeholderTextColor="#64748B"
            defaultValue={props.defaultValue}
          />
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  box: {
    marginVertical: 4,
  },
  hStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  vStack: {
    flexDirection: 'column',
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 12,
  },
  otpCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
    alignItems: 'center',
  },
  otpLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  otpBox: {
    width: 48,
    height: 52,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  otpChar: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '900',
  },
  hiddenInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: '80%',
    textAlign: 'center',
  },
  otpHint: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 8,
  },
  maskedCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maskedLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  maskedValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 2,
  },
  revealBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  revealBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  checklistCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  checklistTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  checkItemLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    flex: 1,
  },
  checkItemLabelDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  scannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    marginBottom: 10,
  },
  scannerFrame: {
    width: '100%',
    height: 120,
    backgroundColor: '#020617',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scannerIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  scannerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  probeCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  probeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  probeIcon: {
    fontSize: 26,
  },
  probeTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  probeStatus: {
    color: '#10B981',
    fontSize: 11,
    marginTop: 2,
  },
  segmentLegendRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  metricCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  metricDelta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  banner: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  bannerCritical: {
    backgroundColor: '#450A0A',
    borderColor: '#DC2626',
  },
  bannerInfo: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  bannerTitleCritical: {
    color: '#F87171',
  },
  bannerMessage: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
    lineHeight: 16,
  },
  toggleRow: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  buttonWrapper: {
    marginVertical: 6,
  },
  gaugeContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  gaugeFraction: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
  },
  gaugeTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeSegment: {
    height: '100%',
  },
  gaugeLegend: {
    color: '#94A3B8',
    fontSize: 11,
  },
  soundboxCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  soundboxSpeaker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  speakerIcon: {
    fontSize: 28,
  },
  soundboxModel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  soundboxStatus: {
    color: '#38BDF8',
    fontSize: 12,
    marginTop: 2,
  },
  soundboxBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  soundboxBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
});
