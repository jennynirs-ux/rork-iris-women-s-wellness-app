/**
 * PCOS / Endometriosis / PMDD / Fibroids Condition Profiles
 *
 * Each profile defines:
 *   - Extra symptoms the user can track in daily check-ins
 *   - Additional wellness metrics to surface
 *   - Condition-specific insight descriptions
 *   - How coaching tips should adapt
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConditionProfile = 'none' | 'pcos' | 'endometriosis' | 'pmdd' | 'fibroids';

export interface ConditionConfig {
  id: ConditionProfile;
  /** Translation key for the condition name */
  nameKey: string;
  /** Translation key for the description */
  descriptionKey: string;
  /** Emoji icon representing the condition */
  icon: string;
  /** Extra symptoms that appear in the check-in when this condition is active */
  additionalSymptoms: string[];
  /** Extra daily metrics to track */
  additionalMetrics: string[];
  /** Condition-specific insight description keys */
  insightKeys: string[];
  /** How coaching tips should change */
  coachingAdjustments: string[];
}

// ---------------------------------------------------------------------------
// Profile definitions
// ---------------------------------------------------------------------------

export const CONDITION_PROFILES: Record<ConditionProfile, ConditionConfig> = {
  none: {
    id: 'none',
    nameKey: 'condition_none',
    descriptionKey: 'condition_none_desc',
    icon: '',
    additionalSymptoms: [],
    additionalMetrics: [],
    insightKeys: [],
    coachingAdjustments: [],
  },

  pcos: {
    id: 'pcos',
    nameKey: 'condition_pcos',
    descriptionKey: 'condition_pcos_desc',
    icon: 'Activity',
    additionalSymptoms: [
      'Acne flare',
      'Hair thinning',
      'Sugar cravings',
      'Pelvic pain',
    ],
    additionalMetrics: [
      'insulin_resistance_symptoms',
      'irregular_cycle_tracking',
      'weight_fluctuation',
      'acne_severity',
    ],
    insightKeys: [
      'pcos_insulin_tip',
      'pcos_cycle_variability',
      'pcos_weight_trend',
      'pcos_skin_correlation',
    ],
    coachingAdjustments: [
      'Prioritize low-glycemic nutrition advice',
      'Emphasize strength training for insulin sensitivity',
      'Monitor cycle regularity closely',
      'Suggest anti-inflammatory foods more frequently',
    ],
  },

  endometriosis: {
    id: 'endometriosis',
    nameKey: 'condition_endometriosis',
    descriptionKey: 'condition_endometriosis_desc',
    icon: 'Heart',
    additionalSymptoms: [
      'Deep pelvic pain',
      'Pain during exercise',
      'Bowel discomfort',
      'Back pain',
    ],
    additionalMetrics: [
      'pain_level_tracking',
      'pain_location_map',
      'fatigue_severity',
      'bowel_symptom_log',
    ],
    insightKeys: [
      'endo_pain_pattern',
      'endo_fatigue_correlation',
      'endo_exercise_adaptation',
      'endo_flare_predictor',
    ],
    coachingAdjustments: [
      'Recommend gentle movement during flare days',
      'Suggest heat therapy and anti-inflammatory foods',
      'Reduce high-impact exercise recommendations when pain is high',
      'Prioritize recovery and rest guidance',
    ],
  },

  pmdd: {
    id: 'pmdd',
    nameKey: 'condition_pmdd',
    descriptionKey: 'condition_pmdd_desc',
    icon: 'Cloud',
    additionalSymptoms: [
      'Overwhelming sadness',
      'Rage/irritability',
      'Anxiety attack',
      'Feeling out of control',
    ],
    additionalMetrics: [
      'mood_severity_scale',
      'anxiety_level',
      'depression_timing',
      'rage_episode_count',
    ],
    insightKeys: [
      'pmdd_mood_cycle_pattern',
      'pmdd_luteal_warning',
      'pmdd_coping_strategies',
      'pmdd_symptom_timeline',
    ],
    coachingAdjustments: [
      'Increase mindfulness and grounding recommendations in luteal phase',
      'Suggest calming activities 7-10 days before expected period',
      'Recommend journaling for emotional processing',
      'Prioritize sleep hygiene and stress reduction tips',
    ],
  },

  fibroids: {
    id: 'fibroids',
    nameKey: 'condition_fibroids',
    descriptionKey: 'condition_fibroids_desc',
    icon: 'Droplets',
    additionalSymptoms: [
      'Heavy clotting',
      'Pelvic pressure',
      'Frequent urination',
      'Lower back ache',
    ],
    additionalMetrics: [
      'bleeding_heaviness_scale',
      'clot_size_log',
      'pelvic_pressure_level',
      'urination_frequency',
    ],
    insightKeys: [
      'fibroids_bleeding_pattern',
      'fibroids_iron_level_warning',
      'fibroids_pressure_management',
      'fibroids_activity_adaptation',
    ],
    coachingAdjustments: [
      'Emphasize iron-rich food recommendations during and after menstruation',
      'Suggest tracking clot size for medical reporting',
      'Recommend gentle core exercises, avoid heavy abdominal strain',
      'Monitor energy levels closely due to potential anemia',
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get all additional symptoms for the user's active condition profiles.
 * Useful for extending the check-in screen's symptom list.
 */
export function getAdditionalSymptoms(conditions: ConditionProfile[]): string[] {
  const symptoms = new Set<string>();
  for (const cond of conditions) {
    const profile = CONDITION_PROFILES[cond];
    if (profile) {
      for (const s of profile.additionalSymptoms) {
        symptoms.add(s);
      }
    }
  }
  return Array.from(symptoms);
}

/**
 * Get coaching adjustment notes for all active condition profiles.
 */
export function getCoachingAdjustments(conditions: ConditionProfile[]): string[] {
  const adjustments: string[] = [];
  for (const cond of conditions) {
    const profile = CONDITION_PROFILES[cond];
    if (profile) {
      adjustments.push(...profile.coachingAdjustments);
    }
  }
  return adjustments;
}

/**
 * Get additional metrics to display for active conditions.
 */
export function getAdditionalMetrics(conditions: ConditionProfile[]): string[] {
  const metrics = new Set<string>();
  for (const cond of conditions) {
    const profile = CONDITION_PROFILES[cond];
    if (profile) {
      for (const m of profile.additionalMetrics) {
        metrics.add(m);
      }
    }
  }
  return Array.from(metrics);
}
