import { ComponentFixture, TestBed, fakeAsync, resetFakeAsyncZone, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { CardsLayoutComponent } from './cards-layout.component';
import { CardType } from '../cards.enum';
import { fakeAsyncFlush } from '../../services/utils/test-helpers';
import { CARD_TYPE_WIDTH, GAP_SIZE } from './cards-layout.const';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { ItemsInRowService } from '../../services/items-in-row/items-in-row.service';
import {
  DOMhelpersProvideMock,
  MobileServiceProvideMock,
  MutationObservableServiceProvideMock,
} from '../../tests/services.stub.spec';
import { simpleChange } from '../../services/utils/functional-utils';

describe('CardsLayoutComponent', () => {
  let fixture: ComponentFixture<CardsLayoutComponent>;
  let component: CardsLayoutComponent;
  let cardsListElement: HTMLElement;
  let cardsHostElement: HTMLElement;

  const getCardMaxWidth = () =>
    getComputedStyle(cardsHostElement).getPropertyValue('--item-width');

  const calcCards = (hostWidth, type) => {
    const gaps = (Math.floor(hostWidth / CARD_TYPE_WIDTH[type]) - 1) * GAP_SIZE;
    let fullCards = Math.floor((hostWidth - gaps) / CARD_TYPE_WIDTH[type]);
    fullCards = fullCards > 1 ? fullCards : 1;
    return fullCards > 1 ? fullCards : 1;
  };

  const calcNeededWidth = (cards, type) => {
    return CARD_TYPE_WIDTH[type] * cards + GAP_SIZE * (cards - 1) + 15 + 'px';
  };

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardsLayoutComponent],
      imports: [],
      providers: [
        EventManagerPlugins[0],
        ItemsInRowService,
        MutationObservableServiceProvideMock(),
        DOMhelpersProvideMock(),
        MobileServiceProvideMock(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CardsLayoutComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardsLayoutComponent);

        component = fixture.componentInstance;

        cardsHostElement = fixture.debugElement.nativeElement;
        cardsHostElement.style.width = '950px';

        component.type = CardType.regular;
        fixture.detectChanges();

        cardsListElement = fixture.debugElement.query(By.css('.cards-list'))
          .nativeElement;
      });
  }));

  describe('Oninit', () => {
    it('should be of type primary by default', () => {
      expect(getCardMaxWidth()).toEqual(
        CARD_TYPE_WIDTH[CardType.regular] + 'px'
      );
    });
    it('should change type on type input change', () => {
      component.ngOnChanges(simpleChange({ type: CardType.large }));
      expect(getCardMaxWidth()).toEqual(CARD_TYPE_WIDTH[CardType.large] + 'px');
    });

    it('should have gap-size variable set', () => {
      expect(
        getComputedStyle(cardsHostElement).getPropertyValue('--item-grid-gap')
      ).toEqual(GAP_SIZE + 'px');
    });
  });

  describe('cards in a row calculation', () => {
    afterEach(fakeAsync(() => {
      fakeAsyncFlush();
    }));

    it(`should have 5 cards on ${calcNeededWidth(
      5,
      CardType.small
    )} container, small cards`, () => {
      cardsHostElement.style.width = calcNeededWidth(5, CardType.small);
      component.ngOnChanges(
        simpleChange({
          type: CardType.small,
        })
      );
      expect(component.cardsInRow).toEqual(5);
    });

    it(`should have 6 cards on ${calcNeededWidth(
      6,
      CardType.regular
    )} container, regular cards`, () => {
      cardsHostElement.style.width = calcNeededWidth(6, CardType.regular);
      component.ngOnChanges(
        simpleChange({
          type: CardType.regular,
        })
      );
      expect(component.cardsInRow).toEqual(6);
    });

    it(`should have 3 cards on ${calcNeededWidth(
      3,
      CardType.large
    )} container, large cards`, () => {
      cardsHostElement.style.width = calcNeededWidth(3, CardType.large);
      component.ngOnChanges(
        simpleChange({
          type: CardType.large,
        })
      );
      expect(component.cardsInRow).toEqual(3);
    });

    it('should transmit cardsInRow as cardsInRow$', (done) => {
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(4);
        done();
      });
    });
  });

  describe('Align center', () => {
    it('should have align-center attribute if input align center is true', () => {
      component.type = CardType.regular;
      component.alignCenter = true;
      fixture.detectChanges();
      expect(cardsListElement.dataset.alignCenter).toEqual('true');
    });
  });

  describe('Mobile swiper', () => {});
});
