import { URLtype } from './url.enum';

export interface VideoData {
  type: URLtype;
  id: string;
  url: string;
  thumb: string;
  thumbAlt?: string;
  thumbMinWidth?: number;
}
