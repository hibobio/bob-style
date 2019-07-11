import { CardComponent } from './card.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { CardsMockData } from '../cards.mock';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { CardsModule } from '../cards.module';
import { CardType } from '../cards.enum';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;
  let cardContentElement: HTMLElement;
  let menuElement: HTMLElement;
  let menuComponent: MenuComponent;

  const mockCardData = CardsMockData[1];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(MenuComponent),
      ],
      imports: [
        CardsModule,
        TruncateTooltipModule,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style.width = '300px';
        component.card = mockCardData;
        fixture.detectChanges();

        cardContentElement = fixture.debugElement.query(By.css('.card-content'))
          .nativeElement;

        menuElement =
          fixture.debugElement.query(By.css('b-menu')) &&
          fixture.debugElement.query(By.css('b-menu')).nativeElement;
        menuComponent =
          fixture.debugElement.query(By.css('b-menu')) &&
          fixture.debugElement.query(By.css('b-menu')).componentInstance;
      });
  }));

  describe('Type', () => {
    it('should be of type primary by default', () => {
      expect(getComputedStyle(cardContentElement).fontSize).toEqual('18px');
    });
    it('should change type on type input change', () => {
      component.type = CardType.large;
      fixture.detectChanges();
      expect(getComputedStyle(cardContentElement).fontSize).toEqual('22px');
    });
  });

  describe('Main text', () => {
    it('should set .card-content input text', () => {
      expect(cardContentElement.innerText).toContain('Compensation update');
    });

    it('should add truncate-tooltip to long .card-content text', () => {
      fixture.detectChanges();
      expect(cardContentElement.children[0].classList).toContain('initialized');
    });
  });

  describe('Menu', () => {
    it('should create menu element', () => {
      expect(menuElement).toBeTruthy();
    });

    it('should add focus-inside class on the host element on menu open', () => {
      menuComponent.openMenu.emit();
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('focus-inside');
    });

    it('should remove focus-inside class from host element after timeout on menu close', fakeAsync(() => {
      menuComponent.openMenu.emit();
      menuComponent.closeMenu.emit();
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('focus-inside');
      tick(300);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).not.toContain('focus-inside');
    }));

    it('should NOT create menu element when falsy menu configuration is passed', () => {
      const cardDataWithNoMenu = mockCardData;
      cardDataWithNoMenu.menu = [];
      component.card = cardDataWithNoMenu;
      fixture.detectChanges();

      const badMenuElement = fixture.debugElement.query(By.css('b-menu'));
      expect(badMenuElement).toBeFalsy();
    });
  });
});
