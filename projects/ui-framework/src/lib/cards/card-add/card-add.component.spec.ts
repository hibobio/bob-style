import { CardAddComponent } from './card-add.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { CardType } from '../cards.enum';

describe('CardAddComponent', () => {
  let fixture: ComponentFixture<CardAddComponent>;
  let component: CardAddComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardAddComponent],
      imports: [TruncateTooltipModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardAddComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style.width = '300px';
      });
  }));

  describe('Type', () => {
    beforeEach(() => {
      component.card = {
        title: 'test',
      };
    });
    it('should be of type primary by default', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.attributes['data-type'].value).toEqual(
        'regular'
      );
    });
    it('should change type on type input change', () => {
      component.type = CardType.large;
      fixture.detectChanges();
      expect(fixture.nativeElement.attributes['data-type'].value).toEqual(
        'large'
      );
    });
  });

  describe('texts', () => {
    it('should set title text', () => {
      component.card = {
        title: 'test',
      };
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.card-title'));
      expect(title.nativeElement.innerText).toContain('test');
    });
    it('should set subtitle text', () => {
      component.card = {
        title: 'test',
        subtitle: 'subtitle test',
      };
      fixture.detectChanges();
      const subtitle = fixture.debugElement.query(By.css('.card-title'));
      expect(subtitle.nativeElement.innerText).toContain('test');
    });
  });

  describe('onClick', () => {
    it('should emit Clicked event', () => {
      component.clicked.subscribe(() => {});
      spyOn(component.clicked, 'emit');
      component.card = {
        title: 'test',
      };
      component.cardElRef.nativeElement.click();
      expect(component.clicked.emit).toHaveBeenCalled();
      component.clicked.complete();
    });
  });
});
