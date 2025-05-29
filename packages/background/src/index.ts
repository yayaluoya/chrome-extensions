import { startServer } from "./startServer";
import { tapdTask } from "./tapd";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: ["*://codesign.qq.com/*", "*://app.apifox.com/*", "*://www.tapd.cn/*"],
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
