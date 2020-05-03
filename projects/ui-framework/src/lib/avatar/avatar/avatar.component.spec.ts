import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { By } from '@angular/platform-browser';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChipType } from '../../chips/chips.enum';
import { AvatarImageComponent } from './avatar-image/avatar-image.component';
import { MockComponent } from 'ng-mocks';
import { ChipComponent } from '../../chips/chip/chip.component';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let avatarElement: HTMLElement;
  let titleElement: HTMLElement;
  let componentElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AvatarComponent,
        AvatarImageComponent,
        MockComponent(ChipComponent),
        MockComponent(TruncateTooltipComponent),
      ],
      imports: [],
      providers: [DOMhelpers],
    })
      .overrideComponent(AvatarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;
        component.title = 'Title';
        component.imageSource = emptyImg;
        component.backgroundColor = 'red';
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
      expect(avatarElement.getAttribute('style')).toContain(emptyImgTestString);
    });
  });
  describe('Avatar background color', () => {
    it('Should put the background color on .avatar element', () => {
      expect(avatarElement.getAttribute('style')).toContain('red');
    });
  });

  describe('onClick', () => {
    it('Should not emit the click event if the component is set to not be clickable', () => {
      component.onClick('click' as any);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('Should emit the click event if the component is set to be clickable', () => {
      component.isClickable = true;
      component.clicked.subscribe(() => {});
      component.onClick('click' as any);
      expect(component.clicked.emit).toHaveBeenCalledWith('click' as any);
      component.clicked.complete();
    });
  });

  describe('Attributes', () => {
    it('Should put the right attributes on component host element', () => {
      component.isClickable = true;
      component.size = AvatarSize.large;
      fixture.detectChanges();

      expect(componentElem.dataset.size).toEqual('large');
      expect(componentElem.dataset.orientation).toEqual('horizontal');
      expect(componentElem.dataset.disabled).not.toEqual('true');
    });
  });

  describe('Avatar size', () => {
    it('Should set the right size of the avatar with css variable', fakeAsync(() => {
      component.size = AvatarSize.large;
      fixture.detectChanges();
      flush();

      expect(getComputedStyle(avatarElement).width).toEqual(
        AvatarSize.large + 'px'
      );
    }));
  });

  describe('Text', () => {
    it('Should put title & subtitle text', () => {
      component.subtitle = 'Subtitle';
      component.size = AvatarSize.medium;
      fixture.detectChanges();

      const subtitle = fixture.debugElement.query(By.css('.slot2-medium'))
        .nativeElement;
      expect(titleElement.innerText).toContain('Title');
      expect(subtitle.innerText).toContain('Subtitle');
    });
    it('Should put caption text on large avatar', () => {
      component.caption = 'department';
      component.size = AvatarSize.medium;
      fixture.detectChanges();

      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeTruthy();
      expect(department.nativeElement.innerText).toEqual('department');
    });
    it('Should not put caption text on avatar, if size is small', () => {
      component.caption = 'department';
      component.size = AvatarSize.small;
      fixture.detectChanges();

      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeFalsy();
    });
  });

  describe('Disabled', () => {
    it('Should set disabled attribute', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(componentElem.dataset.disabled).toEqual('true');
      component.onClick('click' as any);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('Should add badge icon', fakeAsync(() => {
      component.size = AvatarSize.small;
      component.badge = AvatarBadge.pending;
      fixture.detectChanges();
      flush();

      expect(avatarElement.dataset.iconAfter).toContain('watch');
      expect(avatarElement.dataset.iconAfterColor).toContain('normal');
    }));
  });

  describe('Status', () => {
    it('Should add status chip', () => {
      component.chip = {
        type: ChipType.success,
        text: 'status',
      };
      component.size = AvatarSize.large;
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('b-chip'));
      expect(statusElement).toBeTruthy();
      expect(statusElement.componentInstance.type).toEqual('success');
      expect(statusElement.componentInstance.text).toEqual('status');
    });
    it('Should not add status chip to small avatar', () => {
      component.chip = {
        type: ChipType.success,
        text: 'status',
      };
      component.size = AvatarSize.small;
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('b-chip'));
      expect(statusElement).toBeFalsy();
    });
  });

  describe('Orientation', () => {
    it('Should have vertical orientation', () => {
      component.orientation = AvatarOrientation.vertical;
      fixture.detectChanges();

      expect(componentElem.dataset.orientation).toEqual('vertical');
      expect(getComputedStyle(componentElem).flexDirection).toEqual('column');
    });
  });
});
