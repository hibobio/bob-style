import createSpyObj = jasmine.createSpyObj;
import spyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';
import { MobileService } from '../services/utils/mobile.service';

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
utilsServiceStub.getScrollEvent.and.returnValue(of({}));
utilsServiceStub.getWindowKeydownEvent.and.returnValue(of({}));
utilsServiceStub.getWindowClickEvent.and.returnValue(of({}));
utilsServiceStub.getElementInViewEvent.and.returnValue(of({}));

export const mobileServiceStub: spyObj<MobileService> = createSpyObj(
  'MobileService',
  ['getMediaEvent']
);
mobileServiceStub.getMediaEvent.and.returnValue(of({ matchMobile: false }));
