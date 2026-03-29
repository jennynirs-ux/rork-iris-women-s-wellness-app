import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'iris_custom_symptoms';

export interface CustomSymptom {
  id: string;
  name: string;
  icon: string;      // Lucide icon name
  category: string;
  createdAt: number;
}

/**
 * Load all custom symptoms from AsyncStorage.
 */
export async function getCustomSymptoms(): Promise<CustomSymptom[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CustomSymptom[];
  } catch {
    return [];
  }
}

/**
 * Add a new custom symptom and persist to AsyncStorage.
 */
export async function addCustomSymptom(
  name: string,
  icon: string,
  category: string
): Promise<CustomSymptom> {
  const existing = await getCustomSymptoms();

  // Prevent duplicates: if a symptom with the same name already exists, return it
  const duplicate = existing.find(
    (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (duplicate) {
    return duplicate;
  }

  const symptom: CustomSymptom = {
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: name.trim(),
    icon,
    category,
    createdAt: Date.now(),
  };

  const updated = [...existing, symptom];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return symptom;
}

/**
 * Remove a custom symptom by ID and persist.
 */
export async function removeCustomSymptom(id: string): Promise<void> {
  const existing = await getCustomSymptoms();
  const filtered = existing.filter((s) => s.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
