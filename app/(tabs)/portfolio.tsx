import { StyleSheet, Text, View } from 'react-native';

import { useCryptoCrm } from '@/components/crm/crypto-crm-provider';
import {
  ChangePill,
  CoinAvatar,
  formatCurrency,
  Panel,
  SectionTitle,
  Shell,
  Sparkline,
  StatCard,
} from '@/components/crm/ui';
import { CRM_COLORS } from '@/constants/crm';

export default function PortfolioScreen() {
  const { portfolio } = useCryptoCrm();

  const totalValue = portfolio.reduce((sum, coin) => sum + coin.value, 0);
  const averageChange =
    portfolio.reduce((sum, coin) => sum + (coin.change24h ?? 0), 0) / Math.max(portfolio.length, 1);
  const topHolding = portfolio[0];

  return (
    <Shell title="Portfolio">
      <View style={styles.statsGrid}>
        <StatCard
          icon="savings"
          label="Total Net Worth"
          value={formatCurrency(totalValue)}
          detail={`${portfolio.length} tracked assets`}
        />
        <StatCard
          icon="waterfall-chart"
          label="24h Portfolio Drift"
          value={averageChange.toFixed(2) + '%'}
          detail={averageChange >= 0 ? 'Positive momentum' : 'Risk-off rotation'}
          accent={averageChange >= 0 ? CRM_COLORS.success : CRM_COLORS.danger}
        />
        <StatCard
          icon="pie-chart"
          label="Largest Position"
          value={topHolding ? topHolding.symbol : 'N/A'}
          detail={topHolding ? formatCurrency(topHolding.value, true) : 'No holdings'}
        />
      </View>

      <Panel>
        <SectionTitle
          title="Asset Inventory"
          description="Portfolio rows are derived from CoinGecko `/coins/markets` using your demo key."
        />
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.rank]}>Asset</Text>
          <Text style={[styles.headerText, styles.units]}>Units</Text>
          <Text style={[styles.headerText, styles.price]}>Price</Text>
          <Text style={[styles.headerText, styles.change]}>24h</Text>
          <Text style={[styles.headerText, styles.value]}>Position Value</Text>
          <Text style={[styles.headerText, styles.spark]}>7d</Text>
        </View>

        <View style={styles.rows}>
          {portfolio.map((coin) => (
            <View key={coin.id} style={styles.row}>
              <View style={styles.rank}>
                <View style={styles.assetInfo}>
                  <CoinAvatar image={coin.image} symbol={coin.symbol} />
                  <View>
                    <Text style={styles.assetName}>{coin.name}</Text>
                    <Text style={styles.assetMeta}>{coin.symbol}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.bodyText, styles.units]}>{coin.units.toLocaleString()}</Text>
              <Text style={[styles.bodyText, styles.price]}>{formatCurrency(coin.price, true)}</Text>
              <View style={styles.change}>
                <ChangePill value={coin.change24h} />
              </View>
              <Text style={[styles.bodyText, styles.value]}>{formatCurrency(coin.value)}</Text>
              <View style={styles.spark}>
                <Sparkline values={coin.sparkline} />
              </View>
            </View>
          ))}
        </View>
      </Panel>
    </Shell>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CRM_COLORS.borderSoft,
    gap: 12,
  },
  headerText: {
    color: CRM_COLORS.textSoft,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  rows: {
    gap: 14,
    marginTop: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  rank: {
    flex: 2.2,
    minWidth: 220,
  },
  units: {
    flex: 1,
    minWidth: 90,
  },
  price: {
    flex: 1,
    minWidth: 100,
  },
  change: {
    flex: 1,
    minWidth: 90,
  },
  value: {
    flex: 1.2,
    minWidth: 120,
  },
  spark: {
    flex: 1,
    minWidth: 120,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetName: {
    color: CRM_COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
  assetMeta: {
    color: CRM_COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  bodyText: {
    color: CRM_COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
