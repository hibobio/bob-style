export interface Styles {
  [property: string]: string | number;
}

export interface TextProps {
  [property: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}

export interface NgClass {
  [className: string]: boolean;
}

export type HtmlLangs = 'hebrew' | 'russian';
export type HtmlAttrs =
  | 'dir'
  | 'lang'
  | 'class'
  | 'style'
  | 'alt'
  | 'href'
  | 'id'
  | 'rel'
  | 'src'
  | 'target'
  | 'title'
  | 'valign'
  | 'contenteditable'
  | 'spellcheck'
  | 'tabindex'
  | string;
