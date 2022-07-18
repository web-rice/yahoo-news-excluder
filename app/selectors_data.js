const TARGETS = {
  domain: [
    {
      domains: ['www.yahoo.co.jp'],
      selectors: [
        '#Topics li',
        '#Topics article > a',
        '#Stream article',
      ],
    },
    {
      domains: [
        'sports.yahoo.co.jp',
        'baseball.yahoo.co.jp',
        'soccer.yahoo.co.jp',
        'keiba.yahoo.co.jp',
      ],
      selectors: [
        '.lsn-listPickup__item',
        '#pic_photo',
        '.cm-topTimeLine__item',
        '.sn-info__item',
        '.cm-videoEmbedSub',
        '.cm-list__item',
        '.sn-doPickup',
        '.sn-doArticleList__item',
        '.sn-textList__item',
        '.sn-list__item',
        '.sn-pickup__item',
        '.io-pickup__item',
        '.io-list__item',
        '.sn-videoList__item',
        '.bb-timeLine__item',
        '#yjSMPickup',
        '.yjMS > li',
        '.sc-timeLine__item',
        '.sn-listPickup__item',
        '#parag_link li',
        '.cm-timeLine__item',
      ],
    },
    {
      domains: [
        'keiba.yahoo.co.jp',
      ],
      selectors: [
        '.lsn-listPickup__item',
        '#pic_photo',
        '.cm-topTimeLine__item',
        '.sn-info__item',
        '.cm-videoEmbedSub',
        '.cm-list__item',
        '.sn-doPickup',
        '.sn-doArticleList__item',
        '.sn-textList__item',
        '.sn-list__item',
        '.sn-pickup__item',
        '.io-pickup__item',
        '.io-list__item',
        '.sn-videoList__item',
        '.bb-timeLine__item',
        '#yjSMPickup',
        '.yjMS > li',
        '.sc-timeLine__item',
        '.sn-listPickup__item',
        '#parag_link li',
        '.cm-timeLine__item',
        '.mgnBL,.mgnBS',
        '.glanceArticleBox > li',
      ],
    },
    {
      domains: [
        'www.yahoo.com',
        'news.yahoo.com',
      ],
      selectors: [
        '.ntk-link-filter',
        '.ntk-filmstrip li',
        '.stream-item',
        '#viewer-aside li',
        '.js-stream-content',
        '.lead-item',
        '.video-item-lite',
        '#wafer-content-list-video > div:not(.header-wrapper) > div',
      ],
    },
  ],
  default: [
    '.listModBoxWrap',
    '.listPaneltype_cont',
    '.listFeedWrap',
    '.topicsListItem',
    '.yjnSub_list ol li',
    '.yjnSub_list_item',
    '.newsFeed_item',
    '#newsTopics li',
    '#ranking li',
    '.subList_item',
    '[data-ual-view-type="list"]',
    '.yjnSubTopics_list_item',
    'section.topics > div > p',
    '#contentsWrap li',
  ],
};

TARGETS.domain.some((obj, i) => {
  if (isCurrentDomain(obj.domains)) {
    TARGETS.current = obj.selectors;
    return true;
  }
  if (i === TARGETS.domain.length - 1) {
    TARGETS.current = TARGETS.default;
  }
});

/**
 *
 * @param {object} domains ドメイン判定
 * @return {boolean}
 */
function isCurrentDomain(domains) {
  return domains.includes(document.domain);
}

