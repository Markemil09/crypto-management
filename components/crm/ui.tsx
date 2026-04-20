import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import { CRM_LEADS, CRM_COLORS } from '@/constants/crm';

type NavItem = {
  href: '/' | '/portfolio' | '/leads' | '/market';
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/portfolio', label: 'Portfolio', icon: 'account-balance-wallet' },
  { href: '/leads', label: 'Lead Management', icon: 'hub' },
  { href: '/market', label: 'Market Explorer', icon: 'candlestick-chart' },
];

export function formatCurrency(value: number | null | undefined, compact = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 2 : 0,
  }).format(value ?? 0);
}

export function formatPercent(value: number | null | undefined) {
  const number = value ?? 0;
  const sign = number > 0 ? '+' : '';

  return `${sign}${number.toFixed(2)}%`;
}

export function formatCompactNumber(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

export function Shell({
  title,
  children,
  action,
}: PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1080;

  return (
    <View style={styles.screen}>
      {isDesktop ? (
        <View style={styles.sidebar}>
          <View>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <MaterialIcons color="#004346" name="account-balance" size={20} />
              </View>
              <View>
                <Text style={styles.brandTitle}>EM Capital</Text>
                <Text style={styles.brandSubtitle}>Crypto CRM</Text>
              </View>
            </View>

            <View style={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                return (
                  <Pressable
                    key={item.href}
                    onPress={() => router.push(item.href)}
                    style={[styles.navItem, active && styles.navItemActive]}>
                    <MaterialIcons
                      color={active ? CRM_COLORS.primary : CRM_COLORS.textMuted}
                      name={item.icon}
                      size={20}
                    />
                    <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.sidebarFooter}>
            <Text style={styles.footerTitle}>CRM Snapshot</Text>
            <Text style={styles.footerText}>{CRM_LEADS.length} active investor profiles</Text>
            <Text style={styles.footerText}>6 hot opportunities in motion</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.contentWrap}>
        <View style={styles.topBar}>
          <View style={styles.searchBox}>
            <MaterialIcons color={CRM_COLORS.textSoft} name="search" size={18} />
            <TextInput
              placeholder="Search coins, leads, or wallets"
              placeholderTextColor={CRM_COLORS.textSoft}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.topActions}>
            <HeaderIcon name="notifications" />
            <HeaderIcon name="account-balance-wallet" />
            <HeaderIcon name="settings" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderText}>
              <Text style={styles.pageEyebrow}>EM</Text>
              <Text style={styles.pageTitle}>{title}</Text>
            </View>
            {action ? <View>{action}</View> : null}
          </View>

          {children}
        </ScrollView>
      </View>
    </View>
  );
}

function HeaderIcon({ name }: { name: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <Pressable style={styles.headerIcon}>
      <MaterialIcons color={CRM_COLORS.textMuted} name={name} size={18} />
    </Pressable>
  );
}

export function Panel({
  children,
  style,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function StatCard({
  label,
  value,
  accent,
  detail,
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  detail?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <Panel style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <MaterialIcons color={CRM_COLORS.textSoft} name={icon} size={28} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {detail ? <Text style={[styles.statDetail, accent ? { color: accent } : null]}>{detail}</Text> : null}
    </Panel>
  );
}

export function SectionTitle({
  title,
  description,
  right,
}: {
  title: string;
  description: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      {right}
    </View>
  );
}

export function ChangePill({ value }: { value: number | null | undefined }) {
  const positive = (value ?? 0) >= 0;

  return (
    <View
      style={[
        styles.changePill,
        { backgroundColor: positive ? 'rgba(63,255,139,0.12)' : 'rgba(255,113,108,0.12)' },
      ]}>
      <MaterialIcons
        color={positive ? CRM_COLORS.success : CRM_COLORS.danger}
        name={positive ? 'trending-up' : 'trending-down'}
        size={14}
      />
      <Text style={[styles.changePillText, { color: positive ? CRM_COLORS.success : CRM_COLORS.danger }]}>
        {formatPercent(value)}
      </Text>
    </View>
  );
}

export function CoinAvatar({
  image,
  symbol,
  size = 38,
}: {
  image?: string;
  symbol: string;
  size?: number;
}) {
  return image ? (
    <Image source={{ uri: image }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View
      style={[
        styles.symbolFallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <Text style={styles.symbolFallbackText}>{symbol.slice(0, 3)}</Text>
    </View>
  );
}

export function Sparkline({ values }: { values: number[] | undefined }) {
  if (!values?.length) {
    return <View style={styles.sparklineFallback} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const sample = values.filter((_, index) => index % Math.ceil(values.length / 24) === 0).slice(0, 24);
  const up = sample[sample.length - 1] >= sample[0];

  return (
    <View style={styles.sparkline}>
      {sample.map((value, index) => (
        <View
          key={`${value}-${index}`}
          style={[
            styles.sparkBar,
            {
              height: 12 + ((value - min) / range) * 32,
              backgroundColor: up ? 'rgba(63,255,139,0.8)' : 'rgba(255,113,108,0.8)',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CRM_COLORS.background,
    flexDirection: 'row',
  },
  sidebar: {
    width: 270,
    backgroundColor: CRM_COLORS.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: CRM_COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 28,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CRM_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#67e8f9',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    color: CRM_COLORS.textSoft,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  navList: {
    marginTop: 36,
    gap: 8,
  },
  navItem: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(161,250,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(161,250,255,0.18)',
  },
  navLabel: {
    color: CRM_COLORS.textMuted,
    fontWeight: '700',
    fontSize: 14,
  },
  navLabelActive: {
    color: CRM_COLORS.primary,
  },
  sidebarFooter: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: CRM_COLORS.surface,
    borderWidth: 1,
    borderColor: CRM_COLORS.border,
    gap: 6,
  },
  footerTitle: {
    color: CRM_COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  footerText: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
  },
  contentWrap: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CRM_COLORS.border,
    backgroundColor: 'rgba(12,14,23,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CRM_COLORS.surfaceStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    flex: 1,
    maxWidth: 420,
  },
  searchInput: {
    color: CRM_COLORS.text,
    flex: 1,
    fontSize: 14,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CRM_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  pageHeaderText: {
    maxWidth: 780,
    gap: 6,
  },
  pageEyebrow: {
    color: CRM_COLORS.primary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontWeight: '800',
  },
  pageTitle: {
    color: CRM_COLORS.text,
    fontSize: 34,
    fontWeight: '900',
  },
  panel: {
    backgroundColor: CRM_COLORS.surfaceAlt,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: CRM_COLORS.border,
    padding: 20,
  },
  statCard: {
    minHeight: 150,
    justifyContent: 'space-between',
  },
  statIconWrap: {
    opacity: 0.22,
    alignSelf: 'flex-end',
  },
  statLabel: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    fontWeight: '700',
  },
  statValue: {
    color: CRM_COLORS.text,
    fontSize: 28,
    fontWeight: '900',
  },
  statDetail: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    color: CRM_COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionDescription: {
    color: CRM_COLORS.textMuted,
    marginTop: 4,
    fontSize: 14,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  changePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  symbolFallback: {
    backgroundColor: CRM_COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolFallbackText: {
    color: CRM_COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  sparkline: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    minWidth: 120,
  },
  sparkBar: {
    width: 3,
    borderRadius: 999,
  },
  sparklineFallback: {
    height: 48,
    width: 120,
    backgroundColor: CRM_COLORS.surfaceStrong,
    borderRadius: 12,
  },
});
