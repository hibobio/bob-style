import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsCellComponent } from './actions-cell.component';
import { By } from '@angular/platform-browser';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { MockComponent } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuComponent } from '../../../navigation/menu/menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SquareButtonComponent } from '../../../buttons-indicators/buttons/square/square.component';
import { GridActions } from './actions-cell.interface';
import { map } from 'lodash';

describe('ActionsCellComponent', () => {
  let component: ActionsCellComponent;
  let fixture: ComponentFixture<ActionsCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionsCellComponent,
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
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
        fixture = TestBed.createComponent(ActionsCellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should get menu items data', () => {
    const mockGridActions: GridActions = {
      menuItems: [{label: 'first action'}, {label: 'second action'}], openLeft: true};
    component.agInit({value: mockGridActions});
    component.menuItems = map (component.menuItems, (item) => {
      delete item.action;
      return item;
    });
    expect(component.menuItems).toEqual(mockGridActions.menuItems);
  });

  it('should check menu element in template', () => {
    const mockGridActions: GridActions = {
      menuItems: [{label: 'first action'}, {label: 'second action'}] };
    component.agInit({value: mockGridActions});
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    component.menuItems = map (component.menuItems, (item) => {
      delete item.action;
      return item;
    });
    expect(menuElement.componentInstance.menu).toEqual(mockGridActions.menuItems);
    expect(menuElement.componentInstance.openLeft).toEqual(false);
  });

  it('should check if menu opened to left', () => {
    const mockGridActions: GridActions = {
      menuItems: [{label: 'first action'}, {label: 'second action'}], openLeft: true };
    component.agInit({value: mockGridActions});
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    expect(menuElement.componentInstance.openLeft).toEqual(true);
  });

  it('should check b-square-button element', () => {
    const triggerButtonElement = fixture.debugElement.query(By.css('b-square-button'));
    expect(triggerButtonElement.componentInstance.color).toEqual(IconColor.dark);
    expect(triggerButtonElement.componentInstance.type).toEqual(ButtonType.tertiary);
    expect(triggerButtonElement.componentInstance.icon).toEqual(Icons.three_dots_vert);
  });
});
