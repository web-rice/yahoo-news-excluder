/* global chrome */
chrome.runtime.onMessage.addListener((obj) => {
  if (typeof obj.count !== 'undefined') {
    chrome.browserAction.setBadgeText({text: obj.count});
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.name === 'apply') {
    chrome.tabs.getSelected(null, (tab) => {
      chrome.tabs.sendMessage(tab.id, {name: 'apply'});
    });
  }
});
