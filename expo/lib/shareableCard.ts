import { CyclePhase } from "@/types";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ShareableCardData {
  cycleNumber: number;
  cycleDays: number;
  avgEnergy: number;
  avgStress: number;
  avgRecovery: number;
  topAchievement: string;     // e.g., "7-day scan streak!"
  phase: CyclePhase;
  phaseColor: string;
}

// ─── Phase Display Helpers ───────────────────────────────────────────────────

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
};

const PHASE_GRADIENTS: Record<CyclePhase, { start: string; end: string }> = {
  menstrual: { start: "#E89BA4", end: "#C47A83" },
  follicular: { start: "#8BC9A3", end: "#6BA883" },
  ovulation: { start: "#F4C896", end: "#D4A876" },
  luteal: { start: "#B8A4E8", end: "#9884C8" },
};

// ─── HTML Generator ──────────────────────────────────────────────────────────

/**
 * Generate an HTML string that renders a beautiful cycle recap card.
 * Designed for 1080x1920 (Instagram story) dimensions.
 * Uses only inline CSS -- no external resources.
 */
export function generateShareableHTML(data: ShareableCardData): string {
  const gradient = PHASE_GRADIENTS[data.phase] || PHASE_GRADIENTS.follicular;
  const phaseLabel = PHASE_LABELS[data.phase] || "Cycle";
  const phaseColor = data.phaseColor || gradient.start;

  const energyPct = Math.round(Math.min(10, Math.max(0, data.avgEnergy)) * 10);
  const stressPct = Math.round(Math.min(10, Math.max(0, data.avgStress)) * 10);
  const recoveryPct = Math.round(
    Math.min(10, Math.max(0, data.avgRecovery)) * 10
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=1080, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    body {
      width: 1080px;
      height: 1920px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(160deg, ${gradient.start} 0%, ${gradient.end} 40%, #1a1528 70%);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .bg-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, ${phaseColor}33 0%, transparent 70%);
      top: 200px;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }

    .card-container {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0 80px;
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 60px;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 2px solid rgba(255, 255, 255, 0.25);
    }

    .logo-text {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .title {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 1px;
      opacity: 0.95;
    }

    .subtitle {
      font-size: 24px;
      font-weight: 500;
      opacity: 0.7;
      margin-top: 8px;
    }

    .cycle-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 60px;
    }

    .cycle-number {
      font-size: 160px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -4px;
    }

    .cycle-label {
      font-size: 28px;
      font-weight: 600;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 6px;
      margin-top: 4px;
    }

    .phase-tag {
      display: inline-block;
      padding: 12px 36px;
      border-radius: 40px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .metrics-row {
      display: flex;
      justify-content: center;
      gap: 36px;
      margin-bottom: 60px;
      width: 100%;
    }

    .metric-card {
      flex: 1;
      max-width: 280px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      padding: 36px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .metric-value {
      font-size: 48px;
      font-weight: 800;
    }

    .metric-bar-track {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.15);
      margin: 16px 0;
      overflow: hidden;
    }

    .metric-bar-fill {
      height: 100%;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.8);
    }

    .metric-label {
      font-size: 20px;
      font-weight: 600;
      opacity: 0.75;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .achievement-banner {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 28px 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 80px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .achievement-icon {
      font-size: 32px;
    }

    .achievement-text {
      font-size: 24px;
      font-weight: 600;
    }

    .footer {
      position: absolute;
      bottom: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.5;
    }

    .footer-text {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="bg-glow"></div>

  <div class="card-container">
    <div class="header">
      <div class="logo-circle">
        <span class="logo-text">I</span>
      </div>
      <div class="title">IRIS Cycle Recap</div>
      <div class="subtitle">Cycle ${data.cycleNumber}</div>
    </div>

    <div class="cycle-badge">
      <div class="cycle-number">${data.cycleDays}</div>
      <div class="cycle-label">Days</div>
      <div class="phase-tag">${phaseLabel} Phase</div>
    </div>

    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-value">${data.avgEnergy.toFixed(1)}</div>
        <div class="metric-bar-track">
          <div class="metric-bar-fill" style="width: ${energyPct}%;"></div>
        </div>
        <div class="metric-label">Energy</div>
      </div>

      <div class="metric-card">
        <div class="metric-value">${data.avgStress.toFixed(1)}</div>
        <div class="metric-bar-track">
          <div class="metric-bar-fill" style="width: ${stressPct}%;"></div>
        </div>
        <div class="metric-label">Stress</div>
      </div>

      <div class="metric-card">
        <div class="metric-value">${data.avgRecovery.toFixed(1)}</div>
        <div class="metric-bar-track">
          <div class="metric-bar-fill" style="width: ${recoveryPct}%;"></div>
        </div>
        <div class="metric-label">Recovery</div>
      </div>
    </div>

    ${
      data.topAchievement
        ? `<div class="achievement-banner">
      <span class="achievement-text">${escapeHtml(data.topAchievement)}</span>
    </div>`
        : ""
    }
  </div>

  <div class="footer">
    <div class="footer-text">Track your wellness at iris-wellness.mojjo.se</div>
  </div>
</body>
</html>`;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Escape HTML special characters to prevent injection. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
