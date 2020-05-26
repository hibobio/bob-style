import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { sideMenuMock2 } from './side-menu.mock';
import { elementsFromFixture } from '../../services/utils/test-helpers';
import { MockComponent } from 'ng-mocks';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { MenuComponent } from '../menu/menu.component';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';
import { IconComponent } from '../../icons/icon.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let options: HTMLElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SideMenuComponent,
        MockComponent(AvatarImageComponent),
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
        MockComponent(TruncateTooltipComponent),
        IconComponent,
      ],
      providers: [EventManagerPlugins[0]],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SideMenuComponent);
        component = fixture.componentInstance;
        component.options = sideMenuMock2;
        fixture.detectChanges();
      });
  }));

  describe('onSelectOption', () => {
    beforeEach(() => {
      options = elementsFromFixture(fixture, '.menu-option');
    });

    it('should set selectedId to 2', () => {
      options[2].click();
      fixture.detectChanges();
      expect(component.selectedId).toEqual(2);
      expect(options[2].classList).toContain('selected');
    });
  });

  describe('template', () => {
    let iconEls: HTMLElement[];
    let avatarTextEls: HTMLElement[];
    let menuEls: HTMLElement[];

    beforeEach(() => {
      options = elementsFromFixture(fixture, '.menu-option');
      iconEls = elementsFromFixture(fixture, '.avatar-text-icon');
      avatarTextEls = elementsFromFixture(fixture, '.avatar-text');
      menuEls = elementsFromFixture(fixture, '.option-actions');
    });

    it('should display correct amount of options', () => {
      expect(options.length).toEqual(sideMenuMock2.length);
    });

    it('should correctly display disabled option', () => {
      expect(options[4].classList).toContain('disabled');
    });

    it('should display correct titles and subtitles', () => {
      expect(options[0].querySelector('.avatar-subtitle')).toBeTruthy();
      expect(options[2].querySelector('.avatar-title')).toBeTruthy();
      expect(options[3].querySelector('.avatar-subtitle')).toBeFalsy();
    });

    it('should display menus for all items, except disabled', () => {
      expect(menuEls.length).toEqual(sideMenuMock2.length - 1);
    });

    it('should display icons in correct places', () => {
      expect(iconEls.length).toEqual(3);
      expect(avatarTextEls[0].getAttribute('data-icon-position')).toEqual(
        'label_after'
      );
      expect(avatarTextEls[1].getAttribute('data-icon-position')).toEqual(
        'value_after'
      );
    });

    it('should display text icon tooltip', () => {
      expect(iconEls[0].getAttribute('data-tooltip')).toBeTruthy();
    });
  });
});
