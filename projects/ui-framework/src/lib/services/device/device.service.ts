import { Injectable } from '@angular/core';
import * as Bowser from 'bowser';
import { DeviceInfo } from './device.interface';
import { PlatformType } from './device.enum';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceInfo;

  public getDeviceInfo(): DeviceInfo {
    if (!this.deviceInfo) {
      this.deviceInfo = this.setDeviceInfo();
    }
    return this.deviceInfo;
  }

  private setDeviceInfo(): DeviceInfo {
    const detector = Bowser.getParser(window.navigator.userAgent);

    const browser = detector.getBrowser();
    const platform = detector.getPlatform();
    const platformInfo = {
      ...{ type: this.getMappedPlatformType(detector.getPlatformType()) },
      ...(platform.model ? { model: platform.model } : {}),
    };

    return {
      platform: platformInfo,
      browser: {
        name: browser.name,
        version: browser.version,
      },
    };
  }

  private getMappedPlatformType(platformType: string): PlatformType {
    const types = {
      'mobile': PlatformType.Mobile,
      'tablet': PlatformType.Tablet,
      'desktop': PlatformType.Desktop,
      default: PlatformType.Desktop,
    };
    return types[platformType] || types.default;
  }
}
