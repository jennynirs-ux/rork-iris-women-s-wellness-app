/**
 * Condition Profile Translations
 *
 * English translations for all condition names, descriptions, and symptoms.
 * Uses || fallbacks so it works even without full 9-language support initially.
 */

export interface ConditionTranslation {
  name: string;
  description: string;
}

export interface ConditionTranslations {
  conditions: Record<string, ConditionTranslation>;
  symptoms: Record<string, string>;
  insights: Record<string, string>;
  metrics: Record<string, string>;
}

export const conditionTranslations: ConditionTranslations = {
  conditions: {
    none: {
      name: 'None',
      description: 'No specific health conditions selected.',
    },
    pcos: {
      name: 'PCOS',
      description: 'Polycystic ovary syndrome — track insulin resistance symptoms, irregular cycles, acne, hair changes, and weight fluctuations.',
    },
    endometriosis: {
      name: 'Endometriosis',
      description: 'Track pain levels, pain locations, fatigue severity, and bowel symptoms related to endometriosis.',
    },
    pmdd: {
      name: 'PMDD',
      description: 'Premenstrual dysphoric disorder — track severe mood changes, anxiety, depression timing, and irritability episodes.',
    },
    fibroids: {
      name: 'Fibroids',
      description: 'Uterine fibroids — track heavy bleeding, clot size, pelvic pressure, and urination frequency.',
    },
  },

  symptoms: {
    // PCOS symptoms
    'Acne flare': 'Acne flare',
    'Hair thinning': 'Hair thinning',
    'Sugar cravings': 'Sugar cravings',
    'Pelvic pain': 'Pelvic pain',

    // Endometriosis symptoms
    'Deep pelvic pain': 'Deep pelvic pain',
    'Pain during exercise': 'Pain during exercise',
    'Bowel discomfort': 'Bowel discomfort',
    'Back pain': 'Back pain',

    // PMDD symptoms
    'Overwhelming sadness': 'Overwhelming sadness',
    'Rage/irritability': 'Rage / irritability',
    'Anxiety attack': 'Anxiety attack',
    'Feeling out of control': 'Feeling out of control',

    // Fibroids symptoms
    'Heavy clotting': 'Heavy clotting',
    'Pelvic pressure': 'Pelvic pressure',
    'Frequent urination': 'Frequent urination',
    'Lower back ache': 'Lower back ache',
  },

  insights: {
    // PCOS
    pcos_insulin_tip: 'Your blood sugar patterns may benefit from balanced meals with protein and healthy fats.',
    pcos_cycle_variability: 'Cycle variability is common with PCOS — tracking helps identify your personal patterns.',
    pcos_weight_trend: 'Weight fluctuations can correlate with hormonal changes in PCOS.',
    pcos_skin_correlation: 'Skin changes like acne may relate to hormonal shifts during your cycle.',

    // Endometriosis
    endo_pain_pattern: 'Tracking your pain patterns can help you anticipate and manage flare-ups.',
    endo_fatigue_correlation: 'Fatigue and pain often go hand-in-hand with endometriosis.',
    endo_exercise_adaptation: 'Gentle movement may help, but listen to your body on high-pain days.',
    endo_flare_predictor: 'Certain cycle phases may correlate with more intense symptoms.',

    // PMDD
    pmdd_mood_cycle_pattern: 'Mood changes in PMDD typically intensify 7-10 days before your period.',
    pmdd_luteal_warning: 'The luteal phase is when PMDD symptoms tend to peak.',
    pmdd_coping_strategies: 'Grounding exercises, journaling, and consistent sleep can help manage symptoms.',
    pmdd_symptom_timeline: 'Tracking the exact timing of mood shifts helps identify your personal PMDD window.',

    // Fibroids
    fibroids_bleeding_pattern: 'Tracking bleeding heaviness helps monitor changes over time.',
    fibroids_iron_level_warning: 'Heavy periods from fibroids can affect iron levels — consider iron-rich foods.',
    fibroids_pressure_management: 'Pelvic pressure may increase during certain activities or cycle phases.',
    fibroids_activity_adaptation: 'Adjust exercise intensity based on how your symptoms feel day-to-day.',
  },

  metrics: {
    insulin_resistance_symptoms: 'Insulin sensitivity',
    irregular_cycle_tracking: 'Cycle regularity',
    weight_fluctuation: 'Weight trends',
    acne_severity: 'Skin clarity',
    pain_level_tracking: 'Pain level',
    pain_location_map: 'Pain locations',
    fatigue_severity: 'Fatigue severity',
    bowel_symptom_log: 'Digestive comfort',
    mood_severity_scale: 'Mood intensity',
    anxiety_level: 'Anxiety level',
    depression_timing: 'Low mood timing',
    rage_episode_count: 'Irritability episodes',
    bleeding_heaviness_scale: 'Bleeding heaviness',
    clot_size_log: 'Clot tracking',
    pelvic_pressure_level: 'Pelvic pressure',
    urination_frequency: 'Urination frequency',
  },
};
