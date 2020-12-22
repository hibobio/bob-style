import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {TableActionsWrapperComponent} from './table-actions-wrapper.component';
import {By} from '@angular/platform-browser';
import {MockComponent, MockDirective} from 'ng-mocks';
import {MatTooltip} from '@angular/material/tooltip';
import {ButtonComponent, ButtonType, IconComponent, Icons, MenuComponent, SquareButtonComponent} from 'bob-style';

describe('TableActionsWrapperComponent', () => {
  let component: TableActionsWrapperComponent;
  let fixture: ComponentFixture<TableActionsWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableActionsWrapperComponent,
        MockComponent(SquareButtonComponent),
        MockComponent(MenuComponent),
        MockComponent(ButtonComponent),
        MockComponent(IconComponent),
        MockDirective(MatTooltip),
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
      expect(menuItems).toBeNull();
      expect(button.text).toBe('save');
      expect(button.type).toBe(ButtonType.primary);
    });
    it('Should display button', () => {
      component.buttonType = ButtonType.secondary;
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
    it('Should not display icon by default', () => {
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('b-icon'));
      expect(icon).toBeNull();
    });
    it('Should not display icon', () => {
      component.menuItems = [
        {
          label: 'save',
          action: $event => console.log('save clicked', $event),
        },
      ];
      component.icon = Icons.person_reports;
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('b-icon'));
      expect(icon).not.toBeNull();
    });
  });
});
