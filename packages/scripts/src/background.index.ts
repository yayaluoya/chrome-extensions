import { AllUrlsMatches } from "./constant/const";

chrome.scripting.registerContentScripts([
    {
        id: "default",
        matches: [AllUrlsMatches],
        js: ["scripts/inject.js"],
        runAt: "document_idle"
    },
    {
        id: "codesign-inject",
        matches: ["*://codesign.qq.com/*"],
        js: ["scripts/codesign-inject.js"],
        runAt: "document_idle"
    }
]);