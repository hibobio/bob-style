import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';
import { MultiListComponent } from './multi-list.component';
import { FiltersModule } from '../../../services/filters/filters.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { MockComponent } from 'ng-mocks';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { SearchModule } from '../../../search/search/search.module';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { ComponentRendererModule } from '../../../services/component-renderer/component-renderer.module';

describe('MultiListComponent', () => {
  let component: MultiListComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiListComponent>;

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
        MultiListComponent,
        MockComponent(ListFooterComponent),
        MockComponent(CheckboxComponent),
      ],
      providers: [ListModelService, ListChangeService, ListKeyboardService],
      imports: [
        CommonModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        ScrollingModule,
        FiltersModule,
        ComponentRendererModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListComponent);
        component = fixture.componentInstance;
        spyOn(component.selectChange, 'emit');
        spyOn(component.apply, 'emit');

        component.ngOnChanges({
          options: {
            previousValue: undefined,
            currentValue: optionsMock,
            firstChange: true,
            isFirstChange: () => true,
          },
          value: {
            previousValue: undefined,
            currentValue: [1, 11],
            firstChange: true,
            isFirstChange: () => true,
          },
        });
        fixture.autoDetectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should create selectedIdsMap based on options', () => {
      component.ngOnChanges({});
      fixture.detectChanges();
      expect(component.selectedIdsMap).toEqual([1]);
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
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
        },
      ]);
    });
    it('should create optionsModel based on options', () => {
      expect(component.listOptions).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info Header',
          value: 'Basic Info Header',
          id: 'Basic Info Header',
          selected: null,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: true,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: false,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal Header',
          value: 'Personal Header',
          id: 'Personal Header',
          selected: null,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          disabled: true,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
        },
      ]);
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
      expect(checkboxes[0].componentInstance.value).toEqual(true);
    });
    it('should set the checkbox of options where (id=2,11,12) as unchecked', () => {
      const checkboxes = fixture.debugElement.queryAll(
        By.css('.option .checkbox')
      );
      expect(checkboxes[1].componentInstance.value).not.toEqual(true);
      expect(checkboxes[2].componentInstance.value).not.toEqual(true);
      expect(checkboxes[3].componentInstance.value).not.toEqual(true);
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: changedOptions,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: changedOptions,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: changedOptions,
          firstChange: false,
          isFirstChange: () => true,
        },
      });
      fixture.autoDetectChanges();
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
      let searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
      component.searchChange('no possible options');
      fixture.autoDetectChanges();
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
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not render options if 2 group are collapsed', () => {
      const headerCollapseTrigger = fixture.debugElement.queryAll(
        By.css('.header-collapse-trigger')
      );
      headerCollapseTrigger[0].triggerEventHandler('click', null);
      headerCollapseTrigger[1].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(0);
    });
  });

  describe('option click', () => {
    it('should update selectionMap on option select with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.selectedIdsMap).toEqual([1, 12]);
    });
    it('should emit event when selecting an option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      const listChange = component['listChangeService'].getListChange(
        component.options,
        [1, 12]
      );
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });

    it('should not do anything when clicked on disabled option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[2].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.selectedIdsMap).not.toContain(11);
      expect(component.selectChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('header checkbox click', () => {
    it('should select all options in group when selecting header', () => {
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      );
      headerCheckbox[0].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.selectedIdsMap).toEqual([1, 2]);
    });
    it('should deselect all options in group when deselecting header', () => {
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      );
      headerCheckbox[0].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.selectedIdsMap).toEqual([1, 2]);
      headerCheckbox[0].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.selectedIdsMap).toEqual([]);
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();

      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      );
      headerCheckbox[1].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.selectedIdsMap).toEqual([12, 11, 13]);
      headerCheckbox[1].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.selectedIdsMap).toEqual([12]);
    });
    it('should not update options model when header is collapsed', () => {
      const expectedHeaderModel = [
        {
          groupName: 'Basic Info Header',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
        },
      ];
      const expectedOptionsModel = [
        {
          isPlaceHolder: true,
          groupName: 'Basic Info Header',
          value: 'Basic Info Header',
          id: 'Basic Info Header',
          selected: null,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal Header',
          value: 'Personal Header',
          id: 'Personal Header',
          selected: null,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
          disabled: true,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false,
        },
      ];
      const headerCollapseTrigger = fixture.debugElement.queryAll(
        By.css('.header-collapse-trigger')
      )[0];
      headerCollapseTrigger.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      );
      headerCheckbox[0].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      expect(component.listHeaders).toEqual(expectedHeaderModel);
      expect(component.listOptions).toEqual(expectedOptionsModel);
    });
    it('should emit event when header is selected', () => {
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('.header .checkbox')
      );
      headerCheckbox[0].componentInstance.changed.emit();
      fixture.autoDetectChanges();
      const listChange = component['listChangeService'].getListChange(
        component.options,
        [1, 2]
      );
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });
  });

  describe('singleList listChange class', () => {
    let listChange;
    beforeEach(() => {
      listChange = component['listChangeService'].getListChange(
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
      component.searchChange('info 1');
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(1);
      expect(headers.length).toEqual(1);
      expect(options[0].nativeElement.innerText.trim()).toEqual('Basic Info 1');
      expect(headers[0].nativeElement.innerText.trim()).toEqual(
        'Basic Info Header'
      );
    });
    it('should show group headers and no options if search only matches headers', () => {
      component.searchChange('Personal He');
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(0);
      expect(headers.length).toEqual(1);
      expect(headers[0].nativeElement.innerText.trim()).toEqual(
        'Personal Header'
      );
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
      fixture.autoDetectChanges();
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
      fixture.autoDetectChanges();
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.apply.emit();
      expect(component.apply.emit).toHaveBeenCalled();
    });

    it('should clear selection on footer clear emit and emit list change', () => {
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.clear.emit();
      fixture.detectChanges();
      expect(component.selectedIdsMap).toEqual([]);
      expect(component.selectChange.emit).toHaveBeenCalled();
      const listChange = component['listChangeService'].getListChange(
        component.options,
        component.selectedIdsMap
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
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: testOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.autoDetectChanges();
      const listFooter = fixture.debugElement.query(By.css('b-list-footer'));
      listFooter.componentInstance.clear.emit();
      fixture.detectChanges();
      expect(component.selectedIdsMap).toEqual([12]);
      expect(component.selectChange.emit).toHaveBeenCalled();
      const listChange = component['listChangeService'].getListChange(
        component.options,
        component.selectedIdsMap
      );
      expect(listChange.getSelectedIds()).toEqual([12]);
    });
  });
});
