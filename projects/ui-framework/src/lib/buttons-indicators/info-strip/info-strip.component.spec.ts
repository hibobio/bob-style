import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InfoStripComponent} from './info-strip.component';
import {By} from '@angular/platform-browser';
import {MockComponent} from 'ng-mocks';
import {IconComponent} from '../../icons/icon.component';
import {LinkModule} from '../link/link.module';
import {LinkColor, LinkTarget} from '../link/link.enum';
import {StripIconType} from './info-strip.enum';
import {IconColor, Icons} from '../../icons/icons.enum';

describe('InfoStripComponent', () => {
  let component: InfoStripComponent;
  let fixture: ComponentFixture<InfoStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(IconComponent),
        InfoStripComponent,
      ],
      imports: [
        LinkModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InfoStripComponent);
        component = fixture.componentInstance;
        component.link = {
          url: 'https://app.hibob.com', text: 'Click here', target: LinkTarget.blank, color: LinkColor.primary
        };
      });
  }));

  describe('icon dictionary', () => {
    const testIcon = (type: StripIconType, icon: Icons, color: IconColor) => {
      component.iconType = type;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement.componentInstance.color).toEqual(color);
      expect(iconElement.componentInstance.icon).toEqual(icon);
    };

    it('should have warning icon with primary color', () => {
      testIcon(StripIconType.warning, Icons.warning, IconColor.primary);
    });

    it('should have success icon with positive color', () => {
      testIcon(StripIconType.success, Icons.success, IconColor.positive);
    });

    it('should have error icon with negative color', () => {
      testIcon(StripIconType.error, Icons.error, IconColor.negative);
    });

    it('should have information icon with inform color', () => {
      testIcon(StripIconType.information, Icons.baseline_info_icon, IconColor.inform);
    });
  });

  it('should check info strip link', () => {
    component.text = 'info strip text';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.content p')).nativeElement;
    const link = fixture.debugElement.query(By.css('b-link'));
    expect(text.innerText).toBe('info strip text');
    expect(link.componentInstance.config.text).toBe('Click here');
    expect(link.componentInstance.config.url).toBe('https://app.hibob.com');
    expect(link.componentInstance.config.target).toBe('_blank');
    expect(link.componentInstance.config.color).toBe('primary');
  });
});
