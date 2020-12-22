import { CardComponent } from './card.component';
import { ComponentFixture, fakeAsync, TestBed, tick, resetFakeAsyncZone, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { CardType } from '../cards.enum';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { TypographyModule } from '../../typography/typography.module';
import { IconColor, Icons } from '../../icons/icons.enum';
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardComponent,
        MockComponent(MenuComponent),
        MockComponent(SquareButtonComponent),
        MockComponent(TextButtonComponent),
      ],
      imports: [TruncateTooltipModule, TypographyModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        component.ngAfterViewInit = () => {};
        fixture.debugElement.nativeElement.style.width = '300px';
      });
  }));

  describe('Type', () => {
    beforeEach(() => {
      component.card = {
        title: 'test title',
      };
    });
    it('should be of type primary by default', () => {
      fixture.detectChanges();
      expect(
        fixture.debugElement.nativeElement.attributes['data-type'].value
      ).toEqual('regular');
    });
    it('should change type on type input change', () => {
      component.type = CardType.large;
      fixture.detectChanges();
      expect(
        fixture.debugElement.nativeElement.attributes['data-type'].value
      ).toEqual('large');
    });
  });

  describe('Title', () => {
    it('should set .card-title text', () => {
      component.card = {
        title: 'test title',
      };
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.card-title'));
      expect(title.nativeElement.innerText).toContain('test title');
    });

    it('should add truncate-tooltip to long .card-content text', () => {
      component.card = {
        title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      };
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.card-title'));
      expect(title.componentInstance.maxLines).toEqual(2);
      expect(title.componentInstance.trustCssVars).toEqual(true);
    });
  });

  describe('Menu', () => {
    it('should create menu element', () => {
      component.card = {
        title: 'test',
        menuConfig: [
          { label: 'action 1', action: () => console.log('action 1') },
        ],
      };
      fixture.detectChanges();
      const menu = fixture.debugElement.query(By.css('.card-menu'));

      expect(menu).toBeTruthy();
    });
    it('should not create menu element if no menuConfig is passed', () => {
      component.card = {
        title: 'test',
      };
      const menu = fixture.debugElement.query(By.css('.card-menu'));

      expect(menu).toBeFalsy();
    });
    it('should prefer menu over action button', () => {
      component.card = {
        title: 'test',
        menuConfig: [
          { label: 'action 1', action: () => console.log('action 1') },
        ],
        actionConfig: {
          icon: Icons.file_copy,
          action: () => console.log('action button'),
        },
      };
      fixture.detectChanges();

      const menu = fixture.debugElement.query(By.css('.card-menu'));
      const action = fixture.debugElement.query(By.css('.card-action'));

      expect(menu).toBeTruthy();
      expect(action).toBeFalsy();
    });
  });

  describe('Action Button', () => {
    it('should add action button if config is passed', () => {
      component.card = {
        title: 'test',
        actionConfig: {
          icon: Icons.file_copy,
          action: () => console.log('action button'),
        },
      };
      fixture.detectChanges();
      const action = fixture.debugElement.query(By.css('.card-action'));
      expect(action).toBeTruthy();
    });
    it('should pass button config to element', () => {
      component.card = {
        title: 'test',
        actionConfig: {
          icon: Icons.file_copy,
          action: () => console.log('action button'),
        },
      };
      fixture.detectChanges();
      const action = fixture.debugElement.query(By.css('.card-action'));
      expect(action.componentInstance.icon).toEqual('b-icon-file-copy');
      expect(action.componentInstance.color).toEqual(IconColor.dark);
    });
  });

  describe('cta', () => {
    it('should not show cta button if not in config', () => {
      component.card = {
        title: 'test',
      };
      fixture.detectChanges();
      const ctaButton = fixture.debugElement.query(By.css('.cta-button'));
      expect(ctaButton).toBeFalsy();
    });
    it('should not show cta button if not in config', () => {
      component.card = {
        title: 'test',
        footerCtaLabel: 'click here',
      };
      fixture.detectChanges();
      const ctaButton = fixture.debugElement.query(By.css('.cta-button'));
      expect(ctaButton).toBeTruthy();
      expect(ctaButton.componentInstance.text).toEqual('click here');
    });
    it('should invoke clicked on cta button click', () => {
      spyOn(component.clicked, 'emit');
      component.card = {
        title: 'test',
        footerCtaLabel: 'click here',
      };
      fixture.detectChanges();
      const ctaButton = fixture.debugElement.query(By.css('.cta-button'));
      ctaButton.componentInstance.clicked.emit();
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });

  describe('cover image', () => {
    it('should not show cover image when no image is supplied', () => {
      component.card = {
        title: 'test',
      };
      fixture.detectChanges();
      const image = fixture.debugElement.query(By.css('.image-holder'));
      expect(image).toBeFalsy();
    });
    it('should show image if supplied', () => {
      component.card = {
        title: 'test',
        imageUrl: emptyImg,
      };
      fixture.detectChanges();
      const image = fixture.debugElement.query(By.css('.card-top'))
        .nativeElement;
      expect(image.style.backgroundImage).toContain(emptyImgTestString);
    });
    it('should change icon color to white when image is displayed', () => {
      component.card = {
        title: 'test',
        imageUrl: emptyImg,
        actionConfig: {
          icon: Icons.file_copy,
          action: () => console.log('action button'),
        },
      };
      fixture.detectChanges();
      const action = fixture.debugElement.query(By.css('.card-action'));
      expect(action.componentInstance.color).toEqual(IconColor.white);
    });
  });
});
