export interface ProgramDay {
  dayNumber: number;
  titleKey: string;
  descriptionKey: string;
  habitKey: string;
  tipKey: string;
}

export interface GuidedProgram {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: 'sleep' | 'stress' | 'nutrition' | 'movement' | 'skin';
  icon: string;
  durationDays: number;
  isPremium: boolean;
  days: ProgramDay[];
}

export const GUIDED_PROGRAMS: GuidedProgram[] = [
  // ── 1. Sleep Reset ──────────────────────────────────────────────
  {
    id: 'prog_sleep_reset',
    titleKey: 'sleepResetTitle',
    descriptionKey: 'sleepResetDescription',
    category: 'sleep',
    icon: 'Moon',
    durationDays: 7,
    isPremium: false,
    days: [
      {
        dayNumber: 1,
        titleKey: 'sleepResetDay1Title',
        descriptionKey: 'sleepResetDay1Desc',
        habitKey: 'recovery',
        tipKey: 'sleepResetDay1Tip',
      },
      {
        dayNumber: 2,
        titleKey: 'sleepResetDay2Title',
        descriptionKey: 'sleepResetDay2Desc',
        habitKey: 'recovery',
        tipKey: 'sleepResetDay2Tip',
      },
      {
        dayNumber: 3,
        titleKey: 'sleepResetDay3Title',
        descriptionKey: 'sleepResetDay3Desc',
        habitKey: 'mindfulness',
        tipKey: 'sleepResetDay3Tip',
      },
      {
        dayNumber: 4,
        titleKey: 'sleepResetDay4Title',
        descriptionKey: 'sleepResetDay4Desc',
        habitKey: 'nutrition',
        tipKey: 'sleepResetDay4Tip',
      },
      {
        dayNumber: 5,
        titleKey: 'sleepResetDay5Title',
        descriptionKey: 'sleepResetDay5Desc',
        habitKey: 'recovery',
        tipKey: 'sleepResetDay5Tip',
      },
      {
        dayNumber: 6,
        titleKey: 'sleepResetDay6Title',
        descriptionKey: 'sleepResetDay6Desc',
        habitKey: 'mindfulness',
        tipKey: 'sleepResetDay6Tip',
      },
      {
        dayNumber: 7,
        titleKey: 'sleepResetDay7Title',
        descriptionKey: 'sleepResetDay7Desc',
        habitKey: 'recovery',
        tipKey: 'sleepResetDay7Tip',
      },
    ],
  },

  // ── 2. Stress Relief ────────────────────────────────────────────
  {
    id: 'prog_stress_relief',
    titleKey: 'stressReliefTitle',
    descriptionKey: 'stressReliefDescription',
    category: 'stress',
    icon: 'Heart',
    durationDays: 7,
    isPremium: false,
    days: [
      {
        dayNumber: 1,
        titleKey: 'stressReliefDay1Title',
        descriptionKey: 'stressReliefDay1Desc',
        habitKey: 'mindfulness',
        tipKey: 'stressReliefDay1Tip',
      },
      {
        dayNumber: 2,
        titleKey: 'stressReliefDay2Title',
        descriptionKey: 'stressReliefDay2Desc',
        habitKey: 'mindfulness',
        tipKey: 'stressReliefDay2Tip',
      },
      {
        dayNumber: 3,
        titleKey: 'stressReliefDay3Title',
        descriptionKey: 'stressReliefDay3Desc',
        habitKey: 'movement',
        tipKey: 'stressReliefDay3Tip',
      },
      {
        dayNumber: 4,
        titleKey: 'stressReliefDay4Title',
        descriptionKey: 'stressReliefDay4Desc',
        habitKey: 'hydration',
        tipKey: 'stressReliefDay4Tip',
      },
      {
        dayNumber: 5,
        titleKey: 'stressReliefDay5Title',
        descriptionKey: 'stressReliefDay5Desc',
        habitKey: 'mindfulness',
        tipKey: 'stressReliefDay5Tip',
      },
      {
        dayNumber: 6,
        titleKey: 'stressReliefDay6Title',
        descriptionKey: 'stressReliefDay6Desc',
        habitKey: 'recovery',
        tipKey: 'stressReliefDay6Tip',
      },
      {
        dayNumber: 7,
        titleKey: 'stressReliefDay7Title',
        descriptionKey: 'stressReliefDay7Desc',
        habitKey: 'mindfulness',
        tipKey: 'stressReliefDay7Tip',
      },
    ],
  },

  // ── 3. Anti-Inflammation Week ───────────────────────────────────
  {
    id: 'prog_anti_inflammation',
    titleKey: 'antiInflammationTitle',
    descriptionKey: 'antiInflammationDescription',
    category: 'nutrition',
    icon: 'Leaf',
    durationDays: 7,
    isPremium: false,
    days: [
      {
        dayNumber: 1,
        titleKey: 'antiInflammationDay1Title',
        descriptionKey: 'antiInflammationDay1Desc',
        habitKey: 'nutrition',
        tipKey: 'antiInflammationDay1Tip',
      },
      {
        dayNumber: 2,
        titleKey: 'antiInflammationDay2Title',
        descriptionKey: 'antiInflammationDay2Desc',
        habitKey: 'hydration',
        tipKey: 'antiInflammationDay2Tip',
      },
      {
        dayNumber: 3,
        titleKey: 'antiInflammationDay3Title',
        descriptionKey: 'antiInflammationDay3Desc',
        habitKey: 'nutrition',
        tipKey: 'antiInflammationDay3Tip',
      },
      {
        dayNumber: 4,
        titleKey: 'antiInflammationDay4Title',
        descriptionKey: 'antiInflammationDay4Desc',
        habitKey: 'movement',
        tipKey: 'antiInflammationDay4Tip',
      },
      {
        dayNumber: 5,
        titleKey: 'antiInflammationDay5Title',
        descriptionKey: 'antiInflammationDay5Desc',
        habitKey: 'nutrition',
        tipKey: 'antiInflammationDay5Tip',
      },
      {
        dayNumber: 6,
        titleKey: 'antiInflammationDay6Title',
        descriptionKey: 'antiInflammationDay6Desc',
        habitKey: 'recovery',
        tipKey: 'antiInflammationDay6Tip',
      },
      {
        dayNumber: 7,
        titleKey: 'antiInflammationDay7Title',
        descriptionKey: 'antiInflammationDay7Desc',
        habitKey: 'nutrition',
        tipKey: 'antiInflammationDay7Tip',
      },
    ],
  },

  // ── 4. Cycle Sync Movement ──────────────────────────────────────
  {
    id: 'prog_cycle_sync_movement',
    titleKey: 'cycleSyncMovementTitle',
    descriptionKey: 'cycleSyncMovementDescription',
    category: 'movement',
    icon: 'Dumbbell',
    durationDays: 7,
    isPremium: false,
    days: [
      {
        dayNumber: 1,
        titleKey: 'cycleSyncMovementDay1Title',
        descriptionKey: 'cycleSyncMovementDay1Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay1Tip',
      },
      {
        dayNumber: 2,
        titleKey: 'cycleSyncMovementDay2Title',
        descriptionKey: 'cycleSyncMovementDay2Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay2Tip',
      },
      {
        dayNumber: 3,
        titleKey: 'cycleSyncMovementDay3Title',
        descriptionKey: 'cycleSyncMovementDay3Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay3Tip',
      },
      {
        dayNumber: 4,
        titleKey: 'cycleSyncMovementDay4Title',
        descriptionKey: 'cycleSyncMovementDay4Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay4Tip',
      },
      {
        dayNumber: 5,
        titleKey: 'cycleSyncMovementDay5Title',
        descriptionKey: 'cycleSyncMovementDay5Desc',
        habitKey: 'recovery',
        tipKey: 'cycleSyncMovementDay5Tip',
      },
      {
        dayNumber: 6,
        titleKey: 'cycleSyncMovementDay6Title',
        descriptionKey: 'cycleSyncMovementDay6Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay6Tip',
      },
      {
        dayNumber: 7,
        titleKey: 'cycleSyncMovementDay7Title',
        descriptionKey: 'cycleSyncMovementDay7Desc',
        habitKey: 'movement',
        tipKey: 'cycleSyncMovementDay7Tip',
      },
    ],
  },

  // ── 5. Glow Up Week (Premium) ───────────────────────────────────
  {
    id: 'prog_glow_up',
    titleKey: 'glowUpTitle',
    descriptionKey: 'glowUpDescription',
    category: 'skin',
    icon: 'Sparkles',
    durationDays: 7,
    isPremium: true,
    days: [
      {
        dayNumber: 1,
        titleKey: 'glowUpDay1Title',
        descriptionKey: 'glowUpDay1Desc',
        habitKey: 'skincare',
        tipKey: 'glowUpDay1Tip',
      },
      {
        dayNumber: 2,
        titleKey: 'glowUpDay2Title',
        descriptionKey: 'glowUpDay2Desc',
        habitKey: 'hydration',
        tipKey: 'glowUpDay2Tip',
      },
      {
        dayNumber: 3,
        titleKey: 'glowUpDay3Title',
        descriptionKey: 'glowUpDay3Desc',
        habitKey: 'skincare',
        tipKey: 'glowUpDay3Tip',
      },
      {
        dayNumber: 4,
        titleKey: 'glowUpDay4Title',
        descriptionKey: 'glowUpDay4Desc',
        habitKey: 'nutrition',
        tipKey: 'glowUpDay4Tip',
      },
      {
        dayNumber: 5,
        titleKey: 'glowUpDay5Title',
        descriptionKey: 'glowUpDay5Desc',
        habitKey: 'skincare',
        tipKey: 'glowUpDay5Tip',
      },
      {
        dayNumber: 6,
        titleKey: 'glowUpDay6Title',
        descriptionKey: 'glowUpDay6Desc',
        habitKey: 'recovery',
        tipKey: 'glowUpDay6Tip',
      },
      {
        dayNumber: 7,
        titleKey: 'glowUpDay7Title',
        descriptionKey: 'glowUpDay7Desc',
        habitKey: 'skincare',
        tipKey: 'glowUpDay7Tip',
      },
    ],
  },
];
