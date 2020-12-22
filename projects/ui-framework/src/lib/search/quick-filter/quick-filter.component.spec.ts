import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectGroupOption } from '../../lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectComponent } from '../../lists/multi-select/multi-select.component';
import { SingleSelectComponent } from '../../lists/single-select/single-select.component';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { ListChange } from '../../lists/list-change/list-change';
import { QuickFilterConfig } from './quick-filter.interface';

describe('QuickFilterComponent', () => {
  let component: QuickFilterComponent;
  let fixture: ComponentFixture<QuickFilterComponent>;
  let optionsMock: SelectGroupOption[];

  beforeEach(waitForAsync(() => {
    optionsMock = Array.from(Array(3), (g, i) => {
      return {
        groupName: `Basic Info G${i} - header`,
        options: Array.from(Array(4), (o, k) => {
          return {
            selected: false,
            value: `Basic Info G${i}_E${k} - option`,
            id: i * 4 + k,
          };
        }),
      };
    });

    TestBed.configureTestingModule({
      declarations: [
        QuickFilterComponent,
        MockComponent(MultiSelectComponent),
        MockComponent(SingleSelectComponent),
      ],
      providers: [ListModelService],
      imports: [NoopAnimationsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuickFilterComponent);
        component = fixture.componentInstance;
        spyOn(component.filterChange, 'emit');
      });
  }));

  describe('OnChanges', () => {
    it('should render multi select element', () => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.multiSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.queryAll(
        By.css('b-multi-select')
      );
      const singleSelectEl = fixture.debugElement.queryAll(
        By.css('b-single-select')
      );
      expect(multiSelectEl.length).toEqual(1);
      expect(singleSelectEl.length).toEqual(0);
    });
    it('should render single select element', () => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.singleSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.queryAll(
        By.css('b-multi-select')
      );
      const singleSelectEl = fixture.debugElement.queryAll(
        By.css('b-single-select')
      );
      expect(multiSelectEl.length).toEqual(0);
      expect(singleSelectEl.length).toEqual(1);
    });
    it('should set showSingleGroupHeader to false by default', () => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.multiSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      expect(multiSelectEl.componentInstance.showSingleGroupHeader).toBe(false);
    });
    it('should set showSingleGroupHeader on select from the config', () => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.multiSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
        showSingleGroupHeader: true,
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      expect(multiSelectEl.componentInstance.showSingleGroupHeader).toBe(true);
    });
    it('should set hasValue to true if some options are selected', () => {
      optionsMock[0].options[0].selected = true;
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.singleSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      expect(component.hasValue).toBe(true);
    });
    it('should set hasValue to false if no options are selected', () => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.singleSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      expect(component.hasValue).toBe(false);
    });
  });

  describe('selectModified, selectCancelled', () => {
    beforeEach(() => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: QuickFilterSelectType.multiSelect,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
    });
    it('should update hasValue to true is some options are selected', () => {
      optionsMock[0].options[0].selected = true;
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectModified.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(true);
    });
    it('should update hasValue to false to false if no options are selected', () => {
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectModified.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(false);
    });
    it('should update hasValue to true is some options are selected', () => {
      optionsMock[0].options[0].selected = true;
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectCancelled.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(true);
    });
    it('should update hasValue to false to false if no options are selected', () => {
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectCancelled.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(false);
    });
  });

  describe('selectChange', () => {
    const createQuickFilter = (
      quickFilterSelectType: QuickFilterSelectType
    ) => {
      const quickFilterConfig: QuickFilterConfig = {
        selectType: quickFilterSelectType,
        label: 'department',
        key: 'department',
        options: [optionsMock[0]],
      };
      component.ngOnChanges({
        quickFilterConfig: {
          previousValue: undefined,
          currentValue: quickFilterConfig,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
    };
    it('should set hasValue to true is some options are selected - multiSelect', () => {
      createQuickFilter(QuickFilterSelectType.multiSelect);
      optionsMock[0].options[0].selected = true;
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(true);
    });
    it('should set hasValue to true is some options are selected - singleSelect', () => {
      createQuickFilter(QuickFilterSelectType.singleSelect);
      optionsMock[0].options[0].selected = true;
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const singleListEl = fixture.debugElement.query(
        By.css('b-single-select')
      );
      singleListEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(true);
    });
    it('should set hasValue to false is some options are selected - multiSelect', () => {
      createQuickFilter(QuickFilterSelectType.multiSelect);
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(false);
    });
    it('should set hasValue to false is some options are selected - singleSelect', () => {
      createQuickFilter(QuickFilterSelectType.singleSelect);
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const singleListEl = fixture.debugElement.query(
        By.css('b-single-select')
      );
      singleListEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.hasValue).toBe(false);
    });
    it('should emit QuickFilterChangeEvent - multiSelect', () => {
      createQuickFilter(QuickFilterSelectType.multiSelect);
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const multiSelectEl = fixture.debugElement.query(
        By.css('b-multi-select')
      );
      multiSelectEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.filterChange.emit).toHaveBeenCalledWith({
        key: 'department',
        listChange,
      });
    });
    it('should emit QuickFilterChangeEvent - singleSelect', () => {
      createQuickFilter(QuickFilterSelectType.singleSelect);
      const listChange: ListChange = new ListChange([optionsMock[0]]);
      const singleListEl = fixture.debugElement.query(
        By.css('b-single-select')
      );
      singleListEl.componentInstance.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.filterChange.emit).toHaveBeenCalledWith({
        key: 'department',
        listChange,
      });
    });
  });
});
