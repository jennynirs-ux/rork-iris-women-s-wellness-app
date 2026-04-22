import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
  ActivityIndicator, Animated, Alert, RefreshControl, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users, Download, LogOut, Activity, BarChart3,
  ArrowUpRight, ArrowDownRight, Shield,
  TrendingUp, DollarSign, Zap,
  Smartphone, Target, Clock,
  UserCheck, Gift, Crown, Database,
  Share2, Heart, Eye, RefreshCw,
  Scan, Droplets, X as CloseIcon,
} from 'lucide-react-native';
import { useAdmin } from '@/contexts/AdminContext';
import { trpc } from '@/lib/trpc';

type AdminTab = 'overview' | 'funnel' | 'users' | 'wellness' | 'revenue' | 'referrals' | 'events';

function MetricCard({ label, value, subtitle, icon, color, large }: {
  label: string; value: string; subtitle?: string;
  icon: React.ReactNode; color: string; large?: boolean;
}) {
  return (
    <View style={[styles.metricCard, large && styles.metricCardLarge]}>
      <View style={[styles.metricIconBg, { backgroundColor: color + '18' }]}>
        {icon}
      </View>
      <Text style={[styles.metricValue, large && styles.metricValueLarge]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {subtitle && (
        <Text style={styles.metricSub}>{subtitle}</Text>
      )}
    </View>
  );
}

function SectionCard({ title, icon, children, subtitle }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; subtitle?: string;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {icon}
        <View style={styles.sectionHeaderFlex}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );
}

function FunnelBar({ step, count, percentage, dropoff, color, isFirst }: {
  step: string; count: number; percentage: number; dropoff: number; color: string; isFirst: boolean;
}) {
  return (
    <View style={styles.funnelStep}>
      <View style={styles.funnelBarRow}>
        <View style={[styles.funnelBar, { width: `${Math.max(percentage, 4)}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.funnelLabelRow}>
        <Text style={styles.funnelLabel}>{step}</Text>
        <View style={styles.funnelRightCol}>
          <Text style={[styles.funnelValue, { color }]}>{count}</Text>
          <Text style={styles.funnelPct}>{percentage}%</Text>
          {!isFirst && dropoff > 0 && (
            <View style={styles.funnelDropoff}>
              <ArrowDownRight color="#EF4444" size={10} />
              <Text style={styles.funnelDropoffText}>-{dropoff}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function StatRow({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statRowLabel}>{label}</Text>
      <Text style={[styles.statRowValue, valueColor ? { color: valueColor } : undefined]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
    </View>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <View style={styles.miniBarTrack}>
      <View style={[styles.miniBarFill, { width: `${Math.max(pct, 2)}%`, backgroundColor: color }]} />
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Database color="#374151" size={32} />
      <Text style={styles.emptyStateText}>{message}</Text>
      <Text style={styles.emptyStateHint}>Events are tracked as users interact with the app.</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { adminUser, logout, hasPermission, isAuthenticated, isLoading: authLoading } = useAdmin();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [eyeMetricsExpanded, setEyeMetricsExpanded] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin-login');
    }
  }, [isAuthenticated, authLoading]);

  const analyticsQuery = trpc.analytics.stats.useQuery(undefined, {
    refetchInterval: 10000,
    enabled: isAuthenticated,
  });

  const stats = analyticsQuery.data;
  const isLoading = analyticsQuery.isLoading;

  const switchTab = useCallback((tab: AdminTab) => {
    fadeAnim.setValue(0);
    setActiveTab(tab);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleExportCSV = useCallback(() => {
    if (!hasPermission('export_data')) {
      Alert.alert('Access Denied', 'You do not have permission to export data.');
      return;
    }
    if (!stats) return;

    const headers = 'Date,Active Users,New Users,Events\n';
    const rows = stats.dailyActiveUsers.map((d, i) =>
      `${d.date},${d.count},${stats.dailyNewUsers[i]?.count || 0},${stats.dailyEvents[i]?.count || 0}`
    ).join('\n');
    const csv = headers + rows;

    if (Platform.OS === 'web') {
      try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iris-admin-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        Alert.alert('Export', 'CSV export is available on web browser.');
      }
    } else {
      Alert.alert('Export Ready', `CSV data prepared.\nTotal rows: ${stats.dailyActiveUsers.length}\n\nFull export requires web browser.`);
    }
  }, [stats, hasPermission]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/admin-login');
  }, [logout]);

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 color={activeTab === 'overview' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'funnel', label: 'Funnel', icon: <Target color={activeTab === 'funnel' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'users', label: 'Users', icon: <Users color={activeTab === 'users' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'wellness', label: 'Wellness', icon: <Droplets color={activeTab === 'wellness' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'revenue', label: 'Revenue', icon: <DollarSign color={activeTab === 'revenue' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'referrals', label: 'Referrals', icon: <Share2 color={activeTab === 'referrals' ? '#60A5FA' : '#6B7280'} size={14} /> },
    { key: 'events', label: 'Events', icon: <Activity color={activeTab === 'events' ? '#60A5FA' : '#6B7280'} size={14} /> },
  ];

  // Block rendering until auth check completes — prevents content flash
  if (authLoading || !isAuthenticated) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#60A5FA" size="large" />
      </View>
    );
  }

  const canExport = hasPermission('export_data');

  const renderOverview = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No analytics data yet" />;

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Users"
            value={stats.totalUsers.toString()}
            subtitle={`+${stats.newUsersToday} today`}
            icon={<Users color="#60A5FA" size={18} />}
            color="#60A5FA"
          />
          <MetricCard
            label="Active (24h)"
            value={stats.activeUsers24h.toString()}
            subtitle={`${stats.activeUsers7d} in 7d`}
            icon={<Zap color="#34D399" size={18} />}
            color="#34D399"
          />
          <MetricCard
            label="Premium"
            value={stats.premiumUsers.toString()}
            subtitle={`${stats.conversionRate}% conversion`}
            icon={<Crown color="#FBBF24" size={18} />}
            color="#FBBF24"
          />
          <MetricCard
            label="Est. MRR"
            value={`$${stats.revenue.estimatedMRR.toFixed(0)}`}
            subtitle={`$${stats.revenue.estimatedARR.toFixed(0)} ARR`}
            icon={<DollarSign color="#34D399" size={18} />}
            color="#34D399"
          />
        </View>

        <SectionCard title="Key Metrics" icon={<TrendingUp color="#60A5FA" size={16} />}>
          <StatRow label="Onboarding Rate" value={`${stats.onboardingRate}%`} valueColor={stats.onboardingRate > 50 ? '#34D399' : '#FBBF24'} />
          <StatRow label="Users with Check-in" value={stats.usersWithCheckin} />
          <StatRow label="Users with Scan" value={stats.usersWithScan} />
          <StatRow label="Health Connected" value={`${stats.healthConnectedUsers} (${stats.healthConnectionRate}%)`} />
          <StatRow label="Power Users" value={`${stats.engagement.powerUsers} (${stats.engagement.powerUserRate}%)`} valueColor="#A78BFA" />
          <StatRow label="Avg Check-ins/User" value={stats.engagement.avgCheckinsPerUser} />
          <StatRow label="Avg Scans/User" value={stats.engagement.avgScansPerUser} />
          <StatRow label="Total Events" value={stats.totalEvents} />
        </SectionCard>

        <SectionCard title="Daily Active Users (30d)" icon={<Activity color="#8B5CF6" size={16} />}>
          <View style={styles.chartContainer}>
            {stats.dailyActiveUsers.slice(-14).map((day) => {
              const maxCount = Math.max(...stats.dailyActiveUsers.map(d => d.count), 1);
              const pct = (day.count / maxCount) * 100;
              return (
                <View key={day.date} style={styles.chartRow}>
                  <Text style={styles.chartDateLabel}>{day.date.slice(5)}</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { width: `${Math.max(pct, 2)}%` }]} />
                  </View>
                  <Text style={styles.chartCountLabel}>{day.count}</Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard title="Platform Distribution" icon={<Smartphone color="#F59E0B" size={16} />}>
          {stats.platforms.length > 0 ? stats.platforms.map(p => (
            <View key={p.platform} style={styles.distRow}>
              <View style={styles.distRowLeft}>
                <View style={[styles.distDot, { backgroundColor: p.platform === 'ios' ? '#60A5FA' : p.platform === 'android' ? '#34D399' : '#9CA3AF' }]} />
                <Text style={styles.distLabel}>{p.platform}</Text>
              </View>
              <View style={styles.distRowRight}>
                <MiniBar value={p.count} max={stats.totalUsers} color={p.platform === 'ios' ? '#60A5FA' : p.platform === 'android' ? '#34D399' : '#9CA3AF'} />
                <Text style={styles.distValue}>{p.count} ({p.percentage}%)</Text>
              </View>
            </View>
          )) : <Text style={styles.noDataText}>No platform data yet</Text>}
        </SectionCard>

        <SectionCard title="Life Stages" icon={<Heart color="#EC4899" size={16} />}>
          {stats.lifeStages.length > 0 ? stats.lifeStages.map(ls => (
            <View key={ls.stage} style={styles.distRow}>
              <Text style={styles.distLabel}>{ls.stage}</Text>
              <View style={styles.distRowRight}>
                <MiniBar value={ls.count} max={stats.totalUsers} color="#EC4899" />
                <Text style={styles.distValue}>{ls.count} ({ls.percentage}%)</Text>
              </View>
            </View>
          )) : <Text style={styles.noDataText}>No life stage data yet</Text>}
        </SectionCard>
      </Animated.View>
    );
  };

  const renderFunnel = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No funnel data yet" />;

    const funnelColors = ['#60A5FA', '#8B5CF6', '#EC4899', '#F59E0B', '#34D399', '#14B8A6'];

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Users"
            value={stats.totalUsers.toString()}
            icon={<Users color="#60A5FA" size={18} />}
            color="#60A5FA"
          />
          <MetricCard
            label="Onboarded"
            value={`${stats.onboardingRate}%`}
            subtitle={`${stats.onboardedUsers} users`}
            icon={<UserCheck color="#34D399" size={18} />}
            color="#34D399"
          />
          <MetricCard
            label="Converted"
            value={`${stats.conversionRate}%`}
            subtitle={`${stats.premiumUsers} premium`}
            icon={<Crown color="#FBBF24" size={18} />}
            color="#FBBF24"
          />
        </View>

        <SectionCard title="User Journey Funnel" icon={<Target color="#60A5FA" size={16} />} subtitle="Aggregated across all users">
          <View style={styles.funnelContainer}>
            {stats.funnel.map((step, i) => (
              <FunnelBar
                key={step.step}
                step={step.step}
                count={step.count}
                percentage={step.percentage}
                dropoff={step.dropoff}
                color={funnelColors[i % funnelColors.length]}
                isFirst={i === 0}
              />
            ))}
          </View>
        </SectionCard>

        <SectionCard title="Conversion Breakdown" icon={<BarChart3 color="#34D399" size={16} />}>
          <StatRow label="App → Onboarding" value={`${stats.onboardingRate}%`} valueColor={stats.onboardingRate > 70 ? '#34D399' : '#FBBF24'} />
          <StatRow label="Onboarding → Check-in" value={stats.onboardedUsers > 0 ? `${Math.round((stats.usersWithCheckin / stats.onboardedUsers) * 100)}%` : '0%'} />
          <StatRow label="Check-in → Scan" value={stats.usersWithCheckin > 0 ? `${Math.round((stats.usersWithScan / stats.usersWithCheckin) * 100)}%` : '0%'} />
          <StatRow label="Active → Premium" value={`${stats.conversionRate}%`} valueColor={stats.conversionRate > 5 ? '#34D399' : '#6B7280'} />
          <StatRow label="Paywall Views → Premium" value={`${stats.revenue.paywallViewToConversion}%`} />
        </SectionCard>
      </Animated.View>
    );
  };

  const renderUsers = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No user data yet" />;

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total"
            value={stats.totalUsers.toString()}
            icon={<Users color="#60A5FA" size={18} />}
            color="#60A5FA"
          />
          <MetricCard
            label="Active 24h"
            value={stats.activeUsers24h.toString()}
            icon={<Zap color="#34D399" size={18} />}
            color="#34D399"
          />
          <MetricCard
            label="Active 7d"
            value={stats.activeUsers7d.toString()}
            icon={<Activity color="#8B5CF6" size={18} />}
            color="#8B5CF6"
          />
          <MetricCard
            label="New This Week"
            value={stats.newUsersThisWeek.toString()}
            icon={<ArrowUpRight color="#F59E0B" size={18} />}
            color="#F59E0B"
          />
        </View>

        <SectionCard title="Engagement" icon={<Zap color="#FBBF24" size={16} />}>
          <StatRow label="Avg Check-ins/User" value={stats.engagement.avgCheckinsPerUser} />
          <StatRow label="Avg Scans/User" value={stats.engagement.avgScansPerUser} />
          <StatRow label="Users with 3+ Check-ins" value={stats.engagement.usersWithMultipleCheckins} />
          <StatRow label="Users with 2+ Scans" value={stats.engagement.usersWithMultipleScans} />
          <StatRow label="Power Users (7+ CI, 3+ Scan)" value={stats.engagement.powerUsers} valueColor="#A78BFA" />
          <StatRow label="Power User Rate" value={`${stats.engagement.powerUserRate}%`} />
        </SectionCard>

        <SectionCard title="User Breakdown" icon={<Database color="#60A5FA" size={16} />}>
          <StatRow label="Total Users" value={stats.totalUsers} />
          <StatRow label="Onboarded" value={`${stats.onboardedUsers} (${stats.onboardingRate}%)`} />
          <StatRow label="Used Check-in" value={stats.usersWithCheckin} />
          <StatRow label="Used Scan" value={stats.usersWithScan} />
          <StatRow label="Health Connected" value={`${stats.healthConnectedUsers} (${stats.healthConnectionRate}%)`} />
          <StatRow label="Premium" value={stats.premiumUsers} valueColor="#34D399" />
          <StatRow label="Active (30d)" value={stats.activeUsers30d} />
        </SectionCard>

        {stats.userList.length > 0 && (
          <SectionCard title="Individual Users" icon={<Users color="#60A5FA" size={16} />} subtitle={`${stats.userList.length} tracked`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellWide]}>User</Text>
                  <Text style={styles.tableCell}>Onboard</Text>
                  <Text style={styles.tableCell}>CIs</Text>
                  <Text style={styles.tableCell}>Scans</Text>
                  <Text style={styles.tableCell}>Premium</Text>
                  <Text style={styles.tableCell}>Stage</Text>
                  <Text style={styles.tableCell}>Platform</Text>
                </View>
                {stats.userList.map((user) => (
                  <TouchableOpacity
                    key={user.userId}
                    style={styles.tableRow}
                    onPress={() => setSelectedUserId(user.userId)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tableCell, styles.tableCellWide, styles.userIdText]} numberOfLines={1}>
                      {user.userId.slice(0, 14)}...
                    </Text>
                    <View style={[styles.tableCell, styles.tableCellBadge, user.onboardingCompleted ? styles.badgeOnboardedYes : styles.badgeOnboardedNo]}>
                      <Text style={user.onboardingCompleted ? styles.badgeOnboardedYesText : styles.badgeOnboardedNoText}>
                        {user.onboardingCompleted ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellBadge]}>
                      <Text style={styles.tableCellText}>{user.totalCheckins}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellBadge]}>
                      <Text style={styles.tableCellText}>{user.totalScans}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellBadge, user.isPremium ? styles.badgePremiumYes : styles.badgePremiumNo]}>
                      <Text style={user.isPremium ? styles.badgePremiumYesText : styles.badgePremiumNoText}>
                        {user.isPremium ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellBadge]}>
                      <Text style={[styles.tableCellText, { fontSize: 9 }]}>{user.lifeStage}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellBadge, styles.platformBadgeTable]}>
                      <Text style={styles.platformBadgeTableText}>{user.platform}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </SectionCard>
        )}

        <SectionCard title="New Users (30d)" icon={<TrendingUp color="#34D399" size={16} />}>
          <View style={styles.chartContainer}>
            {stats.dailyNewUsers.slice(-14).map((day) => {
              const maxCount = Math.max(...stats.dailyNewUsers.map(d => d.count), 1);
              const pct = (day.count / maxCount) * 100;
              return (
                <View key={day.date} style={styles.chartRow}>
                  <Text style={styles.chartDateLabel}>{day.date.slice(5)}</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { width: `${Math.max(pct, 2)}%`, backgroundColor: '#34D399' }]} />
                  </View>
                  <Text style={styles.chartCountLabel}>{day.count}</Text>
                </View>
              );
            })}
          </View>
        </SectionCard>
      </Animated.View>
    );
  };

  const renderRevenue = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No revenue data yet" />;

    const rev = stats.revenue;

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Est. MRR"
            value={`$${rev.estimatedMRR.toFixed(0)}`}
            icon={<DollarSign color="#34D399" size={18} />}
            color="#34D399"
            large
          />
          <MetricCard
            label="Est. ARR"
            value={`$${rev.estimatedARR.toFixed(0)}`}
            icon={<TrendingUp color="#60A5FA" size={18} />}
            color="#60A5FA"
            large
          />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="Premium"
            value={rev.totalPremium.toString()}
            subtitle={`${rev.conversionRate}% of users`}
            icon={<Crown color="#FBBF24" size={18} />}
            color="#FBBF24"
          />
          <MetricCard
            label="Free"
            value={rev.totalFree.toString()}
            icon={<Gift color="#9CA3AF" size={18} />}
            color="#9CA3AF"
          />
        </View>

        <SectionCard title="Revenue Details" icon={<DollarSign color="#34D399" size={16} />}>
          <StatRow label="Premium Users" value={rev.totalPremium} valueColor="#34D399" />
          <StatRow label="Free Users" value={rev.totalFree} />
          <StatRow label="Conversion Rate" value={`${rev.conversionRate}%`} valueColor={rev.conversionRate > 5 ? '#34D399' : '#FBBF24'} />
          <StatRow label="ARPU" value={`$${rev.avgRevenuePerUser.toFixed(2)}`} />
          <StatRow label="Churn Rate" value={`${rev.churnRate}%`} valueColor={rev.churnRate > 5 ? '#EF4444' : '#34D399'} />
          <StatRow label="Churned Users" value={rev.churned} />
        </SectionCard>

        <SectionCard title="Paywall Performance" icon={<Eye color="#8B5CF6" size={16} />}>
          <StatRow label="Total Paywall Views" value={rev.totalPaywallViews} />
          <StatRow label="Paywall → Premium" value={`${rev.paywallViewToConversion}%`} valueColor={rev.paywallViewToConversion > 3 ? '#34D399' : '#FBBF24'} />
          <View style={styles.paywallFunnel}>
            <View style={styles.paywallFunnelRow}>
              <Text style={styles.paywallFunnelLabel}>Viewed Paywall</Text>
              <View style={[styles.paywallFunnelBar, { width: '100%', backgroundColor: '#8B5CF620' }]}>
                <Text style={styles.paywallFunnelBarText}>{rev.totalPaywallViews}</Text>
              </View>
            </View>
            <View style={styles.paywallFunnelRow}>
              <Text style={styles.paywallFunnelLabel}>Converted</Text>
              <View style={[styles.paywallFunnelBar, {
                width: `${Math.max(rev.paywallViewToConversion, 5)}%`,
                backgroundColor: '#34D39920',
              }]}>
                <Text style={[styles.paywallFunnelBarText, { color: '#34D399' }]}>{rev.totalPremium}</Text>
              </View>
            </View>
          </View>
        </SectionCard>
      </Animated.View>
    );
  };

  const renderReferrals = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No referral data yet" />;

    const ref = stats.referrals;

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Codes Generated"
            value={ref.totalCodesGenerated.toString()}
            icon={<Share2 color="#60A5FA" size={18} />}
            color="#60A5FA"
          />
          <MetricCard
            label="Referrals Applied"
            value={ref.totalReferralsApplied.toString()}
            icon={<UserCheck color="#34D399" size={18} />}
            color="#34D399"
          />
          <MetricCard
            label="Conversion Rate"
            value={`${ref.referralConversionRate}%`}
            icon={<TrendingUp color="#FBBF24" size={18} />}
            color="#FBBF24"
          />
        </View>

        <SectionCard title="Referral Details" icon={<Share2 color="#60A5FA" size={16} />}>
          <StatRow label="Codes Generated" value={ref.totalCodesGenerated} />
          <StatRow label="Referrals Applied" value={ref.totalReferralsApplied} />
          <StatRow label="Users via Referral" value={ref.usersWithReferral} />
          <StatRow label="Referral → User Rate" value={`${ref.referralConversionRate}%`} />
        </SectionCard>

        {stats.userList.filter(u => u.referralApplied).length > 0 && (
          <SectionCard title="Users via Referral" icon={<Gift color="#34D399" size={16} />}>
            {stats.userList.filter(u => u.referralApplied).map(u => (
              <View key={u.userId} style={styles.statRow}>
                <Text style={[styles.statRowLabel, { fontSize: 11 }]} numberOfLines={1}>
                  {u.userId.slice(0, 16)}...
                </Text>
                <View style={styles.referralBadge}>
                  <Text style={styles.referralBadgeText}>
                    {u.isPremium ? 'Premium' : u.onboardingCompleted ? 'Onboarded' : 'Installed'}
                  </Text>
                </View>
              </View>
            ))}
          </SectionCard>
        )}
      </Animated.View>
    );
  };

  const renderWellness = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No wellness data yet" />;

    const wa = stats.wellnessAggregates;
    if (!wa || (wa.totalScans === 0 && wa.totalCheckIns === 0)) {
      return <EmptyState message="No wellness data collected yet. Scans and check-ins will appear here." />;
    }

    const scoreColors: Record<string, string> = {
      energy: '#34D399', fatigue: '#F59E0B', hydration: '#06B6D4',
      inflammation: '#EC4899', recovery: '#60A5FA', stress: '#EF4444',
    };

    const phaseColors: Record<string, string> = {
      menstrual: '#EF4444', follicular: '#34D399', ovulation: '#FBBF24', luteal: '#8B5CF6',
    };

    const handleExportWellnessCSV = () => {
      if (!hasPermission('export_data')) {
        Alert.alert('Access Denied', 'You do not have permission to export data.');
        return;
      }
      const headers = 'Date,Avg Energy,Avg Fatigue,Avg Hydration,Avg Stress,Avg Recovery,Avg Inflammation,Scan Count,CheckIn Count\n';
      const rows = wa.dailyWellnessTrends.map(d =>
        `${d.date},${d.avgEnergy},${d.avgFatigue},${d.avgHydration},${d.avgStress},${d.avgRecovery},${d.avgInflammation},${d.scanCount},${d.checkInCount}`
      ).join('\n');
      const csv = headers + rows;
      if (Platform.OS === 'web') {
        try {
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `iris-wellness-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        } catch {
          Alert.alert('Export', 'CSV export is available on web browser.');
        }
      } else {
        Alert.alert('Export Ready', `CSV data prepared with ${wa.dailyWellnessTrends.length} days.\n\nFull export requires web browser.`);
      }
    };

    return (
      <Animated.View style={styles.animatedViewFade}>
        {/* A) Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Avg Energy"
            value={wa.avgScores.energy.toFixed(1)}
            subtitle="out of 10"
            icon={<Zap color="#34D399" size={18} />}
            color="#34D399"
          />
          <MetricCard
            label="Avg Fatigue"
            value={wa.avgScores.fatigue.toFixed(1)}
            subtitle="out of 10"
            icon={<Activity color="#F59E0B" size={18} />}
            color="#F59E0B"
          />
          <MetricCard
            label="Avg Hydration"
            value={wa.avgScores.hydration.toFixed(1)}
            subtitle="out of 10"
            icon={<Droplets color="#06B6D4" size={18} />}
            color="#06B6D4"
          />
          <MetricCard
            label="Avg Stress"
            value={wa.avgScores.stress.toFixed(1)}
            subtitle="out of 10"
            icon={<Heart color="#EF4444" size={18} />}
            color="#EF4444"
          />
          <MetricCard
            label="Total Scans"
            value={wa.totalScans.toString()}
            subtitle={`${wa.usersWithScans} users`}
            icon={<Scan color="#60A5FA" size={18} />}
            color="#60A5FA"
          />
          <MetricCard
            label="Total Check-ins"
            value={wa.totalCheckIns.toString()}
            subtitle={`${wa.usersWithCheckIns} users`}
            icon={<UserCheck color="#A78BFA" size={18} />}
            color="#A78BFA"
          />
        </View>

        {/* B) Score Distributions - Stacked bars */}
        <SectionCard title="Score Distributions" icon={<BarChart3 color="#34D399" size={16} />} subtitle="Low (1-3) · Mid (4-6) · High (7-10)">
          {(['energy', 'fatigue', 'hydration', 'inflammation', 'recovery', 'stress'] as const).map(key => {
            const dist = wa.scoreDistributions[key];
            const total = dist.low + dist.mid + dist.high;
            const lowPct = total > 0 ? Math.round((dist.low / total) * 100) : 0;
            const midPct = total > 0 ? Math.round((dist.mid / total) * 100) : 0;
            const highPct = total > 0 ? Math.round((dist.high / total) * 100) : 0;
            return (
              <View key={key} style={styles.scoreDistRow}>
                <View style={styles.scoreDistHeader}>
                  <Text style={[styles.scoreDistLabel, { color: scoreColors[key] }]}>{key}</Text>
                  <Text style={styles.scoreDistCount}>n={total}</Text>
                </View>
                <View style={styles.scoreDistBarContainer}>
                  {lowPct > 0 && (
                    <View style={[styles.scoreDistBar, { width: `${lowPct}%`, backgroundColor: '#EF4444' }]}>
                      {lowPct >= 12 && <Text style={styles.scoreDistBarText}>{lowPct}%</Text>}
                    </View>
                  )}
                  {midPct > 0 && (
                    <View style={[styles.scoreDistBar, { width: `${midPct}%`, backgroundColor: '#FBBF24' }]}>
                      {midPct >= 12 && <Text style={styles.scoreDistBarTextDark}>{midPct}%</Text>}
                    </View>
                  )}
                  {highPct > 0 && (
                    <View style={[styles.scoreDistBar, { width: `${highPct}%`, backgroundColor: '#34D399' }]}>
                      {highPct >= 12 && <Text style={styles.scoreDistBarTextDark}>{highPct}%</Text>}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          <View style={styles.scoreLegendContainer}>
            <View style={styles.scoreLegendItem}>
              <View style={[styles.scoreLegendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.scoreLegendText}>Low</Text>
            </View>
            <View style={styles.scoreLegendItem}>
              <View style={[styles.scoreLegendDot, { backgroundColor: '#FBBF24' }]} />
              <Text style={styles.scoreLegendText}>Mid</Text>
            </View>
            <View style={styles.scoreLegendItem}>
              <View style={[styles.scoreLegendDot, { backgroundColor: '#34D399' }]} />
              <Text style={styles.scoreLegendText}>High</Text>
            </View>
          </View>
        </SectionCard>

        {/* C) 30-Day Trends */}
        <SectionCard title="30-Day Wellness Trends" icon={<TrendingUp color="#60A5FA" size={16} />} subtitle="Daily avg scores + scan volume">
          <View style={styles.chartContainer}>
            {wa.dailyWellnessTrends.slice(-14).map((day) => {
              const maxVal = 10;
              const pctEnergy = (day.avgEnergy / maxVal) * 100;
              return (
                <View key={day.date} style={styles.chartRow}>
                  <Text style={styles.chartDateLabel}>{day.date.slice(5)}</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { width: `${Math.max(pctEnergy, 2)}%`, backgroundColor: '#34D399' }]} />
                  </View>
                  <Text style={[styles.chartCountLabel, { width: 34 }]}>
                    {day.scanCount > 0 ? day.avgEnergy.toFixed(1) : '—'}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.trendInfoContainer}>
            <Text style={styles.trendInfoText}>Showing avg energy score. Bars represent daily averages.</Text>
          </View>
        </SectionCard>

        {/* D) Cycle Phase Insights */}
        <SectionCard title="Cycle Phase Insights" icon={<Heart color="#EC4899" size={16} />} subtitle="Avg scores by menstrual phase">
          <View style={styles.phaseAnalyticsContainer}>
            {wa.phaseAnalytics.map(pa => (
              <View key={pa.phase} style={[styles.phaseCard, { borderColor: phaseColors[pa.phase] ? phaseColors[pa.phase] + '40' : '#1F2335' }]}>
                <View style={styles.phaseCardHeader}>
                  <View style={[styles.phaseDot, { backgroundColor: phaseColors[pa.phase] || '#6B7280' }]} />
                  <Text style={[styles.phaseLabel, { color: phaseColors[pa.phase] || '#D1D5DB' }]}>
                    {pa.phase}
                  </Text>
                </View>
                <StatRow label="Avg Energy" value={pa.avgEnergy.toFixed(1)} valueColor="#34D399" />
                <StatRow label="Avg Stress" value={pa.avgStress.toFixed(1)} valueColor="#EF4444" />
                <StatRow label="Users" value={pa.userCount} />
              </View>
            ))}
          </View>
        </SectionCard>

        {/* E) Check-In Patterns */}
        <SectionCard title="Check-In Patterns" icon={<Activity color="#A78BFA" size={16} />} subtitle={`${wa.totalCheckIns} total check-ins`}>
          <StatRow label="Avg Sleep" value={wa.avgCheckIn.sleep.toFixed(1)} valueColor="#8B5CF6" />
          <StatRow label="Avg Energy" value={wa.avgCheckIn.energy.toFixed(1)} valueColor="#34D399" />
          <StatRow label="Avg Stress" value={wa.avgCheckIn.stressLevel.toFixed(1)} valueColor="#EF4444" />
          <StatRow label="Avg Mood" value={wa.avgCheckIn.mood.toFixed(1)} valueColor="#FBBF24" />

          {wa.totalCheckIns > 0 && (
            <View style={styles.checkInDistContainer}>
              <Text style={styles.checkInDistTitle}>Check-In Distributions</Text>
              {(['energy', 'sleep', 'stress'] as const).map(key => {
                const dist = wa.checkInDistributions[key];
                const total = dist.low + dist.mid + dist.high;
                const lowPct = total > 0 ? Math.round((dist.low / total) * 100) : 0;
                const midPct = total > 0 ? Math.round((dist.mid / total) * 100) : 0;
                const highPct = total > 0 ? Math.round((dist.high / total) * 100) : 0;
                return (
                  <View key={key} style={styles.checkInDistRow}>
                    <Text style={styles.checkInDistKey}>{key}</Text>
                    <View style={styles.checkInDistBarContainer}>
                      {lowPct > 0 && <View style={[styles.checkInDistBar, { width: `${lowPct}%`, backgroundColor: '#EF4444' }]} />}
                      {midPct > 0 && <View style={[styles.checkInDistBar, { width: `${midPct}%`, backgroundColor: '#FBBF24' }]} />}
                      {highPct > 0 && <View style={[styles.checkInDistBar, { width: `${highPct}%`, backgroundColor: '#34D399' }]} />}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {wa.topSymptoms.length > 0 && (
            <View style={styles.topSymptomsContainer}>
              <Text style={styles.topSymptomsTitle}>Top 5 Symptoms</Text>
              {wa.topSymptoms.slice(0, 5).map((s, i) => {
                const colors = ['#EF4444', '#F59E0B', '#FBBF24', '#34D399', '#60A5FA'];
                return (
                  <View key={s.symptom} style={styles.eventRow}>
                    <View style={styles.eventRowLeft}>
                      <View style={[styles.eventDot, { backgroundColor: colors[i % colors.length] }]} />
                      <Text style={styles.eventName}>{s.symptom}</Text>
                    </View>
                    <View style={styles.eventRowRight}>
                      <MiniBar value={s.count} max={wa.topSymptoms[0]?.count || 1} color={colors[i % colors.length]} />
                      <Text style={styles.eventCount}>{s.count}</Text>
                      <Text style={styles.eventPct}>{s.percentage}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </SectionCard>

        {/* F) Raw Eye Metrics - Collapsible */}
        <SectionCard title="Raw Eye Metrics" icon={<Eye color="#8B5CF6" size={16} />} subtitle="For algorithm tuning (0-1 scale)">
          <TouchableOpacity
            onPress={() => setEyeMetricsExpanded(!eyeMetricsExpanded)}
            style={styles.eyeMetricsToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeMetricsToggleText}>
              {eyeMetricsExpanded ? 'Hide Details' : 'Show Details'}
            </Text>
            <Text style={styles.eyeMetricsToggleIcon}>{eyeMetricsExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {eyeMetricsExpanded && (
            <View style={styles.eyeMetricsDetailsContainer}>
              {[
                { label: 'Sclera Yellowness', value: wa.avgEyeMetrics.scleraYellowness, color: '#FBBF24' },
                { label: 'Under-Eye Darkness', value: wa.avgEyeMetrics.underEyeDarkness, color: '#A78BFA' },
                { label: 'Eye Openness', value: wa.avgEyeMetrics.eyeOpenness, color: '#34D399' },
                { label: 'Tear Film Quality', value: wa.avgEyeMetrics.tearFilmQuality, color: '#06B6D4' },
              ].map(m => (
                <View key={m.label} style={styles.scanMetricRow}>
                  <View style={styles.scanMetricLabelRow}>
                    <View style={[styles.eventDot, { backgroundColor: m.color }]} />
                    <Text style={styles.scanMetricLabel}>{m.label}</Text>
                    <Text style={[styles.scanMetricValue, { color: m.color }]}>{m.value.toFixed(3)}</Text>
                  </View>
                  <View style={styles.scanMetricBarTrack}>
                    <View style={[styles.scanMetricBarFill, { width: `${Math.max(m.value * 100, 2)}%`, backgroundColor: m.color }]} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        {/* G) CSV Export */}
        {canExport && (
          <TouchableOpacity
            style={styles.exportWellnessButton}
            onPress={handleExportWellnessCSV}
            activeOpacity={0.7}
          >
            <Download color="#60A5FA" size={16} />
            <Text style={styles.exportWellnessButtonText}>Export Wellness CSV</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const renderEvents = () => {
    if (isLoading) return <ActivityIndicator color="#60A5FA" style={styles.loadingIndicator} />;
    if (!stats) return <EmptyState message="No events yet" />;

    return (
      <Animated.View style={styles.animatedViewFade}>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Events"
            value={stats.totalEvents.toLocaleString()}
            icon={<Activity color="#60A5FA" size={18} />}
            color="#60A5FA"
            large
          />
        </View>

        <SectionCard title="Top Events" icon={<BarChart3 color="#34D399" size={16} />} subtitle={`${Object.keys(stats.eventCounts).length} event types`}>
          {stats.topEvents.map((ev, i) => {
            const colors = ['#60A5FA', '#34D399', '#FBBF24', '#EC4899', '#8B5CF6', '#F97316', '#14B8A6', '#EF4444'];
            const color = colors[i % colors.length];
            return (
              <View key={ev.event} style={styles.eventRow}>
                <View style={styles.eventRowLeft}>
                  <View style={[styles.eventDot, { backgroundColor: color }]} />
                  <Text style={styles.eventName}>{ev.event.replace(/_/g, ' ')}</Text>
                </View>
                <View style={styles.eventRowRight}>
                  <MiniBar value={ev.count} max={stats.topEvents[0]?.count || 1} color={color} />
                  <Text style={styles.eventCount}>{ev.count}</Text>
                  <Text style={styles.eventPct}>{ev.percentage}%</Text>
                </View>
              </View>
            );
          })}
        </SectionCard>

        <SectionCard title="Event Volume (14d)" icon={<Activity color="#8B5CF6" size={16} />}>
          <View style={styles.chartContainer}>
            {stats.dailyEvents.slice(-14).map((day) => {
              const maxCount = Math.max(...stats.dailyEvents.map(d => d.count), 1);
              const pct = (day.count / maxCount) * 100;
              return (
                <View key={day.date} style={styles.chartRow}>
                  <Text style={styles.chartDateLabel}>{day.date.slice(5)}</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { width: `${Math.max(pct, 2)}%`, backgroundColor: '#A78BFA' }]} />
                  </View>
                  <Text style={styles.chartCountLabel}>{day.count}</Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        {stats.recentEvents.length > 0 && (
          <SectionCard title="Recent Events" icon={<Clock color="#F59E0B" size={16} />} subtitle="Last 20 events">
            {stats.recentEvents.slice(0, 20).map((evt, i) => (
              <View key={`${evt.timestamp}-${i}`} style={styles.recentEventRow}>
                <View style={styles.recentEventRowFlex}>
                  <Text style={styles.recentEventName}>{evt.event.replace(/_/g, ' ')}</Text>
                  <Text style={styles.recentEventMeta}>
                    {evt.userId.slice(0, 12)}... · {new Date(evt.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.platformBadge}>
                  <Text style={styles.platformBadgeText}>
                    {String(evt.properties?.platform || 'unknown')}
                  </Text>
                </View>
              </View>
            ))}
          </SectionCard>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.adminBadge}>
            <Shield color="#60A5FA" size={14} />
          </View>
          <View>
            <Text style={styles.topBarTitle}>Iris Admin</Text>
            <Text style={styles.topBarRole}>
              {adminUser?.role === 'super_admin' ? 'Super Admin' :
               adminUser?.role === 'analyst' ? 'Analyst' : 'Viewer'}
            </Text>
          </View>
        </View>
        <View style={styles.topBarRight}>
          {canExport && (
            <TouchableOpacity style={styles.iconButton} onPress={handleExportCSV} activeOpacity={0.7}>
              <Download color="#9CA3AF" size={14} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => analyticsQuery.refetch()}
            activeOpacity={0.7}
          >
            <RefreshCw color="#9CA3AF" size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut color="#EF4444" size={14} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabGrid}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => switchTab(tab.key)}
              activeOpacity={0.7}
            >
              {tab.icon}
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={analyticsQuery.isFetching && !analyticsQuery.isLoading}
            onRefresh={() => analyticsQuery.refetch()}
            tintColor="#60A5FA"
          />
        }
      >
        {stats && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              Live · {stats.totalUsers} users · {stats.totalEvents} events
            </Text>
          </View>
        )}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'funnel' && renderFunnel()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'wellness' && renderWellness()}
        {activeTab === 'revenue' && renderRevenue()}
        {activeTab === 'referrals' && renderReferrals()}
        {activeTab === 'events' && renderEvents()}
      </ScrollView>

      <UserDetailModal
        userId={selectedUserId}
        users={stats?.userList ?? []}
        onClose={() => setSelectedUserId(null)}
        canExport={canExport}
      />
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// UserDetailModal — per-user drill-down with scan + check-in history.
// Data is already in stats.userList (anonymous userId only); we just render it.
// ────────────────────────────────────────────────────────────────────────────

type UserSnapshotLike = {
  userId: string;
  firstSeen: string;
  lastSeen: string;
  onboardingCompleted: boolean;
  totalCheckins: number;
  totalScans: number;
  isPremium: boolean;
  lifeStage: string;
  platform: string;
  language: string;
  referralApplied: boolean;
  healthConnected: boolean;
  scanMetrics: Array<{
    timestamp: string;
    stressScore: number;
    energyScore: number;
    recoveryScore: number;
    hydrationLevel: number;
    fatigueLevel: number;
    inflammation: number;
    scleraYellowness: number;
    underEyeDarkness: number;
    eyeOpenness: number;
    tearFilmQuality: number;
  }>;
  checkInEntries: Array<{
    timestamp: string;
    energy: number;
    sleep: number;
    stressLevel: number;
    mood: number;
    symptoms: string[];
    cyclePhase: string;
  }>;
};

function UserDetailModal({
  userId,
  users,
  onClose,
  canExport,
}: {
  userId: string | null;
  users: UserSnapshotLike[];
  onClose: () => void;
  canExport: boolean;
}) {
  const user = useMemo(
    () => (userId ? users.find((u) => u.userId === userId) : null),
    [userId, users],
  );

  const sortedScans = useMemo(
    () =>
      user
        ? [...user.scanMetrics].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
        : [],
    [user],
  );

  const sortedCheckIns = useMemo(
    () =>
      user
        ? [...user.checkInEntries].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
        : [],
    [user],
  );

  const handleExportUserCSV = useCallback(() => {
    if (!user) return;
    const scanHeaders =
      'timestamp,energy,stress,recovery,hydration,fatigue,irritation,scleraYellowness,underEyeDarkness,eyeOpenness,tearFilmQuality';
    const scanRows = sortedScans
      .map(
        (s) =>
          `${s.timestamp},${s.energyScore},${s.stressScore},${s.recoveryScore},${s.hydrationLevel},${s.fatigueLevel},${s.inflammation},${s.scleraYellowness},${s.underEyeDarkness},${s.eyeOpenness},${s.tearFilmQuality}`,
      )
      .join('\n');
    const ciHeaders =
      '\n\ntimestamp,energy,sleep,stress,mood,phase,symptoms';
    const ciRows = sortedCheckIns
      .map(
        (c) =>
          `${c.timestamp},${c.energy},${c.sleep},${c.stressLevel},${c.mood},${c.cyclePhase},"${c.symptoms.join('|')}"`,
      )
      .join('\n');
    const csv = scanHeaders + '\n' + scanRows + ciHeaders + '\n' + ciRows;

    if (Platform.OS === 'web') {
      try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iris-user-${user.userId.slice(0, 12)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        Alert.alert('Export', 'CSV export is available on web browser.');
      }
    } else {
      Alert.alert('Export', `User CSV prepared.\nScans: ${sortedScans.length}\nCheck-ins: ${sortedCheckIns.length}\n\nFull export requires web browser.`);
    }
  }, [user, sortedScans, sortedCheckIns]);

  if (!user) return null;

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <Modal
      visible={!!userId}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.detailModalContainer}>
        <View style={styles.detailModalHeader}>
          <View>
            <Text style={styles.detailModalTitle}>User Detail</Text>
            <Text style={styles.detailModalSubtitle} numberOfLines={1}>
              {user.userId}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {canExport && (
              <TouchableOpacity style={styles.iconButton} onPress={handleExportUserCSV} activeOpacity={0.7}>
                <Download color="#9CA3AF" size={14} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconButton} onPress={onClose} activeOpacity={0.7}>
              <CloseIcon color="#9CA3AF" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.detailModalScroll} showsVerticalScrollIndicator={false}>
          {/* Summary */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Users color="#60A5FA" size={16} />
              <View style={styles.sectionHeaderFlex}>
                <Text style={styles.sectionTitle}>Summary</Text>
              </View>
            </View>
            <View style={styles.detailSummaryGrid}>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Platform</Text>
                <Text style={styles.detailSummaryValue}>{user.platform}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Life Stage</Text>
                <Text style={styles.detailSummaryValue}>{user.lifeStage}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Language</Text>
                <Text style={styles.detailSummaryValue}>{user.language}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>First Seen</Text>
                <Text style={styles.detailSummaryValue}>{fmtDate(user.firstSeen)}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Last Seen</Text>
                <Text style={styles.detailSummaryValue}>{fmtDate(user.lastSeen)}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Onboarded</Text>
                <Text style={styles.detailSummaryValue}>
                  {user.onboardingCompleted ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Premium</Text>
                <Text style={styles.detailSummaryValue}>{user.isPremium ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Health Connected</Text>
                <Text style={styles.detailSummaryValue}>{user.healthConnected ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Total Scans</Text>
                <Text style={styles.detailSummaryValue}>{sortedScans.length}</Text>
              </View>
              <View style={styles.detailSummaryRow}>
                <Text style={styles.detailSummaryLabel}>Total Check-ins</Text>
                <Text style={styles.detailSummaryValue}>{sortedCheckIns.length}</Text>
              </View>
            </View>
          </View>

          {/* Scan history */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Eye color="#8B5CF6" size={16} />
              <View style={styles.sectionHeaderFlex}>
                <Text style={styles.sectionTitle}>Scan History</Text>
                <Text style={styles.sectionSubtitle}>{sortedScans.length} scans</Text>
              </View>
            </View>
            {sortedScans.length === 0 ? (
              <Text style={styles.detailEmptyHint}>No scans recorded.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.tableCellWide]}>When</Text>
                    <Text style={styles.tableCell}>Energy</Text>
                    <Text style={styles.tableCell}>Stress</Text>
                    <Text style={styles.tableCell}>Recovery</Text>
                    <Text style={styles.tableCell}>Hydration</Text>
                    <Text style={styles.tableCell}>Fatigue</Text>
                    <Text style={styles.tableCell}>Irritation</Text>
                  </View>
                  {sortedScans.slice(0, 100).map((s, i) => (
                    <View key={`${s.timestamp}-${i}`} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.tableCellWide, styles.userIdText]} numberOfLines={1}>
                        {fmtDate(s.timestamp)}
                      </Text>
                      <Text style={styles.tableCell}>{s.energyScore}</Text>
                      <Text style={styles.tableCell}>{s.stressScore}</Text>
                      <Text style={styles.tableCell}>{s.recoveryScore}</Text>
                      <Text style={styles.tableCell}>{s.hydrationLevel}</Text>
                      <Text style={styles.tableCell}>{s.fatigueLevel}</Text>
                      <Text style={styles.tableCell}>{s.inflammation}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Check-in history */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Heart color="#EF4444" size={16} />
              <View style={styles.sectionHeaderFlex}>
                <Text style={styles.sectionTitle}>Check-in History</Text>
                <Text style={styles.sectionSubtitle}>{sortedCheckIns.length} check-ins</Text>
              </View>
            </View>
            {sortedCheckIns.length === 0 ? (
              <Text style={styles.detailEmptyHint}>No check-ins recorded.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.tableCellWide]}>When</Text>
                    <Text style={styles.tableCell}>Energy</Text>
                    <Text style={styles.tableCell}>Sleep</Text>
                    <Text style={styles.tableCell}>Stress</Text>
                    <Text style={styles.tableCell}>Mood</Text>
                    <Text style={styles.tableCell}>Phase</Text>
                    <Text style={[styles.tableCell, styles.tableCellWide]}>Symptoms</Text>
                  </View>
                  {sortedCheckIns.slice(0, 100).map((c, i) => (
                    <View key={`${c.timestamp}-${i}`} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.tableCellWide, styles.userIdText]} numberOfLines={1}>
                        {fmtDate(c.timestamp)}
                      </Text>
                      <Text style={styles.tableCell}>{c.energy}</Text>
                      <Text style={styles.tableCell}>{c.sleep}</Text>
                      <Text style={styles.tableCell}>{c.stressLevel}</Text>
                      <Text style={styles.tableCell}>{c.mood}</Text>
                      <Text style={[styles.tableCell, { fontSize: 9 }]}>{c.cyclePhase}</Text>
                      <Text style={[styles.tableCell, styles.tableCellWide, { fontSize: 9 }]} numberOfLines={2}>
                        {c.symptoms.join(', ') || '—'}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          <Text style={styles.detailPrivacyNote}>
            All data is anonymous. Only the random userId is stored — no names, emails,
            device IDs, or photos ever leave the device.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  topBar: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  topBarLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  adminBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#60A5FA14',
    borderWidth: 1,
    borderColor: '#60A5FA30',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#F9FAFB',
    letterSpacing: -0.3,
  },
  topBarRole: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  topBarRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#151823',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: '#1F2335',
  },
  tabGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  tab: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#151823',
    borderWidth: 1,
    borderColor: '#1F2335',
  },
  tabActive: {
    backgroundColor: '#60A5FA18',
    borderColor: '#60A5FA40',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#60A5FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  liveIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500' as const,
  },
  metricsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#131620',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2335',
  },
  metricCardLarge: {
    minWidth: 160,
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#F9FAFB',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  metricValueLarge: {
    fontSize: 24,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  metricSub: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: '#131620',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2335',
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#E5E7EB',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 1,
  },
  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  statRowLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 1,
  },
  statRowValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#F9FAFB',
    textAlign: 'right' as const,
  },
  funnelContainer: {
    gap: 8,
  },
  funnelStep: {
    gap: 3,
  },
  funnelBarRow: {
    height: 22,
    borderRadius: 6,
    overflow: 'hidden' as const,
  },
  funnelBar: {
    height: '100%',
    borderRadius: 6,
  },
  funnelLabelRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  funnelLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  funnelRightCol: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  funnelValue: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  funnelPct: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500' as const,
    minWidth: 32,
    textAlign: 'right' as const,
  },
  funnelDropoff: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2,
    backgroundColor: '#EF444414',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  funnelDropoffText: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '600' as const,
  },
  chartContainer: {
    gap: 3,
  },
  chartRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  chartDateLabel: {
    color: '#4B5563',
    fontSize: 10,
    width: 38,
    fontWeight: '500' as const,
  },
  chartBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#1A1D2E',
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  chartCountLabel: {
    color: '#6B7280',
    fontSize: 10,
    width: 26,
    textAlign: 'right' as const,
    fontWeight: '500' as const,
  },
  distRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  distRowLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    flex: 1,
  },
  distRowRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  distDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distLabel: {
    fontSize: 12,
    color: '#D1D5DB',
    flex: 1,
  },
  distValue: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#9CA3AF',
    minWidth: 60,
    textAlign: 'right' as const,
  },
  miniBarTrack: {
    width: 48,
    height: 4,
    backgroundColor: '#1A1D2E',
    borderRadius: 2,
    overflow: 'hidden' as const,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  noDataText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic' as const,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600' as const,
  },
  emptyStateHint: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center' as const,
    maxWidth: 240,
  },
  tableHeader: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2335',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#131620',
    marginBottom: 2,
  },
  tableCell: {
    width: 56,
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center' as const,
    paddingVertical: 4,
    fontWeight: '500' as const,
  },
  tableCellWide: {
    width: 100,
    textAlign: 'left' as const,
    color: '#D1D5DB',
  },
  tableCellBadge: {
    borderRadius: 4,
    backgroundColor: '#1A1D2E',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 1,
  },
  tableCellText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  eventRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  eventRowLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    flex: 1,
  },
  eventRowRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventName: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  eventCount: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#F9FAFB',
    minWidth: 30,
    textAlign: 'right' as const,
  },
  eventPct: {
    fontSize: 10,
    color: '#6B7280',
    minWidth: 28,
    textAlign: 'right' as const,
  },
  recentEventRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  recentEventName: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  recentEventMeta: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 1,
  },
  platformBadge: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformBadgeText: {
    color: '#93C5FD',
    fontSize: 9,
    fontWeight: '600' as const,
  },
  referralBadge: {
    backgroundColor: '#34D39918',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  referralBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600' as const,
  },
  paywallFunnel: {
    marginTop: 12,
    gap: 8,
  },
  paywallFunnelRow: {
    gap: 4,
  },
  paywallFunnelLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  paywallFunnelBar: {
    height: 28,
    borderRadius: 6,
    justifyContent: 'center' as const,
    paddingHorizontal: 10,
  },
  paywallFunnelBarText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#A78BFA',
  },
  scanMetricRow: {
    marginBottom: 10,
  },
  scanMetricLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 4,
  },
  scanMetricLabel: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500' as const,
    flex: 1,
  },
  scanMetricHint: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 1,
  },
  scanMetricValue: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  scanMetricBarTrack: {
    height: 5,
    backgroundColor: '#1A1D2E',
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  scanMetricBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  distSection: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  distSectionTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginBottom: 6,
    textTransform: 'capitalize' as const,
  },
  distBarsRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 4,
    height: 40,
  },
  distBarCol: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
  },
  distBar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 2,
  },
  distBarLabel: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 3,
    fontWeight: '500' as const,
  },
  recentScanRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D2E',
  },
  recentScanHeader: {
    marginBottom: 6,
  },
  recentScanTime: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  recentScanScores: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  recentScanScore: {
    flex: 1,
    alignItems: 'center' as const,
    backgroundColor: '#1A1D2E',
    borderRadius: 6,
    paddingVertical: 4,
  },
  recentScanScoreVal: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  recentScanScoreLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500' as const,
    marginTop: 1,
  },
  // New styles extracted from inline declarations
  sectionHeaderFlex: {
    flex: 1,
  },
  authLoadingContainer: {
    flex: 1,
    backgroundColor: '#0F1117',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  animatedViewFade: {
    opacity: 1, // Will be overridden by Animated.View's style prop
  },
  userIdText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  badgeOnboardedYes: {
    backgroundColor: '#10B98118',
  },
  badgeOnboardedYesText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#34D399',
  },
  badgeOnboardedNo: {
    backgroundColor: '#EF444418',
  },
  badgeOnboardedNoText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  badgePremiumYes: {
    backgroundColor: '#10B98118',
  },
  badgePremiumYesText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#34D399',
  },
  badgePremiumNo: {
    backgroundColor: '#252838',
  },
  badgePremiumNoText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  platformBadgeTable: {
    backgroundColor: '#1E3A5F',
  },
  platformBadgeTableText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: '#93C5FD',
  },
  scoreDistRow: {
    marginBottom: 10,
  },
  scoreDistHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 4,
  },
  scoreDistLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  scoreDistCount: {
    fontSize: 10,
    color: '#6B7280',
  },
  scoreDistBarContainer: {
    flexDirection: 'row' as const,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden' as const,
    backgroundColor: '#1A1D2E',
  },
  scoreDistBar: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  scoreDistBarText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '700' as const,
  },
  scoreDistBarTextDark: {
    fontSize: 8,
    color: '#1A1D2E',
    fontWeight: '700' as const,
  },
  scoreLegendContainer: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 6,
  },
  scoreLegendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  scoreLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scoreLegendText: {
    fontSize: 10,
    color: '#6B7280',
  },
  trendInfoContainer: {
    marginTop: 8,
  },
  trendInfoText: {
    fontSize: 10,
    color: '#4B5563',
  },
  phaseAnalyticsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  phaseCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#0B0E14',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  phaseCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 8,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  checkInDistContainer: {
    marginTop: 12,
  },
  checkInDistTitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  checkInDistRow: {
    marginBottom: 8,
  },
  checkInDistKey: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 3,
    textTransform: 'capitalize' as const,
  },
  checkInDistBarContainer: {
    flexDirection: 'row' as const,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden' as const,
    backgroundColor: '#1A1D2E',
  },
  checkInDistBar: {
    height: '100%',
  },
  topSymptomsContainer: {
    marginTop: 12,
  },
  topSymptomsTitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  eyeMetricsToggle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 6,
  },
  eyeMetricsToggleText: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '500' as const,
  },
  eyeMetricsToggleIcon: {
    fontSize: 10,
    color: '#4B5563',
  },
  eyeMetricsDetailsContainer: {
    marginTop: 8,
  },
  exportWellnessButton: {
    backgroundColor: '#131620',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2335',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  exportWellnessButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#60A5FA',
  },
  recentEventRowFlex: {
    flex: 1,
  },
  // User detail modal
  detailModalContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  detailModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#F9FAFB',
  },
  detailModalSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  detailModalScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  detailSummaryGrid: {
    gap: 8,
  },
  detailSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  detailSummaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailSummaryValue: {
    fontSize: 12,
    color: '#F9FAFB',
    fontWeight: '500' as const,
  },
  detailEmptyHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    padding: 12,
    textAlign: 'center',
  },
  detailPrivacyNote: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    lineHeight: 14,
  },
});
