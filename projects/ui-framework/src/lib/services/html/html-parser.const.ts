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

export interface HtmlCleanupReplacer {
  find: RegExp[];
  replaceWith: string[];
}

export const HTML_CLEANUP_REPLACERS: {
  [key: string]: HtmlCleanupReplacer;
} = {
  blockToDiv: {
    find: [
      /(?:(<p)|(<main)|(<section)|(<header)|(<article)|(<footer))(?:>|(?: [^>]*>))/gi,
      /(<\/p>)|(\/main)|(\/section)|(\/header)|(\/article)|(\/footer)/gi,
    ],
    replaceWith: ['<div>', '</div>'],
  },

  biToStrongEM: {
    find: [
      /<b(?:>|(?: [^>]*>))/gi,
      /<i(?:>|(?: [^>]*>))/gi,
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
    replaceWith: ['<br>$1'], //'<div><br></div>$1'
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
    find: [/<(span)>([^<]+)<\/\1>/gi],
    replaceWith: ['$2'],
  },

  whiteSpace: {
    find: [/\s+/gi],
    replaceWith: [' '],
  },

  BRs: {
    find: [
      // <br>'s inside tags with text (<div><br> text</div>)
      /(<(?:div|p|span|ul|ol|li|a|strong|em|i)[^>]*>)(?:\s*<br[^>]*>\s*)+([^<\s]+)/gi,
      // replace <br><br> with <div><br></div>
      /(<br[^>]*>\s*){2,}/gi,
      /([^<>])(<br[^>]*>\s*){2,}(?=[^<>\s])/gi,
      // <br>'s at the start / end
      /(^(\s*<br[^>]*>\s*)+)|((\s*<br[^>]*>\s*)+$)/gi,
      // too many <div><br></div>
      /((<([^\/>\s]+)[^>]*>)+\s*<br[^>]*>\s*(<\/\3>)+\s*){2,}/gi,
      // <div><br></div> at the start / end
      /(?:^\s*((?:<[^\/>]+>\s*)*)(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\2>\s*)+)/i,
      /(?:(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\1>\s*)+((?:<\/[^\/>]+>\s*)*)$)/i,
    ],
    replaceWith: [
      '$1$2',
      '<div><br></div>',
      '$1<div><br></div>',
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
