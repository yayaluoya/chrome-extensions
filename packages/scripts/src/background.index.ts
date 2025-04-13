import { AllUrlsMatches, ContentScriptPath } from "./constant/enum";

chrome.scripting.registerContentScripts([
  {
    id: ContentScriptPath.Default,
    matches: [AllUrlsMatches],
    js: [ContentScriptPath.Default],
    runAt: "document_idle"
  },
  {
    id: ContentScriptPath.Codesign,
    matches: ["*://codesign.qq.com/*"],
    js: [ContentScriptPath.Codesign],
    runAt: "document_idle"
  }
]);
