import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { By } from '@angular/platform-browser';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { SimpleChange } from '@angular/core';
import { ChipType } from '../chip/chip.enum';
import { ChipModule } from '../chip/chip.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { BadgeSize, AvatarBadges } from './avatar.consts';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let avatarElement: HTMLElement;
  let titleElement: HTMLElement;
  let componentElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [IconsModule, ChipModule, TruncateTooltipModule],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;
        component.title = 'Title';
        component.imageSource =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        component.backgroundColor = 'rgb(255, 255, 255)';

        fixture.detectChanges();
        avatarElement = fixture.debugElement.query(By.css('.avatar'))
          .nativeElement;
        titleElement = fixture.debugElement.query(By.css('.title'))
          .nativeElement;
        spyOn(component.clicked, 'emit');
      });
  }));

  it('should create avatar with default values', () => {
    expect(component).toBeTruthy();
    expect(component.size).toEqual(AvatarSize.mini);
  });

  describe('Avatar image', () => {
    it('Should put the image as background on .avatar element', () => {
      expect(avatarElement.style.backgroundImage).toContain(
        'iVBORw0KGgoAAAANSUhEUgAAA'
      );
    });
  });
  describe('Avatar background color', () => {
    it('Should put the background color on .avatar element', () => {
      expect(avatarElement.style.backgroundColor).toContain(
        'rgb(255, 255, 255)'
      );
    });
  });

  describe('onClick', () => {
    it('Should not emit the click event if the component is set to not be clickable', () => {
      component.onClick('click');
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('Should emit the click event if the component is set to be clickable', () => {
      component.isClickable = true;
      component.onClick('click');
      expect(component.clicked.emit).toHaveBeenCalledWith('click');
    });
  });

  describe('Classes', () => {
    it('Should put the right classes on component host element', () => {
      component.isClickable = true;
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.large, false)
      });
      fixture.detectChanges();
      expect(componentElem.classList.value).toEqual(
        'large horizontal clickable'
      );
    });
  });

  describe('Avatar size', () => {
    it('Should set the right size of the avatar with css variable', () => {
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.large, false)
      });
      fixture.detectChanges();
      expect(getComputedStyle(avatarElement).width).toEqual(
        AvatarSize.large + 'px'
      );
    });
  });

  describe('Text', () => {
    it('Should put title & subtitle text', () => {
      component.subtitle = 'Subtitle';
      fixture.detectChanges();

      const subtitle = fixture.debugElement.query(By.css('.slot2-medium'))
        .nativeElement;
      expect(titleElement.innerText).toContain('Title');
      expect(subtitle.innerText).toContain('Subtitle');
    });
    it('Should put caption text on large avatar', () => {
      component.caption = 'department';
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.large, false)
      });
      fixture.detectChanges();
      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeTruthy();
      expect(department.nativeElement.innerText).toEqual('department');
    });
    it('Should not put caption text on avatar, if size is not large', () => {
      component.caption = 'department';
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.medium, false)
      });
      fixture.detectChanges();
      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeFalsy();
    });
  });

  describe('Disabled', () => {
    it('Should set avatar disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(componentElem.classList.value).toContain('disabled');
      component.onClick('click');
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('Should add badge icon', () => {
      component.ngOnChanges({
        badge: new SimpleChange(null, AvatarBadge.pending, false),
        size: new SimpleChange(null, AvatarSize.small, false)
      });
      fixture.detectChanges();
      const badgeElement = fixture.debugElement.query(
        By.css('.avatar-badge .b-icon.b-icon-' + BadgeSize[AvatarSize.small])
      );
      expect(badgeElement).toBeTruthy();
    });
    it('Should also accept BadgeConfig-format input', () => {
      component.ngOnChanges({
        badge: new SimpleChange(null, AvatarBadges[AvatarBadge.pending], false),
        size: new SimpleChange(null, AvatarSize.medium, false)
      });
      fixture.detectChanges();
      const badgeElement = fixture.debugElement.query(
        By.css('.avatar-badge .b-icon.b-icon-' + BadgeSize[AvatarSize.medium])
      );
      expect(badgeElement).toBeTruthy();
    });
  });

  describe('Status', () => {
    it('Should add status chip', () => {
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.large, false)
      });
      component.chip = {
        type: ChipType.success,
        text: 'status'
      };
      fixture.detectChanges();
      const statusElement = fixture.debugElement.query(
        By.css('.chip .chip-success')
      );
      expect(statusElement).toBeTruthy();
      expect(statusElement.nativeElement.innerText).toEqual('status');
    });
    it('Should not add status chip to small avatar', () => {
      component.ngOnChanges({
        size: new SimpleChange(null, AvatarSize.small, false)
      });
      component.chip = {
        type: ChipType.success,
        text: 'status'
      };
      fixture.detectChanges();
      const statusElement = fixture.debugElement.query(
        By.css('.chip .chip-success')
      );
      expect(statusElement).toBeFalsy();
    });
  });

  describe('Orientation', () => {
    it('Should have vertical orientation', () => {
      component.orientation = AvatarOrientation.vertical;
      fixture.detectChanges();
      expect(componentElem.classList.value).toContain('vertical');
      expect(getComputedStyle(componentElem).flexDirection).toEqual('column');
    });
  });
});
