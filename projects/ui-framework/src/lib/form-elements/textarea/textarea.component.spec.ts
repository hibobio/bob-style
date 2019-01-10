import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextareaComponent } from './textarea.component';
import { InputEventType } from '../input/input.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  // let inputElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
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

  /*
  describe('emitInputEvent', () => {
    beforeEach(() => {
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should emitInputEvent on input focus with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('focus'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value',
      });
    });
    it('should emitInputEvent on input blur with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('blur'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value',
      });
    });
    it('should emitInputEvent on model change with input value', () => {
      inputElement.value = 'change input value';
      inputElement.dispatchEvent(new Event('input'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value',
      });
    });
  });
  */

});
