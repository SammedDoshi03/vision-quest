export const PatientTheme = {
  colors: {
    background: '#FFFFFF',
    textPrimary: '#111827',     // Pure dark for 14:1 contrast ratio (WCAG AAA)
    textSecondary: '#374151',
    dueNow: '#DC2626',          // Alert Red
    dueNowBg: '#FEE2E2',
    taken: '#15803D',           // High contrast Forest Green
    takenBg: '#DCFCE7',
    upcoming: '#4B5563',
    upcomingBg: '#F3F4F6',
    cardBackground: '#F9FAFB',
    cardBorder: '#D1D5DB',
    emergencyButton: '#B91C1C',
  },
  typography: {
    display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
    headline: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    bodyLarge: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    label: { fontSize: 18, fontWeight: '500' as const, lineHeight: 24 },
  },
  touchTarget: {
    minHeight: 64,
    minWidth: 64,
    borderRadius: 16,
  },
};

export const CaregiverTheme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#0F766E',         // Calming Medical Teal
    primaryHover: '#115E59',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    criticalBadge: '#EF4444',
    criticalBg: '#FEE2E2',
    warningBadge: '#F59E0B',
    warningBg: '#FEF3C7',
    successBadge: '#10B981',
    successBg: '#D1FAE5',
  },
  typography: {
    title: { fontSize: 20, fontWeight: '700' as const },
    subhead: { fontSize: 15, fontWeight: '600' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '500' as const },
  },
  touchTarget: {
    minHeight: 44,
    borderRadius: 8,
  },
};
