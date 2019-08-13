import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';
import { PasswordInputComponent } from './password-input.component';
import { IconsModule } from '../../icons/icons.module';
import { inputValue } from '../../services/utils/test-helpers';
import { ElementRef } from '@angular/core';
import { InputEventType } from '../form-elements.enum';

describe('InputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;
  let inputElement: HTMLInputElement;
  let showButtonElement: ElementRef;
  let showButtonIconElement: ElementRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordInputComponent],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        InputMessageModule,
        IconsModule
      ],
      providers: []
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PasswordInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.css('input'))
          .nativeElement;

        spyOn(component.changed, 'emit');
        spyOn(component, 'propagateChange');
      });
  }));

  describe('emit InputEvent', () => {
    it('should emitInputEvent on model change with input value', () => {
      inputValue(inputElement, 'text');
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'text'
      });
      expect(component.propagateChange).toHaveBeenCalledWith('text');
    });
  });

  describe('show button', () => {
    it('should start with show button hidden', () => {
      showButtonElement = fixture.debugElement.query(By.css('.bfe-suffix'));
      expect(showButtonElement).toBeFalsy();
    });
    it('should show the button when input has text; icon should have class .b-icon-visibility-on', () => {
      inputValue(inputElement, 'text');
      fixture.detectChanges();
      showButtonElement = fixture.debugElement.query(By.css('.bfe-suffix'));
      showButtonIconElement = fixture.debugElement.query(By.css('.b-icon'));
      expect(showButtonElement).toBeTruthy();
      expect(showButtonIconElement.nativeElement.classList).toContain(
        'b-icon-visibility-on'
      );
    });
  });

  describe('input type', () => {
    it('should start with input type password', () => {
      fixture.detectChanges();
      expect(inputElement.getAttribute('type')).toEqual('password');
    });
    it('should switch to input type text, when input has text and show button is clicked; icon should change to class .b-icon-visibility-off', () => {
      inputValue(inputElement, 'text');
      fixture.detectChanges();
      expect(inputElement.getAttribute('type')).toEqual('password');
      showButtonElement = fixture.debugElement.query(By.css('.bfe-suffix'));
      showButtonIconElement = fixture.debugElement.query(By.css('.b-icon'));
      showButtonElement.nativeElement.click();
      fixture.detectChanges();
      expect(inputElement.getAttribute('type')).toEqual('text');
      expect(showButtonIconElement.nativeElement.classList).toContain(
        'b-icon-visibility-off'
      );
    });
  });
});
