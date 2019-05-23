import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CardsLayoutComponent } from './cards-layout.component';
import { CardsMockData, AddCardMockData } from '../cardsMockData';
import { CardsModule } from '../cards.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { SliderComponent } from '../../buttons-indicators/slider/slider.component';
import { CardType } from '../cards.enum';

describe('CardsLayoutComponent', () => {
  let fixture: ComponentFixture<CardsLayoutComponent>;
  let component: CardsLayoutComponent;
  let addCardElement: HTMLElement;
  let cardsListElement: HTMLElement;
  let cardsElements: any;

  const mockCardData = CardsMockData.slice(0, 4);
  const mockAddCardData = AddCardMockData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CardsModule, AvatarModule, SliderModule, TruncateTooltipModule, ComponentRendererModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarComponent, SliderComponent]
        }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardsLayoutComponent);
        fixture.nativeElement.style.width = '950px';
        component = fixture.componentInstance;
        component.cards = mockCardData;
        component.addCard = mockAddCardData;

        fixture.detectChanges();

        addCardElement = fixture.debugElement.query(By.css('[b-card-add]')).nativeElement;

        cardsListElement = fixture.debugElement.query(By.css('.cards-list')).nativeElement;

        cardsElements = cardsListElement.querySelectorAll('[b-card]');
      });
  }));

  describe('Layout', () => {
    it('should create layout with 1 addCard and 4 card components', () => {
      expect(cardsListElement.children.length).toEqual(5);
      expect(addCardElement).toBeTruthy();
      expect(cardsElements.length).toEqual(4);
    });
  });

  describe('Type', () => {
    it('should be of type primary by default', () => {
      expect(cardsListElement.classList).toContain('cards-primary');
    });
    it('should change type on type input change', () => {
      component.type = CardType.tertiary;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('cards-tertiary');
    });
  });
});
