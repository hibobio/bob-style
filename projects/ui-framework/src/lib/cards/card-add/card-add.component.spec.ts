import { CardAddComponent } from './card-add.component';
import {
  ComponentFixture,
  async,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TypographyModule } from '../../typography/typography.module';

describe('CardAddComponent', () => {
  let fixture: ComponentFixture<CardAddComponent>;
  let component: CardAddComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardAddComponent],
      imports: [TypographyModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardAddComponent);
        component = fixture.componentInstance;

        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('component', () => {
    it('should set input Title inside <b-display-3> element', () => {
      component.title = 'hello';
      fixture.detectChanges();
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bDisplay3Element.nativeElement.innerText).toEqual('hello');
    });
    it('should set input Subtitle inside <p card-bottom> element', () => {
      component.subtitle = 'world';
      fixture.detectChanges();
      const cardBottomElement = fixture.debugElement.query(
        By.css('[card-bottom]')
      );
      expect(cardBottomElement.nativeElement.innerText).toEqual('world');
    });
    it('should set input text inside <b-display-3> element and truncate text', () => {
      fixture.nativeElement.style.width = '200px';
      component.title =
        'Compensation update with a very long text that cuts off after 4 lines of text. And here is another very long text that should not be displayed at all.';
      fixture.detectChanges();
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bDisplay3Element.nativeElement.scrollHeight).toBeGreaterThan(
        bDisplay3Element.nativeElement.clientHeight
      );
    });
  });

  describe('onClick', () => {
    it('should emit Clicked event', () => {
      component.onClick('hello');
      expect(component.clicked.emit).toHaveBeenCalledWith('hello');
    });
  });
});
