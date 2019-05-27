import { Injectable } from '@angular/core';

@Injectable()
export class SocialService {
  constructor() {
  }

  static inputTransformOut(prefix: string, eventValue: string): string {
    return `${prefix}${eventValue}`;
  }

  static inputToSocialFormat(value: string): string {
    return value.split('/')[1];
  }

}
