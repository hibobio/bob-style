import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipInputComponent } from './chip-input.component';

import { ColorService } from '../../services/color-service/color.service';

import {
  elementsFromFixture,
  elementFromFixture,
  inputValue
} from '../../services/utils/test-helpers';
import { ChipListModule } from '../chip-list/chip-list.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChipModule } from '../chip/chip.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { ChipComponent } from '../chip/chip.component';

describe('ChipInputComponent', () => {
  let component: ChipInputComponent;
  let fixture: ComponentFixture<ChipInputComponent>;
  let chipInputElem: HTMLElement;
  let inputElement: HTMLElement;
  let messageElement: HTMLElement;
  let chipsComponents: () => ChipComponent[];
  let chipsElements: () => HTMLElement[];

  const chipOptions = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipInputComponent],
      imports: [
        ChipListModule,
        ChipModule,
        MatAutocompleteModule,
        InputMessageModule
      ],
      providers: [ColorService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipInputComponent);
        component = fixture.componentInstance;
        chipInputElem = fixture.debugElement.nativeElement;
        component.options = chipOptions;
        component.label = 'label';
        component.placeholder = 'placeholder';
        component.hintMessage = 'hintMessage';
        component.required = true;

        fixture.detectChanges();

        chipsComponents = () => component.chips.list.toArray();
        inputElement = elementFromFixture(
          fixture,
          '.bfe-input'
        ) as HTMLInputElement;

        chipsElements = () =>
          elementsFromFixture(fixture, 'b-chip-list b-chip');

        messageElement = elementFromFixture(fixture, '[b-input-message]');
      });
  }));

  describe('Component', () => {
    it('should create component with right label, placeholder etc', () => {
      const labelElem = elementFromFixture(fixture, '.bfe-label');
      expect(chipsComponents().length).toEqual(0);
      expect(component.value.length).toEqual(0);
      expect(labelElem.innerText).toEqual('label');
      expect(messageElement.innerText).toEqual('hintMessage');
      expect(inputElement.getAttribute('placeholder')).toEqual('placeholder');
    });

    it('should have disabled class when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(chipInputElem.className).toContain('disabled');
    });

    it('should display warnMessage', () => {
      component.warnMessage = 'warn';
      fixture.detectChanges();
      expect(messageElement.innerText).toEqual('warn');
      expect(chipInputElem.className).toContain('has-message warn');
    });

    it('should display errorMessage', () => {
      component.warnMessage = 'warn';
      component.errorMessage = 'error';
      fixture.detectChanges();
      expect(messageElement.innerText).toEqual('error');
      expect(chipInputElem.className).toContain('has-message error');
    });
  });

  describe('Value', () => {
    it('should display chips according to set value', () => {
      component.value = chipOptions.slice(0, 2);
      fixture.detectChanges();
      expect(chipsComponents().length).toEqual(2);
      expect(component.value.length).toEqual(2);
      expect(chipsComponents()[0].text).toEqual(chipOptions[0]);
    });
  });

  describe('Add new', () => {
    it('should add new chip if acceptNew is true', () => {
      component.acceptNew = true;
      fixture.detectChanges();
      inputValue(inputElement, 'XYZ');
      fixture.detectChanges();
      expect(component.value).toContain('XYZ');
      expect(chipsComponents().length).toEqual(1);
      expect(component.value.length).toEqual(1);
    });
    it('should not add new chip if acceptNew is false', () => {
      component.acceptNew = false;
      fixture.detectChanges();
      inputValue(inputElement, 'XYZ');
      fixture.detectChanges();
      expect(component.value).not.toContain('XYZ');
      expect(chipsComponents().length).toEqual(0);
      expect(component.value.length).toEqual(0);
    });
  });

  describe('Remove chips', () => {
    it('should remove chips from value with button click', () => {
      component.value = chipOptions.slice(0, 2);
      fixture.detectChanges();
      expect(chipsComponents().length).toEqual(2);
      expect(component.value.length).toEqual(2);

      (chipsElements()[0].children[0] as HTMLElement).click();
      fixture.detectChanges();

      expect(chipsComponents().length).toEqual(1);
      expect(component.value.length).toEqual(1);
    });
  });
});
