import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { InputModule } from '../input';
import { InputEventType } from '../input/input.enum';
import { IconsModule } from '../../icons';
import { By } from '@angular/platform-browser';
import { InputEvent } from '../input/input.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        InputModule,
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
    fit('should emitInputEvent on input focus with input value', () => {
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
