import createSpyObj = jasmine.createSpyObj;
import spyObj = jasmine.SpyObj;
import { of, Observable, EMPTY } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';
import { MobileService, MediaEvent } from '../services/utils/mobile.service';
import { ScrollEvent } from '../services/utils/utils.interface';
import { MockPipe } from 'ng-mocks';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PipeTransform, Pipe } from '@angular/core';
import { ListKeyboardService } from '../lists/list-service/list-keyboard.service';
import { HighlightPipe } from '../services/filters/highlight.pipe';
import { FormatNumberPipe } from '../services/filters/formatNumber.pipe';

// This file is intentionally named .spec.ts - to fix build problems due to missing jasmine namespace

export const utilsServiceStub: spyObj<UtilsService> = createSpyObj(
  'UtilsService',
  [
    'getResizeEvent',
    'getWindowKeydownEvent',
    'getScrollEvent',
    'getWindowClickEvent',
    'getElementInViewEvent',
  ]
);
utilsServiceStub.getResizeEvent.and.returnValue(of({}));
utilsServiceStub.getScrollEvent.and.returnValue(of({} as ScrollEvent));
utilsServiceStub.getWindowKeydownEvent.and.returnValue(of({} as KeyboardEvent));
utilsServiceStub.getWindowClickEvent.and.returnValue(of({} as MouseEvent));
utilsServiceStub.getElementInViewEvent.and.returnValue(of(true));

export const mobileServiceStub: spyObj<MobileService> = createSpyObj(
  'MobileService',
  ['getMediaEvent', 'getMediaData']
);
mobileServiceStub.getMediaEvent.and.returnValue(
  of({ matchMobile: false } as MediaEvent)
);
mobileServiceStub.getMediaData.and.returnValue({
  matchMobile: false,
} as MediaEvent);

export const MobileServiceProvideMock = () => ({
  provide: MobileService,
  useValue: mobileServiceStub,
});

export const listKeyboardServiceStub: spyObj<ListKeyboardService> = createSpyObj(
  'ListKeyboardService',
  ['getKeyboardNavigationObservable']
);
listKeyboardServiceStub.getKeyboardNavigationObservable.and.returnValue(
  EMPTY as Observable<KeyboardEvent>
);

export const mockHighlightPipe = MockPipe(HighlightPipe, (v) => v);

export const mockFormatNumberPipe = MockPipe(FormatNumberPipe, (v) => v as any);

@Pipe({ name: 'translate' })
export class TranslatePipeStub implements PipeTransform {
  transform(value: string, params?: any): string {
    return value;
  }
}

// export const mockTranslatePipe = TranslatePipeStub;

export const mockTranslatePipe = MockPipe(TranslatePipe, (v) => v);

export const translateServiceStub: spyObj<TranslateService> = createSpyObj(
  'TranslateService',
  ['instant', 'get', 'updateValue']
);
translateServiceStub.instant.and.callFake((val) => `translated ${val}`);

export const TranslateServiceProvideMock = () => ({
  provide: TranslateService,
  useValue: translateServiceStub,
});
