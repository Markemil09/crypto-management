import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCryptoCrm } from '@/components/crm/crypto-crm-provider';
import {
  ChangePill,
  CoinAvatar,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  Panel,
  SectionTitle,
  Shell,
  StatCard,
} from '@/components/crm/ui';
import { CRM_COLORS } from '@/constants/crm';

export default function DashboardScreen() {
  const { error, global, isLoading, portfolio, refetch, trending } = useCryptoCrm();

  const totalValue = portfolio.reduce((sum, coin) => sum + coin.value, 0);
  const liquidValue = portfolio
    .filter((coin) => coin.bucket === 'Liquid Assets')
    .reduce((sum, coin) => sum + coin.value, 0);
  const lockedValue = portfolio
    .filter((coin) => coin.bucket === 'Locked Vaults')
    .reduce((sum, coin) => sum + coin.value, 0);

  return (
    <Shell
      title="Dashboard"
      action={
        <Pressable onPress={() => void refetch()} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh Live Feed</Text>
        </Pressable>
      }>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <>
          <View style={styles.heroRow}>
            <Panel style={styles.heroPanel}>
              <Text style={styles.heroLabel}>Total Portfolio Value</Text>
              <Text style={styles.heroValue}>{formatCurrency(totalValue)}</Text>
              <View style={styles.heroMeta}>
                <ChangePill value={global?.market_cap_change_percentage_24h_usd} />
                <Text style={styles.heroMetaText}>
                  {formatCurrency(global?.total_volume.usd, true)} traded across tracked markets in
                  the last 24 hours.
                </Text>
              </View>
              <View style={styles.heroStats}>
                <MetricBlock label="Liquid Assets" value={formatCurrency(liquidValue, true)} />
                <MetricBlock label="Locked Vaults" value={formatCurrency(lockedValue, true)} />
                <MetricBlock
                  label="Risk Index"
                  value={totalValue > 0 && lockedValue / totalValue > 0.5 ? 'Medium-High' : 'Balanced'}
                />
              </View>
            </Panel>

            <Panel style={styles.trendingPanel}>
              <SectionTitle
                title="Trending Assets"
                description="CoinGecko `/search/trending` demo feed"
              />
              <View style={styles.list}>
                {trending.slice(0, 5).map((coin) => (
                  <View key={coin.id} style={styles.assetRow}>
                    <View style={styles.assetInfo}>
                      <CoinAvatar image={coin.thumb} symbol={coin.symbol} />
                      <View>
                        <Text style={styles.assetName}>{coin.name}</Text>
                        <Text style={styles.assetMeta}>{coin.symbol}/USD</Text>
                      </View>
                    </View>
                    <View style={styles.assetPriceWrap}>
                      <Text style={styles.assetPrice}>{formatCurrency(coin.price ?? 0, true)}</Text>
                      <Text
                        style={[
                          styles.assetDelta,
                          { color: (coin.change24h ?? 0) >= 0 ? CRM_COLORS.success : CRM_COLORS.danger },
                        ]}>
                        {formatPercent(coin.change24h)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Panel>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon="public"
              label="Total Market Cap"
              value={formatCurrency(global?.total_market_cap.usd, true)}
              detail={formatPercent(global?.market_cap_change_percentage_24h_usd)}
              accent={CRM_COLORS.success}
            />
            <StatCard
              icon="query-stats"
              label="24h Volume"
              value={formatCurrency(global?.total_volume.usd, true)}
              detail={`${formatCompactNumber(global?.markets)} active exchanges`}
            />
            <StatCard
              icon="token"
              label="BTC Dominance"
              value={`${(global?.market_cap_percentage.btc ?? 0).toFixed(1)}%`}
              detail={`${(global?.active_cryptocurrencies ?? 0).toLocaleString()} active cryptocurrencies`}
            />
          </View>

          <Panel>
            <SectionTitle
              title="Top Holdings"
              description="Largest portfolio positions priced from CoinGecko `/coins/markets`."
            />
            <View style={styles.list}>
              {portfolio.slice(0, 4).map((coin) => (
                <View key={coin.id} style={styles.holdingRow}>
                  <View style={styles.assetInfo}>
                    <CoinAvatar image={coin.image} symbol={coin.symbol} size={44} />
                    <View>
                      <Text style={styles.assetName}>{coin.name}</Text>
                      <Text style={styles.assetMeta}>
                        {coin.units.toLocaleString()} {coin.symbol}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.holdingValue}>
                    <Text style={styles.assetPrice}>{formatCurrency(coin.value)}</Text>
                    <Text style={styles.assetMeta}>{coin.bucket}</Text>
                  </View>
                  <ChangePill value={coin.change24h} />
                </View>
              ))}
            </View>
          </Panel>
        </>
      )}
    </Shell>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBlock}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function LoadingState() {
  return (
    <Panel style={styles.statePanel}>
      <ActivityIndicator color={CRM_COLORS.primary} />
      <Text style={styles.stateTitle}>Loading CoinGecko data</Text>
      <Text style={styles.stateText}>Fetching global markets, trending assets, and tracked holdings.</Text>
    </Panel>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Panel style={styles.statePanel}>
      <Text style={styles.stateTitle}>Live data unavailable</Text>
      <Text style={styles.stateText}>{error}</Text>
      <Pressable onPress={onRetry} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Retry</Text>
      </Pressable>
    </Panel>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    backgroundColor: CRM_COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  refreshButtonText: {
    color: '#004346',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroRow: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  heroPanel: {
    flex: 2,
    minWidth: 320,
    gap: 18,
  },
  heroLabel: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    fontWeight: '800',
  },
  heroValue: {
    color: CRM_COLORS.text,
    fontSize: 44,
    fontWeight: '900',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroMetaText: {
    color: CRM_COLORS.textMuted,
    fontSize: 13,
    flexShrink: 1,
  },
  heroStats: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CRM_COLORS.borderSoft,
    paddingTop: 18,
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  metricBlock: {
    minWidth: 120,
    gap: 6,
  },
  metricLabel: {
    color: CRM_COLORS.textSoft,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontWeight: '800',
  },
  metricValue: {
    color: CRM_COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  trendingPanel: {
    flex: 1,
    minWidth: 280,
  },
  list: {
    gap: 14,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  assetName: {
    color: CRM_COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  assetMeta: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  assetPriceWrap: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    color: CRM_COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  assetDelta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  holdingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  holdingValue: {
    minWidth: 140,
    alignItems: 'flex-end',
  },
  statePanel: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
    gap: 10,
  },
  stateTitle: {
    color: CRM_COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  stateText: {
    color: CRM_COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 520,
  },
});
