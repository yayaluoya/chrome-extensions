import { AllUrlsMatches } from "./constant/const";
import { startServer } from "./startServer";
import { tapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    css: ["inject/index.css"],
    runAt: "document_idle"
  }
]);

setInterval(async () => {
  const v = await tapdLocalStorage.get();
  const { bug = 0 } = v?.workitemCount || {};
  if (bug > 0) {
    chrome.action.setIcon({
      path: {
        "64": "/images/icon-msg-64.png",
        "128": "/images/icon-msg-128.png"
      }
    });
  } else {
    chrome.action.setIcon({
      path: {
        "64": "/images/icon-64.png",
        "128": "/images/icon-128.png"
      }
    });
  }
}, 100);

startServer();
