import { AllUrlsMatches } from "./constant/const";
import { startServer } from "./startServer";
import { tapdTask } from "./tapd";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    css: ["inject/index.css"],
    runAt: "document_idle"
  }
]);

startServer();

setInterval(() => {
  tapdTask();
}, 1000 * 10);
tapdTask();
