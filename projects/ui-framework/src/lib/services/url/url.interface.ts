import { SafeResourceUrl } from '@angular/platform-browser';
import { MediaType } from '../../popups/lightbox/media-embed/media-embed.enum';
import { URLtype } from './url.enum';

export interface VideoData {
  type: URLtype;
  id: string;
  url: string;
  thumb: string;

  thumbAlt?: string;
  thumbMinWidth?: number;
}

export interface MediaData extends Partial<VideoData> {
  mediaType: MediaType;
  safeUrl?: SafeResourceUrl;
}
