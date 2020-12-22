import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChipInputComponent } from './chip-input.component';

import {
  elementsFromFixture,
  elementFromFixture,
  inputValue,
} from '../../services/utils/test-helpers';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { ChipComponent } from '../chip/chip.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { MockComponent } from 'ng-mocks';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { IconComponent } from '../../icons/icon.component';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { FormElementLabelComponent } from '../../form-elements/form-element-label/form-element-label.component';
import { By } from '@angular/platform-browser';

describe('ChipInputComponent', () => {
  let component: ChipInputComponent;
  let fixture: ComponentFixture<ChipInputComponent>;
  let chipInputElem: HTMLElement;
  let inputElement: HTMLInputElement;
  let messageElement: HTMLElement;
  let chipsComponents: () => ChipComponent[];
  let chipsElements: () => HTMLElement[];

  const chipOptions = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChipInputComponent,
        ChipListComponent,
        ChipComponent,
        MockComponent(TextButtonComponent),
        MockComponent(IconComponent),
        MockComponent(AvatarImageComponent),
        MockComponent(FormElementLabelComponent),
      ],
      imports: [MatAutocompleteModule, InputMessageModule],
      providers: [EventManagerPlugins[0]],
    })
      .overrideComponent(ChipInputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
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

        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});

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

  afterEach(() => {
    component.changed.complete();
  });

  describe('Component', () => {
    it('should create component with right label, placeholder etc', () => {
      const labelComp = fixture.debugElement.query(By.css('.bfe-label'))
        .componentInstance;
      expect(chipsComponents().length).toEqual(0);
      expect(component.value.length).toEqual(0);
      expect(labelComp.label).toEqual('label');
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

  describe('Input', () => {
    it('should add chip from options from user input', () => {
      inputValue(inputElement, 'ABC');
      fixture.detectChanges();
      expect(component.value).toEqual(['ABC']);
      expect(chipsComponents().length).toEqual(1);
      expect(inputElement.value).toEqual('');
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        added: 'ABC',
        value: ['ABC'],
      });
    });
    it('should not add chip if its already present in value', () => {
      component.value = ['ABC'];
      fixture.detectChanges();

      inputValue(inputElement, 'ABC');
      fixture.detectChanges();

      expect(component.value).toEqual(['ABC']);
      expect(chipsComponents().length).toEqual(1);
      expect(chipsElements()[0].className).toContain('blink');
      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('Add new', () => {
    it('should add new chip if acceptNew is true', () => {
      component.acceptNew = true;
      fixture.detectChanges();
      inputValue(inputElement, 'XYZ');
      fixture.detectChanges();
      expect(component.value).toEqual(['XYZ']);
      expect(chipsComponents().length).toEqual(1);
      expect(inputElement.value).toEqual('');
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        added: 'XYZ',
        value: ['XYZ'],
      });
    });
    it('should not add new chip if acceptNew is false', () => {
      component.acceptNew = false;
      fixture.detectChanges();
      inputValue(inputElement, 'XYZ');
      fixture.detectChanges();
      expect(component.value.length).toEqual(0);
      expect(chipsComponents().length).toEqual(0);
      expect(inputElement.value).toEqual('XYZ');
      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('Remove chips', () => {
    it('should remove chips from value with button click', () => {
      component.value = chipOptions.slice(0, 2);
      fixture.detectChanges();
      expect(chipsComponents().length).toEqual(2);
      expect(component.value.length).toEqual(2);

      (chipsElements()[0].querySelector(
        '.remove-button'
      ) as HTMLElement).click();
      fixture.detectChanges();

      expect(chipsComponents().length).toEqual(1);
      expect(component.value.length).toEqual(1);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        removed: 'ABC',
        value: ['ACB'],
      });
    });
  });

  describe('Autocomplete', () => {
    it('should filter chips options', () => {
      inputValue(inputElement, 'AB');
      fixture.detectChanges();
      expect(component.filteredChips).toEqual(['ABC', 'CAB']);
    });
    it('should add chip from options to value', () => {
      expect(component.value.length).toEqual(0);
      component.optionSelected({
        option: {
          viewValue: 'ABC',
        },
      } as MatAutocompleteSelectedEvent);
      fixture.detectChanges();
      expect(component.value).toEqual(['ABC']);
      expect(chipsComponents().length).toEqual(1);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        added: 'ABC',
        value: ['ABC'],
      });
    });
    it('should not add chip if its already present in value', () => {
      component.value = ['ABC'];
      fixture.detectChanges();

      component.optionSelected({
        option: {
          viewValue: 'ABC',
        },
      } as MatAutocompleteSelectedEvent);
      fixture.detectChanges();

      expect(component.value).toEqual(['ABC']);
      expect(chipsComponents().length).toEqual(1);
      expect(chipsElements()[0].className).toContain('blink');
      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });
});
