import { Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MediaType } from '../../popups/lightbox/media-embed/media-embed.enum';
import { GenericObject } from '../../types';
import { stringify } from '../utils/functional-utils';
import {
  ImageDimensionsService,
  ImageDims,
} from '../utils/image-dimensions.service';
import { log } from '../utils/logger';
import {
  allowedDomainsTest,
  base64imageTest,
  filestackTest,
  imageLinkTest,
  naiveLinkTest,
  URL_UTILS_ALLOWED_DOMAINS_DEF,
} from './url.const';
import { URLtype } from './url.enum';
import { MediaData, VideoData } from './url.interface';

@Injectable({
  providedIn: 'root',
})
export class URLutils {
  constructor(
    private sanitizer: DomSanitizer,
    private imageDimensionsService: ImageDimensionsService
  ) {}

  reconstruct(url: string): string {
    if (!naiveLinkTest.test(url)) {
      return undefined;
    }
    const rec = url.split(/(https?:\/\/)/i);
    return rec.length < 3
      ? `https://${rec[rec.length - 1]}`
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

  getYoutubeVideoID(url: string): string {
    const u = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== u[2] ? u[2].split(/[^0-9a-z_\-]/i)[0] : u[0];
  }

  getVimeoVideoID(url: string): string {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    return url.match(regExp)[5];
  }

  parseVideoURL(url: string, autoplay = true): VideoData {
    const urlData = this.getData(url);

    if (!urlData) {
      return undefined;
    }

    if (urlData.hostname.includes('youtu')) {
      const id = this.getYoutubeVideoID(urlData.href);
      return {
        type: URLtype.youtube,
        id,
        url: `https://www.youtube.com/embed/${id}?autoplay=${
          autoplay ? 1 : 0
        }&rel=0&color=white&iv_load_policy=3&modestbranding=1`,
        thumb: 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg',
        thumbAlt: 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg',
        thumbMinWidth: 120,
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

  isValidImageURL(url: string): boolean {
    let result = false;
    try {
      result = Boolean(this.validateImgUrl(url));
    } catch (e) {}
    return result;
  }

  isValidVideoURL(url: string): boolean {
    let result = false;
    try {
      result = Boolean(this.validateVideoUrl(url));
    } catch (e) {}
    return result;
  }

  /**
   * Simple url domain validation test
   * @param url to test
   * @param allowedHosts array of allowed hosts. check is strict,
   * so include all possible variants (www.hibob.com, app.hibob.com,
   * front.hibob.com, etc); defaults to URL_UTILS_ALLOWED_DOMAINS_DEF
   * @returns boolean indicating if the domain is allowed
   *
   * .
   */
  validateHost(
    url: string,
    allowedHosts: string[] = URL_UTILS_ALLOWED_DOMAINS_DEF
  ): boolean {
    const host = this.domain(url);
    return allowedHosts.includes(host);
  }

  validateImgUrl(url: string): SafeResourceUrl {
    const urlData = this.getData(url);

    if (
      (urlData || base64imageTest.test(url)) &&
      (filestackTest.test(url) || imageLinkTest.test(url))
    ) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        !base64imageTest.test(url) ? this.reconstruct(url) : url
      );
    }

    throw new Error(
      `[URLutils.validateImgUrl]: URL (${url}) is not a valid image URL.`
    );
  }

  validateVideoUrl(url: string): SafeResourceUrl {
    const urlData = this.getData(url);

    if (urlData) {
      for (const key of Object.keys(allowedDomainsTest)) {
        if (allowedDomainsTest[key].test(urlData.hostname)) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(urlData.href);
        }
      }
    }

    throw new Error(
      `[URLutils.validateVideoUrl]: URL (${url}) is not allowed. Allowed URLs are [${stringify(
        Object.keys(allowedDomainsTest)
      )}]`
    );
  }

  getMediaData$(url: string, autoplay = true): Observable<MediaData> {
    //
    const mediaType =
      imageLinkTest.test(url) || filestackTest.test(url)
        ? MediaType.image
        : MediaType.video;

    const mediaData: MediaData = {
      mediaType,
      url,
    };

    return of(mediaData).pipe(
      //
      map(() => {
        try {
          if (mediaData.mediaType === MediaType.image) {
            mediaData.safeUrl = this.validateImgUrl(mediaData.url);
          }

          if (mediaData.mediaType === MediaType.video) {
            const videoData = this.parseVideoURL(mediaData.url, autoplay);
            const safeUrl = this.validateVideoUrl(
              videoData?.url || mediaData.url
            );

            Object.assign(mediaData, videoData, {
              url: mediaData.url,
              safeUrl,
            });
          }
        } catch (error) {
          log.err(error, 'URLutils.getMediaData$');
        }
        return mediaData;
      }),

      switchMap(() => {
        //
        return mediaData.type === URLtype.vimeo
          ? //
            fromFetch(
              `https://vimeo.com/api/v2/video/${mediaData.id}.json`
            ).pipe(
              //
              switchMap((response: Response) => {
                //
                if (response.ok) {
                  return response.json();
                  //
                } else {
                  // vimeo api error usually means the video is private
                  log.err(
                    `\n
Vimeo API Error ${response.status}: ${response.statusText}
>>> Check if video is public and can be shared <<<

`,
                    'URLutils.getMediaData$'
                  );

                  return of([
                    {
                      status: response.status,
                      error: response.statusText,
                    },
                  ]);
                }
              }),
              //
              map(([videoMeta]: GenericObject[]) => {
                const thumb = videoMeta?.thumbnail_large?.split('_640')[0];
                mediaData.thumb =
                  videoMeta?.error || (!thumb && !mediaData.thumb)
                    ? 'http://images.hibob.com/background-images/notFound.jpg'
                    : thumb
                    ? thumb + '_1280x720.jpg'
                    : mediaData.thumb;

                return mediaData;
              })
            )
          : //
          mediaData.type === URLtype.youtube &&
            mediaData['thumbAlt'] &&
            mediaData['thumbMinWidth']
          ? //
            this.imageDimensionsService
              .getImageDimensions$(mediaData.thumb)
              .pipe(
                map((imgDims: ImageDims) => {
                  if (imgDims.width <= mediaData['thumbMinWidth']) {
                    mediaData.thumb = mediaData['thumbAlt'];
                  }
                  return mediaData;
                })
              )
          : //
            of(mediaData);
      }),

      map(() => {
        delete mediaData.thumbAlt;
        delete mediaData.thumbMinWidth;
        return mediaData;
      }),

      catchError((error) => {
        log.err(error, 'URLutils.getMediaData$');
        return of(mediaData);
      })
    );
  }
}
