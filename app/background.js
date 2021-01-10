/* global chrome */
chrome.runtime.onMessage.addListener(function(obj) {
  if (typeof obj.count !== 'undefined') {
    chrome.browserAction.setBadgeText({text: obj.count});
  }
});
