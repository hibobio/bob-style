import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { CardEmployeeComponent } from './card-employee.component';
import { TypographyModule } from '../../typography/typography.module';
import { MockComponent } from 'ng-mocks';
import { CardType } from '../cards.enum';
import { By } from '@angular/platform-browser';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';

describe('CardEmployeeComponent', () => {
  let fixture: ComponentFixture<CardEmployeeComponent>;
  let component: CardEmployeeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardEmployeeComponent,
        MockComponent(AvatarImageComponent),
      ],
      imports: [TruncateTooltipModule, TypographyModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardEmployeeComponent);
        component = fixture.componentInstance;
        component.ngAfterViewInit = () => {};
        fixture.nativeElement.style.width = '300px';
      });
  }));

  describe('Type', () => {
    beforeEach(() => {
      component.card = {
        imageSource: emptyImg,
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

  describe('avatar image', () => {
    beforeEach(() => {
      component.card = {
        imageSource: emptyImg,
        title: 'test',
      };
    });
    it('should set avatar image', () => {
      fixture.detectChanges();
      const avatar = fixture.debugElement.query(By.css('b-avatar-image'));
      expect(avatar.componentInstance.imageSource).toContain(
        emptyImgTestString
      );
    });
    it('should set avatar size to medium if type is not small', () => {
      fixture.detectChanges();
      const avatar = fixture.debugElement.query(By.css('b-avatar-image'));
      expect(avatar.componentInstance.size).toEqual(AvatarSize.medium);
    });
    it('should set avatar size to small if type is small', () => {
      component.type = CardType.small;
      fixture.detectChanges();
      const avatar = fixture.debugElement.query(By.css('b-avatar-image'));
      expect(avatar.componentInstance.size).toEqual(AvatarSize.small);
    });
  });

  describe('title', () => {
    beforeEach(() => {
      component.card = {
        imageSource: emptyImg,
        title: 'test',
      };
    });
    it('should set title', () => {
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.card-title'));
      expect(title.nativeElement.innerText).toContain('test');
    });
  });

  describe('social', () => {
    it('should not display social elements if none are provided', () => {
      component.card = {
        imageSource: emptyImg,
        title: 'test',
      };
      fixture.detectChanges();
      const social = fixture.debugElement.query(By.css('.social'));
      expect(social).toBeFalsy();
    });
    it('should display social elements that are provided', () => {
      component.card = {
        imageSource: emptyImg,
        title: 'test',
        social: {
          facebook: 'facebook_url',
          twitter: 'twitter_url',
        },
      };
      fixture.detectChanges();
      const socialLinks = fixture.debugElement.queryAll(By.css('.social a'));
      expect(socialLinks.length).toEqual(2);
    });
    it('should have correct link for every link', () => {
      const testLink = (linkEl, url) => {
        expect(linkEl.href).toContain(url);
      };
      component.card = {
        imageSource: emptyImg,
        title: 'test',
        social: {
          linkedin: 'linkedin_url',
          facebook: 'facebook_url',
          twitter: 'twitter_url',
        },
      };
      fixture.detectChanges();
      const socialLinks = fixture.debugElement.queryAll(By.css('.social a'));
      testLink(socialLinks[0].nativeElement, 'linkedin_url');
      testLink(socialLinks[1].nativeElement, 'facebook_url');
      testLink(socialLinks[2].nativeElement, 'twitter_url');
    });
  });
});
