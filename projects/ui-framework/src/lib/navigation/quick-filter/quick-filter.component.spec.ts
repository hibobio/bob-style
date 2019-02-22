import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectComponent } from '../../form-elements/lists/multi-select/multi-select.component';
import { SingleSelectComponent } from '../../form-elements/lists/single-select/single-select.component';

describe('QuickFilterComponent', () => {
  let component: QuickFilterComponent;
  let fixture: ComponentFixture<QuickFilterComponent>;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuickFilterComponent,
        MockComponent(MultiSelectComponent),
        MockComponent(SingleSelectComponent),
      ],
      imports: [
        NoopAnimationsModule,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuickFilterComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('Render', () => {
    it('should render multi select element', () => {
      const quickFilterConfig = {
        selectType: QuickFilterSelectType.multiSelect,
        label: 'department',
        options: [optionsMock[0]],
        value: [1, 2],
      };
      component.quickFilterConfig = quickFilterConfig;
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.queryAll(By.css('b-multi-select'));
      const singleSelectEl = fixture.debugElement.queryAll(By.css('b-single-select'));
      expect(multiSelectEl.length).toEqual(1);
      expect(singleSelectEl.length).toEqual(0);
    });
    it('should render single select element', () => {
      const quickFilterConfig = {
        selectType: QuickFilterSelectType.singleSelect,
        label: 'department',
        options: [optionsMock[0]],
        value: 1,
      };
      component.quickFilterConfig = quickFilterConfig;
      fixture.detectChanges();
      const multiSelectEl = fixture.debugElement.queryAll(By.css('b-multi-select'));
      const singleSelectEl = fixture.debugElement.queryAll(By.css('b-single-select'));
      expect(multiSelectEl.length).toEqual(0);
      expect(singleSelectEl.length).toEqual(1);
    });
  });
});
