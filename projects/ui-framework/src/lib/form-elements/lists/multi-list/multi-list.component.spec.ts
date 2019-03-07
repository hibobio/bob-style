import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPseudoCheckboxModule,
  MatTooltipModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '../../../navigation/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { InputModule } from '../../input/input.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { By } from '@angular/platform-browser';
import { MultiListComponent } from './multi-list.component';
import { FiltersModule } from '../../../filters/filters.module';
import { ListOptionModule } from '../list-option/list-option.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';

describe('MultiListComponent', () => {
  let component: MultiListComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiListComponent>;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info Header',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ]
      },
      {
        groupName: 'Personal Header',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ]
      }
    ];

    TestBed.configureTestingModule({
      declarations: [
        MultiListComponent,
      ],
      providers: [
        ListModelService,
        ListKeyboardService,
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        MatTooltipModule,
        ScrollingModule,
        MatPseudoCheckboxModule,
        FiltersModule,
        ListOptionModule,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListComponent);
        component = fixture.componentInstance;
        spyOn(component.selectChange, 'emit');
        component.ngOnChanges({
          options: {
            previousValue: undefined, currentValue: optionsMock, firstChange: true, isFirstChange: () => true,
          },
          value: {
            previousValue: undefined, currentValue: [1, 11], firstChange: true, isFirstChange: () => true,
          },
        });
        fixture.autoDetectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should create headerModel based on options', () => {
      component.ngOnChanges({});
      expect(component.listHeaders).toEqual([
        {
          groupName: 'Basic Info Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false
        }
      ]);
    });
    it('should create optionsModel based on options', () => {
      expect(component.listOptions).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info Header',
          value: 'Basic Info Header',
          id: 'Basic Info Header',
          selected: null
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info Header',
          isPlaceHolder: false,
          selected: false
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal Header',
          value: 'Personal Header',
          id: 'Personal Header',
          selected: null
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false
        }
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
    it('should set the checkbox of options where (id=1,11) as checked', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('.option .checkbox'));
      expect(checkboxes[0].nativeElement.getAttribute('ng-reflect-state')).toEqual('checked');
      expect(checkboxes[2].nativeElement.getAttribute('ng-reflect-state')).toEqual('checked');
    });
    it('should set the checkbox of options where (id=2,12) as unchecked', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('.option .checkbox'));
      expect(checkboxes[1].nativeElement.getAttribute('ng-reflect-state')).toEqual('unchecked');
      expect(checkboxes[3].nativeElement.getAttribute('ng-reflect-state')).toEqual('unchecked');
    });
    it('should rerender lists if simpleChanges includes options', () => {
      let options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(4);
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }, { value: 'Basic Info 2', id: 2 }]
        },
      ];
      component.ngOnChanges({
        options:
          {
            previousValue: undefined, currentValue: changedOptions, firstChange: false, isFirstChange: () => false,
          }
      });
      fixture.autoDetectChanges();
      options = fixture.debugElement.queryAll(By.css('.option'));
      expect(options.length).toEqual(2);
    });
    it('should not show group header if options.length=1 && showSingleGroupHeader=false (default)', () => {
      let options = fixture.debugElement.queryAll(By.css('.option'));
      let headers = fixture.debugElement.queryAll(By.css('.header'));
      let headerPlaceholder = fixture.debugElement.queryAll(By.css('.header-placeholder'));
      expect(options.length).toEqual(4);
      expect(headers.length).toEqual(2);
      expect(headerPlaceholder.length).toEqual(2);
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }, { value: 'Basic Info 2', id: 2 }]
        },
      ];
      component.ngOnChanges({
        options:
          {
            previousValue: undefined, currentValue: changedOptions, firstChange: false, isFirstChange: () => true,
          }
      });
      fixture.autoDetectChanges();
      options = fixture.debugElement.queryAll(By.css('.option'));
      headers = fixture.debugElement.queryAll(By.css('.header'));
      headerPlaceholder = fixture.debugElement.queryAll(By.css('.header-placeholder'));
      expect(options.length).toEqual(2);
      expect(headers.length).toEqual(0);
      expect(headerPlaceholder.length).toEqual(0);
    });
    it('should show group header if showSingleGroupHeader=true', () => {
      component.showSingleGroupHeader = true;
      const changedOptions = [
        {
          groupName: 'Basic Info Header',
          options: [{ value: 'Basic Info 1', id: 1 }, { value: 'Basic Info 2', id: 2 }]
        },
      ];
      component.ngOnChanges({
        options:
          {
            previousValue: undefined, currentValue: changedOptions, firstChange: false, isFirstChange: () => true,
          }
      });
      fixture.autoDetectChanges();
      expect(component.noGroupHeaders).toBe(false);
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headerPlaceholder = fixture.debugElement.queryAll(By.css('.header-placeholder'));
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
          ]
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
          ]
        }
      ];
      component.ngOnChanges({
        options:
          {
            previousValue: undefined, currentValue: testOptionsMock, firstChange: false, isFirstChange: () => false,
          }
      });
      fixture.autoDetectChanges();
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeTruthy();
    });
    it('should not display search if list is smaller than DISPLAY_SEARCH_OPTION_NUM', () => {
      const testOptionsMock = [
        {
          groupName: 'Basic Info Header',
          options: [
            { value: 'Basic Info 1', id: 1 },
          ]
        },
        {
          groupName: 'Personal Header',
          options: [
            { value: 'Personal 1', id: 11 },
          ]
        }
      ];
      component.ngOnChanges({
        options:
          {
            previousValue: undefined, currentValue: testOptionsMock, firstChange: false, isFirstChange: () => false,
          }
      });
      fixture.autoDetectChanges();
      const searchEl = fixture.debugElement.query(By.css('b-search'));
      expect(searchEl).toBeFalsy();
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
    it('should update value when option is clicked with the option id', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.value).toEqual([1, 11, 12]);
    });
    it('should emit event when selecting an option', () => {
      const options = fixture.debugElement.queryAll(By.css('.option'));
      options[3].triggerEventHandler('click', null);
      expect(component.selectChange.emit).toHaveBeenCalledWith([1, 11, 12]);
    });
  });

  describe('header checkbox click', () => {
    it('should select all options in group when selecting header', () => {
      const headerCheckbox = fixture.debugElement.queryAll(By.css('.header .checkbox'));
      headerCheckbox[0].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.value).toEqual([1, 11, 2]);
    });
    it('should deselect all options in group when deselecting header', () => {
      const headerCheckbox = fixture.debugElement.queryAll(By.css('.header .checkbox'));
      headerCheckbox[0].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.value).toEqual([1, 11, 2]);
      headerCheckbox[0].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.value).toEqual([11]);
    });
    it('should not update options model when header is collapsed', () => {
      const expectedHeaderModel = [
        {
          groupName: 'Basic Info Header',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true
        },
        {
          groupName: 'Personal Header',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false
        }
      ];
      const expectedOptionsModel = [
        {
          isPlaceHolder: true,
          groupName: 'Basic Info Header',
          value: 'Basic Info Header',
          id: 'Basic Info Header',
          selected: null
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal Header',
          value: 'Personal Header',
          id: 'Personal Header',
          selected: null
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal Header',
          isPlaceHolder: false,
          selected: false
        }
      ];
      const headerCollapseTrigger = fixture.debugElement.queryAll(
        By.css('.header-collapse-trigger')
      )[0];
      headerCollapseTrigger.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      const headerCheckbox = fixture.debugElement.queryAll(By.css('.header .checkbox'));
      headerCheckbox[0].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.listHeaders).toEqual(expectedHeaderModel);
      expect(component.listOptions).toEqual(expectedOptionsModel);
    });
    it('should emit event when header is selected', () => {
      const headerCheckbox = fixture.debugElement.queryAll(By.css('.header .checkbox'));
      headerCheckbox[0].triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.selectChange.emit).toHaveBeenCalledWith([1, 11, 2]);
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
      expect(headers[0].nativeElement.innerText.trim()).toEqual('Basic Info Header');
    });
    it('should show group headers and no options if search only matches headers', () => {
      component.searchChange('Personal He');
      fixture.autoDetectChanges();
      const options = fixture.debugElement.queryAll(By.css('.option'));
      const headers = fixture.debugElement.queryAll(By.css('.header'));
      expect(options.length).toEqual(0);
      expect(headers.length).toEqual(1);
      expect(headers[0].nativeElement.innerText.trim()).toEqual('Personal Header');
    });
  });

});
