import { TreeWalkerTake, TreeWalkerFilter } from './dom-helpers.enum';

export interface TreeWalkerConfig {
  take?: TreeWalkerTake;
  filter?: (node: HTMLElement | Node) => TreeWalkerFilter;
  forEach?: (node: HTMLElement | Node) => void | HTMLElement | Node;
}

export interface GetElementStylesConfig {
  getStyles?: 'inline' | 'computed';
  rules: string[];
  ignoreValues?: (string | number)[];
  removeStyleAttr?: boolean;
}
