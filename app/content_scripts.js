/* global chrome, TARGETS */
let words = [];
const hideClass = 'yne_hide';
const keyName = 'yne_words';

String.prototype.zenkakuToHankaku = function() {
  return this.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
};

chrome.storage.local.get([keyName], function(result) {
  if (typeof result[keyName] !== 'undefined') {
    words = JSON.parse(result[keyName]);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === 'apply') {
    scan().then((response) => {
      sendResponse(response);
    });
  }
  return true;
});

const config = {childList: true, subtree: true};
const observer = new MutationObserver(scan);
observer.observe(document.body, config);

window.addEventListener('DOMContentLoaded', scan);
window.addEventListener('load', scan);

/**
 * wordsを処理する関数
 */
async function scan() {
  if (words.length === 1 && words[0] === '') {
    reset();
  }
  for (let i = 0; i < words.length; i++) {
    const text = words[i].trim();
    clean(text);
  }
  const newCount = document.querySelectorAll('.' + hideClass).length;
  badge(newCount);
  return newCount;
}

/**
 * 除外した記事を再表示させる関数
 */
function reset() {
  const elms = document.querySelectorAll(TARGETS.current);
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
  const elms = document.querySelectorAll(TARGETS.current);
  if (elms.lenth < 1) {
    return;
  }
  for (let i = 0; i < elms.length; i++) {
    if (jadgeText(elms[i].textContent, text)) {
      if (!elms[i].classList.contains(hideClass)) {
        elms[i].classList.add(hideClass);
        elms[i].setAttribute('style', 'display:none');
      }
    } else if (elms[i].classList.contains(hideClass)) {
      let flag = false;
      for (let ii = 0; ii < words.length; ii++) {
        if (
          jadgeText(elms[i].textContent, words[ii].trim())
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

/**
 * @param {string} textContent 記事タイトル
 * @param {string} text 除外する単語
 * @return {boolean}
 */
function jadgeText(textContent, text) {
  if (!textContent || !text) {
    return false;
  }
  return (textContent.toLocaleLowerCase().zenkakuToHankaku().indexOf(text.toLocaleLowerCase().zenkakuToHankaku()) !== -1);
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
