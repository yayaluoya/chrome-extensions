import { AllUrlsMatches } from "./constant/const";
import { queryBaiduTranslate } from "./translate/queryBaiduTranslate";

chrome.scripting.registerContentScripts([
  {
    id: "default",
    matches: [AllUrlsMatches],
    js: ["inject/index.iife.js"],
    runAt: "document_idle"
  }
]);

chrome.runtime.onMessage.addListener((messsage, sender, sendResponse: any) => {
  if (messsage.type === "translate") {
    queryBaiduTranslate(messsage.str)
      .then(str => sendResponse({ succeed: true, content: str }))
      .catch(() => sendResponse({ succeed: false }));
  }
  return true;
});
