const SYMPTOM_TRANSLATION_MAP: Record<string, string> = {
  "Cramps": "cramps",
  "Headache": "headache",
  "Bloating": "bloating",
  "Fatigue": "fatigue",
  "Breast Tenderness": "breastTenderness",
  "Mood Swings": "moodSwings",
  "Back Pain": "backPain",
  "Acne": "acne",
  "Insomnia": "insomnia",
  "Hot Flashes": "hotFlashes",
  "Night Sweats": "nightSweats",
  "Brain Fog": "brainFog",
  "Nausea": "nausea",
  "Morning Sickness": "morningSickness",
  "Food Aversions": "foodAversions",
  "Frequent Urination": "frequentUrination",
  "Tender Breasts": "tenderBreasts",
  "Heartburn": "heartburn",
  "Swelling": "swelling",
  "Constipation": "constipation",
  "Breast Engorgement": "breastEngorgement",
  "Postpartum Bleeding": "postpartumBleeding",
  "Perineal Pain": "perinealPain",
  "Mood Changes": "moodChanges",
  "Cramping": "cramping",
  "Irregular Periods": "irregularPeriods",
  "Sleep Issues": "sleepIssues",
  "Joint Pain": "jointPain",
  "Vaginal Dryness": "vaginalDryness",
  "Weight Gain": "weightGain",
  "Memory Issues": "memoryIssues",
  "Dry Skin": "drySkin",
  "Hair Thinning": "hairThinning",
  "Breakthrough Bleeding": "breakthroughBleeding",
  "Headaches": "headaches",
  "Spotting": "spotting",
  "Weight Changes": "weightChanges",
  "Irregular Bleeding": "irregularBleeding",
  "Missed Periods": "missedPeriods",
  "Prolonged Bleeding": "prolongedBleeding",
};

export function translateSymptom(symptom: string, symptoms: Record<string, string>): string {
  const key = SYMPTOM_TRANSLATION_MAP[symptom];
  if (key && key in symptoms) {
    return symptoms[key as keyof typeof symptoms];
  }
  return symptom;
}

export function translateSymptoms(symptomList: string[], symptoms: Record<string, string>): string {
  return symptomList.map(s => translateSymptom(s, symptoms)).join(', ');
}
