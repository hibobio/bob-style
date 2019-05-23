import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { getSideMenuOptionsMock } from './side-menu.mock';
import { MockComponent } from 'ng-mocks';
import { MenuModule } from '../menu/menu.module';
import { IconsModule } from '../../icons/icons.module';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuComponent, MockComponent(SideMenuOptionComponent)],
      providers: [
        MenuModule,
        IconsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    component.options = getSideMenuOptionsMock();
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should select the first option', () => {
      component.ngOnChanges();
      expect(component.selectedId).toEqual(1);
    });
    it('should not select an option when no options', () => {
      component.options = [];
      component.ngOnChanges();
      expect(component.selectedId).toBeNull();
    });
    it('should select the fist option when selectedId is not in options', () => {
      component.selectedId = 99999;
      component.ngOnChanges();
      expect(component.selectedId).toEqual(1);
    });
  });

  describe('onSelectOption', () => {
    it('should set selectedId to 2', () => {
      component.onSelectOption(2);
      expect(component.selectedId).toEqual(2);
    });
  });

  describe('template', () => {
    let bSideMenuOption: DebugElement[];

    beforeEach(() => {
      bSideMenuOption = fixture.debugElement.queryAll(By.css('b-side-menu-option'));
    });

    it('should display correct amount of b-side-menu-option', () => {
      expect(bSideMenuOption.length).toEqual(5);
    });
  });
});
