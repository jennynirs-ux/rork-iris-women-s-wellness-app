import React from 'react';
import Svg, { Circle, Line, Path, Ellipse } from 'react-native-svg';
import { ExerciseSketchType } from '@/lib/trainingPlans';

interface Props {
  type: ExerciseSketchType;
  color: string;
  size?: number;
}

/**
 * Simple SVG stick-figure sketches for exercise illustrations.
 * All figures drawn on a 60×60 viewBox.
 */
export default function ExerciseSketch({ type, color, size = 60 }: Props) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const headFill = { fill: color, fillOpacity: 0.15, stroke: color, strokeWidth: 2 };

  const figures: Record<ExerciseSketchType, React.ReactNode> = {
    // ── Squat ─────────────────────────────────────────────────────────────────
    squat: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        {/* Torso angled forward */}
        <Line x1="30" y1="13" x2="30" y2="28" {...strokeProps} />
        {/* Arms forward */}
        <Line x1="30" y1="18" x2="18" y2="24" {...strokeProps} />
        <Line x1="30" y1="18" x2="42" y2="24" {...strokeProps} />
        {/* Hip joint */}
        <Line x1="30" y1="28" x2="20" y2="42" {...strokeProps} />
        <Line x1="30" y1="28" x2="40" y2="42" {...strokeProps} />
        {/* Feet */}
        <Line x1="20" y1="42" x2="17" y2="52" {...strokeProps} />
        <Line x1="40" y1="42" x2="43" y2="52" {...strokeProps} />
        {/* Foot lines */}
        <Line x1="14" y1="52" x2="20" y2="52" {...strokeProps} />
        <Line x1="40" y1="52" x2="46" y2="52" {...strokeProps} />
      </>
    ),

    // ── Lunge ─────────────────────────────────────────────────────────────────
    lunge: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="28" {...strokeProps} />
        <Line x1="30" y1="18" x2="20" y2="24" {...strokeProps} />
        <Line x1="30" y1="18" x2="40" y2="24" {...strokeProps} />
        {/* Front leg bent */}
        <Line x1="30" y1="28" x2="22" y2="40" {...strokeProps} />
        <Line x1="22" y1="40" x2="22" y2="52" {...strokeProps} />
        {/* Back leg angled */}
        <Line x1="30" y1="28" x2="44" y2="40" {...strokeProps} />
        <Line x1="44" y1="40" x2="48" y2="50" {...strokeProps} />
        {/* Foot */}
        <Line x1="19" y1="52" x2="25" y2="52" {...strokeProps} />
      </>
    ),

    // ── Push-up ───────────────────────────────────────────────────────────────
    pushup: (
      <>
        <Circle cx="14" cy="24" r="5" {...headFill} />
        {/* Horizontal body */}
        <Line x1="14" y1="29" x2="46" y2="36" {...strokeProps} />
        {/* Arms down */}
        <Line x1="20" y1="30" x2="20" y2="44" {...strokeProps} />
        <Line x1="34" y1="33" x2="34" y2="44" {...strokeProps} />
        {/* Feet */}
        <Line x1="46" y1="36" x2="52" y2="40" {...strokeProps} />
        <Line x1="46" y1="36" x2="52" y2="44" {...strokeProps} />
        {/* Ground */}
        <Line x1="10" y1="48" x2="54" y2="48" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Plank ─────────────────────────────────────────────────────────────────
    plank: (
      <>
        <Circle cx="12" cy="26" r="5" {...headFill} />
        {/* Straight horizontal body */}
        <Line x1="12" y1="31" x2="50" y2="34" {...strokeProps} />
        {/* Arms straight down */}
        <Line x1="18" y1="32" x2="18" y2="44" {...strokeProps} />
        <Line x1="32" y1="33" x2="32" y2="44" {...strokeProps} />
        {/* Legs */}
        <Line x1="50" y1="34" x2="52" y2="44" {...strokeProps} />
        <Line x1="46" y1="34" x2="48" y2="44" {...strokeProps} />
        {/* Ground */}
        <Line x1="8" y1="46" x2="56" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Bridge ────────────────────────────────────────────────────────────────
    bridge: (
      <>
        <Circle cx="10" cy="28" r="5" {...headFill} />
        {/* Lying torso arched upward */}
        <Path d="M 10 33 Q 30 14 50 36" {...strokeProps} />
        {/* Arms down to ground */}
        <Line x1="18" y1="32" x2="14" y2="44" {...strokeProps} />
        <Line x1="26" y1="24" x2="24" y2="38" {...strokeProps} />
        {/* Legs bent, feet flat */}
        <Line x1="44" y1="32" x2="40" y2="44" {...strokeProps} />
        <Line x1="50" y1="36" x2="50" y2="46" {...strokeProps} />
        {/* Ground */}
        <Line x1="6" y1="46" x2="56" y2="46" {...strokeProps} strokeOpacity={0.3} />
        <Line x1="36" y1="46" x2="54" y2="46" {...strokeProps} />
      </>
    ),

    // ── Child's Pose ──────────────────────────────────────────────────────────
    childPose: (
      <>
        <Circle cx="12" cy="30" r="5" {...headFill} />
        {/* Torso down */}
        <Line x1="12" y1="35" x2="40" y2="38" {...strokeProps} />
        {/* Arms extended forward on ground */}
        <Line x1="12" y1="35" x2="8" y2="46" {...strokeProps} />
        <Line x1="40" y1="38" x2="52" y2="40" {...strokeProps} />
        <Line x1="52" y1="40" x2="56" y2="46" {...strokeProps} />
        {/* Knees folded back */}
        <Line x1="40" y1="38" x2="42" y2="50" {...strokeProps} />
        <Line x1="44" y1="38" x2="46" y2="50" {...strokeProps} />
        {/* Ground */}
        <Line x1="4" y1="48" x2="58" y2="48" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Cat-Cow ────────────────────────────────────────────────────────────────
    catCow: (
      <>
        <Circle cx="12" cy="26" r="5" {...headFill} />
        {/* Spine arching up (cat) */}
        <Path d="M 12 31 Q 32 18 52 31" {...strokeProps} />
        {/* Front legs */}
        <Line x1="18" y1="30" x2="16" y2="44" {...strokeProps} />
        <Line x1="24" y1="26" x2="22" y2="44" {...strokeProps} />
        {/* Back legs */}
        <Line x1="46" y1="26" x2="44" y2="44" {...strokeProps} />
        <Line x1="52" y1="31" x2="50" y2="44" {...strokeProps} />
        {/* Ground */}
        <Line x1="8" y1="46" x2="56" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Leg Raise ─────────────────────────────────────────────────────────────
    legRaise: (
      <>
        <Circle cx="10" cy="24" r="5" {...headFill} />
        {/* Body lying flat */}
        <Line x1="10" y1="29" x2="48" y2="36" {...strokeProps} />
        {/* Arms at sides */}
        <Line x1="20" y1="31" x2="16" y2="44" {...strokeProps} />
        <Line x1="30" y1="33" x2="26" y2="44" {...strokeProps} />
        {/* One leg raised 45° */}
        <Line x1="44" y1="35" x2="38" y2="22" {...strokeProps} />
        {/* Other leg flat */}
        <Line x1="48" y1="36" x2="54" y2="40" {...strokeProps} />
        {/* Ground */}
        <Line x1="6" y1="46" x2="56" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Crunches ──────────────────────────────────────────────────────────────
    crunches: (
      <>
        <Circle cx="14" cy="22" r="5" {...headFill} />
        {/* Torso curled up */}
        <Path d="M 14 27 Q 20 32 28 34" {...strokeProps} />
        {/* Arms behind head */}
        <Line x1="14" y1="22" x2="8" y2="18" {...strokeProps} />
        <Line x1="14" y1="22" x2="20" y2="18" {...strokeProps} />
        {/* Hips and bent legs */}
        <Line x1="28" y1="34" x2="36" y2="44" {...strokeProps} />
        <Line x1="28" y1="34" x2="42" y2="40" {...strokeProps} />
        <Line x1="42" y1="40" x2="44" y2="50" {...strokeProps} />
        {/* Ground */}
        <Line x1="20" y1="50" x2="56" y2="50" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Side Leg Lift ─────────────────────────────────────────────────────────
    sideLeg: (
      <>
        <Circle cx="10" cy="26" r="5" {...headFill} />
        {/* Body lying on side */}
        <Line x1="10" y1="31" x2="46" y2="42" {...strokeProps} />
        {/* Bottom arm propped */}
        <Line x1="10" y1="31" x2="6" y2="40" {...strokeProps} />
        {/* Top arm along body */}
        <Line x1="24" y1="35" x2="28" y2="30" {...strokeProps} />
        {/* Top leg raised */}
        <Line x1="44" y1="42" x2="44" y2="28" {...strokeProps} />
        {/* Bottom leg */}
        <Line x1="46" y1="42" x2="52" y2="46" {...strokeProps} />
        {/* Ground */}
        <Line x1="4" y1="48" x2="56" y2="48" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Clamshell ─────────────────────────────────────────────────────────────
    clamshell: (
      <>
        <Circle cx="10" cy="26" r="5" {...headFill} />
        <Line x1="10" y1="31" x2="42" y2="40" {...strokeProps} />
        <Line x1="10" y1="31" x2="6" y2="42" {...strokeProps} />
        {/* Both knees bent, top knee opening up */}
        <Line x1="38" y1="40" x2="42" y2="50" {...strokeProps} />
        <Line x1="42" y1="40" x2="34" y2="28" {...strokeProps} />
        <Line x1="34" y1="28" x2="44" y2="24" {...strokeProps} />
        {/* Ground */}
        <Line x1="4" y1="52" x2="56" y2="52" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Warrior Pose ──────────────────────────────────────────────────────────
    warriorPose: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="28" {...strokeProps} />
        {/* Arms wide */}
        <Line x1="30" y1="20" x2="10" y2="22" {...strokeProps} />
        <Line x1="30" y1="20" x2="50" y2="22" {...strokeProps} />
        {/* Wide stance legs */}
        <Line x1="30" y1="28" x2="16" y2="44" {...strokeProps} />
        <Line x1="16" y1="44" x2="12" y2="52" {...strokeProps} />
        <Line x1="30" y1="28" x2="44" y2="42" {...strokeProps} />
        <Line x1="44" y1="42" x2="46" y2="52" {...strokeProps} />
        <Line x1="8" y1="52" x2="16" y2="52" {...strokeProps} />
        <Line x1="42" y1="52" x2="50" y2="52" {...strokeProps} />
      </>
    ),

    // ── Downward Dog ──────────────────────────────────────────────────────────
    downwardDog: (
      <>
        <Circle cx="48" cy="18" r="5" {...headFill} />
        {/* Inverted V shape */}
        <Line x1="48" y1="23" x2="30" y2="18" {...strokeProps} />
        <Line x1="30" y1="18" x2="14" y2="30" {...strokeProps} />
        {/* Arms */}
        <Line x1="14" y1="30" x2="10" y2="42" {...strokeProps} />
        <Line x1="20" y1="28" x2="16" y2="42" {...strokeProps} />
        {/* Legs */}
        <Line x1="30" y1="18" x2="36" y2="34" {...strokeProps} />
        <Line x1="36" y1="34" x2="36" y2="46" {...strokeProps} />
        <Line x1="30" y1="18" x2="42" y2="32" {...strokeProps} />
        <Line x1="42" y1="32" x2="42" y2="46" {...strokeProps} />
        <Line x1="8" y1="44" x2="24" y2="44" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Hip Circle ────────────────────────────────────────────────────────────
    hipCircle: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="26" {...strokeProps} />
        {/* Hip rotation indicated with arc */}
        <Path d="M 22 24 Q 30 30 38 24" {...strokeProps} />
        <Path d="M 22 28 Q 30 22 38 28" {...strokeProps} strokeOpacity={0.5} />
        <Line x1="30" y1="26" x2="22" y2="40" {...strokeProps} />
        <Line x1="30" y1="26" x2="38" y2="40" {...strokeProps} />
        <Line x1="22" y1="40" x2="20" y2="52" {...strokeProps} />
        <Line x1="38" y1="40" x2="40" y2="52" {...strokeProps} />
        <Line x1="16" y1="52" x2="24" y2="52" {...strokeProps} />
        <Line x1="36" y1="52" x2="44" y2="52" {...strokeProps} />
      </>
    ),

    // ── Jumping Jack ──────────────────────────────────────────────────────────
    jumpingJack: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="30" {...strokeProps} />
        {/* Arms up diagonally */}
        <Line x1="30" y1="20" x2="12" y2="12" {...strokeProps} />
        <Line x1="30" y1="20" x2="48" y2="12" {...strokeProps} />
        {/* Legs spread */}
        <Line x1="30" y1="30" x2="14" y2="46" {...strokeProps} />
        <Line x1="30" y1="30" x2="46" y2="46" {...strokeProps} />
        <Line x1="10" y1="46" x2="18" y2="46" {...strokeProps} />
        <Line x1="42" y1="46" x2="50" y2="46" {...strokeProps} />
      </>
    ),

    // ── Burpee ────────────────────────────────────────────────────────────────
    burpee: (
      <>
        {/* Head up (jump phase) */}
        <Circle cx="30" cy="6" r="5" {...headFill} />
        <Line x1="30" y1="11" x2="30" y2="24" {...strokeProps} />
        {/* Arms up celebrating */}
        <Line x1="30" y1="16" x2="16" y2="10" {...strokeProps} />
        <Line x1="30" y1="16" x2="44" y2="10" {...strokeProps} />
        {/* Legs jumping */}
        <Line x1="30" y1="24" x2="22" y2="38" {...strokeProps} />
        <Line x1="30" y1="24" x2="38" y2="38" {...strokeProps} />
        <Line x1="22" y1="38" x2="18" y2="50" {...strokeProps} />
        <Line x1="38" y1="38" x2="42" y2="50" {...strokeProps} />
        {/* Arrow indicating jump */}
        <Line x1="30" y1="50" x2="30" y2="56" {...strokeProps} strokeOpacity={0.4} />
      </>
    ),

    // ── Mountain Climber ──────────────────────────────────────────────────────
    mountainClimber: (
      <>
        <Circle cx="12" cy="22" r="5" {...headFill} />
        <Line x1="12" y1="27" x2="46" y2="32" {...strokeProps} />
        {/* Arms straight */}
        <Line x1="18" y1="28" x2="18" y2="42" {...strokeProps} />
        <Line x1="30" y1="30" x2="30" y2="42" {...strokeProps} />
        {/* One knee driven forward */}
        <Line x1="46" y1="32" x2="38" y2="22" {...strokeProps} />
        <Line x1="38" y1="22" x2="34" y2="36" {...strokeProps} />
        {/* Back leg extended */}
        <Line x1="46" y1="32" x2="52" y2="44" {...strokeProps} />
        <Line x1="8" y1="44" x2="58" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── High Knees ────────────────────────────────────────────────────────────
    highKnees: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="28" {...strokeProps} />
        {/* Arms pumping */}
        <Line x1="30" y1="18" x2="16" y2="24" {...strokeProps} />
        <Line x1="30" y1="18" x2="44" y2="14" {...strokeProps} />
        {/* One knee high */}
        <Line x1="30" y1="28" x2="22" y2="38" {...strokeProps} />
        <Line x1="22" y1="38" x2="24" y2="22" {...strokeProps} />
        {/* Other leg pushing off */}
        <Line x1="30" y1="28" x2="40" y2="42" {...strokeProps} />
        <Line x1="40" y1="42" x2="38" y2="52" {...strokeProps} />
        <Line x1="35" y1="52" x2="42" y2="52" {...strokeProps} />
      </>
    ),

    // ── Walk ──────────────────────────────────────────────────────────────────
    walk: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="28" {...strokeProps} />
        {/* Arms in walking position */}
        <Line x1="30" y1="18" x2="18" y2="26" {...strokeProps} />
        <Line x1="30" y1="18" x2="42" y2="22" {...strokeProps} />
        {/* Legs in stride */}
        <Line x1="30" y1="28" x2="20" y2="44" {...strokeProps} />
        <Line x1="20" y1="44" x2="18" y2="52" {...strokeProps} />
        <Line x1="30" y1="28" x2="40" y2="40" {...strokeProps} />
        <Line x1="40" y1="40" x2="44" y2="50" {...strokeProps} />
        <Line x1="14" y1="52" x2="22" y2="52" {...strokeProps} />
        <Line x1="40" y1="50" x2="48" y2="50" {...strokeProps} />
      </>
    ),

    // ── Stretch (seated forward fold) ─────────────────────────────────────────
    stretch: (
      <>
        <Circle cx="14" cy="22" r="5" {...headFill} />
        {/* Torso bending forward */}
        <Line x1="14" y1="27" x2="40" y2="36" {...strokeProps} />
        {/* Arms reaching */}
        <Line x1="26" y1="32" x2="52" y2="40" {...strokeProps} />
        <Line x1="30" y1="30" x2="52" y2="36" {...strokeProps} />
        {/* Legs flat (seated) */}
        <Line x1="40" y1="36" x2="52" y2="40" {...strokeProps} />
        <Line x1="40" y1="40" x2="52" y2="44" {...strokeProps} />
        {/* Ground */}
        <Line x1="8" y1="46" x2="56" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Breathe (seated upright) ──────────────────────────────────────────────
    breathe: (
      <>
        <Circle cx="30" cy="8" r="5" {...headFill} />
        <Line x1="30" y1="13" x2="30" y2="30" {...strokeProps} />
        {/* Arms relaxed at sides / open */}
        <Line x1="30" y1="22" x2="16" y2="30" {...strokeProps} />
        <Line x1="30" y1="22" x2="44" y2="30" {...strokeProps} />
        {/* Crossed legs */}
        <Path d="M 30 30 Q 20 40 14 42" {...strokeProps} />
        <Path d="M 30 30 Q 40 40 46 42" {...strokeProps} />
        <Line x1="14" y1="42" x2="46" y2="42" {...strokeProps} />
        {/* Breath lines */}
        <Line x1="26" y1="16" x2="26" y2="10" {...strokeProps} strokeOpacity={0.4} />
        <Line x1="34" y1="16" x2="34" y2="10" {...strokeProps} strokeOpacity={0.4} />
      </>
    ),

    // ── Rest (lying flat) ─────────────────────────────────────────────────────
    rest: (
      <>
        <Circle cx="10" cy="28" r="5" {...headFill} />
        {/* Body flat */}
        <Line x1="10" y1="33" x2="50" y2="38" {...strokeProps} />
        {/* Arms relaxed */}
        <Line x1="22" y1="34" x2="20" y2="44" {...strokeProps} />
        <Line x1="34" y1="36" x2="32" y2="44" {...strokeProps} />
        {/* Legs flat */}
        <Line x1="48" y1="38" x2="52" y2="46" {...strokeProps} />
        <Line x1="50" y1="38" x2="54" y2="44" {...strokeProps} />
        {/* Z z z (sleep/rest) */}
        <Line x1="44" y1="20" x2="50" y2="20" {...strokeProps} strokeOpacity={0.5} />
        <Line x1="50" y1="20" x2="44" y2="26" {...strokeProps} strokeOpacity={0.5} />
        <Line x1="44" y1="26" x2="50" y2="26" {...strokeProps} strokeOpacity={0.5} />
        {/* Ground */}
        <Line x1="4" y1="46" x2="58" y2="46" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),

    // ── Deadlift ──────────────────────────────────────────────────────────────
    deadlift: (
      <>
        <Circle cx="30" cy="10" r="5" {...headFill} />
        {/* Hinged torso */}
        <Line x1="30" y1="15" x2="24" y2="30" {...strokeProps} />
        {/* Arms hanging down */}
        <Line x1="26" y1="22" x2="22" y2="38" {...strokeProps} />
        <Line x1="28" y1="22" x2="30" y2="38" {...strokeProps} />
        {/* Bar */}
        <Line x1="14" y1="40" x2="46" y2="40" {...strokeProps} />
        <Ellipse cx="14" cy="40" rx="4" ry="6" {...headFill} />
        <Ellipse cx="46" cy="40" rx="4" ry="6" {...headFill} />
        {/* Legs */}
        <Line x1="24" y1="30" x2="18" y2="48" {...strokeProps} />
        <Line x1="24" y1="30" x2="30" y2="46" {...strokeProps} />
        <Line x1="14" y1="48" x2="22" y2="48" {...strokeProps} />
        <Line x1="26" y1="46" x2="34" y2="46" {...strokeProps} />
      </>
    ),

    // ── Hip Thrust ────────────────────────────────────────────────────────────
    hipThrust: (
      <>
        <Circle cx="50" cy="22" r="5" {...headFill} />
        {/* Back against bench */}
        <Line x1="46" y1="24" x2="46" y2="44" {...strokeProps} />
        {/* Torso horizontal, hips up */}
        <Line x1="46" y1="34" x2="24" y2="32" {...strokeProps} />
        {/* Legs bent, feet flat */}
        <Line x1="24" y1="32" x2="16" y2="46" {...strokeProps} />
        <Line x1="24" y1="32" x2="22" y2="46" {...strokeProps} />
        <Line x1="12" y1="46" x2="26" y2="46" {...strokeProps} />
        {/* Ground + bench */}
        <Line x1="42" y1="44" x2="56" y2="44" {...strokeProps} />
        <Line x1="4" y1="48" x2="56" y2="48" {...strokeProps} strokeOpacity={0.3} />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {figures[type] ?? figures.rest}
    </Svg>
  );
}
