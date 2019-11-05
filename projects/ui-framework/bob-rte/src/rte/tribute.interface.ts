export interface TributeItem {
  index: number;
  original: any;
  score: number;
  string: string;
}

export interface TributeCollection {
  trigger?: string;
  iframe?: any;
  selectClass?: string;
  selectTemplate?: (item: TributeItem) => string;
  menuItemTemplate?: (item: TributeItem) => string;
  noMatchTemplate?: () => string;
  menuContainer?: Element;
  lookup?: string | ((item: any) => string);
  fillAttr?: string;
  values?:
    | Array<any>
    | ((text: string, cb: (result: Array<any>) => void) => void);
  requireLeadingSpace?: boolean;
  allowSpaces?: boolean;
  replaceTextSuffix?: string;
  positionMenu?: boolean;
  autocompleteMode?: boolean;
  searchOpts?: any;
}

export type TributeOptions =
  | TributeCollection
  | {
      collection: TributeCollection[];
    };

export interface TributeEvents {
  tribute: TributeInstance;
  bind(element: Element): void;
  unbind(element: Element): void;
  keydown(instance, event): void;
  input(instance, event): void;
  click(instance, event): void;
  keyup(instance, event): void;
  shouldDeactivate(event): boolean;
  getKeyCode(instance, el, event): any;
  updateSelection(el: Element): void;
  callbacks(): any;
  setActiveLi(index: number): void;
  getFullHeight(elem: Element, includeMargin: boolean): number;
}

export interface TributeMenuEvents {
  tribute: TributeInstance;
  menu: any;
  bind(menu): void;
  unbind(menu): void;
  debounce(func, wait, immediate): Function;
}

export interface TributeRange {
  tribute: TributeInstance;
  getDocument(): any;
  positionMenuAtCaret(scrollTo: boolean): void;
  menuContainerIsBody(): boolean;
  selectElement(targetElement: Element, path: string, offset: number): void;
  replaceTriggerText(
    text: string,
    requireLeadingSpace,
    hasTrailingSpace,
    originalEvent,
    item
  ): void;
  pasteHtml(html: string, startPos: number, endPos: number): void;
  getWindowSelection(): Selection;
  getNodePositionInParent(element: Element): number;
  getContentEditableSelectedPath(ctx): any;
  getTextPrecedingCurrentSelection(): string;
  getLastWordInText(text: string): string;
  getTriggerInfo(
    menuAlreadyActive,
    hasTrailingSpace,
    requireLeadingSpace,
    allowSpaces,
    isAutocomplete
  ): any;
  lastIndexWithLeadingSpace(str: string, char): number;
  isContentEditable(element: Element): boolean;
  isMenuOffScreen(coordinates, menuDimensions): any;
  getMenuDimensions(): any;
  getTextAreaOrInputUnderlinePosition(element, position, flipped): any;
  getContentEditableCaretPosition(selectedNodePosition): any;
  scrollIntoView(elem: Element): void;
}

export interface TributeSearch {
  tribute: TributeInstance;
  simpleFilter(pattern, array): boolean;
  test(pattern, string): boolean;
  match(pattern, string, opts): any;
  traverse(string, pattern, stringIndex, patternIndex, patternCache): any;
  calculateScore(patternCache): number;
  render(string, indices, pre, post): any;
  filter(pattern, arr, opts): any;
}

export interface TributeInstance {
  isActive: boolean;
  allowSpaces: boolean;
  autocompleteMode: boolean;
  spaceSelectsMatch: boolean;
  hasTrailingSpace: boolean;
  inputEvent: boolean;
  positionMenu: boolean;
  menuContainer: any;
  current: any;
  collection: TributeCollection[];
  events: TributeEvents;
  menuEvents: TributeMenuEvents;
  menuSelected: number;
  range: TributeRange;
  replaceTextSuffix: any;
  search: TributeSearch;

  append(index: number, values: Array<any>, replace?: boolean): void;
  appendCurrent(values: Array<any>, replace?: boolean): void;
  attach(to: Element): void;
  detach(to: Element): void;

  triggers(): any;
  ensureEditable(element: Element): void;
  createMenu(): any;
  showMenuFor(element: Element, scrollTo): void;
  showMenuForCollection(element: Element, collectionIndex?: number): void;
  placeCaretAtEnd(el: Element): void;
  insertTextAtCursor(text: string): void;
  insertAtCaret(textarea, text: string): void;
  hideMenu(): void;
  selectItemAtIndex(index: number, originalEvent): void;
  replaceText(content, originalEvent, item): void;
}
