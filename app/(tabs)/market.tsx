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

export default function MarketScreen() {
  const { global, markets } = useCryptoCrm();

  return (
    <Shell title="Market Explorer">
      <View style={styles.statsGrid}>
        <StatCard
          icon="language"
          label="Total Market Cap"
          value={formatCurrency(global?.total_market_cap.usd, true)}
          detail={global ? `${global.markets.toLocaleString()} exchanges tracked` : 'Loading'}
        />
        <StatCard
          icon="bar-chart"
          label="24h Volume"
          value={formatCurrency(global?.total_volume.usd, true)}
          detail="CoinGecko `/global`"
        />
        <StatCard
          icon="currency-bitcoin"
          label="BTC Dominance"
          value={`${(global?.market_cap_percentage.btc ?? 0).toFixed(1)}%`}
          detail="Benchmark market control"
        />
      </View>

      <Panel>
        <SectionTitle
          title="Tracked Market Board"
          description="Rows below use `/coins/markets` with `sparkline=true` and `price_change_percentage=24h`."
        />

        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.rank]}>Coin</Text>
          <Text style={[styles.headerText, styles.price]}>Price</Text>
          <Text style={[styles.headerText, styles.change]}>24h %</Text>
          <Text style={[styles.headerText, styles.cap]}>Market Cap</Text>
          <Text style={[styles.headerText, styles.volume]}>Volume</Text>
          <Text style={[styles.headerText, styles.spark]}>7d</Text>
        </View>

        <View style={styles.rows}>
          {markets.map((coin) => (
            <View key={coin.id} style={styles.row}>
              <View style={styles.rank}>
                <View style={styles.coinWrap}>
                  <CoinAvatar image={coin.image} symbol={coin.symbol.toUpperCase()} />
                  <View>
                    <Text style={styles.coinName}>{coin.name}</Text>
                    <Text style={styles.coinMeta}>
                      #{coin.market_cap_rank} {coin.symbol.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.bodyText, styles.price]}>{formatCurrency(coin.current_price, true)}</Text>
              <View style={styles.change}>
                <ChangePill value={coin.price_change_percentage_24h} />
              </View>
              <Text style={[styles.bodyText, styles.cap]}>{formatCurrency(coin.market_cap, true)}</Text>
              <Text style={[styles.bodyText, styles.volume]}>{formatCurrency(coin.total_volume, true)}</Text>
              <View style={styles.spark}>
                <Sparkline values={coin.sparkline_in_7d?.price} />
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
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rank: {
    flex: 2.2,
    minWidth: 220,
  },
  price: {
    flex: 1,
    minWidth: 100,
  },
  change: {
    flex: 1,
    minWidth: 90,
  },
  cap: {
    flex: 1,
    minWidth: 110,
  },
  volume: {
    flex: 1,
    minWidth: 110,
  },
  spark: {
    flex: 1,
    minWidth: 120,
  },
  coinWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinName: {
    color: CRM_COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  coinMeta: {
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
