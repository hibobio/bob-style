import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { By } from '@angular/platform-browser';
import { QuickFilterComponent } from './quick-filter.component';
import { MockComponent } from 'ng-mocks';
import { QuickFilterChangeEvent } from './quick-filter.interface';

describe('QuickFilterBarComponent', () => {
  let component: QuickFilterBarComponent;
  let fixture: ComponentFixture<QuickFilterBarComponent>;

  const optionsMock: SelectGroupOption[] = Array.from(Array(3), (_, i) => {
    return {
      groupName: `Basic Info G${ i } - header`,
      options: Array.from(Array(4), (_, k) => {
        return {
          value: `Basic Info G${ i }_E${ k } - option`,
          id: i * 4 + k,
        };
      })
    };
  });
  const quickFiltersMock = [
    {
      selectType: QuickFilterSelectType.multiSelect,
      label: 'department',
      options: [optionsMock[0]],
      value: [1, 2],
    },
    {
      selectType: QuickFilterSelectType.multiSelect,
      label: 'site',
      options: optionsMock,
      value: [],
    },
    {
      selectType: QuickFilterSelectType.singleSelect,
      label: 'employment',
      options: [optionsMock[0]],
      value: null,
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuickFilterBarComponent,
        MockComponent(QuickFilterComponent),
      ],
      imports: [
        NoopAnimationsModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuickFilterBarComponent);
        component = fixture.componentInstance;
        spyOn(component.filtersChange, 'emit');
      });
  }));

  describe('OnChanges', () => {
    it('should render 3 quick filters', () => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined, currentValue: quickFiltersMock, firstChange: true, isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const quickFilterEl = fixture.debugElement.queryAll(By.css('b-quick-filter'));
      expect(quickFilterEl.length).toEqual(3);
    });
    it('should build quickFiltersChanges model from the quickFiltesConfig', () => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined, currentValue: quickFiltersMock, firstChange: true, isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      expect(component.quickFiltersChanges).toEqual({
        department: [1, 2],
        site: [],
        employment: null,
      });
    });
  });

  describe('onFilterChange', () => {
    beforeEach(() => {
      component.ngOnChanges({
        quickFilters: {
          previousValue: undefined, currentValue: quickFiltersMock, firstChange: true, isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
    });
    it('should update quickFiltersChanges model with the changed filter value', () => {
      const changedFilter: QuickFilterChangeEvent = {
        label: 'site',
        value: [1],
      };
      const quickFilterSiteEl = fixture.debugElement.queryAll(By.css('b-quick-filter'))[1];
      quickFilterSiteEl.componentInstance.filterChange.emit(changedFilter);
      expect(component.quickFiltersChanges).toEqual({
        department: [1, 2],
        site: [1],
        employment: null,
      });
    });
    it('should invoke onFilterChange.emit with the quickFiltersChanges model', () => {
      const changedFilter: QuickFilterChangeEvent = {
        label: 'site',
        value: [1],
      };
      const quickFilterSiteEl = fixture.debugElement.queryAll(By.css('b-quick-filter'))[1];
      quickFilterSiteEl.componentInstance.filterChange.emit(changedFilter);
      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        department: [1, 2],
        site: [1],
        employment: null,
      });
    });
  });
});
