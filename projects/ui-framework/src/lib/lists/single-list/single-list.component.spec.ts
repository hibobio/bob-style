import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import {} from '../../services/utils/test-helpers';
import {
  mockTranslatePipe,
  TranslateServiceProvideMock,
  listKeyboardServiceStub,
  mockHighlightPipe,
  MobileServiceProvideMock,
} from '../../tests/services.stub.spec';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../buttons/button/button.component';
import { SearchComponent } from '../../search/search/search.component';
import { simpleChange } from '../../services/utils/functional-utils';

describe('SingleListComponent', () => {
  let component: SingleListComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<SingleListComponent>;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info Header',

        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false },
        ],
      },
      {
        groupName: 'Personal Header',
        options: [
          { value: 'Personal 1', id: 11, selected: false, disabled: true },
          { value: 'Personal 2', id: 12, selected: false },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleListComponent,
        ListFooterComponent,
        mockTranslatePipe,
        mockHighlightPipe,
        MockComponent(ButtonComponent),
        MockComponent(IconComponent),
        MockComponent(SearchComponent),
      ],
      imports: [CommonModule, NoopAnimationsModule, ScrollingModule],
      providers: [
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        MobileServiceProvideMock(),
        TranslateServiceProvideMock(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleListComponent);
        component = fixture.componentInstance;
        component.ngOnInit = () => {};

        component.ngOnChanges(
          simpleChange({
            options: optionsMock,
            startWithGroupsCollapsed: false,
          })
        );
        fixture.detectChanges();
      });
  }));

  describe('ngOnChanges', () => {
    it('should create headerModel based on options', () => {
      expect(component.listHeaders).toEqual([
        {
          groupName: 'Basic Info Header',
          key: '0__Basic Info Header',
          groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
          hasCheckbox: false,
          groupIsOption: false,
        },
        {
          groupName: 'Personal Header',
          key: '1__Personal Header',
          groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
          hasCheckbox: false,
          groupIsOption: false,
        },
      ]);
    });
    it('should create optionsModel based on options', () => {
      expect(component.listOptions).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 0,
          key: '0__Basic Info Header',
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 0,
          key: '0__Basic Info Header',
        },
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          disabled: true,
          groupIndex: 1,
          key: '1__Personal Header',
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 1,
          key: '1__Personal Header',
        },
      ] as any);
    });
    it('should render 2 headers', () => {
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(headers.length).toEqual(2);
    });
    it('should render 4 options', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(4);
    });
    it('should set selected option (id=1) with class selected', () => {
      const option = fixture.debugElement.queryAll(By.css('.option'))[0];
      expect(option.nativeElement.classList).toContain('selected');
    });
    it('should not set the selected option (id=2) with class selected', () => {
      const option = fixture.debugElement.queryAll(By.css('.option'))[1];
      expect(option.nativeElement.classList).not.toContain('selected');
    });
    it('should rerender lists if simpleChanges includes options', () => {
      let options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(4);
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
            { value: 'Basic Info 2', id: 2 },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: changedOptions,
        })
      );
      fixture.detectChanges();
      options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not show group header if options.length=1 && showSingleGroupHeader=false (default)', () => {
      let options = fixture.debugElement.queryAll(By.css('.option'));
      let headers = fixture.debugElement.queryAll(By.css('.header'));
      let headerPlaceholder = fixture.debugElement.queryAll(
        By.css('.header-placeholder')
      );
      expect(options.length).toEqual(4);
      expect(headers.length).toEqual(2);
      expect(headerPlaceholder.length).toEqual(2);
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
            { value: 'Basic Info 2', id: 2 },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: changedOptions,
        })
      );
      fixture.detectChanges();
      options = fixture.debugElement.queryAll(By.css('.option'));
      headers = fixture.debugElement.queryAll(By.css('.header'));
      headerPlaceholder = fixture.debugElement.queryAll(
        By.css('.header-placeholder')
      );
      expect(options.length).toEqual(2);
      expect(headers.length).toEqual(0);
      expect(headerPlaceholder.length).toEqual(0);
    });
    it('should show group header if showSingleGroupHeader=true', () => {
      component.showSingleGroupHeader = true;
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
            { value: 'Basic Info 2', id: 2 },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: changedOptions,
        })
      );
      fixture.detectChanges();
      expect(component.noGroupHeaders).toBe(false);
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headerPlaceholder = fixture.debugElement.queryAll(
        By.css('.header-placeholder')
      );
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(2);
      expect(headerPlaceholder.length).toEqual(1);
      expect(headers.length).toEqual(1);
    });
    it('should display search if list is greater than DISPLAY_SEARCH_OPTION_NUM', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
            { value: 'Basic Info 2', id: 2 },
            { value: 'Basic Info 3', id: 3 },
            { value: 'Basic Info 4', id: 4 },
            { value: 'Basic Info 5', id: 5 },
            { value: 'Basic Info 6', id: 6 },
          ],
        },
        {
          groupName: 'Personal Header',
          options: [
            { value: 'Personal 1', id: 11 },
            { value: 'Personal 2', id: 12 },
            { value: 'Personal 3', id: 13 },
            { value: 'Personal 4', id: 14 },
            { value: 'Personal 5', id: 15 },
            { value: 'Personal 6', id: 16 },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
    });
    it('should not display search if list is smaller than DISPLAY_SEARCH_OPTION_NUM', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }],
        },
        {
          groupName: 'Personal Header',
          options: [{ value: 'Personal 1', id: 11 }],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeFalsy();
    });
    it('should display search field also when listOptions=empty if total option>DISPLAY_SEARCH_OPTION_NUM', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1, selected: false },
            { value: 'Basic Info 2', id: 2, selected: false },
            { value: 'Basic Info 3', id: 3, selected: false },
            { value: 'Basic Info 4', id: 4, selected: false },
            { value: 'Basic Info 5', id: 5, selected: false },
            { value: 'Basic Info 6', id: 6, selected: false },
          ],
        },
        {
          groupName: 'Personal Header',
          options: [
            { value: 'Personal 1', id: 11, selected: false },
            { value: 'Personal 2', id: 12, selected: false },
            { value: 'Personal 3', id: 13, selected: false },
            { value: 'Personal 4', id: 14, selected: false },
            { value: 'Personal 5', id: 15, selected: false },
            { value: 'Personal 6', id: 16, selected: false },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      let searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
      component['searchChange']('no possible options');
      fixture.detectChanges();
      expect(component.listOptions.length).toEqual(0);
      searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
    });
  });

  describe('header collapse', () => {
    it('should render 2 options if 1 group is collapsed', () => {
      const header = fixture.debugElement.queryAll(By.css('.header'))[0]
        .nativeElement;
      header.click();
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not render options if 2 group are collapsed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      headers[0].nativeElement.click();
      headers[1].nativeElement.click();
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(0);
    });
  });

  describe('option click', () => {
    it('should update value when option is clicked with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].nativeElement.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([12]);
    });

    it('should emit event when selecting an option', () => {
      spyOn(component.selectChange, 'emit').and.callThrough();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].nativeElement.click();
      const listChange = component[
        'listChangeSrvc'
      ].getListChange(component.options, [12]);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });

    it('should not do anything when clicked on disabled option', () => {
      spyOn(component.selectChange, 'emit').and.callThrough();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[2].nativeElement.click();
      fixture.detectChanges();
      expect(component.selectedIDs).not.toEqual([11]);
      expect(component.selectChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('singleList listChange class', () => {
    let listChange;
    beforeEach(() => {
      listChange = component['listChangeSrvc'].getListChange(
        component.options,
        [12]
      );
    });

    it('should return updated options model', () => {
      expect(listChange.getSelectGroupOptions()).toEqual([
        {
          groupName: 'Basic Info Header',
          key: '0__Basic Info Header',
          groupIndex: 0,
          options: [
            { value: 'Basic Info 1', id: 1, selected: false },
            { value: 'Basic Info 2', id: 2, selected: false },
          ],
        },
        {
          groupName: 'Personal Header',
          key: '1__Personal Header',
          groupIndex: 1,
          options: [
            { value: 'Personal 1', id: 11, selected: false, disabled: true },
            { value: 'Personal 2', id: 12, selected: true },
          ],
        },
      ]);
    });
    it('should return selectedId', () => {
      expect(listChange.getSelectedIds()).toEqual([12]);
    });
  });

  describe('searchChange', () => {
    it('should show group header and option that match the search', () => {
      component['searchChange']('info 1');
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(1);
      expect(headers.length).toEqual(1);
      expect(options[0].nativeElement.innerHTML).toContain('Info 1');
      expect(headers[0].nativeElement.innerHTML).toContain('Basic Info Header');
    });
  });

  describe('-None-', () => {
    it('should not show -None- button by default', () => {
      const clearSelection = fixture.debugElement.query(
        By.css('.clear-selection')
      );
      expect(clearSelection).toBeFalsy();
    });
    it('should show -None- button if showNoneOption is true', () => {
      component.showNoneOption = true;
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      const clearSelection = fixture.debugElement.query(
        By.css('.clear-selection')
      );
      expect(clearSelection).toBeTruthy();
      expect(clearSelection.nativeElement.innerText).toEqual('— None —');
    });
    it('should call clearList method  on click', () => {
      spyOn(component, 'clearList').and.callThrough();

      component.showNoneOption = true;
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      const clearSelection = fixture.debugElement.query(
        By.css('.clear-selection')
      );
      clearSelection.nativeElement.click();
      expect(component.clearList).toHaveBeenCalled();
    });
  });

  describe('getListHeight', () => {
    const updateList = () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
            { value: 'Basic Info 2', id: 2 },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
    };
    it('should return options.length * listElHeight', () => {
      updateList();

      const listHeight = component.getListHeight();
      expect(listHeight).toEqual(88);
      const vScrollWrapper = fixture.debugElement.query(
        By.css('.v-scroll-wrapper')
      );
      const styles = getComputedStyle(vScrollWrapper.nativeElement);
      expect(styles.height).toEqual('88px');
    });
    it('should add another row if showNoneOption is true', () => {
      component.showNoneOption = true;
      updateList();

      const listHeight = component.getListHeight();
      expect(listHeight).toEqual(132);
      const vScrollWrapper = fixture.debugElement.query(
        By.css('.v-scroll-wrapper')
      );
      const styles = getComputedStyle(vScrollWrapper.nativeElement);
      expect(styles.height).toEqual('132px');
    });
  });

  describe('No results were found.', () => {
    it(`should not show 'no results were found.' message`, () => {
      component['searchChange']('info 1');
      fixture.detectChanges();
      const noResultsMessageElements = fixture.debugElement.queryAll(
        By.css('.empty-state-message')
      );
      expect(noResultsMessageElements.length).toEqual(0);
    });

    it(`should show 'no results were found.' message`, () => {
      component['searchChange']('˚ß∂∆ƒ˚ß∆ƒ');
      fixture.detectChanges();
      const noResultsMessageElements = fixture.debugElement.queryAll(
        By.css('.empty-state-message')
      );
      expect(noResultsMessageElements.length).toEqual(1);
    });
  });

  describe('.v-scroll-wrapper min-height', () => {
    it('should have min-height property set', () => {
      const vScrollWrapperDiv = fixture.debugElement.queryAll(
        By.css('.v-scroll-wrapper')
      )[0];
      expect(component['listMinHeight']).toBeGreaterThan(0);
      expect(vScrollWrapperDiv.nativeElement.style.minHeight).toBeTruthy();
    });
  });
});
