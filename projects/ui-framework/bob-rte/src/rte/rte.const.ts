import { BlotType } from './rte.enum';
import {
  joinArrays,
  HTML_CLEANUP_REPLACERS,
  HtmlCleanupReplacer,
  SANITIZER_ALLOWED_ATTRS,
  SANITIZER_ALLOWED_TAGS,
  SANITIZER_ALLOWED_STYLE_PROPS,
} from 'bob-style';
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

const RTE_DISALLOWED_STYLE_PROPS = [
  'font-family',
  'font-style',
  // 'text-decoration',
];

export const RTE_ALLOWED_FONTSIZES = [11, 12, 18, 28];
export const RTE_ALLOWED_FONTSIZE_KEYWORDS = [
  'small',
  'medium',
  'large',
  'x-large',
];

export const RTE_HTML_CLEANUP_REPLACERS_INPUT: HtmlCleanupReplacer[] = [
  HTML_CLEANUP_REPLACERS.blockToDiv,
  // HTML_CLEANUP_REPLACERS.biToStrongEM,
  HTML_CLEANUP_REPLACERS.headings,
  HTML_CLEANUP_REPLACERS.nbsp,
  // HTML_CLEANUP_REPLACERS.blockStyleTagsUsedAsBR,
  // HTML_CLEANUP_REPLACERS.emptyDivs,
  HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.unnecessaryWrappers,
  HTML_CLEANUP_REPLACERS.whiteSpace,
  HTML_CLEANUP_REPLACERS.BRs,
  // HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.spacesBetweenTextAndTag,
  HTML_CLEANUP_REPLACERS.spacesBetweenTags,
];

export const RTE_HTML_CLEANUP_REPLACERS_OUTPUT: HtmlCleanupReplacer[] = [
  HTML_CLEANUP_REPLACERS.nbsp,
  // HTML_CLEANUP_REPLACERS.emptyDivs,
  // HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.unnecessaryWrappers,
  HTML_CLEANUP_REPLACERS.whiteSpace,
  HTML_CLEANUP_REPLACERS.BRs,
  HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.spacesBetweenTextAndTag,
  HTML_CLEANUP_REPLACERS.spacesBetweenTags,
];

export const RTE_OPTIONS_DEF: FroalaOptions = {
  key: 'DUA2yE3G1A1A5B8B1pZGCTRSAPJWTLPLZHTQQe1JGZxC4B3A3B2B5B1C1E4I1B3==',
  attribution: false,

  enter: 1, // div; use 2 for br
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

  imageDefaultAlign: 'left',
  imageDefaultWidth: 600,
  imageMaxSize: 1024 * 1024 * 3,
  imageMinWidth: 100,

  videoDefaultAlign: 'left',
  videoDefaultWidth: 600,
  videoMaxSize: 1024 * 1024 * 30,

  htmlAllowComments: false,
  htmlAllowedAttrs: SANITIZER_ALLOWED_ATTRS,
  htmlAllowedEmptyTags: ['.fa', '.fr-emoticon', '.fr-inner'],
  htmlAllowedStyleProps: SANITIZER_ALLOWED_STYLE_PROPS,
  htmlAllowedTags: SANITIZER_ALLOWED_TAGS,
  htmlExecuteScripts: false,
  htmlIgnoreCSSProperties: RTE_DISALLOWED_STYLE_PROPS,
  htmlRemoveTags: ['script', 'style'],
  htmlUntouched: false,

  pasteAllowedStyleProps: SANITIZER_ALLOWED_STYLE_PROPS,
  pasteDeniedAttrs: ['^on.*', 'type', 'value', 'id', 'class'],
  pasteDeniedTags: ['script', 'style', 'img', 'hr'],
  imagePaste: false,
  pastePlain: false,

  wordDeniedTags: ['script', 'style'],

  listAdvancedTypes: false,

  linkAlwaysBlank: true,
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  linkInsertButtons: [],

  fontSizeSelection: false,
  fontSize: RTE_ALLOWED_FONTSIZES as any,
  fontSizeUnit: 'px',
  fontSizeDefaultSelection: 12 as any,

  colorsText: [],

  toolbarBottom: true,
  toolbarSticky: false,
  toolbarButtons: RTE_CONTROLS_DEF,
  toolbarInline: false,
  toolbarVisibleWithoutSelection: true,

  shortcutsEnabled: [
    'show',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'indent',
    'outdent',
    'undo',
    'redo',
    'insertImage',
    'createLink',
  ],

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
};

export const RTE_MENTIONS_OPTIONS_DEF: TributeOptions = {
  lookup: 'displayName',
  fillAttr: 'displayName',
  requireLeadingSpace: false,
  allowSpaces: true,

  menuItemTemplate: function (item: TributeItem) {
    return item.original.avatar
      ? `<span class="brte-mention-avatar" aria-hidden="true" style="background-image:url(${item.original.avatar})"></span><span>${item.string}</span>`
      : item.string;
  },

  searchOpts: {
    pre: '<em class="match">',
    post: '</em>',
  },
};
