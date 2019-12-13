import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { SideMenuOptionComponent } from './side-menu-option.component';
import { By } from '@angular/platform-browser';
import { IconsModule } from '../../../icons/icons.module';
import { SideMenuOption } from '../../side-menu/side-menu-option/side-menu-option.interface';

describe('SideMenuOptionComponent', () => {
  let component: SideMenuOptionComponent;
  let fixture: ComponentFixture<SideMenuOptionComponent>;
  let option: SideMenuOption;

  beforeEach(() => {
    option = {
      id: 1,
      displayName: 'option 1',
      actions: [{
        label: 'test',
        action: () => {}
      }]
    };

    TestBed.configureTestingModule({
      declarations: [SideMenuOptionComponent],
      providers: [],
      imports: [IconsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuOptionComponent);
    component = fixture.componentInstance;
    component.option = option;
    component.selected = true;
    fixture.detectChanges();
  });

  describe('template', () => {
    let sideMenuOptionContainer: DebugElement;
    let optionDisplayName: DebugElement;
    let optionActions: DebugElement;

    beforeEach(() => {
      sideMenuOptionContainer = fixture.debugElement.query(
        By.css('.side-menu-option-container')
      );
      optionDisplayName = fixture.debugElement.query(
        By.css('.option-display-name')
      );
      optionActions = fixture.debugElement.query(By.css('.option-actions'));
    });

    it('should add selected-option class to side-menu-option-container', () => {
      expect(sideMenuOptionContainer.nativeElement.classList).toContain(
        'selected'
      );
    });

    it('should call onSelectOption when click on side-menu-option-container', () => {
      const selectOption = spyOn(component.selectOption, 'emit');
      sideMenuOptionContainer.nativeElement.click();
      fixture.detectChanges();
      expect(selectOption).toHaveBeenCalledWith(1);
    });

    it('should show display name', () => {
      expect(optionDisplayName.nativeElement.innerText).toEqual(option.displayName);
    });

    it('should display option-action if actions provided', () => {
      expect(optionActions.nativeElement).toBeTruthy();
    });
    it('should set option-actions opacity to 1 when opening menu', () => {
      const bMenu = fixture.debugElement.query(By.css('b-menu'));
      component.menuOpened = false;
      bMenu.nativeElement.click();
      fixture.detectChanges();
      expect(optionActions.nativeElement.style.opacity).toEqual('1');
    });
  });
});
