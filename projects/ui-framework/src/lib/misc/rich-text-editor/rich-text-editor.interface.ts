import { BlotType } from './rich-text-editor.enum';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
}

interface UpdateRteConfigFormat {
  type: BlotType;
  value: string;
}

export interface RteLink {
  text: string;
  url: string;
}
