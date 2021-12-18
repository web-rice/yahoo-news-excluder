/* global chrome */
let count = 0;
let words = [];
let targets;
const hideClass = 'yne_hide';
const keyName = 'yne_words';
if (document.domain === 'www.yahoo.co.jp') {
  targets = '#Topics li, #Topics article > a, #Stream article';
} else {
  // eslint-disable-next-line max-len
  targets = '.listModBoxWrap,.listPaneltype_cont, .listFeedWrap, .topicsListItem, .yjnSub_list_item, .newsFeed_item, #newsTopics li, #ranking li';
}

chrome.storage.local.get([keyName], function(result) {
  if (typeof result[keyName] !== 'undefined') {
    words = JSON.parse(result[keyName]);
  }
});

loop();
setInterval(loop, 500);

/**
 * wordsを一定間隔で処理する関数
 */
function loop() {
  if (words.length === 1 && words[0] === '') {
    reset();
  }
  for (let i = 0; i < words.length; i++) {
    const text = words[i].trim();
    clean(text);
  }
  const newCount = document.querySelectorAll('.' + hideClass).length;
  if (count !== newCount) {
    count = newCount;
    badge(count);
  }
}

/**
 * 除外した記事を再表示させる関数
 */
function reset() {
  const elms = document.querySelectorAll(targets);
  for (let i = 0; i < elms.length; i++) {
    elms[i].classList.remove(hideClass);
    elms[i].setAttribute('style', '');
  }
}

/**
 *
 * @param {string} text 除外する単語
 */
function clean(text) {
  const elms = document.querySelectorAll(targets);
  if (elms.lenth < 1) {
    return;
  }
  for (let i = 0; i < elms.length; i++) {
    if (text !== '' && elms[i].textContent.indexOf(text) !== -1) {
      if (!elms[i].classList.contains(hideClass)) {
        elms[i].classList.add(hideClass);
        elms[i].setAttribute('style', 'display:none');
      }
    } else if (elms[i].classList.contains(hideClass)) {
      let flag = false;
      for (let ii = 0; ii < words.length; ii++) {
        if (
          elms[i].textContent.indexOf(words[ii].trim()) !== -1
        ) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        elms[i].classList.remove(hideClass);
        elms[i].setAttribute('style', '');
      }
    }
  }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (typeof changes[keyName].newValue !== 'undefined') {
    words = JSON.parse(changes[keyName].newValue);
  } else {
    words = [''];
  }
});

/**
 *
 * @param {number} count アイコンに除外したニュースの合計数を表示
 */
function badge(count) {
  chrome.runtime.sendMessage({count: count + ''});
}
