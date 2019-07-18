export const DEFAULT_FONTS = [
  'sentinel-light', 'sentinel-light-italic',
  'sentinel-regular', 'sentinel-regular-italic',
  'sentinel-medium', 'sentinel-medium-italic',
  'sentinel-semibold', 'sentinel-semibold-italic',
  'sentinel-bold', 'sentinel-bold-italic',
  'sentinel-black', 'sentinel-black-italic'];
export const DEFAULT_SIZES = ['size-sm', 'size-md', 'size-lg'];
export const DEFAULT_COLORS = [
  '#e52c51',
  '#8f233d',
  '#f38161',
  '#f57738',
  '#535353',
  '#9d9d9d'
];

export interface InfoGraphicItem {
  label?: string;
  action?: Function;
  color: string;
  font: string;
  size: string;
}

export interface ColorTextItem {
  label: string;
  action?: Function;
}
