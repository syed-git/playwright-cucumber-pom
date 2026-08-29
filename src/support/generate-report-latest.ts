/**
 * generate-report-latest.ts
 *
 * Single entry point that:
 *   1. Runs cucumber-js, forwarding any CLI args (e.g. --tags "@smoke" --parallel 3).
 *   2. Reads reports/cucumber-report.json + reports/cucumber-messages.ndjson.
 *   3. Generates an aesthetic, self-contained HTML dashboard with a dynamic
 *      (timestamped) file name under reports/dashboard/.
 *
 * Usage:
 *   npm run test -- --tags "@currentDatePolicy" --parallel 3   (run tests + report)
 *   npm run report:latest                                       (report only, from last run)
 */

import { spawnSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { Page, Locator } from "@playwright/test";

const REPORTS_DIR = path.resolve(process.cwd(), "reports");
const JSON_REPORT = path.join(REPORTS_DIR, "cucumber-report.json");
const MESSAGES_NDJSON = path.join(REPORTS_DIR, "cucumber-messages.ndjson");
const DASHBOARD_DIR = path.join(REPORTS_DIR, "dashboard");
const LOG_ATTACH_PREFIX = "💻__CONSOLE__";

type AttachFn = (data: any, options?: any) => void | Promise<void>;

/**
 * Capture a screenshot of a full page or a single element (Locator) with a
 * caption, and attach it to the current cucumber step. The dashboard shows it
 * as an inline thumbnail beside the step duration, and the caption appears in
 * the lightbox viewer.
 *
 * Usage inside a step definition or page object:
 *   await captureScreenshot(this.page, "After login", this.attach.bind(this));
 *   await captureScreenshot(page.locator("#summary"), "Policy summary", attach);
 */
export async function captureScreenshot(
  target: Page | Locator,
  caption: string,
  attach?: AttachFn
): Promise<void> {
  if (!attach) return;
  try {
    const buffer = await target.screenshot();
    await attach(`📷 ${caption}`, { mediaType: "text/plain" });
    await attach(buffer, { mediaType: "image/png" });
  } catch (err) {
    console.warn(`[captureScreenshot] Failed to capture '${caption}':`, err);
  }
}

function platformName(): string {
  switch (os.platform()) {
    case "win32": return `Windows ${os.release()}`;
    case "darwin": return "macOS";
    case "linux": return "Linux";
    default: return os.platform();
  }
}

// ---------------------------------------------------------------------------
// Types (cucumber JSON formatter shape)
// ---------------------------------------------------------------------------

interface Embedding { data: string; mime_type: string }
interface StepResult { status: string; duration?: number; error_message?: string }
interface Step {
  keyword: string;
  name?: string;
  hidden?: boolean;
  result?: StepResult;
  embeddings?: Embedding[];
  match?: { location?: string };
}
interface Scenario {
  id: string;
  name: string;
  keyword: string;
  line: number;
  type: string;
  steps: Step[];
  tags?: { name: string }[];
}
interface Feature {
  id: string;
  name: string;
  uri: string;
  keyword: string;
  elements?: Scenario[];
  tags?: { name: string }[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDuration(nanos: number): string {
  const ms = nanos / 1e6;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  const sec = ms / 1000;
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const min = Math.floor(sec / 60);
  return `${min}m ${(sec % 60).toFixed(0)}s`;
}

function formatMs(ms: number): string {
  return formatDuration(ms * 1e6);
}

function scenarioStatus(scenario: Scenario): string {
  const steps = scenario.steps || [];
  if (steps.some((s) => s.result?.status === "failed")) return "failed";
  if (steps.some((s) => s.result?.status === "pending" || s.result?.status === "undefined")) return "failed";
  if (steps.length > 0 && steps.every((s) => s.result?.status === "skipped")) return "skipped";
  return "passed";
}

function statusIcon(status: string): string {
  switch (status) {
    case "passed": return "✔";
    case "failed": return "✖";
    case "skipped": return "➜";
    default: return "•";
  }
}

interface RunTimings { startMs: number | null; finishMs: number | null }

function getRunTimings(): RunTimings {
  try {
    const lines = fs.readFileSync(MESSAGES_NDJSON, "utf-8").split("\n");
    const toMs = (ts: { seconds: number; nanos: number }) => Number(ts.seconds) * 1000 + Math.floor(ts.nanos / 1e6);
    const sLine = lines.find((l) => l.includes('"testRunStarted"'));
    const eLine = lines.find((l) => l.includes('"testRunFinished"'));
    return {
      startMs: sLine ? toMs(JSON.parse(sLine).testRunStarted.timestamp) : null,
      finishMs: eLine ? toMs(JSON.parse(eLine).testRunFinished.timestamp) : null,
    };
  } catch {
    return { startMs: null, finishMs: null };
  }
}

const CAPTION_PREFIX = "📷 ";

interface StepImage { src: string; caption: string }

function extractStepLogs(step: Step): { logs: string[]; images: StepImage[]; texts: string[] } {
  const logs: string[] = [];
  const images: StepImage[] = [];
  const texts: string[] = [];
  let pendingCaption: string | null = null;
  for (const emb of step.embeddings || []) {
    const mime = (emb.mime_type || "").toLowerCase();
    if (mime.startsWith("image/")) {
      images.push({
        src: `data:${mime};base64,${emb.data}`,
        caption: pendingCaption || `Screenshot ${images.length + 1}`,
      });
      pendingCaption = null;
    } else if (mime.startsWith("text/") || mime === "") {
      const decoded = Buffer.from(emb.data, "base64").toString("utf-8");
      if (decoded.startsWith(LOG_ATTACH_PREFIX)) {
        logs.push(decoded.slice(LOG_ATTACH_PREFIX.length));
      } else if (decoded.startsWith(CAPTION_PREFIX)) {
        pendingCaption = decoded.slice(CAPTION_PREFIX.length).trim();
      } else {
        texts.push(decoded);
      }
    }
  }
  return { logs, images, texts };
}

// ---------------------------------------------------------------------------
// HTML rendering
// ---------------------------------------------------------------------------

function renderStep(step: Step): string {
  const status = step.result?.status || "unknown";
  const duration = step.result?.duration ? formatDuration(step.result.duration) : "";
  const { logs, images, texts } = extractStepLogs(step);
  const name = `${step.keyword || ""}${step.name || (step.hidden ? "(hook)" : "")}`;

  const logsHtml = logs.length
    ? `<div class="step-logs"><div class="logs-title">Console output</div><pre>${escapeHtml(logs.join("\n"))}</pre></div>`
    : "";
  const textsHtml = texts.length
    ? `<div class="step-logs"><div class="logs-title">Attachments</div><pre>${escapeHtml(texts.join("\n"))}</pre></div>`
    : "";
  const inlineGalleryHtml = images.length
    ? `<span class="inline-gallery${images.length > 1 ? " multi" : ""}" title="${images.length} screenshot${images.length > 1 ? "s" : ""}" onclick="event.stopPropagation(); openLightbox(this)">${images
        .map((img, i) => `<img class="inline-thumb${i > 0 ? " extra" : ""}" src="${img.src}" alt="${escapeHtml(img.caption)}" data-caption="${escapeHtml(img.caption)}" loading="lazy"/>`)
        .join("")}${images.length > 1 ? `<span class="shot-count">+${images.length - 1}</span>` : ""}</span>`
    : "";
  const errorHtml = step.result?.error_message
    ? `<div class="step-error"><div class="logs-title">Error</div><pre>${escapeHtml(step.result.error_message)}</pre></div>`
    : "";

  const hasDetails = logsHtml || textsHtml || errorHtml;

  return `
    <div class="step ${status}">
      <div class="step-header${hasDetails ? " expandable" : ""}" ${hasDetails ? 'onclick="this.parentElement.classList.toggle(\'open\')"' : ""}>
        <span class="step-status ${status}">${statusIcon(status)}</span>
        <span class="step-name">${escapeHtml(name)}</span>
        ${hasDetails ? '<span class="chevron">▾</span>' : ""}
        ${inlineGalleryHtml}
        <span class="step-duration">${duration}</span>
      </div>
      ${hasDetails ? `<div class="step-details">${errorHtml}${logsHtml}${textsHtml}</div>` : ""}
    </div>`;
}

function renderScenario(scenario: Scenario, index: number): string {
  const status = scenarioStatus(scenario);
  const totalNanos = (scenario.steps || []).reduce((acc, s) => acc + (s.result?.duration || 0), 0);
  const tags = (scenario.tags || []).map((t) => `<span class="tag">${escapeHtml(t.name)}</span>`).join("");
  const stepsHtml = (scenario.steps || []).map(renderStep).join("");

  return `
    <div class="scenario ${status}" data-status="${status}">
      <div class="scenario-header" onclick="this.parentElement.classList.toggle('open')">
        <span class="badge ${status}">${status.toUpperCase()}</span>
        <span class="scenario-name">${escapeHtml(scenario.name || `Scenario ${index + 1}`)}</span>
        <span class="scenario-meta">${tags}</span>
        <span class="scenario-duration">⏱ ${formatDuration(totalNanos)}</span>
        <span class="chevron">▾</span>
      </div>
      <div class="scenario-body">${stepsHtml}</div>
    </div>`;
}

function renderFeature(feature: Feature): string {
  const scenarios = (feature.elements || []).filter((e) => e.type === "scenario");
  const passed = scenarios.filter((s) => scenarioStatus(s) === "passed").length;
  const failed = scenarios.filter((s) => scenarioStatus(s) === "failed").length;
  const skipped = scenarios.filter((s) => scenarioStatus(s) === "skipped").length;
  const scenariosHtml = scenarios.map(renderScenario).join("");

  return `
    <section class="feature">
      <div class="feature-header">
        <h2>📄 ${escapeHtml(feature.name)}</h2>
        <div class="feature-stats">
          <span class="pill passed">${passed} passed</span>
          ${failed ? `<span class="pill failed">${failed} failed</span>` : ""}
          ${skipped ? `<span class="pill skipped">${skipped} skipped</span>` : ""}
          <span class="feature-uri">${escapeHtml(feature.uri || "")}</span>
        </div>
      </div>
      ${scenariosHtml}
    </section>`;
}

function buildHtml(features: Feature[]): string {
  const allScenarios = features.flatMap((f) => (f.elements || []).filter((e) => e.type === "scenario"));
  const total = allScenarios.length;
  const passed = allScenarios.filter((s) => scenarioStatus(s) === "passed").length;
  const failed = allScenarios.filter((s) => scenarioStatus(s) === "failed").length;
  const skipped = allScenarios.filter((s) => scenarioStatus(s) === "skipped").length;
  const passRate = total ? Math.round((passed / total) * 100) : 0;

  const totalSteps = allScenarios.flatMap((s) => s.steps || []).filter((s) => !s.hidden);
  const stepsPassed = totalSteps.filter((s) => s.result?.status === "passed").length;
  const stepsFailed = totalSteps.filter((s) => s.result?.status === "failed").length;

  const timings = getRunTimings();
  const wallClockMs = timings.startMs && timings.finishMs ? timings.finishMs - timings.startMs : null;
  const cumulativeNanos = totalSteps.reduce((acc, s) => acc + (s.result?.duration || 0), 0);
  const totalTime = wallClockMs !== null ? formatMs(wallClockMs) : formatDuration(cumulativeNanos);
  const startedAt = timings.startMs ? new Date(timings.startMs).toLocaleString() : new Date().toLocaleString();

  const environment = process.env.ENV || "uat1";
  const browser = ["chromium", "firefox", "webkit"].includes(process.env.BROWSER || "") ? (process.env.BROWSER as string) : "chromium";
  const featuresHtml = features.map(renderFeature).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Test Execution Dashboard</title>
<style>
  :root {
    --bg: #0f1420; --surface: #171e2e; --surface2: #1f2940;
    --text: #e6ebf5; --muted: #8b96ad; --border: #2a3550;
    --green: #34d399; --red: #f87171; --amber: #fbbf24; --blue: #60a5fa; --violet: #a78bfa;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 32px; }
  header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; }
  header h1 { font-size: 26px; font-weight: 700; background: linear-gradient(90deg, var(--blue), var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  header .subtitle { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .env-chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { background: var(--surface2); border: 1px solid var(--border); padding: 7px 14px; border-radius: 999px; font-size: 13px; color: var(--text); }
  .chip b { color: var(--blue); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
  .card .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
  .card .value { font-size: 28px; font-weight: 700; }
  .card.passed .value { color: var(--green); }
  .card.failed .value { color: var(--red); }
  .card.skipped .value { color: var(--amber); }
  .card.rate .value { color: var(--blue); }
  .progress-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 28px; }
  .progress-bar { height: 12px; border-radius: 999px; background: var(--surface2); overflow: hidden; display: flex; margin-top: 10px; }
  .progress-bar .seg { height: 100%; }
  .seg.p { background: var(--green); } .seg.f { background: var(--red); } .seg.s { background: var(--amber); }
  .progress-legend { display: flex; gap: 18px; color: var(--muted); font-size: 13px; margin-top: 10px; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  .filters { display: flex; gap: 10px; margin-bottom: 20px; }
  .filters button { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 8px 18px; border-radius: 999px; cursor: pointer; font-size: 13px; }
  .filters button.active { background: var(--blue); border-color: var(--blue); color: #0b1020; font-weight: 700; }
  .feature { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
  .feature-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
  .feature-header h2 { font-size: 18px; }
  .feature-stats { display: flex; gap: 8px; align-items: center; }
  .feature-uri { color: var(--muted); font-size: 12px; margin-left: 8px; }
  .pill { padding: 3px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .pill.passed { background: rgba(52,211,153,.15); color: var(--green); }
  .pill.failed { background: rgba(248,113,113,.15); color: var(--red); }
  .pill.skipped { background: rgba(251,191,36,.15); color: var(--amber); }
  .scenario { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; overflow: hidden; }
  .scenario.failed { border-left: 3px solid var(--red); }
  .scenario.passed { border-left: 3px solid var(--green); }
  .scenario.skipped { border-left: 3px solid var(--amber); }
  .scenario-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; background: var(--surface2); }
  .scenario-header:hover { filter: brightness(1.1); }
  .scenario-name { font-weight: 600; flex: 1; }
  .scenario-duration { color: var(--muted); font-size: 13px; white-space: nowrap; }
  .badge { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: .05em; }
  .badge.passed { background: var(--green); color: #06281c; }
  .badge.failed { background: var(--red); color: #3d0a0a; }
  .badge.skipped { background: var(--amber); color: #3a2a00; }
  .tag { background: rgba(96,165,250,.15); color: var(--blue); padding: 2px 9px; border-radius: 999px; font-size: 11px; margin-right: 4px; }
  .chevron { color: var(--muted); transition: transform .2s; }
  .scenario.open > .scenario-header .chevron { transform: rotate(180deg); }
  .scenario-body { display: none; padding: 10px 16px 16px; }
  .scenario.open > .scenario-body { display: block; }
  .step { border-bottom: 1px solid var(--border); }
  .step:last-child { border-bottom: none; }
  .step-header { display: flex; align-items: center; gap: 10px; padding: 8px 4px; font-size: 14px; }
  .step-header.expandable { cursor: pointer; }
  .step-header.expandable:hover { background: rgba(255,255,255,.03); }
  .step-status { width: 20px; text-align: center; font-weight: 700; }
  .step-status.passed { color: var(--green); }
  .step-status.failed { color: var(--red); }
  .step-status.skipped { color: var(--amber); }
  .step-name { flex: 1; }
  .step.failed .step-name { color: var(--red); }
  .step-duration { color: var(--muted); font-size: 12px; white-space: nowrap; }
  .step .chevron { font-size: 12px; }
  .step.open > .step-header .chevron { transform: rotate(180deg); }
  .step-details { display: none; padding: 6px 4px 12px 34px; }
  .step.open > .step-details { display: block; }
  .logs-title { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .step-logs pre, .step-error pre { background: #0b101c; border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 12.5px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap; word-break: break-word; color: #b9c4da; font-family: 'Cascadia Code', Consolas, monospace; }
  .step-error pre { border-color: rgba(248,113,113,.4); color: #fca5a5; }
  .step-logs, .step-error { margin-bottom: 10px; }
  .inline-gallery { position: relative; display: inline-flex; align-items: center; cursor: zoom-in; flex-shrink: 0; }
  .inline-thumb { width: 48px; height: 30px; object-fit: cover; object-position: top; border: 1px solid var(--border); border-radius: 5px; display: block; transition: transform .15s, border-color .15s; background: #fff; }
  .inline-gallery:hover .inline-thumb { transform: scale(1.08); border-color: var(--blue); }
  .inline-thumb.extra { display: none; }
  .inline-gallery.multi .inline-thumb:first-child { box-shadow: 3px 3px 0 -1px var(--surface2), 3px 3px 0 0 var(--border); }
  .shot-count { position: absolute; right: -7px; top: -7px; background: var(--blue); color: #0b1020; font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 5px; pointer-events: none; }
  .lightbox { display: none; position: fixed; inset: 0; background: rgba(5,8,16,.92); z-index: 1000; align-items: center; justify-content: center; flex-direction: column; }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: 92vw; max-height: 80vh; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 20px 60px rgba(0,0,0,.6); }
  .lightbox .lb-caption { margin-top: 14px; background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 8px 18px; border-radius: 999px; font-size: 14px; max-width: 80vw; }
  .lightbox.hide-caption .lb-caption { display: none; }
  .lightbox .lb-bar { position: absolute; top: 18px; right: 20px; display: flex; gap: 10px; }
  .lightbox .lb-counter { position: absolute; top: 24px; left: 24px; color: var(--muted); font-size: 13px; }
  .lightbox button { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; }
  .lightbox button:hover { border-color: var(--blue); }
  .lightbox .lb-nav { position: absolute; top: 50%; transform: translateY(-50%); font-size: 20px; padding: 12px 16px; border-radius: 50%; }
  .lightbox .lb-prev { left: 20px; } .lightbox .lb-next { right: 20px; }
  footer { color: var(--muted); font-size: 12px; text-align: center; margin-top: 30px; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>🥒 Test Execution Dashboard</h1>
      <div class="subtitle">Cucumber + Playwright &middot; Started: ${escapeHtml(startedAt)}</div>
    </div>
    <div class="env-chips">
      <span class="chip">🌐 Environment: <b>${escapeHtml(environment)}</b></span>
      <span class="chip">💻 Platform: <b>${escapeHtml(platformName())}</b></span>
      <span class="chip">🧭 Browser: <b>${escapeHtml(browser)}</b></span>
      <span class="chip">⏱ Total Time: <b>${escapeHtml(totalTime)}</b></span>
    </div>
  </header>

  <div class="cards">
    <div class="card"><div class="label">Total Scenarios</div><div class="value">${total}</div></div>
    <div class="card passed"><div class="label">Passed</div><div class="value">${passed}</div></div>
    <div class="card failed"><div class="label">Failed</div><div class="value">${failed}</div></div>
    <div class="card skipped"><div class="label">Skipped</div><div class="value">${skipped}</div></div>
    <div class="card rate"><div class="label">Pass Rate</div><div class="value">${passRate}%</div></div>
    <div class="card"><div class="label">Steps (P/F)</div><div class="value">${stepsPassed}<span style="color:var(--muted);font-size:18px">/</span><span style="color:var(--red)">${stepsFailed}</span></div></div>
  </div>

  <div class="progress-wrap">
    <div class="label" style="color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em">Scenario Results</div>
    <div class="progress-bar">
      <div class="seg p" style="width:${total ? (passed / total) * 100 : 0}%"></div>
      <div class="seg f" style="width:${total ? (failed / total) * 100 : 0}%"></div>
      <div class="seg s" style="width:${total ? (skipped / total) * 100 : 0}%"></div>
    </div>
    <div class="progress-legend">
      <span><span class="dot" style="background:var(--green)"></span>${passed} passed</span>
      <span><span class="dot" style="background:var(--red)"></span>${failed} failed</span>
      <span><span class="dot" style="background:var(--amber)"></span>${skipped} skipped</span>
    </div>
  </div>

  <div class="filters">
    <button class="active" data-filter="all">All</button>
    <button data-filter="passed">Passed</button>
    <button data-filter="failed">Failed</button>
    <button data-filter="skipped">Skipped</button>
  </div>

  ${featuresHtml}

  <footer>Generated on ${escapeHtml(new Date().toLocaleString())} by generate-report-latest.ts</footer>

  <div class="lightbox" id="lightbox" onclick="if (event.target === this) closeLightbox()">
    <span class="lb-counter" id="lbCounter"></span>
    <div class="lb-bar">
      <button onclick="toggleCaption()" id="lbCaptionBtn">Hide caption</button>
      <button onclick="closeLightbox()">✕ Close</button>
    </div>
    <button class="lb-nav lb-prev" id="lbPrev" onclick="navLightbox(-1)">‹</button>
    <img id="lbImage" src="" alt=""/>
    <button class="lb-nav lb-next" id="lbNext" onclick="navLightbox(1)">›</button>
    <div class="lb-caption" id="lbCaption"></div>
  </div>

  <script>
    var lbGroup = [];
    var lbIndex = 0;
    function openLightbox(gallery) {
      var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));
      lbGroup = imgs.map(function (img) {
        return { src: img.src, caption: img.getAttribute('data-caption') || '' };
      });
      lbIndex = 0;
      renderLightbox();
      document.getElementById('lightbox').classList.add('open');
    }
    function renderLightbox() {
      var item = lbGroup[lbIndex];
      document.getElementById('lbImage').src = item.src;
      document.getElementById('lbCaption').textContent = item.caption;
      document.getElementById('lbCounter').textContent = (lbIndex + 1) + ' / ' + lbGroup.length;
      var multi = lbGroup.length > 1;
      document.getElementById('lbPrev').style.display = multi ? '' : 'none';
      document.getElementById('lbNext').style.display = multi ? '' : 'none';
    }
    function navLightbox(dir) {
      lbIndex = (lbIndex + dir + lbGroup.length) % lbGroup.length;
      renderLightbox();
    }
    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('open');
    }
    function toggleCaption() {
      var lb = document.getElementById('lightbox');
      lb.classList.toggle('hide-caption');
      document.getElementById('lbCaptionBtn').textContent =
        lb.classList.contains('hide-caption') ? 'Show caption' : 'Hide caption';
    }
    document.addEventListener('keydown', function (e) {
      var lb = document.getElementById('lightbox');
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });

    document.querySelectorAll('.filters button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filters button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.scenario').forEach(function (sc) {
          sc.style.display = (filter === 'all' || sc.getAttribute('data-status') === filter) ? '' : 'none';
        });
      });
    });
  </script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export function generateDashboard(): string | null {
  if (!fs.existsSync(JSON_REPORT)) {
    console.error(`[generate-report-latest] No JSON report found at ${JSON_REPORT}. Run the tests first.`);
    return null;
  }
  const features: Feature[] = JSON.parse(fs.readFileSync(JSON_REPORT, "utf-8"));
  const html = buildHtml(features);

  fs.mkdirSync(DASHBOARD_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:T]/g, "-").replace(/\..+/, "");
  const outFile = path.join(DASHBOARD_DIR, `execution-report-${timestamp}.html`);
  fs.writeFileSync(outFile, html, "utf-8");

  // Also keep a stable "latest" copy for easy bookmarking / CI artifacts.
  fs.writeFileSync(path.join(DASHBOARD_DIR, "execution-report-latest.html"), html, "utf-8");

  console.log(`\n📊 HTML dashboard generated: ${outFile}`);
  return outFile;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--report-only")) {
    generateDashboard();
    return;
  }

  // Forward all CLI args to cucumber-js (e.g. --tags "@smoke" --parallel 3).
  // Accept "--tag" as a friendly alias for cucumber's "--tags".
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tag") args[i] = "--tags";
  }

  // On Windows PowerShell the leading "--" can be stripped, so npm swallows
  // --tags/--parallel as its own config flags and only their values reach us
  // as bare positionals (e.g. "@smoke", "2"). Recover them here.
  const normalized: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const prev = normalized[normalized.length - 1];
    if (arg.startsWith("@") && prev !== "--tags") {
      normalized.push("--tags", arg);
    } else if (/^\d+$/.test(arg) && prev !== "--parallel" && !prev?.startsWith("-")) {
      normalized.push("--parallel", arg);
    } else {
      normalized.push(arg);
    }
  }
  // npm may also expose swallowed flags as npm_config_* env vars with real
  // values (e.g. --tags=@smoke). Pick those up when not already present.
  const envTags = process.env.npm_config_tags;
  if (envTags && envTags !== "true" && !normalized.includes("--tags")) {
    normalized.push("--tags", envTags);
  }
  const envParallel = process.env.npm_config_parallel;
  if (envParallel && /^\d+$/.test(envParallel) && !normalized.includes("--parallel")) {
    normalized.push("--parallel", envParallel);
  }
  args.length = 0;
  args.push(...normalized);
  const isWin = process.platform === "win32";
  const cucumberBin = path.resolve(process.cwd(), "node_modules", ".bin", isWin ? "cucumber-js.cmd" : "cucumber-js");
  const spawnArgs = isWin
    ? args.map((a) => (/\s/.test(a) ? `"${a}"` : a))
    : args;
  const result = spawnSync(isWin ? `"${cucumberBin}"` : cucumberBin, spawnArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  generateDashboard();
  process.exit(result.status ?? 1);
}

if (require.main === module) {
  main();
}
