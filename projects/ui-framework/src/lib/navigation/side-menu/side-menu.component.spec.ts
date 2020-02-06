import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { sideMenuMock1 } from './side-menu.mock';
import { elementsFromFixture } from '../../services/utils/test-helpers';
import { MockComponent } from 'ng-mocks';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { MenuComponent } from '../menu/menu.component';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let options: HTMLElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SideMenuComponent,
        MockComponent(AvatarComponent),
        MockComponent(AvatarImageComponent),
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
        MockComponent(TruncateTooltipComponent)
      ],
      providers: [EventManagerPlugins[0]],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SideMenuComponent);
        component = fixture.componentInstance;
        component.options = sideMenuMock1;
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
    });
  });

  describe('template', () => {
    beforeEach(() => {
      options = elementsFromFixture(fixture, '.menu-option');
    });

    it('should display correct amount of options', () => {
      expect(options.length).toEqual(sideMenuMock1.length);
    });
  });
});
