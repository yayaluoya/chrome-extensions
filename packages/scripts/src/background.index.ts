import { AllUrlsMatches, ScriptsDir } from "./constant/const";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: [ScriptsDir + "inject.js"],
    runAt: "document_idle"
  },
  {
    id: "codesign-inject",
    matches: ["*://codesign.qq.com/*"],
    js: [ScriptsDir + "codesign-inject.js"],
    runAt: "document_idle"
  }
]);
