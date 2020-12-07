import createSpyObj = jasmine.createSpyObj;
import spyObj = jasmine.SpyObj;
import { of, Observable, EMPTY } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';
import { MobileService, MediaEvent } from '../services/utils/mobile.service';
import { ScrollEvent, WinResizeEvent } from '../services/utils/utils.interface';
import { MockPipe } from 'ng-mocks';
import { Mock } from 'ts-mocks';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  PipeTransform,
  Pipe,
  NgModule,
  Component,
  Input,
  NgZone,
  TrackByFunction,
} from '@angular/core';
import { ListKeyboardService } from '../lists/list-service/list-keyboard.service';
import { HighlightPipe } from '../services/filters/highlight.pipe';
import { FormatNumberPipe } from '../services/filters/formatNumber.pipe';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { MutationObservableService } from '../services/utils/mutation-observable';
import { CommonModule } from '@angular/common';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';
import { TooltipPosition } from '@angular/material/tooltip';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { TruncateTooltipComponent } from '../popups/truncate-tooltip/truncate-tooltip.component';
import { WindowLike, WindowRef } from '../services/utils/window-ref.service';
import { simpleUID } from '../services/utils/functional-utils';

// This file is intentionally named .spec.ts - to fix build problems due to missing jasmine namespace

@Pipe({ name: 'trackByProp' })
export class TrackByPropPipeStub implements PipeTransform {
  transform(value: string | string[], params?: any): TrackByFunction<any> {
    return (index, item) => simpleUID();
  }
}

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
// utilsServiceStub.getElementInViewEvent.and.returnValue(of(true));

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
    mutate: (func) => {
      setTimeout(() => {
        func();
      }, 0);
    },
    measure: (func) => {
      setTimeout(() => {
        func();
      }, 0);
    },
    getClosest: (elem) => elem,
    bindClasses: DOMhelpers.prototype.bindClasses,
    setAttributes: DOMhelpers.prototype.setAttributes,
    setCssProps: DOMhelpers.prototype.setCssProps,
    getElementTextProps: DOMhelpers.prototype.getElementTextProps,
    getDeepTextElement: DOMhelpers.prototype.getDeepTextElement,
    isEmpty: DOMhelpers.prototype.isEmpty,
    hasChildren: DOMhelpers.prototype.hasChildren,
    hasInnerText: DOMhelpers.prototype.hasInnerText,
    hasChildrenWithText: DOMhelpers.prototype.hasChildrenWithText,
    hasTextNodes: DOMhelpers.prototype.hasTextNodes,
    getTextNode: DOMhelpers.prototype.getTextNode,
    isTextNode: DOMhelpers.prototype.isTextNode,
  });

export const DOMhelpersProvideMock = (mock: Mock<DOMhelpers> = null) => ({
  provide: DOMhelpers,
  useFactory: () => (mock || getDOMhelpersMock()).Object,
});

export const getNgZoneMock = () =>
  new Mock<NgZone>({
    ...new NgZone({
      enableLongStackTrace: false,
      shouldCoalesceEventChangeDetection: true,
    }),
    runOutsideAngular: (fnc) => fnc(),
    run: (fnc) => fnc(),
  });

export const NgZoneProvideMock = (mock: Mock<NgZone> = null) => ({
  provide: NgZone,
  useFactory: () => (mock || getNgZoneMock()).Object,
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

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: ` <div
    #textContainer
    class="btt initialized"
    [class.tooltip-enabled]="tooltipText?.length > 20"
    data-max-lines="1"
  >
    {{ tooltipText }}
    <ng-content></ng-content>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [
    {
      provide: TruncateTooltipComponent,
      useExisting: TruncateTooltipMockComponent,
    },
  ],
})
export class TruncateTooltipMockComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('text') tooltipText: string;

  // tslint:disable-next-line: no-input-rename
  @Input('maxLines')
  @Input('b-truncate-tooltip')
  maxLines: number;

  @Input() delay: number;
  @Input() lazyness: number;
  @Input() expectChanges: boolean;
  @Input() trustCssVars: boolean;
  @Input() type: TruncateTooltipType;
  @Input() position: TooltipPosition;
  @Input() tooltipClass: TooltipClass | string | (TooltipClass | string)[];

  public tooltipEnabled = true;
  public tooltipAllowed = true;
  public initialized = true;
}

@NgModule({
  declarations: [TruncateTooltipMockComponent],
  imports: [CommonModule],
  exports: [TruncateTooltipMockComponent],
  providers: [],
})
export class MockCompsModule {}

export const getWindowRefMock = () =>
  new Mock<WindowRef>({
    nativeWindow: ({
      open: () => {},
      location: {
        hash: '',
        href: '',
        hostname: 'hostname',
        search: 'search',
        pathname: 'pathname',
        reload: () => {},
      },
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
      sessionStorage: {
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      },
      analytics: {
        identify: () => {},
        alias: () => {},
        group: () => {},
        track: () => {},
        reset: () => {},
        page: () => {},
      },
      history: {
        state: {},
        pushState: () => {},
        back: () => {},
      },
      requestAnimationFrame: (fn) => {
        setTimeout(() => {
          fn();
        }, 0);
      },
    } as any) as WindowLike,
    isEmbedMode: () => false,
  });

export const WindowRefProvideMock = (mock: Mock<WindowRef> = null) => ({
  provide: WindowRef,
  useFactory: () => (mock || getWindowRefMock()).Object,
});
