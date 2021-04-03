import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconComponent } from '../../icons/icon.component';
import { LinkColor, LinkTarget } from '../link/link.enum';
import { LinkModule } from '../link/link.module';
import { InfoStripComponent } from './info-strip.component';
import { INFOSTRIP_ICON_DICT } from './info-strip.const';
import { InfoStripIconType } from './info-strip.enum';

describe('InfoStripComponent', () => {
  let component: InfoStripComponent;
  let fixture: ComponentFixture<InfoStripComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponent(IconComponent), InfoStripComponent],
        imports: [LinkModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(InfoStripComponent);
          component = fixture.componentInstance;
          component.link = {
            url: 'https://app.hibob.com',
            text: 'Click here',
            target: LinkTarget.blank,
            color: LinkColor.primary,
          };
          component.iconType = InfoStripIconType.information;
        });
    })
  );

  describe('icon dictionary', () => {
    const testIcon = (type: InfoStripIconType) => {
      component.iconType = type;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement.componentInstance.color).toEqual(
        INFOSTRIP_ICON_DICT[type].color
      );
      expect(iconElement.componentInstance.icon).toEqual(
        INFOSTRIP_ICON_DICT[type].icon
      );
    };

    it('should have warning icon with primary color', () => {
      testIcon(InfoStripIconType.warning);
    });

    it('should have success icon with positive color', () => {
      testIcon(InfoStripIconType.success);
    });

    it('should have error icon with negative color', () => {
      testIcon(InfoStripIconType.error);
    });

    it('should have information icon with inform color', () => {
      testIcon(InfoStripIconType.information);
    });
  });

  it('should check info strip link', () => {
    component.text = 'info strip text';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.content p')).nativeElement;
    expect(text.innerText).toBe('info strip text');
    const link = fixture.debugElement.query(By.css('b-link'));
    expect(link.componentInstance.config.text).toBe('Click here');
    expect(link.componentInstance.config.url).toBe('https://app.hibob.com');
    expect(link.componentInstance.config.target).toBe('_blank');
    expect(link.componentInstance.config.color).toBe('primary');
  });
});
