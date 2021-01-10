/* global chrome */
const btn = document.getElementById('save');
const textArea = document.getElementById('textArea');
btn.addEventListener(
    'click',
    function() {
      const str = textArea.value.trim();
      const arr = str.split(/\n/);
      const json = JSON.stringify(arr);
      chrome.storage.local.set({yne_words: json});
    },
    false
);

let text = '';
chrome.storage.local.get(['yne_words'], function(result) {
  if (typeof result.yne_words !== 'undefined') {
    const words = JSON.parse(result.yne_words);
    text = words.join('\n');
    textArea.value = text;
  }
});
