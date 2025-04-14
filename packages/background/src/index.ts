import { AllUrlsMatches } from "./constant/const";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    runAt: "document_idle"
  }
]);
