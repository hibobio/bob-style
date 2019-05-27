import { CardAddComponent } from './card-add.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AddCardMockData } from '../cardsMockData';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { CardsModule } from '../cards.module';
import { CardType } from '../cards.enum';

describe('CardAddComponent', () => {
  let fixture: ComponentFixture<CardAddComponent>;
  let component: CardAddComponent;
  let cardContentElement: HTMLElement;

  const mockCardData = AddCardMockData;
  mockCardData.title =
    mockCardData.title +
    'with a very long text that cuts off after 4 lines of text. And here is another very long text that should not be displayed at all.';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CardsModule, TruncateTooltipModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardAddComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style.width = '300px';
        component.card = mockCardData;

        fixture.detectChanges();
        cardContentElement = fixture.debugElement.query(By.css('.card-content'))
          .nativeElement;

        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('Main text', () => {
    it('should set .card-content input text', () => {
      expect(cardContentElement.innerText).toContain('Add a new flow');
    });
    it('should set input Subtitle inside .card-bottom element', () => {
      const cardBottomElement = fixture.debugElement.query(
        By.css('.card-bottom')
      ).nativeElement;
      expect(cardBottomElement.innerText).toContain('Right now');
    });

    it('should add truncate-tooltip to long .card-content text', () => {
      fixture.detectChanges();
      expect(cardContentElement.classList).toContain('btt-initialized');
    });
  });

  describe('Type', () => {
    it('should be of type primary by default', () => {
      expect(getComputedStyle(cardContentElement).fontSize).toEqual('18px');
    });
    it('should change type on type input change', () => {
      component.type = CardType.tertiary;
      fixture.detectChanges();
      expect(getComputedStyle(cardContentElement).fontSize).toEqual('22px');
    });
  });

  describe('onClick', () => {
    it('should emit Clicked event', () => {
      component.onClick('hello');
      expect(component.clicked.emit).toHaveBeenCalledWith('hello');
    });
  });
});
