import { AllUrlsMatches } from "./constant/const";
import { startServer } from "./startServer";
import { papdTask } from "./tapd";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    css: ["inject/index.css"],
    runAt: "document_idle"
  }
]);

chrome.runtime.onInstalled.addListener(() => {
  startServer();
  papdTask();
});
