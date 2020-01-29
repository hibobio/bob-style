import createSpyObj = jasmine.createSpyObj;
import spyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';
import { MobileService, MediaEvent } from '../services/utils/mobile.service';
import { ScrollEvent } from '../services/utils/utils.interface';

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
  ['getMediaEvent']
);
mobileServiceStub.getMediaEvent.and.returnValue(
  of({ matchMobile: false } as MediaEvent)
);
