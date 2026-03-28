/**
 * English-only translations for the Perimenopause Score feature.
 * These are kept separate from the main translations.ts to avoid
 * bloating the main bundle until multi-language support is added.
 */

export const perimenopauseTranslations = {
  "perimenopause.scoreTitle": "Perimenopause Wellness Score",
  "perimenopause.scoreSubtitle": "Based on your recent check-ins and scans",
  "perimenopause.low": "Mild",
  "perimenopause.moderate": "Moderate",
  "perimenopause.significant": "Significant",
  "perimenopause.hotFlashes": "Hot Flashes",
  "perimenopause.nightSweats": "Night Sweats",
  "perimenopause.sleepQuality": "Sleep Quality",
  "perimenopause.moodStability": "Mood Stability",
  "perimenopause.cycleRegularity": "Cycle Regularity",
  "perimenopause.fatigueLevel": "Fatigue Level",
  "perimenopause.stressLevel": "Stress Level",
  "perimenopause.disclaimer":
    "This score is a wellness estimate, not a medical assessment. Consult your healthcare provider for medical guidance.",
  "perimenopause.talkToDoctor": "Share with Your Doctor",
  "perimenopause.viewTrends": "View Trends",
} as const;

export type PerimenopauseTranslationKey = keyof typeof perimenopauseTranslations;

/**
 * Get a perimenopause translation string by key.
 * Currently English-only; extend with a language parameter
 * when multi-language support is needed.
 */
export function getPerimenopauseText(key: PerimenopauseTranslationKey): string {
  return perimenopauseTranslations[key];
}
