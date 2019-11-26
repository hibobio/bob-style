import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { Icons } from '../../icons/icons.enum';
import { SquareButtonComponent } from '../square/square.component';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { ButtonType } from '../../buttons/buttons.enum';
import { ActionsMenuButtonComponent } from './action-menu-button.component';
import { menuItemsMock } from './action-menu-button.mock';

describe('ActionsMenuButtonComponent', () => {
  let component: ActionsMenuButtonComponent;
  let fixture: ComponentFixture<ActionsMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
        ActionsMenuButtonComponent
      ],
      imports: [
        NoopAnimationsModule,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ActionsMenuButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should check b-square-button element', () => {
    const triggerButtonElement = fixture.debugElement.query(By.css('b-square-button'));
    expect(triggerButtonElement.componentInstance.type).toEqual(ButtonType.tertiary);
    expect(triggerButtonElement.componentInstance.icon).toEqual(Icons.three_dots_vert);
  });

  it('should check menu element in template', () => {
    component.menuItems = menuItemsMock;
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    expect(menuElement.componentInstance.menu).toEqual(menuItemsMock);
  });

  it('should check if menu opened to left', () => {
    component.menuItems = menuItemsMock;
    component.openLeft = true;
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    expect(menuElement.componentInstance.openLeft).toEqual(true);
  });
});
