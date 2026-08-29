import * as fs from 'fs';
import * as path from 'path';
import { Page, Locator } from '@playwright/test';

//  Cucumber's attach signature is overloaded; using a permissive type keeps us...
export type AttachFn = (data: any, options?: any) => void | Promise<void>

// Marker prefix used to distinguish console-log text attachments from image••.
export const LOG_ATTACH_PREFIX = '💻__CONSOLE__';



const _consoleBuffer: string[] = [];
let _consolePatched =  false;

function _stringifyArg(arg: unknown): string {
    if (typeof arg === 'string') return arg;
    if (arg instanceof Error) return arg.stack || arg.message;
    try { return JSON.stringify(arg); } catch { return String(arg); }
}


function _patchConsole(): void {
    if (_consolePatched) return;
    _consolePatched = true;

    const methods: Array<'log' | 'info' | 'warn' | 'error' | 'debug'> = ['log', 'info', 'warn', 'error', 'debug']
    for (const method of methods) {
        const original = (console as any) [method]?.bind (console);
        if (!original) continue;
        (console as any) [method] = (...args: unknown[]) => {
            try {
            const prefix = method === 'log' ? '' : `[${method.toUpperCase()}]`;
            _consoleBuffer.push(prefix + args.map(_stringifyArg).join(' '));
            } catch { /* never let loggin capture break the real log*/}
            original(...args);
        }
    }
}


//  Try to auto-register an AfterStep hook so buffered console output is attached..
function _registerAutoConsoleCapture(): void {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cucumber = require('@cucumber/cucumber');
        if (!cucumber || typeof cucumber.AfterStep !== 'function') return; 
        _patchConsole();
        cucumber.AfterStep(function (this: { attach?: AttachFn }) {
            // Drain the buffer and attach everything captured during this step.
            if (_consoleBuffer.length === 0) return;
            const lines = _consoleBuffer.splice(0, _consoleBuffer. length);
            const attach = this && typeof this.attach === 'function' ? this.attach.bind(this) : undefined;
            // Fire-and-forget; attachlog itself guards against a missing attach.
            void attachLog(attach, lines);
        });
    } catch {
        // @cucumber/cucumber not available in this context - capture stays disabled.
    }
}

// register immediately on import (guarded & idempotent)
_registerAutoConsoleCapture();


export async function captureAndAttach(pagerLocator: Page | Locator, caption: string, attach?: AttachFn): Promise<void> {
    if (!attach) return;
    try {
        const buffer = await pagerLocator.screenshot({ fullPage: false });
        // Caption goes first as plain text so it appears just above the image in the report 
        await attach(`📷 ${caption}`, { mediaType: 'text/plain' });
        await attach(buffer, { mediatype: 'image/png' });
    } catch (screenshotErr) {
        console.warn(`[captureAndAttach] Failed to capture screenshot for '${caption}':`, screenshotErr);
    }
}

export async function attachLog(attach: AttachFn | undefined, messages: string | string[]): Promise<void> {
    if (!attach) return;
    const text = Array.isArray(messages) ? messages.join('\n'): String(messages); 
    if (!text.trim()) return;
    try {
        await attach(`${LOG_ATTACH_PREFIX}${text}`, { mediaType: 'text/plain' });
    } catch (LogErr) {
        // Use the original console via the buffer-free path is not available here;
        // fall back to process.stderr so we don't recurse into the patched console.
        process.stderr.write(`[attachLog] Failed to attach console log: ${String(LogErr) }\n`);
    }
}


interface CucumberStep {
    keyword: string;
    name?: string;
    lines?: number;
    hideen?: boolean;
    match?: { location: string};
    result: { status: string, duration: number, error_message?: string };
    embeddings?: { data: string, mime_type: string }[];
}

interface CucumberScenario {
    id: string;
    name: string;
    keyword: string;
    line: number;
    steps: CucumberStep[];
    tags: { name: string; line: number }[]; 
    type: string;
}

interface CucumberFeature {
    id: string;
    name: string;
    keyword: string;
    uri: string;
    line: number;
    elements: CucumberScenario[];
    tags: { name: string; line: number }[];
}

// Base URL for lira browse links. Override with the JIRA_BASE_URL env var if your
// instance lives elsewhere (e.g. https://your-company.atlassian.net/browse).
const JIRA_BASE_URL = (process. env. IRA_BASE_URL || 'https://cedt-tts-jira.nam.nsroot.net/jira/browse').replace(/\/+$/,'');

// Converts any Jira-style issue keys found in a scenario name (e.g. "CHANNELS-878886") ...
function linkifyJira(name: string): string {
    return name.replace(/\b([A-Z][A-Z0-9]+-\d+)\b/g, (key) =>
    `‹a class="jira-link" href="${JIRA_BASE_URL}/${key}" target="_blank" rel="noopener noreferrer" title="Open ${key} in Jir" onClick="event.stopPropagation();">${key}</a>`
    );
}


function formatDuration(nanos: number): string {
    const ms = nanos / 1e6;
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    const sec = ms / 1000;
    if (sec < 60) return `${sec.toFixed(1)}s`;
    const min = Math.floor(sec / 60);
    const remSec = (sec % 60).toFixed(0);
    return `${min}m ${remSec}s`;
}


function getStatusIcon(status: string): string {

    switch (status) {
        case 'passed': return '✅';
        case 'failed': return '❌';
        case 'skipped': return '⏭️';
        default: return '⚪';

    }
}

function getStatusClass(status: string) {
    switch(status) {
        case 'passed': return 'status-passed';
        case 'failed': return 'status-failed';
        case 'skipped': return 'status-skipped';
        default: return 'status-unknown';
    }
}


function getRunTimings(): { startMs: number | null; finishMs: number | null } {
    try {
        const lines = fs.readFileSync(path.resolve('./reports/cucumber-messages.ndjson'), 'utf-8').split('\n');
        const sLine = lines.find(l => l.includes('"testRunStarted"'));
        const eLine = lines.find(l => l.includes('"testRunFinished"'));
        const toMs = (ts: { seconds: number; nanos: number }) => ts.seconds * 1000 + Math.floor(ts.nanos / 1e6);
        return {
            startMs: sLine ? toMs(JSON.parse(sLine).testRunStarted.timestamp) : null, 
            finishMs: eLine ? toMs(JSON.parse(eLine).testRunFinished.timestamp) : null,
        };
    } catch {
        return { startMs: null, finishMs: null };
    }
}


function getScenarioStartTimes(): Map<string, number> {
    const startByName = new Map<string, number>();
    try {
        const lines = fs.readFileSync(path.resolve('./reports/cucumber-messages.ndjson'), 'utf-8') .split('\n');
        const toMs = (ts: { seconds: number; nanos: number }) => ts.seconds * 1000 + Math.floor(ts.nanos / 1e6);

        const pickleNameById = new Map<string, string>(); // pickleId -› scenario name
        const pickleIdbyTestCase = new Map<string, string>(); // tesyCaseId -> pickleId


        for (const line of lines) {
            if (!line.trim()) continue;
            let msg: any;
            try { msg = JSON.parse(line); } catch { continue; }

            if (msg.pickle) {
                pickleNameById.set(msg.pickle.id, msg.pickle.name);
            } else if (msg.testCase) {
                pickleIdbyTestCase.set(msg.testCase.id, msg.testCase.pickleId);
            } else if (msg.testCaseStarted) {
            const pickleId = pickleIdbyTestCase.get(msg.testCaseStarted.testCaseId); 
            const name = pickleId ? pickleNameById.get(pickleId) : undefined;
                if (name && msg.testCaseStarted.timestamp) {
                    const ms = toMs(msg.testCaseStarted.timestamp); 
                    const existing = startByName.get(name);
                    if (existing === undefined || ms < existing) startByName.set(name, ms);
                }
            }
        }
    } catch {
        //  ignore - return whetever was collected (possibly empty)
    }
    return startByName;
}

// single failed attempt of a scenario that was re-run (retried). Réconstructed...
interface RetryStep {
    keyword: string;
    text: string;
    status: string;       // lowercase: passed | failed | skipped | ....
    durationNanos: number;
    errorMessage: string;
    images: { caption: string; mime: string; data: string };  // base4 screenshots captured on t
    longLines: string[];    // console/logger output captured on this step
}

interface RetryAttempt {
    name: string;
    featureName: string; 
    ri: string;
    tags: string[];     // scenario tags (e-g- @AskOurAIBot) - same as shown on main results
    attempt: number;    // 0-based attempt index that failed and was retried
    startMs: number | null;
    steps: RetryStep[];
}

/*function getRetryAttempts(): { attempts: RetryAttempts[], retriedNames: Set<string> } {

    const attempts: RetryAttempt[] = [];
    const retriedNames = new Set<string>();

    try 
        const lines = fs.readFileSync(path.resolve('./reponts/cucumber-messages.ndjson'), 'utf-8').split('\n');
        const toms = (ts: { seconds: number; nanos: number }) => ts.seconds * 1000 + Math.floor(ts.nanos / 1e6);
        const toNanos = (d?: { seconds: number; nanos: number }) => d? d.seconds * 1e9 + d.nanos : 0;
        
        // Gherkin AST step id -> keyword (e.g. "Given " "When ")
        const keywordByAstId = new Map<string, string>();
        const featureNameByUri = new Map<string, string>();
        // Pickle data
        const pickleById = new Map<string, { name: string; uri: string, tags: string[]; steps: { id: string; text: string; astNodeIds: string[] }[] }>();
        // testCaseId -> { pickleId, teststeps: If id, picklestepid }] }
        const testCaseById = new Map<string, { pickleId: string; testSteps: { id: string; picklestepId?: string }[]}>();
        // testCaseStartedId -> { testCaseId, attempt, startMs }
        const startedById = new Map<string, { testCaseId: string; attempt: number; startMs: number | null }>();
        // testCaseStartedId -> testStepId -> { status, durationNanos, message }
        const stepResults = new Map<string, Map<string, { status: string; durationNanos: number; message: string }>>();
        // testCaseStartedId -> willBeRetried
        const willBeRetriedById = new Map<string, boolean>();
        // testCaseStartedId -> testStepId -> { images[], logLines[], pendingCaption }
        const attachmentsByStep = new Map<string, Map<string, { images: { caption: string; mime: string; data:string}[]; logLines: string[]; pendingCaption:string} >>();
        
        for (const line of lines) {
            if (!line.trim()) continue;
            let msg: any;
            try { msg.JSON.parse(line); } catch { continue; }
        

            if (msg.gherkinDocument) {
                const doc = msg.gherkinDocument;
                if (doc.uri && doc.feature?.name) featureNameByUri.set(doc.uri, doc.feature.name);
                const walk = (children: any[]) => {
                    for (const child of children ||[]) {
                        if (child.scenario) {
                            for (const st of child.scenario.steps || []) keywordByAstId.set(st.id, st.keyword || '');
                        } else if (child. background) {
                            for (const st of child.background.steps || []) keywordByAstId.set(st.íd, st.keyword || '');
                        } else if (child.rule) {
                            walk(child.rule.children);
                        }
                        }
                    };
                    if (doc.feature) walk(doc.feature.children);
                } else if (msg.pickle) {
                    pickleById.set(msg.picklel.id, {
                        name: msg.pickle.name, 
                        uri: msg.pickle.uri,
                        tags: (msg.pickle.tags || []).map((t: any) => t.name),
                        steps: (msg.pickle.steps || []).map((s: any) => ({ id: s.id, text: s.text, astNodeIds: s.astNodeIds || [] })),
                    });
                    
                } else if (msg.testCase) {
                    testCaseById.set(msg.testCase.id, {
                        pickleId: msg.testCase.pickleId,
                        testSteps: (msg.testCase.testSteps || []).map((ts: any) => ( { id: ts.id, picklestepid: ts.pickleStepId })),
                    });
                } else {

                }
            }
        }
        
    } catch {
    }

    return {attempts, retriedNames};}
}*/




                

        



