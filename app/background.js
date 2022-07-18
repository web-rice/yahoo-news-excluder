/* global chrome */
chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
  if (typeof obj.count !== 'undefined') {
    chrome.action.setBadgeText({text: obj.count});
    sendResponse();
  }
  return true;
});
