import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { stringify } from '../utils/functional-utils';
import { allowedDomainsTest, naiveLinkTest, imageLinkTest } from './url.const';

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
    return rec ? new URL(rec) : undefined;
  }

  domain(url: string) {
    const data = this.getData(url);
    return data ? data.hostname : undefined;
  }

  validateImg(url: string): string {
    if (imageLinkTest.test(url)) {
      return this.reconstruct(url);
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
      `URL (${url}) is not allowed. Allowed URLs are [${stringify(
        Object.keys(allowedDomainsTest)
      )}]`
    );
  }
}
