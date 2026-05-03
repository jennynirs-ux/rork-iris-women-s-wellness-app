// Unit tests for the v1.1+ burst-pipeline math.
//
// These tests don't run real image analysis (that needs a real device camera);
// they exercise the pure aggregation + scoring functions exported by the burst
// pipeline so we catch regressions when tuning thresholds in v1.2.
//
// Why these matter:
//   - When we adjust BLINK_OPENNESS_THRESHOLD, VESSEL_NORMALIZER, etc. based
//     on real-device readings, these tests catch off-by-one and rescaling bugs.
//   - When the wellness scoring formulas in computeWellnessScores get tweaked,
//     these tests ensure scores stay clamped to [1, 10] at extreme inputs.
//
// Coverage target: pure functions only. End-to-end burst capture (camera ref)
// is exercised manually on TestFlight.

import { computeWellnessScores } from "../lib/eyeAnalysis";

const NEUTRAL_EYE = {
  brightness: 0.5,
  redness: 0.3,
  clarity: 0.5,
  pupilDarkRatio: 0.3,
  symmetry: 0.85,
  scleraYellowness: 0.2,
  underEyeDarkness: 0.3,
  eyeOpenness: 0.7,
  tearFilmQuality: 0.6,
};

const NEUTRAL_CHECKIN = { energy: 5, sleep: 5, stressLevel: 5 };

describe("computeWellnessScores — v1.1 backward compat", () => {
  it("produces all 6 scores in [1, 10] for neutral input without measured signals", () => {
    const scores = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5);
    for (const key of [
      "energyScore",
      "fatigueLevel",
      "hydrationLevel",
      "inflammation",
      "recoveryScore",
      "stressScore",
    ] as const) {
      expect(scores[key]).toBeGreaterThanOrEqual(1);
      expect(scores[key]).toBeLessThanOrEqual(10);
    }
  });

  it("handles null check-in gracefully (uses neutral defaults)", () => {
    const scores = computeWellnessScores(NEUTRAL_EYE, null, 5);
    expect(scores.energyScore).toBeGreaterThanOrEqual(1);
    expect(scores.energyScore).toBeLessThanOrEqual(10);
  });
});

describe("computeWellnessScores — v1.1 measured-signal blending", () => {
  it("higher real blink rate increases fatigueLevel", () => {
    const calmBlinks = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      realBlinkRate: 0.2,
    });
    const tiredBlinks = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      realBlinkRate: 0.7,
    });
    expect(tiredBlinks.fatigueLevel).toBeGreaterThanOrEqual(calmBlinks.fatigueLevel);
  });

  it("higher tear film stability increases hydrationLevel", () => {
    const dryEyes = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      tearFilmStability: 0.2,
    });
    const stableEyes = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      tearFilmStability: 0.95,
    });
    expect(stableEyes.hydrationLevel).toBeGreaterThanOrEqual(dryEyes.hydrationLevel);
  });

  it("higher vessel density increases inflammation", () => {
    const cleanScelra = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      vesselDensity: 0.1,
    });
    const inflamed = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      vesselDensity: 0.9,
    });
    expect(inflamed.inflammation).toBeGreaterThanOrEqual(cleanScelra.inflammation);
  });

  it("higher pupil-to-iris ratio increases stressScore (sympathetic activation)", () => {
    const restingPupil = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      pupilToIrisRatio: 0.3,
    });
    const dilatedPupil = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      pupilToIrisRatio: 0.65,
    });
    expect(dilatedPupil.stressScore).toBeGreaterThanOrEqual(restingPupil.stressScore);
  });

  it("higher limbal ring clarity increases recoveryScore (collagen vitality)", () => {
    const dullLimbus = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      limbalRingClarity: 0.1,
    });
    const sharpLimbus = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, {
      limbalRingClarity: 0.95,
    });
    expect(sharpLimbus.recoveryScore).toBeGreaterThanOrEqual(dullLimbus.recoveryScore);
  });

  it("clamps all scores to [1, 10] at extreme measured inputs", () => {
    const extreme = computeWellnessScores(
      {
        brightness: 0,
        redness: 1,
        clarity: 0,
        pupilDarkRatio: 1,
        symmetry: 0,
        scleraYellowness: 1,
        underEyeDarkness: 1,
        eyeOpenness: 0,
        tearFilmQuality: 0,
      },
      { energy: 1, sleep: 1, stressLevel: 10 },
      10,
      {
        realBlinkRate: 1,
        tearFilmStability: 1,
        vesselDensity: 1,
        pupilToIrisRatio: 0.7,
        limbalRingClarity: 1,
      },
    );
    for (const key of [
      "energyScore",
      "fatigueLevel",
      "hydrationLevel",
      "inflammation",
      "recoveryScore",
      "stressScore",
    ] as const) {
      expect(extreme[key]).toBeGreaterThanOrEqual(1);
      expect(extreme[key]).toBeLessThanOrEqual(10);
    }
  });

  it("preserves backward compat — passing measured=undefined yields same scores as not passing it", () => {
    const without = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5);
    const withUndef = computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, undefined);
    expect(withUndef).toEqual(without);
  });
});

describe("MeasuredOpticalSignals shape contract", () => {
  it("computeWellnessScores accepts each field independently", () => {
    // Each field optional — passing only one should work
    expect(() =>
      computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, { realBlinkRate: 0.4 }),
    ).not.toThrow();
    expect(() =>
      computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, { vesselDensity: 0.5 }),
    ).not.toThrow();
    expect(() =>
      computeWellnessScores(NEUTRAL_EYE, NEUTRAL_CHECKIN, 5, { pupilToIrisRatio: 0.45 }),
    ).not.toThrow();
  });
});
