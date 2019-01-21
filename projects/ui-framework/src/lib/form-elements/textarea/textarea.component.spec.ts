import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextareaComponent } from './textarea.component';
import { InputEventType } from '../input/input.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let textareaElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TextareaComponent);
        component = fixture.componentInstance;
        spyOn(component.inputEvents, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('emitInputEvent', () => {
    beforeEach(() => {
      textareaElement = fixture.debugElement.query(By.css('textarea')).nativeElement;
    });

    it('expect 11', () => {
      expect(1 === 1).toBe(true);
    });

    it('should emitInputEvent on input focus with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('focus'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value',
      });
    });
    it('should emitInputEvent on input blur with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('blur'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value',
      });
    });
    it('should emitInputEvent on model change with input value', () => {
      textareaElement.value = 'change input value';
      textareaElement.dispatchEvent(new Event('input'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value',
      });
    });
  });

});
