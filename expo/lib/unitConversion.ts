export type UnitSystem = 'metric' | 'imperial';

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462 * 10) / 10;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches: inches === 12 ? 0 : inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54 * 10) / 10;
}

export function cmToTotalInches(cm: number): number {
  return Math.round(cm / 2.54 * 10) / 10;
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

export function formatWeight(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${kgToLbs(kg)} lbs`;
  }
  return `${kg} kg`;
}

export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
  }
  return `${cm} cm`;
}

export function displayWeightValue(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return String(kgToLbs(kg));
  }
  return String(kg);
}

export function displayHeightValue(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
  }
  return String(cm);
}

export function parseWeightInput(value: string, units: UnitSystem): number {
  const num = parseFloat(value) || 0;
  if (units === 'imperial') {
    return Math.round(lbsToKg(num));
  }
  return Math.round(num);
}

export function parseHeightInput(value: string, units: UnitSystem): number {
  if (units === 'imperial') {
    const match = value.match(/^(\d+)'?\s*(\d*)"?$/);
    if (match) {
      const feet = parseInt(match[1], 10) || 0;
      const inches = parseInt(match[2], 10) || 0;
      return Math.round(feetInchesToCm(feet, inches));
    }
    const num = parseFloat(value) || 0;
    return Math.round(inchesToCm(num));
  }
  return Math.round(parseFloat(value) || 0);
}

export function weightInputValue(kg: number, units: UnitSystem): string {
  if (kg === 0) return '';
  if (units === 'imperial') {
    return String(kgToLbs(kg));
  }
  return String(kg);
}

export function heightInputValue(cm: number, units: UnitSystem): string {
  if (cm === 0) return '';
  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
  }
  return String(cm);
}
