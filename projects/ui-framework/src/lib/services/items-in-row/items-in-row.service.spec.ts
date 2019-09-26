import {ItemsInRowService} from './items-in-row.service';
import {UtilsService} from '../utils/utils.service';
import {DOMhelpers} from 'bob-style';
import {interval} from 'rxjs';


describe('ItemsInRowService', () => {
  let service: ItemsInRowService;
  let DOMHelper: DOMhelpers;
  let utilsService: UtilsService;

  beforeEach(() => {
    DOMHelper = <any>{
      setCssProps: jasmine.createSpy(),
      getInnerWidth: jasmine.createSpy()
    };
    utilsService = <any>{
      getResizeEvent: jasmine.createSpy().and.returnValue(interval())
    };
    service = new ItemsInRowService(DOMHelper, utilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
