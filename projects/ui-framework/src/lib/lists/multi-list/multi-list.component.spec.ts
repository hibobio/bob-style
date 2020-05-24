import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';
import { MultiListComponent } from './multi-list.component';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { MockComponent } from 'ng-mocks';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { CheckboxComponent } from '../../form-elements/checkbox/checkbox.component';
import {
  simpleChange,
  elementsFromFixture,
  elementFromFixture,
} from '../../services/utils/test-helpers';
import { cloneDeep } from 'lodash';
import {
  mockTranslatePipe,
  TranslateServiceProvideMock,
  mockHighlightPipe,
  listKeyboardServiceStub,
  MobileServiceProvideMock,
} from '../../tests/services.stub.spec';
import { ButtonComponent } from '../../buttons/button/button.component';
import { IconComponent } from '../../icons/icon.component';
import { SearchComponent } from '../../search/search/search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';

describe('MultiListComponent', () => {
  let component: MultiListComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiListComponent>;

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
        {
          value: 'Personal 1',
          id: 11,
          selected: false,
          disabled: true,
        },
        { value: 'Personal 2', id: 12, selected: false },
      ],
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiListComponent,
        ListFooterComponent,
        mockTranslatePipe,
        mockHighlightPipe,
        MockComponent(CheckboxComponent),
        ButtonComponent,
        TextButtonComponent,
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
        fixture = TestBed.createComponent(MultiListComponent);
        component = fixture.componentInstance;
        component.ngOnInit = () => {};
        component.startWithGroupsCollapsed = false;

        component.ngOnChanges(
          simpleChange({
            options: cloneDeep(optionsMock),
          })
        );

        spyOn(component.selectChange, 'emit');
        spyOn(component.apply, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should create selectedIDs based on options', () => {
      component.ngOnChanges({});
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([1]);
    });
    it('should create headerModel based on options', () => {
      component.ngOnChanges({});
      expect(component.listHeaders).toEqual([
        {
          groupName: 'Basic Info Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
          hidden: false,
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
          hidden: false,
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
          hidden: false,
          groupIndex: 0,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: false,
          hidden: false,
          groupIndex: 0,
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
          hidden: false,
          groupIndex: 1,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          hidden: false,
          groupIndex: 1,
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
    it('should set the checkbox of options where (id=1) as checked', () => {
      const checkboxes = fixture.debugElement.queryAll(
        By.css('.option .checkbox')
      );
      expect(checkboxes[0].nativeElement.classList).toContain('selected');
    });
    it('should set the checkbox of options where (id=2,11,12) as unchecked', () => {
      const checkboxes = fixture.debugElement.queryAll(
        By.css('.option .checkbox')
      );
      expect(checkboxes[1].nativeElement.classList).not.toContain('selected');
      expect(checkboxes[2].nativeElement.classList).not.toContain('selected');
      expect(checkboxes[3].nativeElement.classList).not.toContain('selected');
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
    it('should display search if total options is greater than DISPLAY_SEARCH_OPTION_NUM', () => {
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
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
    });
    it('should not display search if total options is smaller than DISPLAY_SEARCH_OPTION_NUM', () => {
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
    it('should display search field when listOptions=empty if total options>DISPLAY_SEARCH_OPTION_NUM', () => {
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
      const headerCollapseTrigger = fixture.debugElement.queryAll(
        By.css('.header-collapse-trigger')
      )[0];
      headerCollapseTrigger.triggerEventHandler('click', null);
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not render options if 2 group are collapsed', () => {
      const headerCollapseTrigger = fixture.debugElement.queryAll(
        By.css('.header-collapse-trigger')
      );
      headerCollapseTrigger[0].triggerEventHandler('click', null);
      headerCollapseTrigger[1].triggerEventHandler('click', null);
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(0);
    });
  });

  describe('option click', () => {
    it('should update selectionMap on option select with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.selectedIDs).toEqual([1, 12]);
    });
    it('should emit event when selecting an option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      const listChange = component[
        'listChangeSrvc'
      ].getListChange(component.options, [1, 12]);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });

    it('should not do anything when clicked on disabled option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[2].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.selectedIDs).not.toContain(11);
      expect(component.selectChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('header checkbox click', () => {
    it('should select all options in group when selecting header', () => {
      const headerCheckbox = fixture.debugElement.query(
        By.css('.header .checkbox')
      ).nativeElement;
      headerCheckbox.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([1, 2]);
    });
    it('should deselect all options in group when deselecting header', () => {
      const headerCheckbox = fixture.debugElement.query(
        By.css('.header .checkbox')
      ).nativeElement;
      headerCheckbox.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([1, 2]);
      headerCheckbox.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([]);
    });
    it('should concat options that are selected and disabled and deselect the rest', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1, selected: false, disabled: false },
            { value: 'Basic Info 2', id: 2, selected: false, disabled: true },
          ],
        },
        {
          groupName: 'Personal Header',
          options: [
            { value: 'Personal 1', id: 11, selected: false, disabled: false },
            { value: 'Personal 2', id: 12, selected: true, disabled: true },
            { value: 'Personal 3', id: 13, selected: false, disabled: false },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();

      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      )[1].nativeElement;
      headerCheckbox.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([12, 11, 13]);
      headerCheckbox.click();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([12]);
    });

    it('should not update options model when header is collapsed', () => {
      const expectedHeaderModel = [
        {
          groupName: 'Basic Info Header',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
          selectedCount: 2,
          hidden: false,
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
          hidden: false,
        },
      ];
      const expectedOptionsModel = [
        {
          isPlaceHolder: true,
          selected: false,
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
          hidden: false,
          groupIndex: 1,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          hidden: false,
          groupIndex: 1,
        },
      ];

      const headerCollapseTrigger = fixture.debugElement.query(
        By.css('.header-collapse-trigger')
      ).nativeElement;
      headerCollapseTrigger.click();
      fixture.detectChanges();

      const headerCheckbox = fixture.debugElement.query(
        By.css('.header .checkbox')
      ).nativeElement;
      headerCheckbox.click();
      fixture.detectChanges();

      expect(component.listHeaders).toEqual(expectedHeaderModel);
      expect(component.listOptions).toEqual(expectedOptionsModel as any);
    });

    it('should emit event when header is selected', () => {
      const headerCheckbox = fixture.debugElement.query(
        By.css('.header .checkbox')
      ).nativeElement;
      headerCheckbox.click();
      fixture.detectChanges();
      const listChange = component[
        'listChangeSrvc'
      ].getListChange(component.options, [1, 2]);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });
  });

  describe('singleList listChange class', () => {
    let listChange;
    beforeEach(() => {
      listChange = component['listChangeSrvc'].getListChange(
        component.options,
        [1, 12]
      );
    });
    it('should return updated options model', () => {
      expect(listChange.getSelectGroupOptions()).toEqual([
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
            { value: 'Personal 2', id: 12, selected: true },
          ],
        },
      ]);
    });
    it('should return selectedId', () => {
      expect(listChange.getSelectedIds()).toEqual([1, 12]);
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
      expect(options[0].nativeElement.innerText).toContain('Basic Info 1');
      expect(headers[0].nativeElement.innerHTML).toContain('Basic Info Header');
    });
  });

  describe('list footer', () => {
    it('should show clear option only by default', () => {
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      expect(listFooter.componentInstance.listActions.clear).toBeTruthy();
      expect(listFooter.componentInstance.listActions.apply).toBeFalsy();
    });

    it('should have all 2 footer options if passed', () => {
      component.listActions = {
        clear: true,
        apply: true,
      };
      fixture.detectChanges();
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      expect(listFooter.componentInstance.listActions).toEqual({
        clear: true,
        apply: true,
      });
    });

    it('should emit apply', () => {
      component.listActions = {
        apply: true,
      };
      fixture.detectChanges();
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.apply.emit();
      expect(component.apply.emit).toHaveBeenCalled();
    });

    it('should clear selection on footer clear emit and emit list change', () => {
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.clear.emit();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([]);
      expect(component.selectChange.emit).toHaveBeenCalled();
      const listChange = component['listChangeSrvc'].getListChange(
        component.options,
        component.selectedIDs
      );
      expect(listChange.getSelectedIds()).toEqual([]);
    });

    it('on clear should set selection map for disabled and selected options', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1, selected: true, disabled: false },
            { value: 'Basic Info 2', id: 2, selected: false, disabled: true },
          ],
        },
        {
          groupName: 'Personal Header',
          options: [
            { value: 'Personal 1', id: 11, selected: false, disabled: true },
            { value: 'Personal 2', id: 12, selected: true, disabled: true },
          ],
        },
      ];
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      fixture.detectChanges();
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.clear.emit();
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([12]);
      expect(component.selectChange.emit).toHaveBeenCalled();
      const listChange = component['listChangeSrvc'].getListChange(
        component.options,
        component.selectedIDs
      );
      expect(listChange.getSelectedIds()).toEqual([12]);
    });
  });

  describe('list footer actions', () => {
    let applyButton: HTMLButtonElement;
    let clearButton: HTMLButtonElement;

    beforeEach(() => {
      component.listActions = {
        clear: true,
        apply: true,
      };
      fixture.detectChanges();

      applyButton = fixture.debugElement.query(By.css('.apply-button button'))
        .nativeElement;
      clearButton = fixture.debugElement.query(By.css('.clear-button'))
        .nativeElement;
    });

    it('should start with Appply disabled', () => {
      expect(applyButton.disabled).toBeTruthy();
    });

    it('should enable Apply button after option click', () => {
      const options = fixture.debugElement.queryAll(
        By.css('.option-select.option')
      );

      options[1].nativeElement.click();
      fixture.detectChanges();
      expect(applyButton.disabled).toBeFalsy();
    });

    it('should set hidden attribute on the Clear button if no options are selected', () => {
      component.ngOnChanges(
        simpleChange({
          options: optionsMock.map((group) => ({
            ...group,
            options: group.options.map((option) => ({
              ...option,
              selected: false,
            })),
          })),
        })
      );
      fixture.detectChanges();

      expect(clearButton.getAttributeNames()).toContain('hidden');
    });

    it('should enable Clear button if some options are selected', () => {
      expect(clearButton.classList).not.toContain('disabled');
    });
  });

  describe('startWithGroupsCollapsed', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          options: cloneDeep(optionsMock),
          startWithGroupsCollapsed: true,
        })
      );

      fixture.detectChanges();
    });

    it('should with groups collapsed, if startWithGroupsCollapsed is true', () => {
      expect(elementsFromFixture(fixture, '.option').length).toEqual(0);
    });
  });

  describe('Reset to default options', () => {
    const optionsMockDef = cloneDeep(optionsMock);
    optionsMockDef[0].options[0].selected = false;
    optionsMockDef[1].options[1].selected = true;
    let clearButton: any;
    let resetButton: HTMLButtonElement;

    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          optionsDefault: optionsMockDef,
        })
      );
      fixture.detectChanges();
      clearButton = elementFromFixture(fixture, '.clear-button');
      resetButton = elementFromFixture(
        fixture,
        '.reset-button [role="button"]'
      ) as HTMLButtonElement;
    });

    it('should remove Clear button if optionsDefault is provided and instead put  Reset button ', () => {
      expect(clearButton).toBeFalsy();
      expect(resetButton).toBeTruthy();
    });

    it('should show Reset button if current value is different from default', () => {
      expect(component.selectedIDs.sort()).not.toEqual(
        component['optionsDefaultIDs'].sort()
      );

      expect(resetButton.getAttributeNames()).not.toContain('hidden');
    });

    it('should reset options to default, when Reset button is clicked, and hide Reset button', () => {
      expect(component.selectedIDs.sort()).not.toEqual(
        component['optionsDefaultIDs'].sort()
      );

      resetButton.click();
      fixture.detectChanges();

      expect(component.selectedIDs.sort()).toEqual(
        component['optionsDefaultIDs'].sort()
      );

      expect(resetButton.parentElement.getAttributeNames()).toContain('hidden');
    });
  });
});
