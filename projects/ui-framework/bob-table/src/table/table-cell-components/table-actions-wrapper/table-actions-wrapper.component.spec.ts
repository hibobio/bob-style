import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionsWrapperComponent } from './table-actions-wrapper.component';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent, ButtonType, MenuComponent, SquareButtonComponent, } from 'bob-style';

describe('TableActionsWrapperComponent', () => {
  let component: TableActionsWrapperComponent;
  let fixture: ComponentFixture<TableActionsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableActionsWrapperComponent,
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
        MockComponent(ButtonComponent),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TableActionsWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('Menu items', () => {
    it('Should display menu items', () => {
      component.menuItems = [
        {
          label: 'save',
          action: $event => console.log('save clicked', $event),
        },
        {
          label: 'close',
          action: $event => console.log('close clicked', $event),
        },
      ];
      fixture.detectChanges();
      const menuItems = fixture.debugElement.query(By.css('b-menu'))
        .componentInstance;
      const button = fixture.debugElement.query(By.css('b-button'));
      expect(menuItems.menu.length).toBe(2);
      expect(button).toBe(null);
    });
    it('Should display button', () => {
      component.menuItems = [
        {
          label: 'save',
          action: $event => console.log('save clicked', $event),
        },
      ];
      fixture.detectChanges();
      const menuItems = fixture.debugElement.query(By.css('b-menu'));
      const button = fixture.debugElement.query(By.css('b-button'))
        .componentInstance;
      expect(menuItems).toBe(null);
      expect(button.text).toBe('save');
      expect(button.type).toBe(ButtonType.primary);
    });
    it('Should display button', () => {
      component.primary = false;
      component.menuItems = [
        {
          label: 'save',
          action: $event => console.log('save clicked', $event),
        },
      ];
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('b-button'))
        .componentInstance;
      expect(button.type).toBe(ButtonType.secondary);
    });
    it('Should not display menu and buttons', () => {
      fixture.detectChanges();
      const menuItems = fixture.debugElement.query(By.css('b-menu'));
      const button = fixture.debugElement.query(By.css('b-button'));
      expect(menuItems).toBe(null);
      expect(button).toBe(null);
    });
  });
});
