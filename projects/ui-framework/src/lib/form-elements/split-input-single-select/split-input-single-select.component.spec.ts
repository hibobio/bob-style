import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SplitInputSingleSelectComponent } from './split-input-single-select.component';
import { SingleSelectComponent } from '../lists/single-select/single-select.component';
import { MockComponent } from 'ng-mocks';
import { InputEventType } from '../input/input.enum';
import { InputComponent } from '../input/input.component';
import { SelectGroupOption } from '../lists/list.interface';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { By } from '@angular/platform-browser';

describe('SplitInputSingleSelectComponent', () => {
  let component: SplitInputSingleSelectComponent;
  let fixture: ComponentFixture<SplitInputSingleSelectComponent>;
  const optionsMock: SelectGroupOption[] = [
    {
      groupName: 'currencies',
      options: [
        { value: 'USD', id: 'USD' },
        { value: 'GBP', id: 'GBP' },
        { value: 'ILS', id: 'ILS' }
      ]
    }
  ];

  const valueMock: InputSingleSelectValue = {
    inputValue: 200,
    selectValue: 'USD'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SplitInputSingleSelectComponent,
        MockComponent(SingleSelectComponent),
        MockComponent(InputComponent)
      ],
      imports: [NoopAnimationsModule, CommonModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SplitInputSingleSelectComponent);
        component = fixture.componentInstance;
        spyOn(component.elementChange, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should set default value object with null values if no value is provided', () => {
      component.ngOnChanges({});
      expect(component.value).toEqual({
        inputValue: null,
        selectValue: null
      });
    });
    it('should use the provided value and not overwrite with nulls', () => {
      component.value = valueMock;
      component.ngOnChanges({});
      expect(component.value).toEqual(valueMock);
    });
    it('should set inputValue as value on the inputEl', () => {
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      expect(inputEl.context.value).toEqual(valueMock.inputValue);
    });
    it('should set selectValue as value on the selectEl', () => {
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
      const selectEl = fixture.debugElement.query(By.css('b-single-select'));
      expect(selectEl.context.value).toEqual(valueMock.selectValue);
    });
    it('should set options on select element', () => {
      component.selectOptions = optionsMock;
      component.ngOnChanges({});
      fixture.detectChanges();
      const selectEl = fixture.debugElement.query(By.css('b-single-select'));
      expect(selectEl.context.options).toEqual(optionsMock);
    });
  });

  describe('onInputChange', () => {
    beforeEach(() => {
      component.selectOptions = optionsMock;
      component.value = valueMock;
      component.ngOnChanges({});
      fixture.detectChanges();
    });
    it('should not emit event if inputEvent is not change', () => {
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      inputEl.context.inputEvents.emit({
        event: InputEventType.onBlur,
        value: 10
      });
      fixture.detectChanges();
      expect(component.elementChange.emit).not.toHaveBeenCalled();
    });
    it('should update value and emit event with updated value', () => {
      const inputEl = fixture.debugElement.query(By.css('b-input'));
      inputEl.context.inputEvents.emit({
        event: InputEventType.onChange,
        value: 500
      });
      fixture.detectChanges();
      expect(component.elementChange.emit).toHaveBeenCalledWith({
        inputValue: 500,
        selectValue: 'USD'
      });
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
      const selectEl = fixture.debugElement.query(By.css('b-single-select'));
      selectEl.context.selectChange.emit('GBP');
      fixture.detectChanges();
      expect(component.elementChange.emit).toHaveBeenCalledWith({
        inputValue: 200,
        selectValue: 'GBP'
      });
    });
  });
});
