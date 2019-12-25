import { BlotType } from './rte.enum';
import { joinArrays, EmojiCategory, Emoji, EMOJI_DATA } from 'bob-style';
import { FroalaOptions } from './froala.interface';
import { TributeOptions, TributeItem } from './tribute.interface';

export const RTE_CONTROLS_DEF = joinArrays(
  [
    BlotType.size,
    BlotType.bold,
    BlotType.italic,
    BlotType.underline,
    BlotType.insertLink,
    BlotType.formatUL,
    BlotType.formatOL,
    BlotType.align,
    BlotType.rightToLeft,
    BlotType.leftToRight,
    BlotType.emoticons,
    BlotType.mentions,
    BlotType.placeholder,
  ],
  Object.values(BlotType)
);

export const RTE_DISABLE_CONTROLS_DEF: BlotType[] = [BlotType.placeholder];

export const RTE_MINHEIGHT_DEF = 185;
export const RTE_MAXHEIGHT_DEF = 350;
export const RTE_TOOLBAR_HEIGHT = 41;

const RTE_ALLOWED_STYLE_PROPS = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'direction',
];

export const RTE_OPTIONS_DEF: FroalaOptions = {
  key: 'DUA2yE3G1A1A5B8B1pZGCTRSAPJWTLPLZHTQQe1JGZxC4B3A3B2B5B1C1E4I1B3==',
  attribution: false,

  enter: 1,
  initOnClick: false,
  theme: 'royal',
  fontFamily: {
    // tslint:disable-next-line: quotemark
    "'Gotham SSm A', 'Gotham SSm B', 'Helvetica'": 'Body font',
    // tslint:disable-next-line: quotemark
    "'Sentinel SSm A', 'Sentinel SSm B', 'Helvetica'": 'Heading font',
  },
  scrollableContainer: 'body',

  heightMin: RTE_MINHEIGHT_DEF - RTE_TOOLBAR_HEIGHT,
  heightMax: RTE_MAXHEIGHT_DEF - RTE_TOOLBAR_HEIGHT,

  charCounterCount: true,
  charCounterMax: -1,

  tooltips: false,
  shortcutsHint: false,
  placeholderText: '',

  imagePaste: false,
  imageDefaultAlign: 'left',
  imageDefaultWidth: 600,
  imageMaxSize: 1024 * 1024 * 3,
  imageMinWidth: 100,

  videoDefaultAlign: 'left',
  videoDefaultWidth: 600,
  videoMaxSize: 1024 * 1024 * 30,

  htmlAllowComments: false,
  htmlAllowedAttrs: [
    'alt',
    'data-.*',
    'dir',
    'href',
    'id',
    'lang',
    'rel',
    'src',
    'target',
    'title',
    'valign',
    'style',
    'class',
    'contenteditable',
    'spellcheck',
    'tabindex',
    '.*mention.*',

    // 'align',
    // 'border',
    // 'cellpadding',
    // 'cellspacing',
    // 'colspan',
    // 'rowspan',
  ],
  htmlAllowedEmptyTags: ['.fa', '.fr-emoticon', '.fr-inner'],
  htmlAllowedStyleProps: RTE_ALLOWED_STYLE_PROPS,
  htmlAllowedTags: [
    'a',
    'br',
    'div',
    'b',
    'strong',
    'em',
    'i',
    'hr',
    'img',
    'li',
    'ol',
    'ul',
    'p',
    'span',
    'u',
    'strike',

    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ],
  htmlExecuteScripts: false,
  htmlIgnoreCSSProperties: [],
  htmlRemoveTags: ['script', 'style'],
  htmlUntouched: true,

  pasteAllowedStyleProps: RTE_ALLOWED_STYLE_PROPS,
  pasteDeniedAttrs: ['^on.*', 'type', 'value'],
  pasteDeniedTags: ['script', 'style'],
  pastePlain: false,

  wordDeniedTags: ['script', 'style'],

  listAdvancedTypes: false,

  linkAlwaysBlank: true,
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  linkInsertButtons: [],

  fontSizeSelection: false,
  fontSize: ['11', '12', '18', '28'],
  fontSizeDefaultSelection: '12',

  colorsText: [],

  toolbarBottom: true,
  toolbarSticky: false,
  toolbarButtons: RTE_CONTROLS_DEF,
  toolbarInline: false,
  toolbarVisibleWithoutSelection: true,

  pluginsEnabled: [
    'align',
    'charCounter',
    'colors',
    'fontSize',
    'inlineStyle',
    'inlineClass',
    'link',
    'lists',
    'paragraphFormat',
    'paragraphStyle',
    'save',
    'url',
    'emoticons',
    // 'fontFamily',
    // 'table',
    // 'video',
    // 'image',
    // 'imageTUI',
    // 'imageManager',
    // 'wordPaste',
    // 'embedly',
    // 'codeBeautifier',
    // 'lineHeight',
    // 'codeView',
    // 'draggable',
    // 'entities',
    // 'file',
    // 'fontAwesome',
    // 'fullscreen',
    // 'lineBreaker',
    // 'quickInsert',
    // 'quote',
  ],

  emoticonsUseImage: false,
  emoticonsButtons: [],

  emoticonsSet: EMOJI_DATA.map((cat: EmojiCategory) => ({
    name: cat.name,
    id: cat.name,
    code: cat.code || cat.data[0].code,
    emoticons: cat.data.map((icn: Emoji) => ({
      code: icn.code,
      desc: icn.description,
      icon: icn.icon,
    })),
  })) as any,
};

export const RTE_MENTIONS_OPTIONS_DEF: TributeOptions = {
  lookup: 'displayName',
  fillAttr: 'displayName',
  requireLeadingSpace: false,
  allowSpaces: true,

  menuItemTemplate: function(item: TributeItem) {
    return item.original.avatar
      ? `<span class="brte-mention-avatar" aria-hidden="true" style="background-image:url(${
          item.original.avatar
        })"></span><span>${item.string}</span>`
      : item.string;
  },

  searchOpts: {
    pre: '<em class="match">',
    post: '</em>',
  },
};
