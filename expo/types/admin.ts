export interface AdminUser {
  username: string;
  role: 'super_admin' | 'analyst' | 'viewer';
  permissions: AdminPermission[];
}

export type AdminPermission = 'view_users' | 'view_revenue' | 'view_features' | 'export_data' | 'manage_roles';

export interface UserMetrics {
  totalUsers: number;
  dau: number;
  wau: number;
  mau: number;
  retention7Day: number;
  retention30Day: number;
  conversionRate: number;
  referralUsageRate: number;
  newUsersToday: number;
  newUsersThisWeek: number;
}

export interface FeatureUsage {
  scanCompletionRate: number;
  checkInCompletionRate: number;
  habitCompletionRate: number;
  lifeStageDistribution: { stage: string; count: number; percentage: number }[];
  cycleRegularityDistribution: { type: string; count: number; percentage: number }[];
  topSymptoms: { symptom: string; count: number }[];
  avgScansPerUser: number;
  avgCheckInsPerUser: number;
}

export interface PatternDetection {
  pregnancyScore: number;
  pregnancyThreshold: number;
  perimenopauseScore: number;
  perimenopauseThreshold: number;
  pregnancyIndicators: string[];
  perimenopauseIndicators: string[];
  currentLifeStage: string;
  hasSuggestion: boolean;
  suggestionType: 'pregnancy' | 'perimenopause' | null;
  suggestionMessage: string | null;
  userAccepted: boolean;
  userDismissed: boolean;
  dismissedType: string | null;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  freeTrialsActive: number;
  churnRate: number;
  referralDiscountsUsed: number;
  avgRevenuePerUser: number;
  totalRevenue: number;
  mrrGrowth: number;
  ltv: number;
}

export interface DailyDataPoint {
  date: string;
  users: number;
  scans: number;
  checkIns: number;
  revenue: number;
  newUsers: number;
}

export interface RealMetrics {
  totalCheckIns: number;
  totalScans: number;
  activeDays: number;
  avgMood: number;
  avgEnergy: number;
  avgSleep: number;
  avgCycleLength: number;
  cyclesTracked: number;
  scanAvgStress: number;
  scanAvgEnergy: number;
  scanAvgRecovery: number;
  scanAvgFatigue: number;
  scanAvgInflammation: number;
  scanAvgHydration: number;
  todayCheckIns: number;
  todayScans: number;
  weekCheckIns: number;
  weekScans: number;
}

export interface UserEngagement {
  dailyActiveRate: number;
  weeklyActiveRate: number;
  avgSessionDuration: number;
  avgCheckInsPerDay: number;
  avgScansPerDay: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  firstActiveDate: string;
  totalActiveDays: number;
  daysSinceSignup: number;
}

export interface UserDemographics {
  ageGroups: { group: string; count: number; percentage: number }[];
  lifeStages: { stage: string; count: number; percentage: number }[];
  cycleRegularity: { type: string; count: number; percentage: number }[];
  birthControlUsage: { type: string; count: number; percentage: number }[];
  goalDistribution: { goal: string; count: number; percentage: number }[];
  focusDistribution: { focus: string; count: number; percentage: number }[];
}

export interface AppHealthMetrics {
  onboardingCompletionRate: number;
  featureAdoption: { feature: string; adoptionRate: number; usageCount: number }[];
  dataCompleteness: { field: string; completionRate: number }[];
  errorRate: number;
  avgLoadTime: number;
}

export interface RetentionCohort {
  cohort: string;
  day1: number;
  day7: number;
  day14: number;
  day30: number;
  day60: number;
  day90: number;
}

export interface SymptomTrend {
  symptom: string;
  weeklyCount: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
  totalCount: number;
}

export interface ScanTrend {
  metric: string;
  values: number[];
  dates: string[];
  trend: 'improving' | 'declining' | 'stable';
  currentAvg: number;
  previousAvg: number;
  changePercent: number;
}

export interface UserJourneyStep {
  step: string;
  completed: boolean;
  completedAt: string | null;
  details: string;
}

export interface AdminDashboardData {
  userMetrics: UserMetrics;
  featureUsage: FeatureUsage;
  revenueMetrics: RevenueMetrics;
  dailyData: DailyDataPoint[];
  realMetrics?: RealMetrics;
  engagement?: UserEngagement;
  demographics?: UserDemographics;
  appHealth?: AppHealthMetrics;
  retentionCohorts?: RetentionCohort[];
  symptomTrends?: SymptomTrend[];
  scanTrends?: ScanTrend[];
  userJourney?: UserJourneyStep[];
}

export type DateRange = '7d' | '30d' | '90d' | '12m';

export type AdminTab = 'overview' | 'users' | 'features' | 'revenue' | 'patterns' | 'health' | 'funnel';
