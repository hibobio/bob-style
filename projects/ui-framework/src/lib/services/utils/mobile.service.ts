import { Injectable } from '@angular/core';
import { mobileBreakpoint } from '../../consts';
import { Observable } from 'rxjs';
import { UtilsService, WinResizeEvent } from './utils.service';
import {
  shareReplay,
  map,
  startWith,
  distinctUntilChanged,
} from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { isEqual } from 'lodash';

export enum WidthMode {
  min = 'min',
  max = 'max',
}

export interface MediaEvent {
  matchMobile: boolean;
  matchDesktop: boolean;
  isTouchDevice: boolean;
  isMobileBrowser: boolean;
  mobileOS: MobileOS;
  isMobile: boolean;
  width: number;
}

export enum MobileOS {
  iOS = 'iOS',
  windowsPhone = 'windowsPhone',
  android = 'android',
}

class DocumentTouch {}

@Injectable({
  providedIn: 'root',
})
export class MobileService {
  mediaEvent$: Observable<MediaEvent>;
  isMobBrowser: boolean;
  isTouchDevice: boolean;
  mobileOS?: MobileOS;

  constructor(
    private windowRef: WindowRef,
    private utilsService: UtilsService
  ) {
    this.isMobBrowser = this.checkForMobileBrowser();
    this.mobileOS = this.getMobileOperatingSystem();
    this.isTouchDevice = this.checkForTouchDevice();
    this.mediaEvent$ = this.utilsService.getResizeEvent().pipe(
      startWith(this.getMediaData()),
      map((e: WinResizeEvent) => this.getMediaData()),
      distinctUntilChanged(isEqual),
      shareReplay(1)
    );
  }

  public matchMedia(query: string): boolean {
    return this.windowRef.nativeWindow.matchMedia(query).matches;
  }

  public matchBreakpoint(
    point: number = mobileBreakpoint,
    mode: WidthMode = WidthMode.max
  ) {
    return this.matchMedia(`(${mode}-width: ${point}px)`);
  }

  public getMediaEvent(): Observable<MediaEvent> {
    return this.mediaEvent$;
  }

  public isMobileBrowser(): boolean {
    return this.isMobBrowser;
  }

  private getMobileOperatingSystem(): MobileOS {
    const userAgent = this.getUserAgent();

    if (/windows phone/i.test(userAgent)) {
      return MobileOS.windowsPhone;
    }

    if (/android/i.test(userAgent)) {
      return MobileOS.android;
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    // @ts-ignore
    if (/ipad|iphone|ipod/i.test(userAgent) && !window.MSStream) {
      return MobileOS.iOS;
    }

    return null;
  }

  private checkForMobileBrowser(): boolean {
    // @ts-ignore
    const a = this.getUserAgent();
    return (
      // tslint:disable-next-line: max-line-length
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      // tslint:disable-next-line: max-line-length
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    );
  }

  private getUserAgent() {
    // @ts-ignore
    return navigator.userAgent || navigator.vendor || window.opera;
  }

  private checkForTouchDevice(): boolean {
    if (
      this.matchMedia('(any-pointer: coarse)') ||
      'ontouchstart' in this.windowRef.nativeWindow ||
      (this.windowRef.nativeWindow.DocumentTouch &&
        document instanceof DocumentTouch)
    ) {
      return true;
    }
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return this.matchMedia(query);
  }

  public getMediaData(): MediaEvent {
    const matchMobile = this.matchBreakpoint(mobileBreakpoint, WidthMode.max);
    return {
      width: this.windowRef.nativeWindow.innerWidth,
      matchMobile,
      matchDesktop: this.matchBreakpoint(mobileBreakpoint + 1, WidthMode.min),
      isTouchDevice: this.isTouchDevice,
      isMobileBrowser: this.isMobBrowser,
      mobileOS: this.mobileOS,
      isMobile: Boolean(matchMobile || this.isMobBrowser || this.mobileOS),
    };
  }
}
