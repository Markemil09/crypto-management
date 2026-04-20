import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Panel, SectionTitle, Shell, StatCard } from '@/components/crm/ui';
import { CRM_COLORS, CRM_LEADS } from '@/constants/crm';

export default function LeadsScreen() {
  const hotLeads = CRM_LEADS.filter((lead) => lead.stage === 'Hot' || lead.score >= 90).length;

  return (
    <Shell
      title="Lead Management"
      action={
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add New Contact</Text>
        </Pressable>
      }>
      <View style={styles.statsGrid}>
        <StatCard
          icon="groups"
          label="Total Leads"
          value={CRM_LEADS.length.toString()}
          detail="+12% from last month"
          accent={CRM_COLORS.success}
        />
        <StatCard
          icon="rocket-launch"
          label="Active Ops"
          value="42"
          detail={`${hotLeads} hot opportunities`}
          accent={CRM_COLORS.primary}
        />
        <StatCard
          icon="workspace-premium"
          label="Avg Conversion"
          value="8.4%"
          detail="Benchmark: 7.2%"
        />
      </View>

      <Panel>
        <SectionTitle
          title="Relationship Pipeline"
          description="Static CRM records for leads and contacts, paired with the live market stack."
        />
        <View style={styles.pipeline}>
          {CRM_LEADS.map((lead) => (
            <View key={lead.id} style={styles.leadCard}>
              <View style={styles.leadHeader}>
                <View>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <Text style={styles.leadCompany}>{lead.company}</Text>
                </View>
                <View
                  style={[
                    styles.stagePill,
                    lead.stage === 'Hot'
                      ? styles.stageHot
                      : lead.stage === 'Proposal'
                        ? styles.stageProposal
                        : styles.stageBase,
                  ]}>
                  <Text style={styles.stageText}>{lead.stage}</Text>
                </View>
              </View>

              <View style={styles.leadMetrics}>
                <Metric label="Score" value={lead.score.toString()} />
                <Metric label="Potential" value={lead.allocation} />
                <Metric label="Last Touch" value={lead.lastTouch} />
              </View>

              <Text style={styles.focusLabel}>Investment Focus</Text>
              <Text style={styles.focusText}>{lead.focus}</Text>
            </View>
          ))}
        </View>
      </Panel>
    </Shell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBlock}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: CRM_COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#004346',
    fontWeight: '900',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  pipeline: {
    gap: 16,
  },
  leadCard: {
    backgroundColor: CRM_COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CRM_COLORS.border,
    padding: 18,
    gap: 14,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  leadName: {
    color: CRM_COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  leadCompany: {
    color: CRM_COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  stagePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stageBase: {
    backgroundColor: 'rgba(161,250,255,0.1)',
  },
  stageProposal: {
    backgroundColor: 'rgba(255,146,140,0.12)',
  },
  stageHot: {
    backgroundColor: 'rgba(63,255,139,0.12)',
  },
  stageText: {
    color: CRM_COLORS.text,
    fontSize: 12,
    fontWeight: '800',
  },
  leadMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  metricBlock: {
    minWidth: 110,
    gap: 4,
  },
  metricLabel: {
    color: CRM_COLORS.textSoft,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  metricValue: {
    color: CRM_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  focusLabel: {
    color: CRM_COLORS.primary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '800',
  },
  focusText: {
    color: CRM_COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
