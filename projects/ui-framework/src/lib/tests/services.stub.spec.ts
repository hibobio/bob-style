import createSpyObj = jasmine.createSpyObj;
import spyObj = jasmine.SpyObj;
import { of, Observable, EMPTY } from 'rxjs';
import { UtilsService, WinResizeEvent } from '../services/utils/utils.service';
import { MobileService, MediaEvent } from '../services/utils/mobile.service';
import { ScrollEvent } from '../services/utils/utils.interface';
import { MockPipe } from 'ng-mocks';
import { Mock } from 'ts-mocks';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PipeTransform, Pipe } from '@angular/core';
import { ListKeyboardService } from '../lists/list-service/list-keyboard.service';
import { HighlightPipe } from '../services/filters/highlight.pipe';
import { FormatNumberPipe } from '../services/filters/formatNumber.pipe';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { MutationObservableService } from '../services/utils/mutation-observable';

// This file is intentionally named .spec.ts - to fix build problems due to missing jasmine namespace

export const utilsServiceStub: spyObj<UtilsService> = createSpyObj(
  'UtilsService',
  [
    'getResizeEvent',
    'getScrollEvent',
    'getWindowKeydownEvent',
    'getWindowClickEvent',
    'getElementInViewEvent',
  ]
);
utilsServiceStub.getResizeEvent.and.returnValue(of({} as WinResizeEvent));
utilsServiceStub.getScrollEvent.and.returnValue(of({} as ScrollEvent));
utilsServiceStub.getWindowKeydownEvent.and.returnValue(of({} as KeyboardEvent));
utilsServiceStub.getWindowClickEvent.and.returnValue(of({} as MouseEvent));
utilsServiceStub.getElementInViewEvent.and.returnValue(of(true));

export const mobileServiceStub: spyObj<MobileService> = createSpyObj(
  'MobileService',
  ['getMediaEvent', 'getMediaData', 'isMobile']
);
mobileServiceStub.getMediaEvent.and.returnValue(
  of({ matchMobile: false, isMobile: false } as MediaEvent)
);
mobileServiceStub.getMediaData.and.returnValue({
  matchMobile: false,
} as MediaEvent);
mobileServiceStub.isMobile.and.returnValue(false);

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

export const getDOMhelpersMock = () =>
  new Mock<DOMhelpers>({
    getElementCSSvar: () => 'xxx',
    bindClasses: () => ({} as any),
    setCssProps: DOMhelpers.prototype.setCssProps,
    getClosest: (elem) => elem,
  });

export const DOMhelpersProvideMock = (mock: Mock<DOMhelpers> = null) => ({
  provide: DOMhelpers,
  useFactory: () => (mock || getDOMhelpersMock()).Object,
});

export const getMutationObservableServiceMock = () =>
  new Mock<MutationObservableService>({
    getMutationObservable: (element) => of(new Set([element])),
    getResizeObservervable: (element) =>
      of({ width: element.offsetWidth, height: element.offsetHeight }),
  });

export const MutationObservableServiceProvideMock = (
  mock: Mock<MutationObservableService> = null
) => ({
  provide: MutationObservableService,
  useFactory: () => (mock || getMutationObservableServiceMock()).Object,
});
