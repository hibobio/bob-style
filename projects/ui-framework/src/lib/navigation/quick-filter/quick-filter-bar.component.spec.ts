import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { By } from '@angular/platform-browser';
import { QuickFilterComponent } from './quick-filter.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';

describe('QuickFilterBarComponent', () => {
  let component: QuickFilterBarComponent;
  let fixture: ComponentFixture<QuickFilterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuickFilterBarComponent,
        MockComponent(QuickFilterComponent),
      ],
      imports: [
        NoopAnimationsModule,
        MockModule(MultiSelectModule),
        MockModule(SingleSelectModule),
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuickFilterBarComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('OnChanges', () => {
    it('should render 3 quick filters', () => {
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
      const quickFilters = [
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
      component.quickFilters = quickFilters;
      fixture.detectChanges();
      const quickFilterEl = fixture.debugElement.queryAll(By.css('b-quick-filter'));
      expect(quickFilterEl.length).toEqual(3);
    });
  });
});
