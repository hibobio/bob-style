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
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementLabelComponent } from '../form-element-label/form-element-label.component';
import { MockComponent } from 'ng-mocks';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;
  let inputElement: HTMLInputElement;
  let showButtonElement: ElementRef;
  let showButtonIconElement: ElementRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PasswordInputComponent,
        MockComponent(FormElementLabelComponent),
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        InputMessageModule,
        IconsModule,
      ],
      providers: [EventManagerPlugins[0]],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PasswordInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.css('input'))
          .nativeElement;

        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        spyOn(component, 'propagateChange');
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('InputEvent', () => {
    it('should adjust text', () => {
      inputValue(inputElement, 'text', false);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'text',
      });
      expect(component.propagateChange).toHaveBeenCalledWith('text');
    });
  });

  describe('show button', () => {
    beforeEach(() => {
      showButtonElement = fixture.debugElement.query(By.css('.bfe-suffix'));
    });
    it('should start with show button hidden', () => {
      expect(showButtonElement.nativeElement.hidden).toBeTruthy();
    });
    it('should show the button when input has text; icon should have class .b-icon-visibility-on', () => {
      inputValue(inputElement, 'text', false);
      fixture.detectChanges();
      showButtonIconElement = fixture.debugElement.query(By.css('.b-icon'));
      expect(showButtonElement.nativeElement.hidden).toBeFalsy();
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
    // tslint:disable-next-line:max-line-length
    it('should switch to input type text, when input has text and show button is clicked; icon should change to class .b-icon-visibility-off', () => {
      inputValue(inputElement, 'text', false);
      fixture.detectChanges();
      expect(inputElement.getAttribute('type')).toEqual('password');
      showButtonElement = fixture.debugElement.query(By.css('.show-passwrd'));
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
