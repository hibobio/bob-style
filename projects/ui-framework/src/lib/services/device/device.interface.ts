import { PlatformType } from './device.enum';

interface Platform {
  type: PlatformType;
  model?: string;
}

interface Browser {
  name: string;
  version: string;
}

export interface DeviceInfo {
  platform: Platform;
  browser: Browser;
}
