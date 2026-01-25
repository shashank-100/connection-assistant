module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-api/linkedin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinkedInAgentAPI",
    ()=>LinkedInAgentAPI
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const execAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["exec"]);
const AGENT_DIR = process.env.AGENT_DIR || __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), '..');
const BACKEND_URL = ("TURBOPACK compile-time value", "https://courteous-empathy-production-9e68.up.railway.app") || 'https://courteous-empathy-production-9e68.up.railway.app';
class LinkedInAgentAPI {
    static async runRailwayAction(action, userId, params = {}) {
        try {
            const response = await fetch(`${BACKEND_URL}/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    userId,
                    ...params
                })
            });
            const data = await response.json();
            if (data.success) {
                return {
                    success: true,
                    message: `${action} completed successfully`,
                    data: data.data
                };
            } else {
                return {
                    success: false,
                    message: data.error || `Failed to execute ${action}`,
                    error: data.error
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to communicate with Railway backend',
                error: error.message
            };
        }
    }
    static async searchPeople(searchTerm, userId = 'shashank') {
        return this.runRailwayAction('linkedin-search', userId, {
            searchTerm
        });
    }
    static async checkAuthStatus(userId = 'shashank') {
        return this.runRailwayAction('linkedin-me', userId);
    }
    static async openLogin() {
        return {
            success: false,
            message: 'Manual login not supported via Railway backend. Please provide valid cookies.'
        };
    }
    static async visitProfiles(searchTerm, userId = 'shashank', max = 10) {
        return this.runRailwayAction('linkedin-visit', userId, {
            searchTerm,
            max
        });
    }
    static async scrapeLeads(searchTerm, userId = 'shashank', max = 25) {
        return this.runRailwayAction('linkedin-search', userId, {
            searchTerm,
            max
        });
    }
    static async sendMessages(message, filter, max = 5) {
        return {
            success: false,
            message: 'Bulk messaging needs mapping to individual profileUrl actions on backend'
        };
    }
    static async getAnalytics() {
        return {
            success: true,
            message: 'Analytics fetched (Mock)',
            data: {
                totalSearched: 150,
                totalVisited: 85,
                totalConnected: 42,
                totalMessaged: 12
            }
        };
    }
}
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/snapshot.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Enhanced snapshot with element refs for deterministic element selection.
 *
 * This module generates accessibility snapshots with embedded refs that can be
 * used to click/fill/interact with elements without re-querying the DOM.
 *
 * Example output:
 *   - heading "Example Domain" [ref=e1] [level=1]
 *   - paragraph: Some text content
 *   - button "Submit" [ref=e2]
 *   - textbox "Email" [ref=e3]
 *
 * Usage:
 *   agent-browser snapshot              # Full snapshot
 *   agent-browser snapshot -i           # Interactive elements only
 *   agent-browser snapshot --depth 3    # Limit depth
 *   agent-browser click @e2             # Click element by ref
 */ __turbopack_context__.s([
    "getEnhancedSnapshot",
    ()=>getEnhancedSnapshot,
    "getSnapshotStats",
    ()=>getSnapshotStats,
    "parseRef",
    ()=>parseRef,
    "resetRefs",
    ()=>resetRefs
]);
// Counter for generating refs
let refCounter = 0;
function resetRefs() {
    refCounter = 0;
}
/**
 * Generate next ref ID
 */ function nextRef() {
    return `e${++refCounter}`;
}
/**
 * Roles that are interactive and should get refs
 */ const INTERACTIVE_ROLES = new Set([
    'button',
    'link',
    'textbox',
    'checkbox',
    'radio',
    'combobox',
    'listbox',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'searchbox',
    'slider',
    'spinbutton',
    'switch',
    'tab',
    'treeitem'
]);
/**
 * Roles that provide structure/context (get refs for text extraction)
 */ const CONTENT_ROLES = new Set([
    'heading',
    'cell',
    'gridcell',
    'columnheader',
    'rowheader',
    'listitem',
    'article',
    'region',
    'main',
    'navigation'
]);
/**
 * Roles that are purely structural (can be filtered in compact mode)
 */ const STRUCTURAL_ROLES = new Set([
    'generic',
    'group',
    'list',
    'table',
    'row',
    'rowgroup',
    'grid',
    'treegrid',
    'menu',
    'menubar',
    'toolbar',
    'tablist',
    'tree',
    'directory',
    'document',
    'application',
    'presentation',
    'none'
]);
/**
 * Build a selector string for storing in ref map
 */ function buildSelector(role, name) {
    if (name) {
        const escapedName = name.replace(/"/g, '\\"');
        return `getByRole('${role}', { name: "${escapedName}", exact: true })`;
    }
    return `getByRole('${role}')`;
}
async function getEnhancedSnapshot(page, options = {}) {
    resetRefs();
    const refs = {};
    // Get ARIA snapshot from Playwright
    const locator = options.selector ? page.locator(options.selector) : page.locator(':root');
    const ariaTree = await locator.ariaSnapshot();
    if (!ariaTree) {
        return {
            tree: '(empty)',
            refs: {}
        };
    }
    // Parse and enhance the ARIA tree
    const enhancedTree = processAriaTree(ariaTree, refs, options);
    return {
        tree: enhancedTree,
        refs
    };
}
function createRoleNameTracker() {
    const counts = new Map();
    const refsByKey = new Map();
    return {
        counts,
        refsByKey,
        getKey (role, name) {
            return `${role}:${name ?? ''}`;
        },
        getNextIndex (role, name) {
            const key = this.getKey(role, name);
            const current = counts.get(key) ?? 0;
            counts.set(key, current + 1);
            return current;
        },
        trackRef (role, name, ref) {
            const key = this.getKey(role, name);
            const refs = refsByKey.get(key) ?? [];
            refs.push(ref);
            refsByKey.set(key, refs);
        },
        getDuplicateKeys () {
            const duplicates = new Set();
            for (const [key, refs] of refsByKey){
                if (refs.length > 1) {
                    duplicates.add(key);
                }
            }
            return duplicates;
        }
    };
}
/**
 * Process ARIA snapshot: add refs and apply filters
 */ function processAriaTree(ariaTree, refs, options) {
    const lines = ariaTree.split('\n');
    const result = [];
    const tracker = createRoleNameTracker();
    // For interactive-only mode, we collect just interactive elements
    if (options.interactive) {
        for (const line of lines){
            const match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
            if (!match) continue;
            const [, , role, name, suffix] = match;
            const roleLower = role.toLowerCase();
            if (INTERACTIVE_ROLES.has(roleLower)) {
                const ref = nextRef();
                const nth = tracker.getNextIndex(roleLower, name);
                tracker.trackRef(roleLower, name, ref);
                refs[ref] = {
                    selector: buildSelector(roleLower, name),
                    role: roleLower,
                    name,
                    nth
                };
                let enhanced = `- ${role}`;
                if (name) enhanced += ` "${name}"`;
                enhanced += ` [ref=${ref}]`;
                // Only show nth in output if it's > 0 (for readability)
                if (nth > 0) enhanced += ` [nth=${nth}]`;
                if (suffix && suffix.includes('[')) enhanced += suffix;
                result.push(enhanced);
            }
        }
        // Post-process: remove nth from refs that don't have duplicates
        removeNthFromNonDuplicates(refs, tracker);
        return result.join('\n') || '(no interactive elements)';
    }
    // Normal processing with depth/compact filters
    for (const line of lines){
        const processed = processLine(line, refs, options, tracker);
        if (processed !== null) {
            result.push(processed);
        }
    }
    // Post-process: remove nth from refs that don't have duplicates
    removeNthFromNonDuplicates(refs, tracker);
    // If compact mode, remove empty structural elements
    if (options.compact) {
        return compactTree(result.join('\n'));
    }
    return result.join('\n');
}
/**
 * Remove nth from refs that ended up not having duplicates
 * This keeps single-element locators simple (no unnecessary .nth(0))
 */ function removeNthFromNonDuplicates(refs, tracker) {
    const duplicateKeys = tracker.getDuplicateKeys();
    for (const [ref, data] of Object.entries(refs)){
        const key = tracker.getKey(data.role, data.name);
        if (!duplicateKeys.has(key)) {
            // Not a duplicate, remove nth to keep locator simple
            delete refs[ref].nth;
        }
    }
}
/**
 * Get indentation level (number of spaces / 2)
 */ function getIndentLevel(line) {
    const match = line.match(/^(\s*)/);
    return match ? Math.floor(match[1].length / 2) : 0;
}
/**
 * Process a single line: add ref if needed, filter if requested
 */ function processLine(line, refs, options, tracker) {
    const depth = getIndentLevel(line);
    // Check max depth
    if (options.maxDepth !== undefined && depth > options.maxDepth) {
        return null;
    }
    // Match lines like:
    //   - button "Submit"
    //   - heading "Title" [level=1]
    //   - link "Click me":
    const match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
    if (!match) {
        // Metadata lines (like /url:) or text content
        if (options.interactive) {
            // In interactive mode, only keep metadata under interactive elements
            return null;
        }
        return line;
    }
    const [, prefix, role, name, suffix] = match;
    const roleLower = role.toLowerCase();
    // Skip metadata lines (like /url:)
    if (role.startsWith('/')) {
        return line;
    }
    const isInteractive = INTERACTIVE_ROLES.has(roleLower);
    const isContent = CONTENT_ROLES.has(roleLower);
    const isStructural = STRUCTURAL_ROLES.has(roleLower);
    // In interactive-only mode, filter non-interactive elements
    if (options.interactive && !isInteractive) {
        return null;
    }
    // In compact mode, skip unnamed structural elements
    if (options.compact && isStructural && !name) {
        return null;
    }
    // Add ref for interactive or named content elements
    const shouldHaveRef = isInteractive || isContent && name;
    if (shouldHaveRef) {
        const ref = nextRef();
        const nth = tracker.getNextIndex(roleLower, name);
        tracker.trackRef(roleLower, name, ref);
        refs[ref] = {
            selector: buildSelector(roleLower, name),
            role: roleLower,
            name,
            nth
        };
        // Build enhanced line with ref
        let enhanced = `${prefix}${role}`;
        if (name) enhanced += ` "${name}"`;
        enhanced += ` [ref=${ref}]`;
        // Only show nth in output if it's > 0 (for readability)
        if (nth > 0) enhanced += ` [nth=${nth}]`;
        if (suffix) enhanced += suffix;
        return enhanced;
    }
    return line;
}
/**
 * Remove empty structural branches in compact mode
 */ function compactTree(tree) {
    const lines = tree.split('\n');
    const result = [];
    // Simple pass: keep lines that have content or refs
    for(let i = 0; i < lines.length; i++){
        const line = lines[i];
        // Always keep lines with refs
        if (line.includes('[ref=')) {
            result.push(line);
            continue;
        }
        // Keep lines with text content (after :)
        if (line.includes(':') && !line.endsWith(':')) {
            result.push(line);
            continue;
        }
        // Check if this structural element has children with refs
        const currentIndent = getIndentLevel(line);
        let hasRelevantChildren = false;
        for(let j = i + 1; j < lines.length; j++){
            const childIndent = getIndentLevel(lines[j]);
            if (childIndent <= currentIndent) break;
            if (lines[j].includes('[ref=')) {
                hasRelevantChildren = true;
                break;
            }
        }
        if (hasRelevantChildren) {
            result.push(line);
        }
    }
    return result.join('\n');
}
function parseRef(arg) {
    if (arg.startsWith('@')) {
        return arg.slice(1);
    }
    if (arg.startsWith('ref=')) {
        return arg.slice(4);
    }
    if (/^e\d+$/.test(arg)) {
        return arg;
    }
    return null;
}
function getSnapshotStats(tree, refs) {
    const interactive = Object.values(refs).filter((r)=>INTERACTIVE_ROLES.has(r.role)).length;
    return {
        lines: tree.split('\n').length,
        chars: tree.length,
        tokens: Math.ceil(tree.length / 4),
        refs: Object.keys(refs).length,
        interactive
    };
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/browser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BrowserManager",
    ()=>BrowserManager
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__ = __turbopack_context__.i("[externals]/playwright-core [external] (playwright-core, esm_import, [project]/geodo-vercel-agent-browser/frontend/node_modules/playwright-core)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$snapshot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/snapshot.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
class BrowserManager {
    browser = null;
    cdpPort = null;
    isPersistentContext = false;
    contexts = [];
    pages = [];
    activePageIndex = 0;
    activeFrame = null;
    dialogHandler = null;
    trackedRequests = [];
    routes = new Map();
    consoleMessages = [];
    pageErrors = [];
    isRecordingHar = false;
    refMap = {};
    lastSnapshot = '';
    scopedHeaderRoutes = new Map();
    // CDP session for screencast and input injection
    cdpSession = null;
    screencastActive = false;
    screencastSessionId = 0;
    frameCallback = null;
    screencastFrameHandler = null;
    // Video recording (Playwright native)
    recordingContext = null;
    recordingPage = null;
    recordingOutputPath = '';
    recordingTempDir = '';
    /**
   * Check if browser is launched
   */ isLaunched() {
        return this.browser !== null || this.isPersistentContext;
    }
    /**
   * Get enhanced snapshot with refs and cache the ref map
   */ async getSnapshot(options) {
        const page = this.getPage();
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$snapshot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEnhancedSnapshot"])(page, options);
        this.refMap = snapshot.refs;
        this.lastSnapshot = snapshot.tree;
        return snapshot;
    }
    /**
   * Get the cached ref map from last snapshot
   */ getRefMap() {
        return this.refMap;
    }
    /**
   * Get a locator from a ref (e.g., "e1", "@e1", "ref=e1")
   * Returns null if ref doesn't exist or is invalid
   */ getLocatorFromRef(refArg) {
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$snapshot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRef"])(refArg);
        if (!ref) return null;
        const refData = this.refMap[ref];
        if (!refData) return null;
        const page = this.getPage();
        // Build locator with exact: true to avoid substring matches
        let locator;
        if (refData.name) {
            locator = page.getByRole(refData.role, {
                name: refData.name,
                exact: true
            });
        } else {
            locator = page.getByRole(refData.role);
        }
        // If an nth index is stored (for disambiguation), use it
        if (refData.nth !== undefined) {
            locator = locator.nth(refData.nth);
        }
        return locator;
    }
    /**
   * Check if a selector looks like a ref
   */ isRef(selector) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$snapshot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRef"])(selector) !== null;
    }
    /**
   * Get locator - supports both refs and regular selectors
   */ getLocator(selectorOrRef) {
        // Check if it's a ref first
        const locator = this.getLocatorFromRef(selectorOrRef);
        if (locator) return locator;
        // Otherwise treat as regular selector
        const page = this.getPage();
        return page.locator(selectorOrRef);
    }
    /**
   * Get the current active page, throws if not launched
   */ getPage() {
        if (this.pages.length === 0) {
            throw new Error('Browser not launched. Call launch first.');
        }
        return this.pages[this.activePageIndex];
    }
    /**
   * Get the current frame (or page's main frame if no frame is selected)
   */ getFrame() {
        if (this.activeFrame) {
            return this.activeFrame;
        }
        return this.getPage().mainFrame();
    }
    /**
   * Switch to a frame by selector, name, or URL
   */ async switchToFrame(options) {
        const page = this.getPage();
        if (options.selector) {
            const frameElement = await page.$(options.selector);
            if (!frameElement) {
                throw new Error(`Frame not found: ${options.selector}`);
            }
            const frame = await frameElement.contentFrame();
            if (!frame) {
                throw new Error(`Element is not a frame: ${options.selector}`);
            }
            this.activeFrame = frame;
        } else if (options.name) {
            const frame = page.frame({
                name: options.name
            });
            if (!frame) {
                throw new Error(`Frame not found with name: ${options.name}`);
            }
            this.activeFrame = frame;
        } else if (options.url) {
            const frame = page.frame({
                url: options.url
            });
            if (!frame) {
                throw new Error(`Frame not found with URL: ${options.url}`);
            }
            this.activeFrame = frame;
        }
    }
    /**
   * Switch back to main frame
   */ switchToMainFrame() {
        this.activeFrame = null;
    }
    /**
   * Set up dialog handler
   */ setDialogHandler(response, promptText) {
        const page = this.getPage();
        // Remove existing handler if any
        if (this.dialogHandler) {
            page.removeListener('dialog', this.dialogHandler);
        }
        this.dialogHandler = async (dialog)=>{
            if (response === 'accept') {
                await dialog.accept(promptText);
            } else {
                await dialog.dismiss();
            }
        };
        page.on('dialog', this.dialogHandler);
    }
    /**
   * Clear dialog handler
   */ clearDialogHandler() {
        if (this.dialogHandler) {
            const page = this.getPage();
            page.removeListener('dialog', this.dialogHandler);
            this.dialogHandler = null;
        }
    }
    /**
   * Start tracking requests
   */ startRequestTracking() {
        const page = this.getPage();
        page.on('request', (request)=>{
            this.trackedRequests.push({
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                timestamp: Date.now(),
                resourceType: request.resourceType()
            });
        });
    }
    /**
   * Get tracked requests
   */ getRequests(filter) {
        if (filter) {
            return this.trackedRequests.filter((r)=>r.url.includes(filter));
        }
        return this.trackedRequests;
    }
    /**
   * Clear tracked requests
   */ clearRequests() {
        this.trackedRequests = [];
    }
    /**
   * Add a route to intercept requests
   */ async addRoute(url, options) {
        const page = this.getPage();
        const handler = async (route)=>{
            if (options.abort) {
                await route.abort();
            } else if (options.response) {
                await route.fulfill({
                    status: options.response.status ?? 200,
                    body: options.response.body ?? '',
                    contentType: options.response.contentType ?? 'text/plain',
                    headers: options.response.headers
                });
            } else {
                await route.continue();
            }
        };
        this.routes.set(url, handler);
        await page.route(url, handler);
    }
    /**
   * Remove a route
   */ async removeRoute(url) {
        const page = this.getPage();
        if (url) {
            const handler = this.routes.get(url);
            if (handler) {
                await page.unroute(url, handler);
                this.routes.delete(url);
            }
        } else {
            // Remove all routes
            for (const [routeUrl, handler] of this.routes){
                await page.unroute(routeUrl, handler);
            }
            this.routes.clear();
        }
    }
    /**
   * Set geolocation
   */ async setGeolocation(latitude, longitude, accuracy) {
        const context = this.contexts[0];
        if (context) {
            await context.setGeolocation({
                latitude,
                longitude,
                accuracy
            });
        }
    }
    /**
   * Set permissions
   */ async setPermissions(permissions, grant) {
        const context = this.contexts[0];
        if (context) {
            if (grant) {
                await context.grantPermissions(permissions);
            } else {
                await context.clearPermissions();
            }
        }
    }
    /**
   * Set viewport
   */ async setViewport(width, height) {
        const page = this.getPage();
        await page.setViewportSize({
            width,
            height
        });
    }
    /**
   * Get device descriptor
   */ getDevice(deviceName) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["devices"][deviceName];
    }
    /**
   * List available devices
   */ listDevices() {
        return Object.keys(__TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["devices"]);
    }
    /**
   * Start console message tracking
   */ startConsoleTracking() {
        const page = this.getPage();
        page.on('console', (msg)=>{
            this.consoleMessages.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: Date.now()
            });
        });
    }
    /**
   * Get console messages
   */ getConsoleMessages() {
        return this.consoleMessages;
    }
    /**
   * Clear console messages
   */ clearConsoleMessages() {
        this.consoleMessages = [];
    }
    /**
   * Start error tracking
   */ startErrorTracking() {
        const page = this.getPage();
        page.on('pageerror', (error)=>{
            this.pageErrors.push({
                message: error.message,
                timestamp: Date.now()
            });
        });
    }
    /**
   * Get page errors
   */ getPageErrors() {
        return this.pageErrors;
    }
    /**
   * Clear page errors
   */ clearPageErrors() {
        this.pageErrors = [];
    }
    /**
   * Start HAR recording
   */ async startHarRecording() {
        // HAR is started at context level, flag for tracking
        this.isRecordingHar = true;
    }
    /**
   * Check if HAR recording
   */ isHarRecording() {
        return this.isRecordingHar;
    }
    /**
   * Set offline mode
   */ async setOffline(offline) {
        const context = this.contexts[0];
        if (context) {
            await context.setOffline(offline);
        }
    }
    /**
   * Set extra HTTP headers (global - all requests)
   */ async setExtraHeaders(headers) {
        const context = this.contexts[0];
        if (context) {
            await context.setExtraHTTPHeaders(headers);
        }
    }
    /**
   * Set scoped HTTP headers (only for requests matching the origin)
   * Uses route interception to add headers only to matching requests
   */ async setScopedHeaders(origin, headers) {
        const page = this.getPage();
        // Build URL pattern from origin (e.g., "api.example.com" -> "**://api.example.com/**")
        // Handle both full URLs and just hostnames
        let urlPattern;
        try {
            const url = new URL(origin.startsWith('http') ? origin : `https://${origin}`);
            // Match any protocol, the host, and any path
            urlPattern = `**://${url.host}/**`;
        } catch  {
            // If parsing fails, treat as hostname pattern
            urlPattern = `**://${origin}/**`;
        }
        // Remove existing route for this origin if any
        const existingHandler = this.scopedHeaderRoutes.get(urlPattern);
        if (existingHandler) {
            await page.unroute(urlPattern, existingHandler);
        }
        // Create handler that adds headers to matching requests
        const handler = async (route)=>{
            const requestHeaders = route.request().headers();
            await route.continue({
                headers: {
                    ...requestHeaders,
                    ...headers
                }
            });
        };
        // Store and register the route
        this.scopedHeaderRoutes.set(urlPattern, handler);
        await page.route(urlPattern, handler);
    }
    /**
   * Clear scoped headers for an origin (or all if no origin specified)
   */ async clearScopedHeaders(origin) {
        const page = this.getPage();
        if (origin) {
            let urlPattern;
            try {
                const url = new URL(origin.startsWith('http') ? origin : `https://${origin}`);
                urlPattern = `**://${url.host}/**`;
            } catch  {
                urlPattern = `**://${origin}/**`;
            }
            const handler = this.scopedHeaderRoutes.get(urlPattern);
            if (handler) {
                await page.unroute(urlPattern, handler);
                this.scopedHeaderRoutes.delete(urlPattern);
            }
        } else {
            // Clear all scoped header routes
            for (const [pattern, handler] of this.scopedHeaderRoutes){
                await page.unroute(pattern, handler);
            }
            this.scopedHeaderRoutes.clear();
        }
    }
    /**
   * Start tracing
   */ async startTracing(options) {
        const context = this.contexts[0];
        if (context) {
            await context.tracing.start({
                screenshots: options.screenshots ?? true,
                snapshots: options.snapshots ?? true
            });
        }
    }
    /**
   * Stop tracing and save
   */ async stopTracing(path) {
        const context = this.contexts[0];
        if (context) {
            await context.tracing.stop({
                path
            });
        }
    }
    /**
   * Save storage state (cookies, localStorage, etc.)
   */ async saveStorageState(path) {
        const context = this.contexts[0];
        if (context) {
            await context.storageState({
                path
            });
        }
    }
    /**
   * Get all pages
   */ getPages() {
        return this.pages;
    }
    /**
   * Get current page index
   */ getActiveIndex() {
        return this.activePageIndex;
    }
    /**
   * Get the current browser instance
   */ getBrowser() {
        return this.browser;
    }
    /**
   * Check if an existing CDP connection is still alive
   * by verifying we can access browser contexts and that at least one has pages
   */ isCdpConnectionAlive() {
        if (!this.browser) return false;
        try {
            const contexts = this.browser.contexts();
            if (contexts.length === 0) return false;
            return contexts.some((context)=>context.pages().length > 0);
        } catch  {
            return false;
        }
    }
    /**
   * Check if CDP connection needs to be re-established
   */ needsCdpReconnect(cdpPort) {
        if (!this.browser?.isConnected()) return true;
        if (this.cdpPort !== cdpPort) return true;
        if (!this.isCdpConnectionAlive()) return true;
        return false;
    }
    /**
   * Launch the browser with the specified options
   * If already launched, this is a no-op (browser stays open)
   */ async launch(options) {
        const cdpPort = options.cdpPort;
        const hasExtensions = !!options.extensions?.length;
        if (hasExtensions && cdpPort) {
            throw new Error('Extensions cannot be used with CDP connection');
        }
        if (this.isLaunched()) {
            const needsRelaunch = !cdpPort && this.cdpPort !== null || !!cdpPort && this.needsCdpReconnect(cdpPort);
            if (needsRelaunch) {
                await this.close();
            } else {
                return;
            }
        }
        if (cdpPort) {
            await this.connectViaCDP(cdpPort);
            return;
        }
        const browserType = options.browser ?? 'chromium';
        if (hasExtensions && browserType !== 'chromium') {
            throw new Error('Extensions are only supported in Chromium');
        }
        const launcher = browserType === 'firefox' ? __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["firefox"] : browserType === 'webkit' ? __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["webkit"] : __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["chromium"];
        const viewport = options.viewport ?? {
            width: 1280,
            height: 720
        };
        let context;
        if (hasExtensions) {
            const extPaths = options.extensions.join(',');
            const session = process.env.AGENT_BROWSER_SESSION || 'default';
            context = await launcher.launchPersistentContext(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].tmpdir(), `agent-browser-ext-${session}`), {
                headless: false,
                executablePath: options.executablePath,
                args: [
                    `--disable-extensions-except=${extPaths}`,
                    `--load-extension=${extPaths}`
                ],
                viewport,
                extraHTTPHeaders: options.headers,
                ...options.proxy && {
                    proxy: options.proxy
                }
            });
            this.isPersistentContext = true;
        } else {
            this.browser = await launcher.launch({
                headless: options.headless ?? true,
                executablePath: options.executablePath
            });
            this.cdpPort = null;
            context = await this.browser.newContext({
                viewport,
                extraHTTPHeaders: options.headers,
                ...options.proxy && {
                    proxy: options.proxy
                },
                storageState: options.storageStatePath
            });
        }
        context.setDefaultTimeout(60000);
        this.contexts.push(context);
        const page = context.pages()[0] ?? await context.newPage();
        this.pages.push(page);
        this.activePageIndex = 0;
        this.setupPageTracking(page);
    }
    /**
   * Connect to a running browser via CDP (Chrome DevTools Protocol)
   */ async connectViaCDP(cdpPort) {
        if (!cdpPort) {
            throw new Error('cdpPort is required for CDP connection');
        }
        const browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$playwright$2d$core__$5b$external$5d$__$28$playwright$2d$core$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$playwright$2d$core$29$__["chromium"].connectOverCDP(`http://localhost:${cdpPort}`).catch(()=>{
            throw new Error(`Failed to connect via CDP on port ${cdpPort}. ` + `Make sure the app is running with --remote-debugging-port=${cdpPort}`);
        });
        // Validate and set up state, cleaning up browser connection if anything fails
        try {
            const contexts = browser.contexts();
            if (contexts.length === 0) {
                throw new Error('No browser context found. Make sure the app has an open window.');
            }
            // Filter out pages with empty URLs, which can cause Playwright to hang
            const allPages = contexts.flatMap((context)=>context.pages()).filter((page)=>page.url());
            if (allPages.length === 0) {
                throw new Error('No page found. Make sure the app has loaded content.');
            }
            // All validation passed - commit state
            this.browser = browser;
            this.cdpPort = cdpPort;
            for (const context of contexts){
                this.contexts.push(context);
                this.setupContextTracking(context);
            }
            for (const page of allPages){
                this.pages.push(page);
                this.setupPageTracking(page);
            }
            this.activePageIndex = 0;
        } catch (error) {
            // Clean up browser connection if validation or setup failed
            await browser.close().catch(()=>{});
            throw error;
        }
    }
    /**
   * Set up console, error, and close tracking for a page
   */ setupPageTracking(page) {
        page.on('console', (msg)=>{
            this.consoleMessages.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: Date.now()
            });
        });
        page.on('pageerror', (error)=>{
            this.pageErrors.push({
                message: error.message,
                timestamp: Date.now()
            });
        });
        page.on('close', ()=>{
            const index = this.pages.indexOf(page);
            if (index !== -1) {
                this.pages.splice(index, 1);
                if (this.activePageIndex >= this.pages.length) {
                    this.activePageIndex = Math.max(0, this.pages.length - 1);
                }
            }
        });
    }
    /**
   * Set up tracking for new pages in a context (for CDP connections)
   */ setupContextTracking(context) {
        context.on('page', (page)=>{
            this.pages.push(page);
            this.setupPageTracking(page);
        });
    }
    /**
   * Create a new tab in the current context
   */ async newTab() {
        if (!this.browser || this.contexts.length === 0) {
            throw new Error('Browser not launched');
        }
        // Invalidate CDP session since we're switching to a new page
        await this.invalidateCDPSession();
        const context = this.contexts[0]; // Use first context for tabs
        const page = await context.newPage();
        this.pages.push(page);
        this.activePageIndex = this.pages.length - 1;
        // Set up tracking for the new page
        this.setupPageTracking(page);
        return {
            index: this.activePageIndex,
            total: this.pages.length
        };
    }
    /**
   * Create a new window (new context)
   */ async newWindow(viewport) {
        if (!this.browser) {
            throw new Error('Browser not launched');
        }
        const context = await this.browser.newContext({
            viewport: viewport ?? {
                width: 1280,
                height: 720
            }
        });
        context.setDefaultTimeout(60000);
        this.contexts.push(context);
        const page = await context.newPage();
        this.pages.push(page);
        this.activePageIndex = this.pages.length - 1;
        // Set up tracking for the new page
        this.setupPageTracking(page);
        return {
            index: this.activePageIndex,
            total: this.pages.length
        };
    }
    /**
   * Invalidate the current CDP session (must be called before switching pages)
   * This ensures screencast and input injection work correctly after tab switch
   */ async invalidateCDPSession() {
        // Stop screencast if active (it's tied to the current page's CDP session)
        if (this.screencastActive) {
            await this.stopScreencast();
        }
        // Detach and clear the CDP session
        if (this.cdpSession) {
            await this.cdpSession.detach().catch(()=>{});
            this.cdpSession = null;
        }
    }
    /**
   * Switch to a specific tab/page by index
   */ async switchTo(index) {
        if (index < 0 || index >= this.pages.length) {
            throw new Error(`Invalid tab index: ${index}. Available: 0-${this.pages.length - 1}`);
        }
        // Invalidate CDP session before switching (it's page-specific)
        if (index !== this.activePageIndex) {
            await this.invalidateCDPSession();
        }
        this.activePageIndex = index;
        const page = this.pages[index];
        return {
            index: this.activePageIndex,
            url: page.url(),
            title: ''
        };
    }
    /**
   * Close a specific tab/page
   */ async closeTab(index) {
        const targetIndex = index ?? this.activePageIndex;
        if (targetIndex < 0 || targetIndex >= this.pages.length) {
            throw new Error(`Invalid tab index: ${targetIndex}`);
        }
        if (this.pages.length === 1) {
            throw new Error('Cannot close the last tab. Use "close" to close the browser.');
        }
        // If closing the active tab, invalidate CDP session first
        if (targetIndex === this.activePageIndex) {
            await this.invalidateCDPSession();
        }
        const page = this.pages[targetIndex];
        await page.close();
        this.pages.splice(targetIndex, 1);
        // Adjust active index if needed
        if (this.activePageIndex >= this.pages.length) {
            this.activePageIndex = this.pages.length - 1;
        } else if (this.activePageIndex > targetIndex) {
            this.activePageIndex--;
        }
        return {
            closed: targetIndex,
            remaining: this.pages.length
        };
    }
    /**
   * List all tabs with their info
   */ async listTabs() {
        const tabs = await Promise.all(this.pages.map(async (page, index)=>({
                index,
                url: page.url(),
                title: await page.title().catch(()=>''),
                active: index === this.activePageIndex
            })));
        return tabs;
    }
    /**
   * Get or create a CDP session for the current page
   * Only works with Chromium-based browsers
   */ async getCDPSession() {
        if (this.cdpSession) {
            return this.cdpSession;
        }
        const page = this.getPage();
        const context = page.context();
        // Create a new CDP session attached to the page
        this.cdpSession = await context.newCDPSession(page);
        return this.cdpSession;
    }
    /**
   * Check if screencast is currently active
   */ isScreencasting() {
        return this.screencastActive;
    }
    /**
   * Start screencast - streams viewport frames via CDP
   * @param callback Function called for each frame
   * @param options Screencast options
   */ async startScreencast(callback, options) {
        if (this.screencastActive) {
            throw new Error('Screencast already active');
        }
        const cdp = await this.getCDPSession();
        this.frameCallback = callback;
        this.screencastActive = true;
        // Create and store the frame handler so we can remove it later
        this.screencastFrameHandler = async (params)=>{
            const frame = {
                data: params.data,
                metadata: params.metadata,
                sessionId: params.sessionId
            };
            // Acknowledge the frame to receive the next one
            await cdp.send('Page.screencastFrameAck', {
                sessionId: params.sessionId
            });
            // Call the callback with the frame
            if (this.frameCallback) {
                this.frameCallback(frame);
            }
        };
        // Listen for screencast frames
        cdp.on('Page.screencastFrame', this.screencastFrameHandler);
        // Start the screencast
        await cdp.send('Page.startScreencast', {
            format: options?.format ?? 'jpeg',
            quality: options?.quality ?? 80,
            maxWidth: options?.maxWidth ?? 1280,
            maxHeight: options?.maxHeight ?? 720,
            everyNthFrame: options?.everyNthFrame ?? 1
        });
    }
    /**
   * Stop screencast
   */ async stopScreencast() {
        if (!this.screencastActive) {
            return;
        }
        try {
            const cdp = await this.getCDPSession();
            await cdp.send('Page.stopScreencast');
            // Remove the event listener to prevent accumulation
            if (this.screencastFrameHandler) {
                cdp.off('Page.screencastFrame', this.screencastFrameHandler);
            }
        } catch  {
        // Ignore errors when stopping
        }
        this.screencastActive = false;
        this.frameCallback = null;
        this.screencastFrameHandler = null;
    }
    /**
   * Inject a mouse event via CDP
   */ async injectMouseEvent(params) {
        const cdp = await this.getCDPSession();
        const cdpButton = params.button === 'left' ? 'left' : params.button === 'right' ? 'right' : params.button === 'middle' ? 'middle' : 'none';
        await cdp.send('Input.dispatchMouseEvent', {
            type: params.type,
            x: params.x,
            y: params.y,
            button: cdpButton,
            clickCount: params.clickCount ?? 1,
            deltaX: params.deltaX ?? 0,
            deltaY: params.deltaY ?? 0,
            modifiers: params.modifiers ?? 0
        });
    }
    /**
   * Inject a keyboard event via CDP
   */ async injectKeyboardEvent(params) {
        const cdp = await this.getCDPSession();
        await cdp.send('Input.dispatchKeyEvent', {
            type: params.type,
            key: params.key,
            code: params.code,
            text: params.text,
            modifiers: params.modifiers ?? 0
        });
    }
    /**
   * Inject touch event via CDP (for mobile emulation)
   */ async injectTouchEvent(params) {
        const cdp = await this.getCDPSession();
        await cdp.send('Input.dispatchTouchEvent', {
            type: params.type,
            touchPoints: params.touchPoints.map((tp, i)=>({
                    x: tp.x,
                    y: tp.y,
                    id: tp.id ?? i
                })),
            modifiers: params.modifiers ?? 0
        });
    }
    /**
   * Check if video recording is currently active
   */ isRecording() {
        return this.recordingContext !== null;
    }
    /**
   * Start recording to a video file using Playwright's native video recording.
   * Creates a fresh browser context with video recording enabled.
   * Automatically captures current URL and transfers cookies/storage if no URL provided.
   *
   * @param outputPath - Path to the output video file (will be .webm)
   * @param url - Optional URL to navigate to (defaults to current page URL)
   */ async startRecording(outputPath, url) {
        if (this.recordingContext) {
            throw new Error("Recording already in progress. Run 'record stop' first, or use 'record restart' to stop and start a new recording.");
        }
        if (!this.browser) {
            throw new Error('Browser not launched. Call launch first.');
        }
        // Check if output file already exists
        if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])(outputPath)) {
            throw new Error(`Output file already exists: ${outputPath}`);
        }
        // Validate output path is .webm (Playwright native format)
        if (!outputPath.endsWith('.webm')) {
            throw new Error('Playwright native recording only supports WebM format. Please use a .webm extension.');
        }
        // Auto-capture current URL if none provided
        const currentPage = this.pages.length > 0 ? this.pages[this.activePageIndex] : null;
        const currentContext = this.contexts.length > 0 ? this.contexts[0] : null;
        if (!url && currentPage) {
            const currentUrl = currentPage.url();
            if (currentUrl && currentUrl !== 'about:blank') {
                url = currentUrl;
            }
        }
        // Capture state from current context (cookies + storage)
        let storageState;
        if (currentContext) {
            try {
                storageState = await currentContext.storageState();
            } catch  {
            // Ignore errors - context might be closed or invalid
            }
        }
        // Create a temp directory for video recording
        const session = process.env.AGENT_BROWSER_SESSION || 'default';
        this.recordingTempDir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].tmpdir(), `agent-browser-recording-${session}-${Date.now()}`);
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["mkdirSync"])(this.recordingTempDir, {
            recursive: true
        });
        this.recordingOutputPath = outputPath;
        // Create a new context with video recording enabled and restored state
        const viewport = {
            width: 1280,
            height: 720
        };
        this.recordingContext = await this.browser.newContext({
            viewport,
            recordVideo: {
                dir: this.recordingTempDir,
                size: viewport
            },
            storageState
        });
        this.recordingContext.setDefaultTimeout(10000);
        // Create a page in the recording context
        this.recordingPage = await this.recordingContext.newPage();
        // Add the recording context and page to our managed lists
        this.contexts.push(this.recordingContext);
        this.pages.push(this.recordingPage);
        this.activePageIndex = this.pages.length - 1;
        // Set up page tracking
        this.setupPageTracking(this.recordingPage);
        // Invalidate CDP session since we switched pages
        await this.invalidateCDPSession();
        // Navigate to URL if provided or captured
        if (url) {
            await this.recordingPage.goto(url, {
                waitUntil: 'load'
            });
        }
    }
    /**
   * Stop recording and save the video file
   * @returns Recording result with path
   */ async stopRecording() {
        if (!this.recordingContext || !this.recordingPage) {
            return {
                path: '',
                frames: 0,
                error: 'No recording in progress'
            };
        }
        const outputPath = this.recordingOutputPath;
        try {
            // Get the video object before closing the page
            const video = this.recordingPage.video();
            // Remove recording page/context from our managed lists before closing
            const pageIndex = this.pages.indexOf(this.recordingPage);
            if (pageIndex !== -1) {
                this.pages.splice(pageIndex, 1);
            }
            const contextIndex = this.contexts.indexOf(this.recordingContext);
            if (contextIndex !== -1) {
                this.contexts.splice(contextIndex, 1);
            }
            // Close the page to finalize the video
            await this.recordingPage.close();
            // Save the video to the desired output path
            if (video) {
                await video.saveAs(outputPath);
            }
            // Clean up temp directory
            if (this.recordingTempDir) {
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["rmSync"])(this.recordingTempDir, {
                    recursive: true,
                    force: true
                });
            }
            // Close the recording context
            await this.recordingContext.close();
            // Reset recording state
            this.recordingContext = null;
            this.recordingPage = null;
            this.recordingOutputPath = '';
            this.recordingTempDir = '';
            // Adjust active page index
            if (this.pages.length > 0) {
                this.activePageIndex = Math.min(this.activePageIndex, this.pages.length - 1);
            } else {
                this.activePageIndex = 0;
            }
            // Invalidate CDP session since we may have switched pages
            await this.invalidateCDPSession();
            return {
                path: outputPath,
                frames: 0
            }; // Playwright doesn't expose frame count
        } catch (error) {
            // Clean up temp directory on error
            if (this.recordingTempDir) {
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["rmSync"])(this.recordingTempDir, {
                    recursive: true,
                    force: true
                });
            }
            // Reset state on error
            this.recordingContext = null;
            this.recordingPage = null;
            this.recordingOutputPath = '';
            this.recordingTempDir = '';
            const message = error instanceof Error ? error.message : String(error);
            return {
                path: outputPath,
                frames: 0,
                error: message
            };
        }
    }
    /**
   * Restart recording - stops current recording (if any) and starts a new one.
   * Convenience method that combines stopRecording and startRecording.
   *
   * @param outputPath - Path to the output video file (must be .webm)
   * @param url - Optional URL to navigate to (defaults to current page URL)
   * @returns Result from stopping the previous recording (if any)
   */ async restartRecording(outputPath, url) {
        let previousPath;
        let stopped = false;
        // Stop current recording if active
        if (this.recordingContext) {
            const result = await this.stopRecording();
            previousPath = result.path;
            stopped = true;
        }
        // Start new recording
        await this.startRecording(outputPath, url);
        return {
            previousPath,
            stopped
        };
    }
    /**
   * Close the browser and clean up
   */ async close() {
        // Stop recording if active (saves video)
        if (this.recordingContext) {
            await this.stopRecording();
        }
        // Stop screencast if active
        if (this.screencastActive) {
            await this.stopScreencast();
        }
        // Clean up CDP session
        if (this.cdpSession) {
            await this.cdpSession.detach().catch(()=>{});
            this.cdpSession = null;
        }
        // CDP: only disconnect, don't close external app's pages
        if (this.cdpPort !== null) {
            if (this.browser) {
                await this.browser.close().catch(()=>{});
                this.browser = null;
            }
        } else {
            // Regular browser: close everything
            for (const page of this.pages){
                await page.close().catch(()=>{});
            }
            for (const context of this.contexts){
                await context.close().catch(()=>{});
            }
            if (this.browser) {
                await this.browser.close().catch(()=>{});
                this.browser = null;
            }
        }
        this.pages = [];
        this.contexts = [];
        this.cdpPort = null;
        this.isPersistentContext = false;
        this.activePageIndex = 0;
        this.refMap = {};
        this.lastSnapshot = '';
        this.frameCallback = null;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-api/serverless-browser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "launchServerlessBrowser",
    ()=>launchServerlessBrowser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$sparticuz$2f$chromium$2d$min__$5b$external$5d$__$2840$sparticuz$2f$chromium$2d$min$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$sparticuz$2f$chromium$2d$min$29$__ = __turbopack_context__.i("[externals]/@sparticuz/chromium-min [external] (@sparticuz/chromium-min, esm_import, [project]/geodo-vercel-agent-browser/frontend/node_modules/@sparticuz/chromium-min)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/browser.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$sparticuz$2f$chromium$2d$min__$5b$external$5d$__$2840$sparticuz$2f$chromium$2d$min$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$sparticuz$2f$chromium$2d$min$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$sparticuz$2f$chromium$2d$min__$5b$external$5d$__$2840$sparticuz$2f$chromium$2d$min$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$sparticuz$2f$chromium$2d$min$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function launchServerlessBrowser() {
    const isVercel = process.env.VERCEL === '1' || ("TURBOPACK compile-time value", "development") === 'production';
    const browser = new __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrowserManager"]();
    const executablePath = isVercel ? await __TURBOPACK__imported__module__$5b$externals$5d2f40$sparticuz$2f$chromium$2d$min__$5b$external$5d$__$2840$sparticuz$2f$chromium$2d$min$2c$__esm_import$2c$__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$sparticuz$2f$chromium$2d$min$29$__["default"].executablePath('https://github.com/sparticuz/chromium/releases/download/v132.0.0/chromium-v132.0.0-pack.tar') : undefined;
    await browser.launch({
        id: 'serverless',
        action: 'launch',
        executablePath,
        headless: true,
        viewport: {
            width: 1280,
            height: 720
        }
    });
    return browser;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/services/linkedin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinkedInAgentService",
    ()=>LinkedInAgentService
]);
class LinkedInAgentService {
    browser;
    constructor(browser){
        this.browser = browser;
    }
    async wait(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    async login() {
        const page = this.browser.getPage();
        const url = page.url();
        if (url.includes('feed') || url.includes('mynetwork')) {
            return true;
        }
        return false;
    }
    async searchPeople(searchTerm) {
        const page = this.browser.getPage();
        const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
        await page.goto(searchUrl);
        await this.wait(5000);
        for(let i = 0; i < 3; i++){
            await page.evaluate(()=>window.scrollBy(0, 1000));
            await this.wait(2000);
        }
        const snapshot = await this.browser.getSnapshot({
            interactive: true
        });
        return this.extractConnectButtons(snapshot);
    }
    extractConnectButtons(snapshot) {
        const lines = snapshot.tree.split('\n');
        const connectButtons = [];
        let currentPerson = null;
        for (const line of lines){
            if (line.includes('link') && !line.includes('Connect') && !line.includes('Message')) {
                const match = line.match(/link "([^"]+)"/);
                if (match && match[1].length > 5 && !match[1].includes('LinkedIn')) {
                    currentPerson = {
                        name: match[1]
                    };
                }
            }
            if (line.includes('button "Connect"') && line.includes('[ref=')) {
                const refMatch = line.match(/\[ref=(\w+)\]/);
                if (refMatch && currentPerson) {
                    connectButtons.push({
                        ...currentPerson,
                        connectRef: '@' + refMatch[1]
                    });
                    currentPerson = null;
                }
            }
        }
        return connectButtons;
    }
    async sendConnectRequest(connectRef) {
        const locator = this.browser.getLocator(connectRef);
        await locator.click();
        await this.wait(2000);
        const snapshot = await this.browser.getSnapshot({
            interactive: true
        });
        if (snapshot.tree.includes('Send now')) {
            const lines = snapshot.tree.split('\n');
            for (const line of lines){
                if ((line.includes('Send now') || line.includes('Send without')) && line.includes('[ref=')) {
                    const refMatch = line.match(/\[ref=(\w+)\]/);
                    if (refMatch) {
                        const sendBtn = this.browser.getLocator('@' + refMatch[1]);
                        await sendBtn.click();
                        break;
                    }
                }
            }
        }
        return {
            success: true
        };
    }
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/app/api/agent/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-api/linkedin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$serverless$2d$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-api/serverless-browser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$services$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/agent-browser/services/linkedin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$serverless$2d$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$serverless$2d$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const maxDuration = 60;
async function runProgrammaticAction(action, params) {
    const browser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$serverless$2d$browser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["launchServerlessBrowser"])();
    try {
        const page = browser.getPage();
        const context = page.context();
        // const cookies = await LinkedInCookieStore.load();
        // if (cookies) {
        //   await context.addCookies(cookies);
        // }
        const service = new __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$browser$2f$services$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentService"](browser);
        const loggedIn = await service.login();
        if (!loggedIn) {
            return {
                success: false,
                error: 'Session expired — re-login required',
                requiresLogin: true
            };
        }
        let result;
        switch(action){
            case 'search':
                const people = await service.searchPeople(params.searchTerm);
                if (people.length > 0) {
                    await service.sendConnectRequest(people[0].profileUrl);
                }
                result = {
                    success: true,
                    data: people
                };
                break;
            case 'visit':
            case 'message':
                result = {
                    success: false,
                    error: 'Action not implemented programmatically yet'
                };
                break;
            default:
                result = {
                    success: false,
                    error: 'Action not implemented programmatically yet'
                };
        }
        // const updatedCookies = await context.cookies();
        // await LinkedInCookieStore.save(updatedCookies);
        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    } finally{
        await browser.close();
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const checkAuth = searchParams.get('checkAuth');
    if (checkAuth === 'true') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentAPI"].checkAuthStatus());
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentAPI"].getAnalytics();
    return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
}
async function POST(request) {
    const body = await request.json();
    const { action, params } = body;
    const isServerless = process.env.VERCEL === '1' || process.env.USE_PROGRAMMATIC === 'true';
    if (isServerless) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await runProgrammaticAction(action, params));
    }
    switch(action){
        case 'search':
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentAPI"].searchPeople(params.searchTerm));
        case 'visit':
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentAPI"].visitProfiles(params.searchTerm, params.max));
        case 'message':
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$agent$2d$api$2f$linkedin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LinkedInAgentAPI"].sendMessages(params.message, params.filter, params.max));
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Invalid action'
            }, {
                status: 400
            });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d7c31060._.js.map