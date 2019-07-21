export const DEFAULT_FONT_STYLES = ['italic', 'normal'];
export const DEFAULT_FONT_WEIGHTS = [400, 600, 800];
export const DEFAULT_FONT_SIZES = ['30px', '35px', '38px'];
export const DEFAULT_COLORS = [
  '#e52c51',
  '#8f233d',
  '#f38161',
  '#f57738',
  '#535353',
  '#9d9d9d'
];

export interface ColorTextItem {
  label: string;
  action?: Function;
}

export interface InfoGraphicItem extends ColorTextItem {
  styles: InfoGraphicItemStyle;
}

export interface InfoGraphicItemStyle {
  color: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
}
