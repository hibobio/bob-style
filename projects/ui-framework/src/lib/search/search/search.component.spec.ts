import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { InputModule } from '../../form-elements/input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [NoopAnimationsModule, FormsModule, InputModule, IconsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        spyOn(component.searchChange, 'emit');
        component.ngOnChanges({});
        fixture.detectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should assign empty string value if no value exists', () => {
      expect(component.value).toEqual('');
    });
    it('should assign value with value if exists', () => {
      component.ngOnChanges({
        value: {
          previousValue: undefined,
          currentValue: 'Alan Tulin',
          firstChange: false,
          isFirstChange: () => true,
        },
      });
      fixture.detectChanges();
      expect(component.value).toEqual('Alan Tulin');
    });
  });

  describe('onInputEvents', () => {
    it('should show reset icon if search has value', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      let resetElement = fixture.debugElement.query(By.css('.clear-input'));
      expect(resetElement).toBe(null);

      inputElement.nativeElement.value = 'change input value';
      inputElement.nativeElement.dispatchEvent(new Event('input'));

      tick(300);
      fixture.detectChanges();

      resetElement = fixture.debugElement.query(By.css('.clear-input'));
      expect(resetElement).not.toBe(null);
    }));

    it('should invoke searchChange.emit with search value', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.nativeElement.value = 'change input value';
      inputElement.nativeElement.dispatchEvent(new Event('input'));

      tick(300);
      fixture.detectChanges();

      expect(component.searchChange.emit).toHaveBeenCalledWith(
        'change input value'
      );
    }));
  });

  describe('onResetClick', () => {
    it('should set value to be empty', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(component.value).toBe('');

      inputElement.nativeElement.value = 'change input value';
      inputElement.nativeElement.dispatchEvent(new Event('input'));

      tick(300);
      fixture.detectChanges();

      expect(component.value).toBe('change input value');

      const resetElement = fixture.debugElement.query(By.css('.clear-input'));
      resetElement.nativeElement.click();
      fixture.detectChanges();
      expect(component.value).toBe('');
    }));
  });
});
