import { map } from 'lodash';
import { MockComponent } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  ButtonType,
  IconColor,
  Icons,
  MenuComponent,
  SquareButtonComponent,
} from 'bob-style';

import { ActionsCellComponent } from './actions-cell.component';
import { GridActions } from './actions-cell.interface';

describe('ActionsCellComponent', () => {
  let component: ActionsCellComponent;
  let fixture: ComponentFixture<ActionsCellComponent>;

  const mockGridActions: GridActions = {
    menuItems: [{ label: 'first action' }, { label: 'second action' }],
    openLeft: true,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ActionsCellComponent,
          MockComponent(SquareButtonComponent),
          MockComponent(MenuComponent),
        ],
        imports: [NoopAnimationsModule],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ActionsCellComponent);
          component = fixture.componentInstance;
          component.agInit({ value: mockGridActions });
          fixture.detectChanges();
        });
    })
  );

  it('should get menu items data', () => {
    component.menuItems = map(component.menuItems, (item) => {
      delete item.action;
      return item;
    });
    expect(component.menuItems).toEqual(mockGridActions.menuItems);
  });

  it('should check menu element in template', () => {
    component.agInit({
      value: {
        menuItems: [{ label: 'first action' }, { label: 'second action' }],
      },
    });
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    component.menuItems = map(component.menuItems, (item) => {
      delete item.action;
      return item;
    });
    expect(menuElement.componentInstance.menu).toEqual(
      mockGridActions.menuItems
    );
    expect(menuElement.componentInstance.openLeft).toEqual(false);
  });

  it('should check if menu opened to left', () => {
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    expect(menuElement.componentInstance.openLeft).toEqual(true);
  });

  it('should check b-square-button element', () => {
    const triggerButtonElement = fixture.debugElement.query(
      By.css('b-square-button')
    );
    expect(triggerButtonElement.componentInstance.setProps.color).toEqual(
      IconColor.normal
    );
    expect(triggerButtonElement.componentInstance.setProps.type).toEqual(
      ButtonType.tertiary
    );
    expect(triggerButtonElement.componentInstance.setProps.icon).toEqual(
      Icons.three_dots_vert
    );
  });
});
