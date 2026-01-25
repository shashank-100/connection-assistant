(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterTabs",
    ()=>FilterTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
;
;
const tabs = [
    {
        id: 'all',
        label: 'All'
    },
    {
        id: 'unread',
        label: 'Unread'
    },
    {
        id: 'sent-by-member',
        label: 'Last message sent by member'
    },
    {
        id: 'sent-by-me',
        label: 'Last message sent by me'
    },
    {
        id: 'never-answered',
        label: 'Never answered'
    }
];
function FilterTabs(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "b98b6dda4d7fb7bdfa0bc8c15ef2d13309a37a86d1db5a47268bf9232f515e12") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b98b6dda4d7fb7bdfa0bc8c15ef2d13309a37a86d1db5a47268bf9232f515e12";
    }
    const { activeTab, onTabChange, counts } = t0;
    let t1;
    if ($[1] !== activeTab || $[2] !== counts || $[3] !== onTabChange) {
        t1 = tabs.map({
            "FilterTabs[tabs.map()]": (tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "FilterTabs[tabs.map() > <button>.onClick]": ()=>onTabChange(tab.id)
                    }["FilterTabs[tabs.map() > <button>.onClick]"],
                    className: `
            px-4 py-3 text-sm font-medium transition-colors relative
            ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
          `,
                    children: [
                        tab.label,
                        counts[tab.id] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-1.5 text-xs text-muted-foreground",
                            children: [
                                "(",
                                counts[tab.id],
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx",
                            lineNumber: 48,
                            columnNumber: 48
                        }, this),
                        activeTab === tab.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        }, void 0, false, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx",
                            lineNumber: 48,
                            columnNumber: 154
                        }, this)
                    ]
                }, tab.id, true, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx",
                    lineNumber: 43,
                    columnNumber: 40
                }, this)
        }["FilterTabs[tabs.map()]"]);
        $[1] = activeTab;
        $[2] = counts;
        $[3] = onTabChange;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    let t2;
    if ($[5] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1 border-b border-border",
            children: t1
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx",
            lineNumber: 59,
            columnNumber: 10
        }, this);
        $[5] = t1;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    return t2;
}
_c = FilterTabs;
var _c;
__turbopack_context__.k.register(_c, "FilterTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/SearchBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchBar",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
;
;
;
function SearchBar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "caf214429c55fd6ecdcde5d525e733380d0d3981946a4f09acada6bf1ddcd2d3") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "caf214429c55fd6ecdcde5d525e733380d0d3981946a4f09acada6bf1ddcd2d3";
    }
    const { value, onChange } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/SearchBar.tsx",
            lineNumber: 21,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== onChange) {
        t2 = ({
            "SearchBar[<input>.onChange]": (e)=>onChange(e.target.value)
        })["SearchBar[<input>.onChange]"];
        $[2] = onChange;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2 || $[5] !== value) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    placeholder: "Search by keywords",
                    value: value,
                    onChange: t2,
                    className: "w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-md\n          placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                }, void 0, false, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/SearchBar.tsx",
                    lineNumber: 38,
                    columnNumber: 40
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/SearchBar.tsx",
            lineNumber: 38,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = value;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    return t3;
}
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Checkbox = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center text-current"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx",
            lineNumber: 21,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Checkbox;
Checkbox.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Checkbox$React.forwardRef");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContactRow",
    ()=>ContactRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
;
;
;
function ContactRow(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(51);
    if ($[0] !== "0b3374e80d712194ff44e4c276105dd8d3b1c0d3901d10911bf7daa59c123bda") {
        for(let $i = 0; $i < 51; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0b3374e80d712194ff44e4c276105dd8d3b1c0d3901d10911bf7daa59c123bda";
    }
    const { contact, isSelected, onSelect } = t0;
    let t1;
    if ($[1] !== contact.name) {
        t1 = contact.name.split(" ").map(_ContactRowAnonymous).join("").toUpperCase().slice(0, 2);
        $[1] = contact.name;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const initials = t1;
    const t2 = `
        grid grid-cols-[32px_1fr_120px_140px_120px_100px] gap-4 items-center px-4 py-3 
        border-b border-border hover:bg-row-hover transition-colors cursor-pointer
        ${!contact.isRead ? "bg-accent/30" : ""}
      `;
    let t3;
    if ($[3] !== contact.id || $[4] !== onSelect) {
        t3 = ({
            "ContactRow[<Checkbox>.onCheckedChange]": ()=>onSelect(contact.id)
        })["ContactRow[<Checkbox>.onCheckedChange]"];
        $[3] = contact.id;
        $[4] = onSelect;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== isSelected || $[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                checked: isSelected,
                onCheckedChange: t3,
                className: "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
                lineNumber: 49,
                columnNumber: 60
            }, this)
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[6] = isSelected;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== contact.avatarUrl || $[10] !== contact.name || $[11] !== initials) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden",
            children: contact.avatarUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: contact.avatarUrl,
                alt: contact.name,
                className: "w-full h-full object-cover"
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
                lineNumber: 58,
                columnNumber: 143
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium text-muted-foreground",
                children: initials
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
                lineNumber: 58,
                columnNumber: 235
            }, this)
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        $[9] = contact.avatarUrl;
        $[10] = contact.name;
        $[11] = initials;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    const t6 = `text-sm font-medium text-foreground truncate ${!contact.isRead ? "font-semibold" : ""}`;
    let t7;
    if ($[13] !== contact.name || $[14] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t6,
            children: contact.name
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 69,
            columnNumber: 10
        }, this);
        $[13] = contact.name;
        $[14] = t6;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== contact.title) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-sm text-link truncate",
            children: [
                "- ",
                contact.title
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, this);
        $[16] = contact.title;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== t7 || $[19] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 86,
            columnNumber: 10
        }, this);
        $[18] = t7;
        $[19] = t8;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== contact.lastMessage) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-muted-foreground truncate mt-0.5",
            children: contact.lastMessage
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 95,
            columnNumber: 11
        }, this);
        $[21] = contact.lastMessage;
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    let t11;
    if ($[23] !== contact.connectionDate || $[24] !== contact.lastMessageTime) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-muted-foreground mt-0.5",
            children: [
                contact.lastMessageTime,
                " - Connection since ",
                contact.connectionDate
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 103,
            columnNumber: 11
        }, this);
        $[23] = contact.connectionDate;
        $[24] = contact.lastMessageTime;
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    let t12;
    if ($[26] !== t10 || $[27] !== t11 || $[28] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0 flex-1",
            children: [
                t9,
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 112,
            columnNumber: 11
        }, this);
        $[26] = t10;
        $[27] = t11;
        $[28] = t9;
        $[29] = t12;
    } else {
        t12 = $[29];
    }
    let t13;
    if ($[30] !== t12 || $[31] !== t5) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3 min-w-0",
            children: [
                t5,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 122,
            columnNumber: 11
        }, this);
        $[30] = t12;
        $[31] = t5;
        $[32] = t13;
    } else {
        t13 = $[32];
    }
    let t14;
    if ($[33] !== contact.labels) {
        t14 = contact.labels.map(_ContactRowContactLabelsMap);
        $[33] = contact.labels;
        $[34] = t14;
    } else {
        t14 = $[34];
    }
    let t15;
    if ($[35] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-1",
            children: t14
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 139,
            columnNumber: 11
        }, this);
        $[35] = t14;
        $[36] = t15;
    } else {
        t15 = $[36];
    }
    let t16;
    if ($[37] !== contact.pipeline) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-muted-foreground truncate",
            children: contact.pipeline
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[37] = contact.pipeline;
        $[38] = t16;
    } else {
        t16 = $[38];
    }
    const t17 = contact.notes || "-";
    let t18;
    if ($[39] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-muted-foreground truncate",
            children: t17
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 156,
            columnNumber: 11
        }, this);
        $[39] = t17;
        $[40] = t18;
    } else {
        t18 = $[40];
    }
    const t19 = contact.reminder || "-";
    let t20;
    if ($[41] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-muted-foreground",
            children: t19
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 165,
            columnNumber: 11
        }, this);
        $[41] = t19;
        $[42] = t20;
    } else {
        t20 = $[42];
    }
    let t21;
    if ($[43] !== t13 || $[44] !== t15 || $[45] !== t16 || $[46] !== t18 || $[47] !== t2 || $[48] !== t20 || $[49] !== t4) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            children: [
                t4,
                t13,
                t15,
                t16,
                t18,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
            lineNumber: 173,
            columnNumber: 11
        }, this);
        $[43] = t13;
        $[44] = t15;
        $[45] = t16;
        $[46] = t18;
        $[47] = t2;
        $[48] = t20;
        $[49] = t4;
        $[50] = t21;
    } else {
        t21 = $[50];
    }
    return t21;
}
_c = ContactRow;
function _ContactRowContactLabelsMap(label) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground",
        children: label
    }, label, false, {
        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx",
        lineNumber: 188,
        columnNumber: 10
    }, this);
}
function _ContactRowAnonymous(n) {
    return n[0];
}
var _c;
__turbopack_context__.k.register(_c, "ContactRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContactTable",
    ()=>ContactTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$ContactRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactRow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
;
;
;
;
function ContactTable(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(30);
    if ($[0] !== "68d79a3750e7b2a438c43bc316df7abe48f2f67f4db30f24f8c81dd3f0a3ddf8") {
        for(let $i = 0; $i < 30; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "68d79a3750e7b2a438c43bc316df7abe48f2f67f4db30f24f8c81dd3f0a3ddf8";
    }
    const { contacts, selectedIds, onSelect, onSelectAll } = t0;
    const allSelected = contacts.length > 0 && selectedIds.size === contacts.length;
    const someSelected = selectedIds.size > 0 && selectedIds.size < contacts.length;
    let t1;
    if ($[1] !== allSelected || $[2] !== someSelected) {
        t1 = ({
            "ContactTable[<Checkbox>.ref]": (ref)=>{
                if (ref) {
                    ref.dataset.state = someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked";
                }
            }
        })["ContactTable[<Checkbox>.ref]"];
        $[1] = allSelected;
        $[2] = someSelected;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== allSelected || $[5] !== onSelectAll || $[6] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                checked: allSelected,
                ref: t1,
                onCheckedChange: onSelectAll,
                className: "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
                lineNumber: 44,
                columnNumber: 60
            }, this)
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 44,
            columnNumber: 10
        }, this);
        $[4] = allSelected;
        $[5] = onSelectAll;
        $[6] = t1;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Members"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Labels"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 59,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Pipeline | Column"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 60,
            columnNumber: 10
        }, this);
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Notes"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 61,
            columnNumber: 10
        }, this);
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Reminder"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 62,
            columnNumber: 10
        }, this);
        $[8] = t3;
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
        $[12] = t7;
    } else {
        t3 = $[8];
        t4 = $[9];
        t5 = $[10];
        t6 = $[11];
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t2) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-[32px_1fr_120px_140px_120px_100px] gap-4 items-center px-4 py-2 border-b border-border bg-surface sticky top-0",
            children: [
                t2,
                t3,
                t4,
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[13] = t2;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== contacts || $[16] !== onSelect || $[17] !== selectedIds) {
        let t10;
        if ($[19] !== onSelect || $[20] !== selectedIds) {
            t10 = ({
                "ContactTable[contacts.map()]": (contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$ContactRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactRow"], {
                        contact: contact,
                        isSelected: selectedIds.has(contact.id),
                        onSelect: onSelect
                    }, contact.id, false, {
                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
                        lineNumber: 88,
                        columnNumber: 52
                    }, this)
            })["ContactTable[contacts.map()]"];
            $[19] = onSelect;
            $[20] = selectedIds;
            $[21] = t10;
        } else {
            t10 = $[21];
        }
        t9 = contacts.map(t10);
        $[15] = contacts;
        $[16] = onSelect;
        $[17] = selectedIds;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[22] !== contacts.length) {
        t10 = contacts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-48 text-muted-foreground",
            children: "No contacts found"
        }, void 0, false, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 106,
            columnNumber: 36
        }, this);
        $[22] = contacts.length;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    let t11;
    if ($[24] !== t10 || $[25] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 114,
            columnNumber: 11
        }, this);
        $[24] = t10;
        $[25] = t9;
        $[26] = t11;
    } else {
        t11 = $[26];
    }
    let t12;
    if ($[27] !== t11 || $[28] !== t8) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 overflow-auto",
            children: [
                t8,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx",
            lineNumber: 123,
            columnNumber: 11
        }, this);
        $[27] = t11;
        $[28] = t8;
        $[29] = t12;
    } else {
        t12 = $[29];
    }
    return t12;
}
_c = ContactTable;
var _c;
__turbopack_context__.k.register(_c, "ContactTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/data/mockContacts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockContacts",
    ()=>mockContacts
]);
const mockContacts = [
    {
        id: '1',
        name: 'Siddhant Garg',
        title: 'Building Omli',
        lastMessage: 'Hi, pls give me sometime to come back here',
        lastMessageTime: '2 minutes ago',
        connectionDate: 'January 15, 2026',
        sentByMe: false,
        isRead: true,
        hasReplied: true,
        labels: [
            'Warm Lead'
        ],
        pipeline: 'Initial Contact',
        notes: '',
        reminder: undefined
    },
    {
        id: '2',
        name: 'Rajeev Bhatia',
        title: 'CEO @ BPK Tech | Software Development For Your Business | CEO @ Dentistry Automation',
        lastMessage: 'You: hi again',
        lastMessageTime: '12 minutes ago',
        connectionDate: 'January 16, 2026',
        sentByMe: true,
        isRead: true,
        hasReplied: true,
        labels: [
            'CEO',
            'Tech'
        ],
        pipeline: 'Follow Up',
        notes: 'Interested in automation',
        reminder: 'Jan 20'
    },
    {
        id: '3',
        name: 'Abhijith Neerkaje',
        title: 'Data science & AI Leader at Falabella | Ex Target | Ex Walmart | Ex GE | MIT | IISc | PESIT',
        lastMessage: 'Not at this moment Shashank',
        lastMessageTime: 'A day ago',
        connectionDate: 'January 12, 2026',
        sentByMe: false,
        isRead: true,
        hasReplied: true,
        labels: [
            'AI/ML'
        ],
        pipeline: 'Not Interested',
        notes: 'Revisit in Q2',
        reminder: undefined
    },
    {
        id: '4',
        name: 'Alexandre Klobb',
        title: 'Co founder sonarly (YC W26)',
        lastMessage: 'Hey, we are not hiring for the moment, but maybe by the end of the batch, will keep you in touch',
        lastMessageTime: '2 days ago',
        connectionDate: 'January 18, 2026',
        sentByMe: false,
        isRead: true,
        hasReplied: true,
        labels: [
            'YC Founder'
        ],
        pipeline: 'Future Opportunity',
        notes: 'Follow up end of batch',
        reminder: 'Mar 15'
    },
    {
        id: '5',
        name: 'Aryah Oztanir',
        title: 'Co-Founder / CEO of o11 (YC W26) | Empowering Capital Market Firms With AI',
        lastMessage: 'You: Hi Aryah, Congrats on o11 and YC W26 - empowering capital-market firms with AI is exactly the kind of hi...',
        lastMessageTime: '2 days ago',
        connectionDate: 'January 18, 2026',
        sentByMe: true,
        isRead: true,
        hasReplied: false,
        labels: [
            'YC Founder',
            'FinTech'
        ],
        pipeline: 'Awaiting Reply',
        notes: '',
        reminder: undefined
    },
    {
        id: '6',
        name: 'Micaela Clark',
        title: 'Sales Development Leader, MongoDB',
        lastMessage: 'We are pretty open Tuesday evening IST next week! Idea would be to share more about how Mongo interplays wit...',
        lastMessageTime: '5 days ago',
        connectionDate: 'January 13, 2026',
        sentByMe: false,
        isRead: false,
        hasReplied: true,
        labels: [
            'Sales',
            'Enterprise'
        ],
        pipeline: 'Meeting Scheduled',
        notes: 'Tuesday call confirmed',
        reminder: 'Jan 21'
    },
    {
        id: '7',
        name: 'Vaibhav Agarwal',
        title: 'Building in AI | ex-Recreate, CRED, Zomato',
        lastMessage: 'You: Hi Vaibhav, Hope you are doing well. I saw your post about introducing strong engineers to remote roles in the...',
        lastMessageTime: '6 days ago',
        connectionDate: 'April 22, 2023',
        sentByMe: true,
        isRead: true,
        hasReplied: false,
        labels: [
            'AI Builder'
        ],
        pipeline: 'Awaiting Reply',
        notes: '',
        reminder: undefined
    },
    {
        id: '8',
        name: 'Roma Sinha',
        title: 'SDE-2 @Amazon | Ex-Walmart | Ex-SDE Intern at Amazon',
        lastMessage: 'You: Hi I hope you are doing well! I came across opening at Walmart and am very interested in the opportunity. htt...',
        lastMessageTime: '6 days ago',
        connectionDate: 'February 24, 2025',
        sentByMe: true,
        isRead: true,
        hasReplied: false,
        labels: [],
        pipeline: 'Awaiting Reply',
        notes: '',
        reminder: undefined
    },
    {
        id: '9',
        name: 'Abhay Tiwari',
        title: 'Senior Software Engineer',
        lastMessage: 'You: Hi I hope you are doing well! I came across opening at Walmart and am very interested in the opportunity. htt...',
        lastMessageTime: '6 days ago',
        connectionDate: 'April 18, 2025',
        sentByMe: true,
        isRead: true,
        hasReplied: false,
        labels: [],
        pipeline: 'Awaiting Reply',
        notes: '',
        reminder: undefined
    },
    {
        id: '10',
        name: 'Hemanth Harikanth',
        title: 'Senior Software Engineer @ Walmart | ex. Biofourmis | Bengalore Institute of Technology',
        lastMessage: 'You: Hi I hope you are doing well! I came across opening at Walmart and am very interested in the opportunity. htt...',
        lastMessageTime: '6 days ago',
        connectionDate: 'February 20, 2025',
        sentByMe: true,
        isRead: true,
        hasReplied: false,
        labels: [
            'Walmart'
        ],
        pipeline: 'Awaiting Reply',
        notes: '',
        reminder: undefined
    },
    {
        id: '11',
        name: 'Kratika Kothari',
        title: 'Software Engineer 2 at Microsoft',
        lastMessage: 'Thanks for connecting!',
        lastMessageTime: '1 week ago',
        connectionDate: 'January 10, 2026',
        sentByMe: false,
        isRead: true,
        hasReplied: true,
        labels: [
            'Microsoft'
        ],
        pipeline: 'Connected',
        notes: '',
        reminder: undefined
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/ui/button.tsx",
        lineNumber: 44,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OutreachDashboard",
    ()=>OutreachDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$FilterTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/FilterTabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$ContactTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/ContactTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/data/mockContacts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function OutreachDashboard() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isAgentRunning, setIsAgentRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [agentAnalytics, setAgentAnalytics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OutreachDashboard.useEffect": ()=>{
            checkAuth();
            fetchAgentAnalytics();
        }
    }["OutreachDashboard.useEffect"], []);
    const checkAuth = async ()=>{
        try {
            const res = await fetch('/api/agent?checkAuth=true');
            const data = await res.json();
            if (data.success) {
                setIsLoggedIn(data.data.isLoggedIn);
            }
        } catch (error) {
            console.error('Failed to check auth', error);
        }
    };
    const handleOpenLogin = async ()=>{
        toast({
            title: 'Opening LinkedIn',
            description: 'Please log in to LinkedIn in the browser window.'
        });
        try {
            await fetch('/api/agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'openLogin'
                })
            });
            setTimeout(checkAuth, 10000);
        } catch (error_0) {
            console.error('Failed to open login', error_0);
        }
    };
    const fetchAgentAnalytics = async ()=>{
        try {
            const res_0 = await fetch('/api/agent');
            const data_0 = await res_0.json();
            if (data_0.success) {
                setAgentAnalytics(data_0.data);
            }
        } catch (error_1) {
            console.error('Failed to fetch analytics', error_1);
        }
    };
    const handleRunAgent = async ()=>{
        setIsAgentRunning(true);
        toast({
            title: 'Agent Started',
            description: 'LinkedIn Connection Agent is searching for leads...'
        });
        try {
            const res_1 = await fetch('/api/agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'search',
                    params: {
                        searchTerm: searchQuery || 'software engineer'
                    }
                })
            });
            const data_1 = await res_1.json();
            if (data_1.success) {
                toast({
                    title: 'Agent Complete',
                    description: 'Finished LinkedIn outreach tasks.'
                });
                fetchAgentAnalytics();
            } else {
                toast({
                    title: 'Agent Failed',
                    description: data_1.error || 'An error occurred',
                    variant: 'destructive'
                });
            }
        } catch (error_2) {
            toast({
                title: 'Error',
                description: 'Failed to communicate with agent backend.',
                variant: 'destructive'
            });
        } finally{
            setIsAgentRunning(false);
        }
    };
    const filterContact = (contact, tab)=>{
        switch(tab){
            case 'all':
                return true;
            case 'unread':
                return !contact.isRead;
            case 'sent-by-member':
                return !contact.sentByMe;
            case 'sent-by-me':
                return contact.sentByMe;
            case 'never-answered':
                return contact.sentByMe && !contact.hasReplied;
            default:
                return true;
        }
    };
    const counts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OutreachDashboard.useMemo[counts]": ()=>{
            return {
                all: __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].length,
                unread: __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].filter({
                    "OutreachDashboard.useMemo[counts]": (c)=>!c.isRead
                }["OutreachDashboard.useMemo[counts]"]).length,
                'sent-by-member': __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].filter({
                    "OutreachDashboard.useMemo[counts]": (c_0)=>!c_0.sentByMe
                }["OutreachDashboard.useMemo[counts]"]).length,
                'sent-by-me': __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].filter({
                    "OutreachDashboard.useMemo[counts]": (c_1)=>c_1.sentByMe
                }["OutreachDashboard.useMemo[counts]"]).length,
                'never-answered': __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].filter({
                    "OutreachDashboard.useMemo[counts]": (c_2)=>c_2.sentByMe && !c_2.hasReplied
                }["OutreachDashboard.useMemo[counts]"]).length
            };
        }
    }["OutreachDashboard.useMemo[counts]"], []);
    const filteredContacts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OutreachDashboard.useMemo[filteredContacts]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$data$2f$mockContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockContacts"].filter({
                "OutreachDashboard.useMemo[filteredContacts]": (contact_0)=>{
                    const matchesTab = filterContact(contact_0, activeTab);
                    const matchesSearch = searchQuery ? contact_0.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact_0.title.toLowerCase().includes(searchQuery.toLowerCase()) || contact_0.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) : true;
                    return matchesTab && matchesSearch;
                }
            }["OutreachDashboard.useMemo[filteredContacts]"]);
        }
    }["OutreachDashboard.useMemo[filteredContacts]"], [
        activeTab,
        searchQuery
    ]);
    const handleSelect = (id)=>{
        setSelectedIds((prev)=>{
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };
    const handleSelectAll = ()=>{
        if (selectedIds.size === filteredContacts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredContacts.map((c_3)=>c_3.id)));
        }
    };
    const handleExportCSV = ()=>{
        const headers = [
            'Name',
            'Title',
            'Last Message',
            'Connection Date',
            'Pipeline',
            'Labels',
            'Notes',
            'Reminder'
        ];
        const rows = filteredContacts.filter((c_4)=>selectedIds.size === 0 || selectedIds.has(c_4.id)).map((c_5)=>[
                c_5.name,
                c_5.title,
                c_5.lastMessage,
                c_5.connectionDate,
                c_5.pipeline,
                c_5.labels.join('; '),
                c_5.notes,
                c_5.reminder || ''
            ]);
        const csv = [
            headers.join(','),
            ...rows.map((r)=>r.map((cell)=>`"${cell}"`).join(','))
        ].join('\n');
        const blob = new Blob([
            csv
        ], {
            type: 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkedin-contacts.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-background relative",
        children: [
            isLoggedIn === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 bg-card border border-border rounded-lg shadow-xl text-center max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "LinkedIn Login Required"
                        }, void 0, false, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                            lineNumber: 178,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground mb-6",
                            children: "Your LinkedIn session has expired or is not active. Please log in to continue using the automation tools."
                        }, void 0, false, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                            lineNumber: 179,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleOpenLogin,
                            size: "lg",
                            className: "w-full gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, this),
                                "Open LinkedIn to Login"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            onClick: checkAuth,
                            className: "mt-4 text-xs",
                            children: "Already logged in? Click to refresh"
                        }, void 0, false, {
                            fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                    lineNumber: 177,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 176,
                columnNumber: 32
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between px-6 py-4 border-b border-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-semibold text-foreground",
                                children: "LinkedIn Outreach"
                            }, void 0, false, {
                                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            agentAnalytics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 text-xs text-muted-foreground border-l pl-4 border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Connections: ",
                                            agentAnalytics.totalConnections || 0
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Messages: ",
                                            agentAnalytics.totalMessages || 0
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                lineNumber: 196,
                                columnNumber: 30
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "default",
                                size: "sm",
                                onClick: handleRunAgent,
                                disabled: isAgentRunning,
                                className: "gap-2",
                                children: [
                                    isAgentRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: "h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                        lineNumber: 203,
                                        columnNumber: 31
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                        lineNumber: 203,
                                        columnNumber: 80
                                    }, this),
                                    isAgentRunning ? 'Agent Running...' : 'Run Agent'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                onClick: handleExportCSV,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    "CSV"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$FilterTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterTabs"], {
                    activeTab: activeTab,
                    onTabChange: setActiveTab,
                    counts: counts
                }, void 0, false, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBar"], {
                    value: searchQuery,
                    onChange: setSearchQuery
                }, void 0, false, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$components$2f$outreach$2f$ContactTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactTable"], {
                contacts: filteredContacts,
                selectedIds: selectedIds,
                onSelect: handleSelect,
                onSelectAll: handleSelectAll
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            selectedIds.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-3 border-t border-border bg-surface",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground",
                    children: [
                        selectedIds.size,
                        " contact",
                        selectedIds.size !== 1 ? 's' : '',
                        " selected"
                    ]
                }, void 0, true, {
                    fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                    lineNumber: 224,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
                lineNumber: 223,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/geodo-vercel-agent-browser/frontend/src/components/outreach/OutreachDashboard.tsx",
        lineNumber: 175,
        columnNumber: 10
    }, this);
}
_s(OutreachDashboard, "uxDjSnhZnajJ6GRlGa28XahxkfY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = OutreachDashboard;
var _c;
__turbopack_context__.k.register(_c, "OutreachDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Download
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 15V3",
            key: "m9g1x1"
        }
    ],
    [
        "path",
        {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }
    ],
    [
        "path",
        {
            d: "m7 10 5 5 5-5",
            key: "brsn70"
        }
    ]
];
const Download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("download", __iconNode);
;
 //# sourceMappingURL=download.js.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Download",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)");
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Bot
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 8V4H8",
            key: "hb8ula"
        }
    ],
    [
        "rect",
        {
            width: "16",
            height: "12",
            x: "4",
            y: "8",
            rx: "2",
            key: "enze0r"
        }
    ],
    [
        "path",
        {
            d: "M2 14h2",
            key: "vft8re"
        }
    ],
    [
        "path",
        {
            d: "M20 14h2",
            key: "4cs60a"
        }
    ],
    [
        "path",
        {
            d: "M15 13v2",
            key: "1xurst"
        }
    ],
    [
        "path",
        {
            d: "M9 13v2",
            key: "rq6x2g"
        }
    ]
];
const Bot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("bot", __iconNode);
;
 //# sourceMappingURL=bot.js.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bot",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript)");
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RefreshCw
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
            key: "v9h5vc"
        }
    ],
    [
        "path",
        {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }
    ],
    [
        "path",
        {
            d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
            key: "3uifl3"
        }
    ],
    [
        "path",
        {
            d: "M8 16H3v5",
            key: "1cv678"
        }
    ]
];
const RefreshCw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("refresh-cw", __iconNode);
;
 //# sourceMappingURL=refresh-cw.js.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RefreshCw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)");
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }
    ],
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("search", __iconNode);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)");
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-use-previous/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrevious",
    ()=>usePrevious
]);
// packages/react/use-previous/src/use-previous.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function usePrevious(value) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        value,
        previous: value
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "usePrevious.useMemo": ()=>{
            if (ref.current.value !== value) {
                ref.current.previous = ref.current.value;
                ref.current.value = value;
            }
            return ref.current.previous;
        }
    }["usePrevious.useMemo"], [
        value
    ]);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox,
    "CheckboxIndicator",
    ()=>CheckboxIndicator,
    "Indicator",
    ()=>CheckboxIndicator,
    "Root",
    ()=>Checkbox,
    "createCheckboxScope",
    ()=>createCheckboxScope,
    "unstable_BubbleInput",
    ()=>CheckboxBubbleInput,
    "unstable_CheckboxBubbleInput",
    ()=>CheckboxBubbleInput,
    "unstable_CheckboxProvider",
    ()=>CheckboxProvider,
    "unstable_CheckboxTrigger",
    ()=>CheckboxTrigger,
    "unstable_Provider",
    ()=>CheckboxProvider,
    "unstable_Trigger",
    ()=>CheckboxTrigger
]);
// src/checkbox.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$previous$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-use-previous/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$size$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-use-size/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-presence/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
    const { __scopeCheckbox, checked: checkedProp, children, defaultChecked, disabled, form, name, onCheckedChange, required, value = "on", // @ts-expect-error
    internal_do_not_use_render } = props;
    const [checked, setChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: checkedProp,
        defaultProp: defaultChecked ?? false,
        onChange: onCheckedChange,
        caller: CHECKBOX_NAME
    });
    const [control, setControl] = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [bubbleInput, setBubbleInput] = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const hasConsumerStoppedPropagationRef = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const isFormControl = control ? !!form || !!control.closest("form") : // We set this to true by default so that events bubble to forms without JS (SSR)
    true;
    const context = {
        checked,
        disabled,
        setChecked,
        control,
        setControl,
        name,
        form,
        value,
        hasConsumerStoppedPropagationRef,
        required,
        defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
        isFormControl,
        bubbleInput,
        setBubbleInput
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CheckboxProviderImpl, {
        scope: __scopeCheckbox,
        ...context,
        children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    });
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef)=>{
    const { control, value, disabled, checked, required, setControl, setChecked, hasConsumerStoppedPropagationRef, isFormControl, bubbleInput } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, setControl);
    const initialCheckedStateRef = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](checked);
    __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CheckboxTrigger.useEffect": ()=>{
            const form = control?.form;
            if (form) {
                const reset = {
                    "CheckboxTrigger.useEffect.reset": ()=>setChecked(initialCheckedStateRef.current)
                }["CheckboxTrigger.useEffect.reset"];
                form.addEventListener("reset", reset);
                return ({
                    "CheckboxTrigger.useEffect": ()=>form.removeEventListener("reset", reset)
                })["CheckboxTrigger.useEffect"];
            }
        }
    }["CheckboxTrigger.useEffect"], [
        control,
        setChecked
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onKeyDown, (event)=>{
            if (event.key === "Enter") event.preventDefault();
        }),
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, (event)=>{
            setChecked((prevChecked)=>isIndeterminate(prevChecked) ? true : !prevChecked);
            if (bubbleInput && isFormControl) {
                hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
                if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
        })
    });
});
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeCheckbox, name, checked, defaultChecked, required, disabled, value, onCheckedChange, form, ...checkboxProps } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CheckboxProvider, {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CheckboxTrigger, {
                        ...checkboxProps,
                        ref: forwardedRef,
                        __scopeCheckbox
                    }),
                    isFormControl && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CheckboxBubbleInput, {
                        __scopeCheckbox
                    })
                ]
            })
    });
});
Checkbox.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: {
                pointerEvents: "none",
                ...props.style
            }
        })
    });
});
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ __scopeCheckbox, ...props }, forwardedRef)=>{
    const { control, hasConsumerStoppedPropagationRef, checked, defaultChecked, required, disabled, name, value, form, bubbleInput, setBubbleInput } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, setBubbleInput);
    const prevChecked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$previous$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrevious"])(checked);
    const controlSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$size$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSize"])(control);
    __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CheckboxBubbleInput.useEffect": ()=>{
            const input = bubbleInput;
            if (!input) return;
            const inputProto = window.HTMLInputElement.prototype;
            const descriptor = Object.getOwnPropertyDescriptor(inputProto, "checked");
            const setChecked = descriptor.set;
            const bubbles = !hasConsumerStoppedPropagationRef.current;
            if (prevChecked !== checked && setChecked) {
                const event = new Event("click", {
                    bubbles
                });
                input.indeterminate = isIndeterminate(checked);
                setChecked.call(input, isIndeterminate(checked) ? false : checked);
                input.dispatchEvent(event);
            }
        }
    }["CheckboxBubbleInput.useEffect"], [
        bubbleInput,
        prevChecked,
        checked,
        hasConsumerStoppedPropagationRef
    ]);
    const defaultCheckedRef = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].input, {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
            ...props.style,
            ...controlSize,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0,
            // We transform because the input is absolutely positioned but we have
            // rendered it **after** the button. This pulls it back to sit on top
            // of the button.
            transform: "translateX(-100%)"
        }
    });
});
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
    return typeof value === "function";
}
function isIndeterminate(checked) {
    return checked === "indeterminate";
}
function getState(checked) {
    return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Root",
    ()=>Slot,
    "Slot",
    ()=>Slot,
    "Slottable",
    ()=>Slottable,
    "createSlot",
    ()=>createSlot,
    "createSlottable",
    ()=>createSlottable
]);
// src/slot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/geodo-vercel-agent-browser/frontend/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[" use ".trim().toString()];
function isPromiseLike(value) {
    return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
    return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.forwardRef((props, forwardedRef)=>{
        let { children, ...slotProps } = props;
        if (isLazyComponent(children) && typeof use === "function") {
            children = use(children._payload);
        }
        const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Children.toArray(children);
        const slottable = childrenArray.find(isSlottable);
        if (slottable) {
            const newElement = slottable.props.children;
            const newChildren = childrenArray.map((child)=>{
                if (child === slottable) {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Children.count(newElement) > 1) return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Children.only(null);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.isValidElement(newElement) ? newElement.props.children : null;
                } else {
                    return child;
                }
            });
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
                ...slotProps,
                ref: forwardedRef,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.isValidElement(newElement) ? __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.cloneElement(newElement, void 0, newChildren) : null
            });
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
            ...slotProps,
            ref: forwardedRef,
            children
        });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
    const SlotClone = __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.forwardRef((props, forwardedRef)=>{
        let { children, ...slotProps } = props;
        if (isLazyComponent(children) && typeof use === "function") {
            children = use(children._payload);
        }
        if (__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.isValidElement(children)) {
            const childrenRef = getElementRef(children);
            const props2 = mergeProps(slotProps, children.props);
            if (children.type !== __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Fragment) {
                props2.ref = forwardedRef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeRefs"])(forwardedRef, childrenRef) : childrenRef;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.cloneElement(children, props2);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Children.count(children) > 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
    const Slottable2 = ({ children })=>{
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    };
    Slottable2.displayName = `${ownerName}.Slottable`;
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
}
var Slottable = /* @__PURE__ */ createSlottable("Slottable");
function isSlottable(child) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$geodo$2d$vercel$2d$agent$2d$browser$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
    const overrideProps = {
        ...childProps
    };
    for(const propName in childProps){
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = (...args)=>{
                    const result = childPropValue(...args);
                    slotPropValue(...args);
                    return result;
                };
            } else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        } else if (propName === "style") {
            overrideProps[propName] = {
                ...slotPropValue,
                ...childPropValue
            };
        } else if (propName === "className") {
            overrideProps[propName] = [
                slotPropValue,
                childPropValue
            ].filter(Boolean).join(" ");
        }
    }
    return {
        ...slotProps,
        ...overrideProps
    };
}
function getElementRef(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.props.ref;
    }
    return element.props.ref || element.ref;
}
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=geodo-vercel-agent-browser_frontend_c0316128._.js.map