import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '../../search/search/search.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';
import { FiltersModule } from '../../services/filters/filters.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { simpleChange } from '../../services/utils/test-helpers';

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
      declarations: [SingleListComponent],
      providers: [ListModelService, ListChangeService, ListKeyboardService],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        ScrollingModule,
        FiltersModule,
        ComponentRendererModule,
        ListFooterModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleListComponent);
        component = fixture.componentInstance;
        component.startWithGroupsCollapsed = false;
        spyOn(component.selectChange, 'emit');

        component.ngOnChanges(
          simpleChange({
            options: optionsMock,
          })
        );
        fixture.autoDetectChanges();
      });
  }));

  describe('ngOnChanges', () => {
    it('should create headerModel based on options', () => {
      expect(component.listHeaders).toEqual([
        {
          groupName: 'Basic Info Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
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
          selected: false,
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
      component.ngOnChanges(
        simpleChange({
          options: changedOptions,
        })
      );
      fixture.autoDetectChanges();
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
      fixture.autoDetectChanges();
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
      fixture.autoDetectChanges();
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
      fixture.autoDetectChanges();
      let searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
      component['searchChange']('no possible options');
      fixture.autoDetectChanges();
      expect(component.listOptions.length).toEqual(0);
      searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
    });
  });

  describe('header collapse', () => {
    it('should render 2 options if 1 group is collapsed', () => {
      const header = fixture.debugElement.queryAll(By.css('.header'))[0];
      header.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not render options if 2 group are collapsed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      headers[0].triggerEventHandler('click', null);
      headers[1].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(0);
    });
  });

  describe('option click', () => {
    it('should update value when option is clicked with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.selectedIDs).toEqual([12]);
    });

    it('should emit event when selecting an option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      const listChange = component['listChangeSrvc'].getListChange(
        component.options,
        [12]
      );
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });

    it('should not do anything when clicked on disabled option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[2].triggerEventHandler('click', null);
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
          options: [
            { value: 'Basic Info 1', id: 1, selected: false },
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
      expect(listChange.getSelectedIds()).toEqual([12]);
    });
  });

  describe('searchChange', () => {
    it('should show group header and option that match the search', () => {
      component['searchChange']('info 1');
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(1);
      expect(headers.length).toEqual(1);
      expect(options[0].nativeElement.innerHTML).toContain('Info 1');
      expect(headers[0].nativeElement.innerHTML).toContain('Basic Info Header');
    });
    // Deprecated: Group header search
    xit('should show group headers and no options if search only matches headers', () => {
      component['searchChange']('Personal He');
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(0);
      expect(headers.length).toEqual(1);
      expect(headers[0].nativeElement.innerHTML).toContain('Personal Header');
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
      fixture.autoDetectChanges();
      const clearSelection = fixture.debugElement.query(
        By.css('.clear-selection')
      );
      expect(clearSelection).toBeTruthy();
      expect(clearSelection.nativeElement.innerText).toEqual('— None —');
    });
    it('should call clearList method  on click', () => {
      spyOn(component, 'clearList');

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
      fixture.autoDetectChanges();
      const clearSelection = fixture.debugElement.query(
        By.css('.clear-selection')
      );
      clearSelection.triggerEventHandler('click', null);
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
      fixture.autoDetectChanges();
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
});
