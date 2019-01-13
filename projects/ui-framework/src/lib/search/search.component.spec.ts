import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './search.component';
import { InputModule } from '../form-elements/input';
import { InputEvent, InputEventType } from '../form-elements/input/input.enum';
import { IconsModule } from '../icons';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
      ],
      imports: [
        FormsModule,
        InputModule,
        BrowserAnimationsModule,
        IconsModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        spyOn(component.inputEvents, 'emit');
        fixture.detectChanges();
      });
  }));


  describe('onInputEvents', () => {
    it('should emitInputEvent on input focus with input value', () => {
      const inputEvent: InputEvent = { event: InputEventType.onChange, value: 'input value' };
      component.onInputEvents(inputEvent);
      expect(component.inputEvents.emit).toHaveBeenCalledWith(inputEvent);
    });
    it('should show reset icon if search has value', () => {
      let resetElement = fixture.debugElement.query(By.css('.reset-button'));
      expect(resetElement).toBe(null);
      const inputEvent: InputEvent = { event: InputEventType.onChange, value: 'input value' };
      component.onInputEvents(inputEvent);
      fixture.detectChanges();
      resetElement = fixture.debugElement.query(By.css('.reset-button'));
      expect(resetElement).not.toBe(null);
    });
  });

  describe('onResetClick', () => {
    it('should set value to be empty', () => {
      const inputEvent: InputEvent = { event: InputEventType.onChange, value: 'input value' };
      component.onInputEvents(inputEvent);
      expect(component.value).toEqual('input value');
      component.onResetClick();
      expect(component.value).toEqual('');
    });
  });
});
