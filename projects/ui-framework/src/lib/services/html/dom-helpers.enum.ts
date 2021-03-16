export enum TreeWalkerTake {
  all = NodeFilter.SHOW_ALL,
  elements = NodeFilter.SHOW_ELEMENT,
  textNodes = NodeFilter.SHOW_TEXT,
}

export enum TreeWalkerFilter {
  accept = NodeFilter.FILTER_ACCEPT,
  skip = NodeFilter.FILTER_SKIP, // reject this node but not its children
  reject = NodeFilter.FILTER_REJECT, // reject node and children
}

export enum DOMtags {
  div = 'DIV',
  p = 'P',
  main = 'MAIN',
  section = 'SECTION',
  header = 'HEADER',
  footer = 'FOOTER',
  article = 'ARTICLE',
  ul = 'UL',
  ol = 'OL',
  li = 'LI',
  span = 'SPAN',
  strong = 'STRONG',
  em = 'EM',
  u = 'U',
  b = 'B',
  i = 'I',
  a = 'A',
  sub = 'SUB',
  sup = 'SUP',
  br = 'BR',
  input = 'INPUT',
}
