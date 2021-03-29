import { MockComponent } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { SquareButtonComponent } from '../square/square.component';
import { ActionMenuButtonComponent } from './action-menu-button.component';
import { menuItemsMock } from './action-menu-button.mock';

describe('ActionMenuButtonComponent', () => {
  let component: ActionMenuButtonComponent;
  let fixture: ComponentFixture<ActionMenuButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent(SquareButtonComponent),
          MockComponent(MenuComponent),
          ActionMenuButtonComponent,
        ],
        imports: [NoopAnimationsModule],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ActionMenuButtonComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    })
  );

  it('should check b-square-button element', () => {
    const triggerButtonElement = fixture.debugElement.query(
      By.css('b-square-button')
    );
    expect(triggerButtonElement.componentInstance.setProps.type).toEqual(
      ButtonType.tertiary
    );
    expect(triggerButtonElement.componentInstance.setProps.icon).toEqual(
      Icons.three_dots_vert
    );
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
