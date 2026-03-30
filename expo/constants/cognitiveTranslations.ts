/**
 * Cognitive Wellness translations — English only.
 * Follows the same pattern as other translation files in the project.
 */

export const cognitiveTranslations = {
  // Screen
  screenTitle: "Brain Wellness",
  subtitle: "Track and support your cognitive health",

  // Overall score
  overallScore: "Overall Score",
  scoreSharp: "Sharp",
  scoreGood: "Good",
  scoreFair: "Fair",
  scoreNeedsAttention: "Needs Attention",

  // Factors
  factorsTitle: "Cognitive Factors",
  memory: "Memory",
  focus: "Focus",
  moodStability: "Mood Stability",
  sleepQuality: "Sleep Quality",

  // Trends
  trendImproving: "Improving",
  trendStable: "Stable",
  trendDeclining: "Declining",

  // Exercises section
  exercisesTitle: "Brain Exercises",
  todaysExercise: "Today's Recommended Exercise",
  allExercises: "All Exercises",
  minutes: "min",

  // Exercise titles
  "exercise.wordAssociation.title": "Word Association",
  "exercise.wordAssociation.description":
    "Think of 10 words starting with a random letter. Challenge yourself to avoid common words.",
  "exercise.numberSequence.title": "Number Sequence",
  "exercise.numberSequence.description":
    "Count backwards from 100 by 7s. This classic exercise engages working memory and concentration.",
  "exercise.gratitudeJournaling.title": "Gratitude Journaling",
  "exercise.gratitudeJournaling.description":
    "Write 3 things you are grateful for today. Reflect on the details and emotions around each one.",
  "exercise.nameRecall.title": "Name Recall",
  "exercise.nameRecall.description":
    "Recall 5 people you spoke to today and one detail about each conversation.",
  "exercise.deepReading.title": "Deep Reading",
  "exercise.deepReading.description":
    "Read a page of a book and summarize it in 3 sentences without looking back.",
  "exercise.creativeVisualization.title": "Creative Visualization",
  "exercise.creativeVisualization.description":
    "Close your eyes and imagine your ideal day in vivid detail, engaging all five senses.",

  // Exercise categories
  categoryMemory: "Memory",
  categoryFocus: "Focus",
  categoryCreativity: "Creativity",
  categoryVerbal: "Verbal",

  // Recommendations
  recommendationsTitle: "Recommendations",

  // Trend chart
  trendChartTitle: "Cognitive Score Trend",
  noTrendData: "Keep tracking to see your trend",

  // Phase tips
  phaseTipsTitle: "Brain Tips for Your Phase",

  // Gating / empty states
  notAvailable: "Cognitive wellness tracking is available for perimenopause and menopause users, or those over 40.",
  insufficientData: "Keep scanning and checking in. You need at least 7 days of data to see your cognitive wellness score.",

  // Score descriptions
  sharpDescription: "Your cognitive indicators are strong. Keep up your healthy routines.",
  goodDescription: "Your brain health looks solid with room for small improvements.",
  fairDescription: "Some factors may benefit from attention. Try the recommended exercises.",
  needsAttentionDescription: "Consider prioritizing sleep, stress management, and brain exercises.",
} as const;

export type CognitiveTranslationKey = keyof typeof cognitiveTranslations;
