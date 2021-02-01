import { GenericObject } from '../../types';

export const FONTSIZE_KEY_TO_NUM_MAP = {
  medium: 12, // 16, body
  'xx-small': 9,
  'x-small': 10,
  small: 11, // 13, caption
  large: 18, // display4
  'x-large': 28, // 24, display2
  'xx-large': 32,
  smaller: 10,
  larger: 14, // big-body
  initial: null,
  inherit: null,
};

export const STYLES_KEEP_ON_DIV = ['text-align', 'direction'];

export const LANGUAGE_TESTS: {
  [lang: string]: { test: RegExp; attributes: GenericObject };
} = {
  hebrew: {
    test: /[\u0590-\u05FF]/,
    attributes: {
      lang: 'he',
    },
  },
  russian: {
    test: /[а-яА-ЯЁё]/,
    attributes: {
      lang: 'ru',
    },
  },
};

export interface HtmlCleanupReplacer {
  find: RegExp[];
  replaceWith: string[];
}

export const HTML_CLEANUP_REPLACERS: {
  [key: string]: HtmlCleanupReplacer;
} = {
  blockToDiv: {
    find: [
      /(?:(?:<p)|(?:<main)|(?:<section)|(?:<header)|(?:<article)|(?:<footer))(>|(?:\s[^>]*>))/gi,
      /(<\/p>)|(<\/main>)|(<\/section>)|(<\/header>)|(<\/article>)|(<\/footer>)/gi,
    ],
    replaceWith: ['<div$1', '</div>'],
  },

  biToStrongEM: {
    find: [
      /<b(?:>|(?:\s[^>]*>))/gi,
      /<i(?:>|(?:\s[^>]*>))/gi,
      /<\/b>/gi,
      /<\/i>/gi,
    ],
    replaceWith: ['<strong>', '<em>', '</strong>', '</em>'],
  },

  headings: {
    find: [
      /(<h[1][^>]*>)/gi,
      /(<h[23][^>]*>)/gi,
      /(<h[456][^>]*>)/gi,
      /(<\/h\d>)/gi,
    ],
    replaceWith: [
      '<div><br></div><div><span style="font-size: 28px;"><strong>',
      '<div><br></div><div><span style="font-size: 18px;"><strong>',
      '<div><br></div><div><span><strong>',
      '</strong></span></div>',
    ],
  },

  nbsp: {
    find: [/\&nbsp;/gi],
    replaceWith: [' '],
  },

  blockStyleTagsUsedAsBR: {
    find: [/(<(span)[^>]+style=["][^"]*display:\s*block[^"]*"[^>]*>)/gi],
    replaceWith: ['<br>$1'], // '<div><br></div>$1'
  },

  emptyDivs: {
    find: [/<div[^>]*>\s+<\/div>/gi],
    replaceWith: ['<div><br></div>'],
  },

  emptyTags: {
    find: [/<([^\/>\s]+)[^>]*>\s*<\/\1>/gi],
    replaceWith: [' '],
  },

  unnecessaryWrappers: {
    find: [
      /<(span)>([^<]+)<\/\1>/gi,
      /<\/(strong|em)>([\s.,;-]*)<\1([^>\/]*)>/gi,
      /(<span\s*([^>\/]*)>)([^<]+)<\/span>(\s*)<span\s*\2>/gi,
    ],
    replaceWith: ['$2', '$2', '$1$3$4'],
  },

  whiteSpace: {
    find: [/([^\s.,;\-:])\s+([.,;])/gi, /\s+/gi],
    replaceWith: ['$1$2', ' '],
  },

  BRs: {
    find: [
      // div's with &nbsp;
      /(?:<(div|p)[^>]*>(?:\s*<span[^>]*>\s*)*(?:\s*&nbsp;\s*)+(?:\s*<\/span>\s*)*(?:<\/\1>))+/gi,
      // <br>'s inside tags with text (<div><br> text</div>)
      /(<(?:div|p|span|ul|ol|li|a|strong|em|i)[^>]*>)(?:\s*<br[^>]*>\s*)+([^<\s]+)/gi,
      // replace <br><br> with <div><br></div>
      /(<br[^>]*>\s*){2,}/gi,
      /([^<>])(<br[^>]*>\s*){2,}(?=[^<>\s])/gi,
      // <br> inside any tag => div
      /(?:<([^d\s]+)[^>]*>\s*<br[^>]*>{1,}\s*<\/\1>)(?:(?:\s*<br[^>]*>\s*){1,})?/gi,
      // <br>'s at the start / end
      /(^(\s*<br[^>]*>\s*)+)|((\s*<br[^>]*>\s*)+$)/gi,
      // too many <div><br></div>
      /((<([^\/>\s]+)[^>]*>)+\s*<br[^>]*>\s*(<\/\3>)+\s*){2,}/gi,
      // <div><br></div> at the start / end
      /(?:^\s*((?:<[^\/>]+>\s*)*)(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\2>\s*)+)/i,
      /(?:(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\1>\s*)+((?:<\/[^\/>]+>\s*)*)$)/i,
    ],
    replaceWith: [
      '<div><br></div>',
      '$1$2',
      '<div><br></div>',
      '$1<div><br></div>',
      '<div><br></div>',
      '',
      // too many div-br-div
      '<div><br></div>',
      '$1',
      '$2',
    ],
  },

  spacesBetweenTextAndTag: {
    find: [/([^\s>]{2})(<[^/])/gi, /(<\/[^>]+>)([^\s<]{2})/gi],
    replaceWith: ['$1 $2', '$1 $2'],
  },

  spacesBetweenTags: {
    find: [/(<\/[^>]+>)(<[^/])/gi],
    replaceWith: ['$1 $2'],
  },

  emojis: {
    find: [
      /([\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}])/gu,
    ],
    replaceWith: [
      '<span contenteditable="false" class="fr-deletable" lang="emoji">$1</span>',
    ],
  },
};

export const HTML_CLEANUP_REPLACERS_DEF: HtmlCleanupReplacer[] = [
  HTML_CLEANUP_REPLACERS.blockToDiv,
  HTML_CLEANUP_REPLACERS.biToStrongEM,
  HTML_CLEANUP_REPLACERS.headings,
  HTML_CLEANUP_REPLACERS.nbsp,
  HTML_CLEANUP_REPLACERS.blockStyleTagsUsedAsBR,
  // HTML_CLEANUP_REPLACERS.emptyDivs,
  HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.unnecessaryWrappers,
  HTML_CLEANUP_REPLACERS.whiteSpace,
  HTML_CLEANUP_REPLACERS.BRs,
  //  HTML_CLEANUP_REPLACERS.emptyTags,
  HTML_CLEANUP_REPLACERS.spacesBetweenTextAndTag,
  HTML_CLEANUP_REPLACERS.spacesBetweenTags,
];
