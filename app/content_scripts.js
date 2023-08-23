/* global chrome, TARGETS */
let words = [];
const hideClass = 'yne_hide';
const keyName = 'yne_words';

chrome.storage.local.get([keyName], function(result) {
  if (typeof result[keyName] !== 'undefined') {
    words = makeObject(JSON.parse(result[keyName]));
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (typeof changes[keyName].newValue !== 'undefined') {
    words = makeObject(JSON.parse(changes[keyName].newValue));
  } else {
    words = [''];
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

// window.addEventListener('DOMContentLoaded', scan);
// window.addEventListener('load', scan);

/**
 * キーワードを整理
 * @param {Array} words キーワードの配列
 * @return {Array}
 */
function makeObject(words) {
  const arr = [];
  words.forEach((row, i) => {
    const data = row.split('||');
    arr[i] = {
      word: data[0].trim(),
      case: '1',
      rate: '100',
      loopCount: 0,
    };
    if (data.length > 0 && typeof data[1] !== 'undefined') {
      const settingTexts = data[1].split(',');
      settingTexts.forEach((text) => {
        const setting = text.split(':');
        arr[i][setting[0]] = setting[1];
      });
    }
  });
  return arr;
}

/**
 * wordsを処理する関数
 */
async function scan() {
  if (words.length === 1 && words[0] === '') {
    reset();
  }
  const newCount = clean();
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
 * @return {number} カウント数
 */
function clean() {
  const elms = document.querySelectorAll(TARGETS.current);
  if (elms.lenth < 1) {
    return;
  }

  for (let i = 0; i < words.length; i++) {
    words[i].loopCount = 0;
  }

  elms.forEach((elm) => {
    let isHit = false;
    const show = () => {
      elm.classList.remove(hideClass);
      elm.setAttribute('style', '');
    };

    for (let i = 0; i < words.length; i++) {
      const data = words[i];
      if (!judgeText(elm.textContent, data)) {
        continue;
      }

      words[i].loopCount++;
      const count = words[i].loopCount;
      const rateNum = 100 - Number(data.rate.replace('!', ''));
      const rate = Math.round(100 / (rateNum > 0 ? rateNum : 1));

      if (!elm.classList.contains(hideClass)) {
        elm.classList.add(hideClass);
        elm.setAttribute('style', 'display:none');
      }

      if (data.rate.indexOf('!') !== -1) {
        if (count === 1) {
          show();
        }
        if (rate <= count) {
          words[i].loopCount = 0;
        }
      } else {
        if (rate <= count) {
          show();
          words[i].loopCount = 0;
        }
      }

      isHit = true;
      break;
    }

    if (!isHit && elm.classList.contains(hideClass)) {
      show();
    }
  });
  return document.querySelectorAll('.' + hideClass).length;
}

/**
 * @param {string} textContent 記事タイトル
 * @param {string} data キーワードと設定
 * @return {boolean}
 */
function judgeText(textContent, data) {
  if (!textContent || !data.word) {
    return false;
  }
  let a = textContent;
  let b = data.word;
  if ('case' in data && parseInt(data.case) === 0) {
    a = textContent.toLocaleLowerCase();
    b = data.word.toLocaleLowerCase();
  }
  return (zenkakuToHankaku(a).indexOf(zenkakuToHankaku(b)) !== -1);
}

/**
 * 全角を半角に統一
 * @param {string} str 記事タイトル
 * @return {string}
 */
function zenkakuToHankaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

/**
 *
 * @param {number} count アイコンに除外したニュースの合計数を表示
 */
function badge(count) {
  chrome.runtime.sendMessage({count: count + ''});
}
