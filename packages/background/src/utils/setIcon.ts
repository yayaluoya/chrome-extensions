export function setIcon(hasMsg = false) {
  if (hasMsg) {
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
}
