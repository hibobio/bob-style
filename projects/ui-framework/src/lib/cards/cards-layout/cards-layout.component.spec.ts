import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ChangeDetectionStrategy, NO_ERRORS_SCHEMA} from '@angular/core';
import {CardsLayoutComponent, GAP_SIZE} from './cards-layout.component';
import {CardsModule} from '../cards.module';
import {CardType} from '../cards.enum';
import {MockComponent} from 'ng-mocks';

describe('CardsLayoutComponent', () => {
  let fixture: ComponentFixture<CardsLayoutComponent>;
  let component: CardsLayoutComponent;
  let cardsListElement: HTMLElement;
  let gapSize: number;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(CardsLayoutComponent)],
      imports: [CardsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(CardsLayoutComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardsLayoutComponent);
        fixture.nativeElement.style.width = '950px';
        component = fixture.componentInstance;
        component.type = CardType.regular;
        fixture.detectChanges();
        cardsListElement = fixture.debugElement.query(By.css('.cards-list'))
          .nativeElement;
        gapSize = GAP_SIZE;
      });
  }));

  describe('Type', () => {
    it('should be of type primary by default', () => {
      expect(cardsListElement.classList).toContain('cards-regular');
    });
    it('should change type on type input change', () => {
      component.type = CardType.large;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('cards-large');
    });
    it('should change type on type input change', () => {
      component.type = CardType.small;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('cards-small');
    });
  });
  describe('cards in a row calculation', () => {
    it('should have 5 cards on 917px container small cards', (done) => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '917px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(5);
        done();
      });
    });
    it('should have 4 cards on 917px container regular cards', (done) => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '917px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(4);
        done();
      });
    });
    it('should have 4 cards on 727px container small cards', (done) => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '727px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(4);
        done();
      });
    });
    it('should have 3 cards on 727px container regular cards', (done) => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '727px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(3);
        done();
      });
    });
    it('should have 3 cards on 600px container small cards', (done) => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '600px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(3);
        done();
      });
    });
    it('should have 2 cards on 600px container regular cards', (done) => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '600px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(2);
        done();
      });
    });
    it('should have fire getCardsInRow$ after resize cards container', async(done) => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '600px';
      let cardsInRowSubscribeCalled = 0;
      component.getCardsInRow$().subscribe((numberOfCards) => {
        if (cardsInRowSubscribeCalled === 0) {
          fixture.nativeElement.style.width = '727px';
          window.dispatchEvent(new Event('resize'));
        } else if (cardsInRowSubscribeCalled === 1) {
          expect(numberOfCards).toEqual(3);
          done();
        }
        cardsInRowSubscribeCalled++;
      });
    });

  });
  describe('component init', () => {
    it('should have align-center class if input align center is true', (done) => {
      component.type = CardType.regular;
      component.alignCenter = true;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('align-center');
      done();
    });
    it('should have no align-center class by default', (done) => {
      component.type = CardType.regular;
      fixture.detectChanges();
      expect(cardsListElement.classList).not.toContain('align-center');
      done();
    });
  });
});
