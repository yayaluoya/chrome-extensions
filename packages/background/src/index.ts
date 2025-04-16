import { AllUrlsMatches } from "./constant/const";
import { startServer } from "./startServer";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    runAt: "document_idle"
  }
]);

startServer();