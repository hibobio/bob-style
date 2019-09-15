import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { MenuItem } from './menu.interface';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuMock: MenuItem[];

  beforeEach(async(() => {
    menuMock = [
      {
        label: 'button 0',
        key: 'button.zero',
        action: ($event) => console.log('button 0', $event),
      },
      {
        label: 'button 1',
        action: ($event) => console.log('button 1', $event),
      },
      {
        label: 'button 2',
        children: [
          {
            label: 'button 3',
            action: ($event) => console.log('button 3', $event),
          },
          {
            label: 'button 4',
            action: ($event) => console.log('button 4', $event),
          },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatMenuModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        spyOn(component.actionClick, 'emit');
        spyOn(component.openMenu, 'emit');
        spyOn(component.closeMenu, 'emit');
      });
  }));

  describe('menu', () => {
    const openMenu = () => {
      const menuTrigger = fixture.debugElement.query(By.css('.menu-trigger-wrapper'));
      menuTrigger.triggerEventHandler('click', null);
    };
    it('should open menu on menuTrigger click', () => {
      component.menu = menuMock;
      fixture.detectChanges();
      let menu = fixture.debugElement.query(By.css('.mat-menu-panel'));
      expect(menu).toBeFalsy();
      openMenu();
      menu = fixture.debugElement.query(By.css('.mat-menu-panel'));
      expect(menu).toBeTruthy();
    });
    it('should emit openMenu event when opening menu', () => {
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      expect(component.openMenu.emit).toHaveBeenCalledTimes(1);
    });
    it('should have 3 options in menu', () => {
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
      expect(menuOptions.length).toEqual(3);
    });
    it('should display label in option', () => {
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOptions = fixture.debugElement.queryAll(By.css('.mat-menu-item span'));
      expect(menuOptions[0].nativeElement.innerText).toEqual('button 0');
      expect(menuOptions[1].nativeElement.innerText).toEqual('button 1');
      expect(menuOptions[2].nativeElement.innerText).toEqual('button 2');
    });
    it('should invoke the action from the config', () => {
      spyOn(menuMock[1], 'action');
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];
      menuOption.triggerEventHandler('click', null);
      expect(menuMock[1].action).toHaveBeenCalledTimes(1);
    });
    it('should invoke actionClick on menu action click', () => {
      spyOn(menuMock[1], 'action');
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];
      menuOption.triggerEventHandler('click', null);
      expect(component.actionClick.emit).toHaveBeenCalledWith(menuMock[1]);
    });
    it('should disable option when config has disabled=true', () => {
      menuMock[1] = {
        label: 'button 2',
        action: ($event) => console.log('button 2', $event),
        disabled: true,
      };
      spyOn(menuMock[1], 'action');
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[1];
      expect(menuOption.nativeElement.classList).toContain('disabled');
    });
    it('should add class from config key', () => {
      component.menu = menuMock;
      fixture.detectChanges();
      openMenu();
      const menuOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[0];
      expect(menuOption.nativeElement.classList).toContain('button.zero');
    });
  });

  describe('OnChanges', () => {
    it('should update menuDir with before', () => {
      component.ngOnChanges({
        openLeft: {
          previousValue: undefined, currentValue: true, firstChange: true, isFirstChange: () => true,
        }
      });
      expect(component.menuDir).toEqual('before');
    });
    it('should update menuDir with after', () => {
      component.ngOnChanges({
        openLeft: {
          previousValue: true, currentValue: false, firstChange: false, isFirstChange: () => false,
        }
      });
      expect(component.menuDir).toEqual('after');
    });
    it('should disable menu trigger', () => {
      component.ngOnChanges({
        disabled: {
          previousValue: undefined, currentValue: true, firstChange: true, isFirstChange: () => true,
        }
      });
      fixture.detectChanges();
      const menuTrigger = fixture.debugElement.query(By.css('.menu-trigger-wrapper'));
      expect(menuTrigger.nativeElement.classList).toContain('disabled');
    });
  });

});
