import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SplitInputSingleSelectComponent } from './split-input-single-select.component';
import { SingleSelectComponent } from '../../lists/single-select/single-select.component';
import { MockComponent } from 'ng-mocks';
import { InputEventType } from '../form-elements.enum';
import { InputComponent } from '../input/input.component';
import { SelectGroupOption } from '../../lists/list.interface';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';
import { SimpleChange } from '@angular/core';
import { InputMessageComponent } from '../input-message/input-message.component';
import { FormElementLabelComponent } from '../form-element-label/form-element-label.component';
import { simpleChange } from '../../services/utils/test-helpers';

describe('SplitInputSingleSelectComponent', () => {
  let component: SplitInputSingleSelectComponent;
  let fixture: ComponentFixture<SplitInputSingleSelectComponent>;
  let optionsMock: SelectGroupOption[];
  let valueMock: InputSingleSelectValue;

  beforeEach(async(() => {
    valueMock = {
      inputValue: 200,
      selectValue: 'USD',
    };

    optionsMock = [
      {
        groupName: 'currencies',
        options: [
          { value: 'USD', id: 'USD', selected: false },
          { value: 'GBP', id: 'GBP', selected: false },
          { value: 'ILS', id: 'ILS', selected: false },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SplitInputSingleSelectComponent,
        MockComponent(SingleSelectComponent),
        MockComponent(InputComponent),
        MockComponent(InputMessageComponent),
        MockComponent(FormElementLabelComponent),
      ],
      imports: [NoopAnimationsModule, CommonModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SplitInputSingleSelectComponent);
        component = fixture.componentInstance;
        component.wrapEvent = true;
        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('OnChanges', () => {
    it('should set default value object with null values if no value is provided', () => {
      component.ngOnChanges({
        selectOptions: new SimpleChange(null, undefined, true),
        value: new SimpleChange(null, undefined, true),
      });
      expect(component.value).toEqual({
        inputValue: null,
        selectValue: null,
      });
    });

    it('should set inputValue as value on the inputEl', () => {
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      expect(inputEl.context.value).toEqual(valueMock.inputValue);
    });

    it('should set selectedOptions as options on the selectEl', () => {
      component.ngOnChanges(
        simpleChange({ selectOptions: optionsMock, value: valueMock })
      );

      fixture.detectChanges();

      const selectEl = fixture.debugElement.query(By.css('b-single-select'));

      expect(selectEl.context.options).toEqual(optionsMock);
      expect(selectEl.context.value).toEqual(valueMock.selectValue);
    });
  });

  describe('onInputChange', () => {
    beforeEach(() => {
      component.selectOptions = optionsMock;
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
    });
    it('should update value and emit event with updated value', () => {
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      inputEl.componentInstance.changed.emit({
        event: InputEventType.onChange,
        value: 500,
      });
      fixture.detectChanges();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: { inputValue: 500, selectValue: 'USD' },
      } as any);
    });
  });

  describe('onSelectChange', () => {
    beforeEach(() => {
      component.selectOptions = optionsMock;
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
    });
    it('should update value and emit event with updated value', () => {
      const listElOptions = cloneDeep(optionsMock);
      listElOptions[0].options[1].selected = true;
      const selectEl = fixture.debugElement.query(By.css('b-single-select'));
      const listChange = new ListChange(listElOptions);
      selectEl.context.selectChange.emit(listChange);
      fixture.detectChanges();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: { inputValue: 200, selectValue: 'GBP' },
      } as any);
    });
  });
});
