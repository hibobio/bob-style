import { MockComponent } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IconComponent } from '../../icons/icon.component';
import { ListChange } from '../../lists/list-change/list-change';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { SelectGroupOption } from '../../lists/list.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { QuickFilterComponent } from './quick-filter.component';
import { QuickFilterSelectType } from './quick-filter.enum';
import {
  QuickFilterChangeEvent,
  QuickFilterConfig,
} from './quick-filter.interface';

describe('QuickFilterBarComponent', () => {
  let component: QuickFilterBarComponent;
  let fixture: ComponentFixture<QuickFilterBarComponent>;

  let optionsMock: SelectGroupOption[];
  let quickFiltersMock: QuickFilterConfig[];

  beforeEach(
    waitForAsync(() => {
      optionsMock = Array.from(Array(3), (g, i) => {
        return {
          groupName: `Basic Info G${i} - header`,
          options: Array.from(Array(4), (o, k) => {
            return {
              value: `Basic Info G${i}_E${k} - option`,
              id: i * 4 + k,
              selected: false,
            };
          }),
        };
      });

      quickFiltersMock = [
        {
          selectType: QuickFilterSelectType.multiSelect,
          label: 'department',
          key: 'department',
          options: [optionsMock[0]],
        },
        {
          selectType: QuickFilterSelectType.multiSelect,
          label: 'site',
          key: 'site',
          options: optionsMock,
        },
        {
          selectType: QuickFilterSelectType.singleSelect,
          label: 'employment',
          key: 'employment',
          options: [optionsMock[0]],
        },
      ];

      TestBed.configureTestingModule({
        declarations: [
          QuickFilterBarComponent,
          MockComponent(QuickFilterComponent),
          MockComponent(IconComponent),
        ],
        providers: [ListModelService, ListChangeService, DOMhelpers],
        imports: [NoopAnimationsModule],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(QuickFilterBarComponent);
          component = fixture.componentInstance;
          component.ngAfterViewInit = () => {};
          spyOn(component.filtersChange, 'emit');
          spyOn(component.resetFilters, 'emit');
        });
    })
  );

  describe('OnChanges', () => {
    it('should render 3 quick filters', () => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined,
          currentValue: quickFiltersMock,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const quickFilterEl = fixture.debugElement.queryAll(
        By.css('b-quick-filter')
      );
      expect(quickFilterEl.length).toEqual(3);
    });
    it('should build quickFiltersChanges model from the quickFiltesConfig', () => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined,
          currentValue: quickFiltersMock,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      expect(component.quickFiltersChanges).toEqual({
        department: {
          key: 'department',
          listChange: new ListChange([optionsMock[0]]),
        },
        site: {
          key: 'site',
          listChange: new ListChange(optionsMock),
        },
        employment: {
          key: 'employment',
          listChange: new ListChange([optionsMock[0]]),
        },
      });
    });
  });

  describe('onFilterChange', () => {
    beforeEach(() => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined,
          currentValue: quickFiltersMock,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
    });
    it('should update quickFiltersChanges model with the changed filter value', () => {
      const changedFilter: QuickFilterChangeEvent = {
        key: 'site',
        listChange: new ListChange(optionsMock),
      };
      const quickFilterSiteEl = fixture.debugElement.queryAll(
        By.css('b-quick-filter')
      )[1];
      quickFilterSiteEl.componentInstance.filterChange.emit(changedFilter);
      expect(component.quickFiltersChanges).toEqual({
        department: {
          key: 'department',
          listChange: new ListChange([optionsMock[0]]),
        },
        site: {
          key: 'site',
          listChange: new ListChange(optionsMock),
        },
        employment: {
          key: 'employment',
          listChange: new ListChange([optionsMock[0]]),
        },
      });
    });
    it('should invoke onFilterChange.emit with the quickFiltersChanges model', () => {
      const changedFilter: QuickFilterChangeEvent = {
        key: 'department',
        listChange: new ListChange([optionsMock[0]]),
      };
      const quickFilterSiteEl = fixture.debugElement.queryAll(
        By.css('b-quick-filter')
      )[1];
      quickFilterSiteEl.componentInstance.filterChange.emit(changedFilter);
      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        department: {
          key: 'department',
          listChange: new ListChange([optionsMock[0]]),
        },
        site: {
          key: 'site',
          listChange: new ListChange(optionsMock),
        },
        employment: {
          key: 'employment',
          listChange: new ListChange([optionsMock[0]]),
        },
      });
    });
  });

  describe('resetFilter', () => {
    it('should not show reset filter by default', () => {
      fixture.detectChanges();
      const resetIcon = fixture.debugElement.query(By.css('.reset-filters'));
      expect(resetIcon).toBeFalsy();
    });
    it('should display reset filter icon when showReset is true', () => {
      component.showResetFilter = true;
      fixture.detectChanges();
      const resetIcon = fixture.debugElement.query(By.css('.reset-filters'));
      expect(resetIcon).toBeTruthy();
    });
    it('should emit resetClick event when reset icon was clicked', () => {
      component.showResetFilter = true;
      fixture.detectChanges();
      const resetIcon = fixture.debugElement.query(By.css('.reset-filters'));
      resetIcon.triggerEventHandler('click', null);
      expect(component.resetFilters.emit).toHaveBeenCalled();
    });
  });
});
