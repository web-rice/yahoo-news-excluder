/* global chrome */
const btn = document.getElementById('save');
const textArea = document.getElementById('textArea');
btn.addEventListener(
    'click',
    () => {
      const str = textArea.value.trim();
      const arr = str.split(/\n/);
      const json = JSON.stringify(arr);
      chrome.storage.local.set({yne_words: json});
      const queryOptions = {
        active: true,
        currentWindow: true,
        url: [
          '*://*.yahoo.co.jp/*',
          '*://*.yahoo.com/*',
        ],
      };
      chrome.tabs.query(queryOptions, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {name: 'apply'});
        }
      });
    },
    false,
);

let text = '';
chrome.storage.local.get(['yne_words'], (result) => {
  if (typeof result.yne_words !== 'undefined') {
    const words = JSON.parse(result.yne_words);
    text = words.join('\n');
    textArea.value = text;
  }
});

const langElms = {
  ja: document.querySelectorAll('._lang-ja'),
  en: document.querySelectorAll('._lang-en'),
};

if (navigator.language === 'ja' || navigator.language === 'ja_JP') {
  langElms.en.forEach((el) => {
    el.style.display = 'none';
  });
} else {
  langElms.ja.forEach((el) => {
    el.style.display = 'none';
  });
}
