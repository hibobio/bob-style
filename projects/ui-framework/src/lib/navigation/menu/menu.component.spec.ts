import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { MenuItem } from './menu.interface';
import { CommonModule } from '@angular/common';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuMock: MenuItem[];

  beforeEach(async(() => {
    menuMock = [
      {
        label: 'button 0',
        key: 'button.zero',
        action: $event => console.log('button 0', $event)
      },
      {
        label: 'button 1',
        action: $event => console.log('button 1', $event)
      },
      {
        label: 'button 2',
        children: [
          {
            label: 'button 3',
            action: $event => console.log('button 3', $event)
          },
          {
            label: 'button 4',
            action: $event => console.log('button 4', $event)
          }
        ]
      }
    ];

    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [CommonModule, NoopAnimationsModule, MatMenuModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        component.id = 'menu_id';
        component.menu = menuMock;
        component.actionClick.subscribe(() => {});
        component.openMenu.subscribe(() => {});
        component.closeMenu.subscribe(() => {});
        fixture.detectChanges();
        spyOn(component.actionClick, 'emit');
        spyOn(component.openMenu, 'emit');
        spyOn(component.closeMenu, 'emit');
      });
  }));

  afterEach(() => {
    component.actionClick.complete();
    component.openMenu.complete();
    component.closeMenu.complete();
  });

  describe('menu', () => {
    const openMenu = () => {
      const menuTrigger = fixture.debugElement.query(By.css('.menu-trigger-wrapper'));
      menuTrigger.triggerEventHandler('click', null);
    };

    it('should open menu on menuTrigger click', () => {
      let menu = fixture.debugElement.query(By.css('.mat-menu-panel'));
      expect(menu).toBeFalsy();
      openMenu();
      menu = fixture.debugElement.query(By.css('.mat-menu-panel'));
      expect(menu).toBeTruthy();
    });

    it('should emit openMenu event when opening menu (with menu id)', () => {
      openMenu();
      expect(component.openMenu.emit).toHaveBeenCalledTimes(1);
      expect(component.openMenu.emit).toHaveBeenCalledWith('menu_id');
    });

    it('should have 3 options in menu', () => {
      openMenu();
      const menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
      expect(menuOptions.length).toEqual(3);
    });

    it('should display label in option', () => {
      openMenu();
      const menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item span'));
      expect(menuOptions[0].nativeElement.innerText).toEqual('button 0');
      expect(menuOptions[1].nativeElement.innerText).toEqual('button 1');
      expect(menuOptions[2].nativeElement.innerText).toEqual('button 2');
    });

    it('should display deep options', () => {
      openMenu();
      let menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item span'));

      menuOptions[2].nativeElement.click();
      menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item'));

      expect(menuOptions[3].nativeElement.innerText).toEqual('button 3');
      expect(menuOptions[4].nativeElement.innerText).toEqual('button 4');
    });

    it('should invoke the action from the config', () => {
      spyOn(component.menu[1], 'action');
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];
      menuOption.triggerEventHandler('click', null);
      expect(component.menu[1].action).toHaveBeenCalledTimes(1);
    });

    it('should invoke actionClick on menu action click, should output menu item, enriched with menu id', () => {
      spyOn(component.menu[1], 'action');
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];

      menuOption.triggerEventHandler('click', null);

      expect(component.actionClick.emit).toHaveBeenCalledWith({
        ...component.menu[1],
        id: 'menu_id'
      });
      expect(component.menu[1].action).toHaveBeenCalledTimes(1);
    });

    it('should invoke actionClick on deep menu action click, should output menu item, enriched with menu id', () => {
      spyOn(component.menu[2].children[1], 'action');
      openMenu();

      let menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item'));

      menuOptions[2].nativeElement.click();
      menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
      menuOptions[4].triggerEventHandler('click', null);

      menuOptions[1].triggerEventHandler('click', null);

      expect(component.actionClick.emit).toHaveBeenCalledWith({
        ...component.menu[2].children[1],
        id: 'menu_id'
      });
      expect(component.menu[2].children[1].action).toHaveBeenCalledTimes(1);
    });

    it('should disable option when config has disabled=true', () => {
      component.menu[1] = {
        label: 'button 2',
        action: $event => console.log('button 2', $event),
        disabled: true
      };
      fixture.detectChanges();

      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];
      expect(menuOption.nativeElement.classList).toContain('disabled');
    });

    it('should add class from config key', () => {
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[0];
      expect(menuOption.nativeElement.classList).toContain('button.zero');
    });
  });

  describe('OnChanges', () => {
    it('should update menuDir with before', () => {
      component.ngOnChanges({
        openLeft: {
          previousValue: undefined,
          currentValue: true,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      expect(component.menuDir).toEqual('before');
    });
    it('should update menuDir with after', () => {
      component.ngOnChanges({
        openLeft: {
          previousValue: true,
          currentValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component.menuDir).toEqual('after');
    });
    it('should disable menu trigger', () => {
      component.ngOnChanges({
        disabled: {
          previousValue: undefined,
          currentValue: true,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      fixture.detectChanges();
      const menuTrigger = fixture.debugElement.query(By.css('.menu-trigger-wrapper'));
      expect(menuTrigger.nativeElement.classList).toContain('disabled');
    });
  });

  describe('Events', () => {});
});
