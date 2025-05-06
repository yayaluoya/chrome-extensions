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

startServer();

setInterval(() => {
  papdTask();
}, 1000 * 60);
papdTask();
