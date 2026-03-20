import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyDataPoint } from '@/types/admin';
import Colors from '@/constants/colors';

interface AdminChartProps {
  data: DailyDataPoint[];
  dataKey: keyof Pick<DailyDataPoint, 'users' | 'scans' | 'checkIns' | 'revenue' | 'newUsers'>;
  color: string;
  title: string;
  formatValue?: (val: number) => string;
  height?: number;
}

export default React.memo(function AdminChart({ data, dataKey, color, title, formatValue, height = 140 }: AdminChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return { bars: [], max: 0, min: 0, avg: 0, total: 0, latest: 0 };

    const sampled = data.length > 30
      ? data.filter((_, i) => i % Math.ceil(data.length / 30) === 0 || i === data.length - 1)
      : data;

    const values = sampled.map(d => d[dataKey] as number);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const latest = values[values.length - 1] ?? 0;

    const bars = values.map((v) => ({
      value: v,
      height: max > 0 ? (v / max) * 100 : 0,
    }));

    return { bars, max, min, avg, total, latest };
  }, [data, dataKey]);

  const fmt = formatValue ?? ((v: number) => v.toLocaleString());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.latestValue, { color }]}>{fmt(chartData.latest)}</Text>
      </View>

      <View style={[styles.chartArea, { height }]}>
        <View style={styles.gridLines}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[styles.gridLine, { bottom: `${i * 33}%` }]} />
          ))}
        </View>
        <View style={styles.barsContainer}>
          {chartData.bars.map((bar, i) => (
            <View key={i} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${Math.max(bar.height, 2)}%`,
                    backgroundColor: color,
                    opacity: 0.3 + (bar.height / 100) * 0.7,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{fmt(Math.round(chartData.avg))}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{fmt(chartData.min)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{fmt(chartData.max)}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  latestValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  chartArea: {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    borderRadius: 8,
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 2,
    paddingHorizontal: 2,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end' as const,
  },
  bar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 2,
  },
  stats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  stat: {
    alignItems: 'center' as const,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
});
