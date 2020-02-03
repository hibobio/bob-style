import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { sideMenuMock1 } from './side-menu.mock';
import { MenuModule } from '../menu/menu.module';
import { IconsModule } from '../../icons/icons.module';
import { elementsFromFixture } from '../../services/utils/test-helpers';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let options: HTMLElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      providers: [MenuModule, IconsModule],
      schemas: [NO_ERRORS_SCHEMA],
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
