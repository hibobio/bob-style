import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { stringify } from '../utils/functional-utils';
import {
  allowedDomainsTest,
  naiveLinkTest,
  imageLinkTest,
  base64imageTest,
  filestackTest,
} from './url.const';
import { VideoData } from './url.interface';
import { URLtype } from './url.enum';

@Injectable()
export class URLutils {
  constructor(private sanitizer: DomSanitizer) {}

  reconstruct(url: string): string {
    if (!naiveLinkTest.test(url)) {
      return undefined;
    }
    const rec = url.split(/(https?:\/\/)/i);
    return rec.length < 3
      ? `http://${rec[rec.length - 1]}`
      : `${rec[1]}${rec[2]}`;
  }

  getData(url: string): URL {
    const rec = this.reconstruct(url);
    let urlData: URL;
    try {
      urlData = new URL(rec);
    } catch {}
    return urlData;
  }

  domain(url: string) {
    const data = this.getData(url);
    return data ? data.hostname : undefined;
  }

  path(url: string) {
    const data = this.getData(url);
    return !url
      ? undefined
      : !data ||
        url === data.hostname ||
        (data.pathname === '/' && !data.hash && !data.search)
      ? url
      : data.pathname.substr(1) + data.search + data.hash;
  }

  validateImg(url: string): string {
    if (filestackTest.test(url)) {
      return this.reconstruct(url);
    }
    if (imageLinkTest.test(url)) {
      return !base64imageTest.test(url) ? this.reconstruct(url) : url;
    }
    throw new Error(`URL (${url}) is not a valid image URL.`);
  }

  domainAllowed(url: string): SafeResourceUrl {
    const urlData = this.getData(url);

    if (urlData) {
      for (const key of Object.keys(allowedDomainsTest)) {
        if (allowedDomainsTest[key].test(urlData.hostname)) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(urlData.href);
        }
      }
    }

    throw new Error(
      `[URLutils Service]: URL (${url}) is not allowed. Allowed URLs are [${stringify(
        Object.keys(allowedDomainsTest)
      )}]`
    );
  }

  getYoutubeVideoID(url: string): string {
    const u = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== u[2] ? u[2].split(/[^0-9a-z_\-]/i)[0] : u[0];
  }

  getVimeoVideoID(url: string): string {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    return url.match(regExp)[5];
  }

  parseVideoURL(url: string): VideoData {
    const urlData = this.getData(url);

    if (!urlData) {
      return undefined;
    }

    if (urlData.hostname.includes('youtu')) {
      const id = this.getYoutubeVideoID(urlData.href);
      return {
        type: URLtype.youtube,
        id,
        url:
          'https://www.youtube.com/embed/' +
          id +
          '?autoplay=1&rel=0&color=white&iv_load_policy=3&modestbranding=1',
        thumb: 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg',
      };
    }

    if (urlData.hostname.includes('vimeo')) {
      const id = this.getVimeoVideoID(urlData.href);
      return {
        type: URLtype.vimeo,
        id,
        url:
          'https://player.vimeo.com/video/' +
          id +
          '?autoplay=1&title=0&byline=0&portrait=0',
        thumb: 'https://i.vimeocdn.com/video/' + id + '_1280x720.jpg',
      };
    }

    return undefined;
  }
}
