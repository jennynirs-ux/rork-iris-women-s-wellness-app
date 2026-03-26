import * as Print from 'expo-print';
import { UserProfile, DailyCheckIn, ScanResult, CyclePhase } from '@/types';

interface PatternAnalysis {
  description: string;
  frequency: string;
}

function getPhaseDisplayName(phase: CyclePhase): string {
  const phaseNames: Record<CyclePhase, string> = {
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal"
  };
  return phaseNames[phase] || phase;
}

function calculateWellnessAverages(scans: ScanResult[]): {
  energy: { avg: number; min: number; max: number };
  stress: { avg: number; min: number; max: number };
  recovery: { avg: number; min: number; max: number };
  hydration: { avg: number; min: number; max: number };
  fatigue: { avg: number; min: number; max: number };
  inflammation: { avg: number; min: number; max: number };
} {
  if (scans.length === 0) {
    return {
      energy: { avg: 0, min: 0, max: 0 },
      stress: { avg: 0, min: 0, max: 0 },
      recovery: { avg: 0, min: 0, max: 0 },
      hydration: { avg: 0, min: 0, max: 0 },
      fatigue: { avg: 0, min: 0, max: 0 },
      inflammation: { avg: 0, min: 0, max: 0 },
    };
  }

  const energyValues = scans.map(s => s.energyScore);
  const stressValues = scans.map(s => s.stressScore);
  const recoveryValues = scans.map(s => s.recoveryScore);
  const hydrationValues = scans.map(s => s.hydrationLevel);
  const fatigueValues = scans.map(s => s.fatigueLevel);
  const inflammationValues = scans.map(s => s.inflammation);

  return {
    energy: {
      avg: Math.round(energyValues.reduce((a, b) => a + b) / energyValues.length),
      min: Math.min(...energyValues),
      max: Math.max(...energyValues),
    },
    stress: {
      avg: Math.round(stressValues.reduce((a, b) => a + b) / stressValues.length),
      min: Math.min(...stressValues),
      max: Math.max(...stressValues),
    },
    recovery: {
      avg: Math.round(recoveryValues.reduce((a, b) => a + b) / recoveryValues.length),
      min: Math.min(...recoveryValues),
      max: Math.max(...recoveryValues),
    },
    hydration: {
      avg: Math.round(hydrationValues.reduce((a, b) => a + b) / hydrationValues.length),
      min: Math.min(...hydrationValues),
      max: Math.max(...hydrationValues),
    },
    fatigue: {
      avg: Math.round(fatigueValues.reduce((a, b) => a + b) / fatigueValues.length),
      min: Math.min(...fatigueValues),
      max: Math.max(...fatigueValues),
    },
    inflammation: {
      avg: Math.round(inflammationValues.reduce((a, b) => a + b) / inflammationValues.length),
      min: Math.min(...inflammationValues),
      max: Math.max(...inflammationValues),
    },
  };
}

function getSymptomFrequency(checkIns: DailyCheckIn[]): Array<{ symptom: string; count: number; percentage: number }> {
  const symptomMap: Record<string, number> = {};
  let totalDays = checkIns.length;

  checkIns.forEach(checkIn => {
    checkIn.symptoms.forEach(symptom => {
      symptomMap[symptom] = (symptomMap[symptom] || 0) + 1;
    });
  });

  return Object.entries(symptomMap)
    .map(([symptom, count]) => ({
      symptom,
      count,
      percentage: totalDays > 0 ? Math.round((count / totalDays) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateCheckInAverages(checkIns: DailyCheckIn[]): {
  mood: number;
  energy: number;
  sleep: number;
} {
  if (checkIns.length === 0) {
    return { mood: 0, energy: 0, sleep: 0 };
  }

  const moodValues = checkIns.map(ci => ci.mood ?? 0);
  const energyValues = checkIns.map(ci => ci.energy ?? 0);
  const sleepValues = checkIns.map(ci => ci.sleep ?? 0);

  return {
    mood: Math.round(moodValues.reduce((a, b) => a + b, 0) / (moodValues.length || 1)),
    energy: Math.round(energyValues.reduce((a, b) => a + b, 0) / (energyValues.length || 1)),
    sleep: Math.round(sleepValues.reduce((a, b) => a + b, 0) / (sleepValues.length || 1)),
  };
}

function detectPatterns(scans: ScanResult[], checkIns: DailyCheckIn[], phase: CyclePhase): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const wellnessAverages = calculateWellnessAverages(scans);
  const checkInAverages = calculateCheckInAverages(checkIns);

  // Detect elevated stress patterns
  if (wellnessAverages.stress.avg > 6) {
    patterns.push({
      description: `Elevated stress levels detected (avg: ${wellnessAverages.stress.avg}/10), particularly during ${getPhaseDisplayName(phase)} phase`,
      frequency: "Ongoing",
    });
  }

  // Detect low energy patterns
  if (wellnessAverages.energy.avg < 4) {
    patterns.push({
      description: `Low energy levels during measurement period (avg: ${wellnessAverages.energy.avg}/10)`,
      frequency: "Consistent",
    });
  }

  // Detect hydration issues
  if (wellnessAverages.hydration.avg < 4) {
    patterns.push({
      description: "Consistently low hydration levels - recommend increased water intake",
      frequency: "Persistent",
    });
  }

  // Detect inflammation issues
  if (wellnessAverages.inflammation.avg > 6) {
    patterns.push({
      description: `Elevated inflammation markers (avg: ${wellnessAverages.inflammation.avg}/10)`,
      frequency: "Notable",
    });
  }

  // Detect sleep quality issues
  if (checkInAverages.sleep < 5) {
    patterns.push({
      description: `Sleep quality concerns (avg: ${checkInAverages.sleep}/10) - consider sleep hygiene evaluation`,
      frequency: "Regular",
    });
  }

  // Detect mood volatility
  const sleepValues = checkIns.map(ci => ci.sleep);
  if (sleepValues.length > 2) {
    const variance = sleepValues.reduce((sum, val) => sum + Math.pow(val - checkInAverages.sleep, 2), 0) / sleepValues.length;
    if (Math.sqrt(variance) > 3) {
      patterns.push({
        description: "Variable mood and energy levels detected - may benefit from stress management techniques",
        frequency: "Intermittent",
      });
    }
  }

  return patterns;
}

function buildHTML(
  userProfile: UserProfile,
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase
): string {
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Calculate date range (last 30 days)
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDateStr = thirtyDaysAgo.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const endDateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const wellnessAverages = calculateWellnessAverages(scans);
  const symptomFrequency = getSymptomFrequency(checkIns);
  const checkInAverages = calculateCheckInAverages(checkIns);
  const patterns = detectPatterns(scans, checkIns, phase);

  const lastPeriodDate = userProfile.lastPeriodDate
    ? new Date(userProfile.lastPeriodDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Not recorded';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
      line-height: 1.5;
      background: white;
      padding: 40px;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #000;
      margin-bottom: 5px;
    }
    .patient-info {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: #666;
    }
    .date-range {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #000;
      margin-bottom: 12px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11px;
    }
    th {
      background-color: #f5f5f5;
      border: 1px solid #999;
      padding: 8px;
      text-align: left;
      font-weight: bold;
      color: #000;
    }
    td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      font-size: 12px;
    }
    .metric-label {
      font-weight: bold;
      color: #333;
    }
    .metric-value {
      color: #666;
    }
    .pattern-item {
      margin-bottom: 12px;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 3px solid #999;
      font-size: 12px;
    }
    .pattern-description {
      color: #333;
      margin-bottom: 3px;
    }
    .pattern-frequency {
      color: #888;
      font-size: 11px;
      font-style: italic;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
      font-size: 10px;
      color: #888;
      text-align: center;
    }
    .cycle-info {
      display: flex;
      justify-content: space-around;
      margin-bottom: 15px;
      font-size: 11px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }
    .cycle-item {
      flex: 1;
    }
    .cycle-label {
      color: #888;
      font-size: 10px;
      margin-bottom: 3px;
    }
    .cycle-value {
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">IRIS Wellness Report</div>
    <div class="patient-info">
      <div><strong>Patient:</strong> ${userProfile.name}</div>
      <div><strong>Report Generated:</strong> ${todayStr}</div>
    </div>
    <div class="date-range">Data Period: ${startDateStr} to ${endDateStr} (30 days)</div>
  </div>

  <div class="section">
    <div class="section-title">Cycle Summary</div>
    <div class="cycle-info">
      <div class="cycle-item">
        <div class="cycle-label">Current Phase</div>
        <div class="cycle-value">${getPhaseDisplayName(phase)}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Cycle Length</div>
        <div class="cycle-value">${userProfile.cycleLength} days</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Regularity</div>
        <div class="cycle-value">${userProfile.cycleRegularity === 'regular' ? 'Regular' : userProfile.cycleRegularity === 'irregular' ? 'Irregular' : 'Uncertain'}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Life Stage</div>
        <div class="cycle-value">${userProfile.lifeStage === 'regular' ? 'Regular Cycling' : userProfile.lifeStage.charAt(0).toUpperCase() + userProfile.lifeStage.slice(1)}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Last Period</div>
        <div class="cycle-value">${lastPeriodDate}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Wellness Scores (Last 30 Days)</div>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Average</th>
          <th>Min</th>
          <th>Max</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Energy Level</td>
          <td>${wellnessAverages.energy.avg}/10</td>
          <td>${wellnessAverages.energy.min}</td>
          <td>${wellnessAverages.energy.max}</td>
        </tr>
        <tr>
          <td>Stress Level</td>
          <td>${wellnessAverages.stress.avg}/10</td>
          <td>${wellnessAverages.stress.min}</td>
          <td>${wellnessAverages.stress.max}</td>
        </tr>
        <tr>
          <td>Recovery Readiness</td>
          <td>${wellnessAverages.recovery.avg}/10</td>
          <td>${wellnessAverages.recovery.min}</td>
          <td>${wellnessAverages.recovery.max}</td>
        </tr>
        <tr>
          <td>Hydration Level</td>
          <td>${wellnessAverages.hydration.avg}/10</td>
          <td>${wellnessAverages.hydration.min}</td>
          <td>${wellnessAverages.hydration.max}</td>
        </tr>
        <tr>
          <td>Fatigue Level</td>
          <td>${wellnessAverages.fatigue.avg}/10</td>
          <td>${wellnessAverages.fatigue.min}</td>
          <td>${wellnessAverages.fatigue.max}</td>
        </tr>
        <tr>
          <td>Inflammation</td>
          <td>${wellnessAverages.inflammation.avg}/10</td>
          <td>${wellnessAverages.inflammation.min}</td>
          <td>${wellnessAverages.inflammation.max}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${symptomFrequency.length > 0 ? `
  <div class="section">
    <div class="section-title">Symptom Frequency (Last 30 Days)</div>
    <table>
      <thead>
        <tr>
          <th>Symptom</th>
          <th>Occurrences</th>
          <th>% of Days</th>
        </tr>
      </thead>
      <tbody>
        ${symptomFrequency.slice(0, 15).map(s => `
        <tr>
          <td>${s.symptom}</td>
          <td>${s.count}</td>
          <td>${s.percentage}%</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Daily Check-in Summary</div>
    <div class="metric-row">
      <span class="metric-label">Average Mood:</span>
      <span class="metric-value">${checkInAverages.mood}/10</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Average Energy:</span>
      <span class="metric-value">${checkInAverages.energy}/10</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Average Sleep Quality:</span>
      <span class="metric-value">${checkInAverages.sleep}/10</span>
    </div>
  </div>

  ${patterns.length > 0 ? `
  <div class="section">
    <div class="section-title">Notable Patterns Detected</div>
    ${patterns.map(p => `
    <div class="pattern-item">
      <div class="pattern-description">${p.description}</div>
      <div class="pattern-frequency">Frequency: ${p.frequency}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>Generated by IRIS Women's Wellness App</p>
    <p>For informational purposes only · Not a medical diagnosis</p>
    <p>Please consult with your healthcare provider for medical advice</p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function generateDoctorReport(
  userProfile: UserProfile,
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase
): Promise<string> {
  try {
    const html = buildHTML(userProfile, scans, checkIns, phase);

    const pdfUri = await Print.printToFileAsync({
      html,
      base64: false,
    });

    return pdfUri.uri;
  } catch (error) {
    // Error propagated to caller — no console logging of health data in production
    throw error;
  }
}
