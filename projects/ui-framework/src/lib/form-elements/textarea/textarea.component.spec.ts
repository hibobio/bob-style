import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { inputValue } from '../../services/utils/test-helpers';
import { HtmlParserHelpersProvideMock } from '../../tests/services.stub.spec';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { InputEventType } from '../form-elements.enum';
import { InputMessageModule } from '../input-message/input-message.module';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let textareaElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TextareaComponent],
        imports: [
          NoopAnimationsModule,
          InputMessageModule,
          FormElementLabelModule,
        ],
        providers: [
          DOMhelpers,
          HtmlParserHelpersProvideMock(),
          EventManagerPlugins[0],
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TextareaComponent);
          component = fixture.componentInstance;
          component.ignoreEvents = [];

          spyOn(component.changed, 'emit');
          component.changed.subscribe(() => {});
          fixture.detectChanges();
        });
    })
  );

  afterEach(() => {
    component.changed.complete();
  });

  describe('emit InputEvent', () => {
    beforeEach(() => {
      textareaElement = fixture.debugElement.query(
        By.css('textarea')
      ).nativeElement;
    });

    it('should emit InputEvent on input focus with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('focus'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value',
      });
    });
    it('should emit InputEvent on input blur with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('blur'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value',
      });
    });
    it('should emit InputEvent on model change with input value, if there is a subscriber to the event', () => {
      inputValue(textareaElement, 'change input value', false);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value',
      });
    });
  });
});
