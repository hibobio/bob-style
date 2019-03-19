import { CardComponent } from './card.component';
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
import { MockComponent } from 'ng-mocks';
import { MenuComponent } from '../../navigation/menu/menu.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(MenuComponent), CardComponent],
      imports: [TypographyModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('component', () => {
    it('should set input text inside <b-display-3> element', () => {
      component.text = 'hello';
      fixture.detectChanges();
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bDisplay3Element.nativeElement.innerText).toEqual('hello');
    });
    it('should set input text inside <b-display-3> element and truncate text', () => {
      fixture.nativeElement.style.width = '200px';
      component.text =
        'Compensation update with a very long text that cuts off after 4 lines of text. And here is another very long text that should not be displayed at all.';
      fixture.detectChanges();
      const bDisplay3Element = fixture.debugElement.query(
        By.css('b-display-3')
      );
      expect(bDisplay3Element.nativeElement.scrollHeight).toBeGreaterThan(
        bDisplay3Element.nativeElement.clientHeight
      );
    });
    it('should create menu element when menu configuration is passed', () => {
      component.menu = [{ label: '' }];
      fixture.detectChanges();
      const menuElement = fixture.debugElement.query(By.css('b-menu'));
      expect(menuElement).toBeTruthy();
    });
  });

  describe('onMenuOpen', () => {
    it('should add focusInside class on the host element', () => {
      component.menu = [{ label: '' }];
      fixture.detectChanges();
      const menuElement = fixture.debugElement.query(By.css('b-menu'));
      menuElement.componentInstance.openMenu.emit();
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('focusInside');
    });
  });

  describe('onMenuClose', () => {
    it('should remove focusInside class from host element after timeout', fakeAsync(() => {
      component.menu = [{ label: '' }];
      fixture.detectChanges();
      const menuElement = fixture.debugElement.query(By.css('b-menu'));
      menuElement.componentInstance.openMenu.emit();
      menuElement.componentInstance.closeMenu.emit();
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('focusInside');
      tick(300);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).not.toContain('focusInside');
    }));
  });
});
