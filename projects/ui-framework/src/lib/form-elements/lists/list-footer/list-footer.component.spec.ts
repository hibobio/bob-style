import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFooterComponent } from './list-footer.component';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../../buttons-indicators/buttons/button/button.component';
import { IconComponent } from '../../../icons/icon.component';
import { By } from '@angular/platform-browser';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { TextButtonComponent } from '../../../buttons-indicators/buttons/text-button/text-button.component';

describe('ListFooterComponent', () => {
  let component: ListFooterComponent;
  let fixture: ComponentFixture<ListFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListFooterComponent,
        MockComponent(ButtonComponent),
        MockComponent(TextButtonComponent),
        MockComponent(IconComponent),
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListFooterComponent);
        component = fixture.componentInstance;
        spyOn(component.clear, 'emit');
        spyOn(component.apply, 'emit');
        spyOn(component.cancel, 'emit');
      });
  }));

  describe('listActions', () => {
    it('should show clear with the right config', () => {
      component.listActions = {
        clear: true
      };
      fixture.detectChanges();
      const clearButton = fixture.debugElement.query(By.css('.clear-button'));
      expect(clearButton.componentInstance.text).toEqual('Clear');
    });
    it('should emit clear on clear click', () => {
      component.listActions = {
        clear: true
      };
      fixture.detectChanges();
      const clearButton = fixture.debugElement.query(By.css('.clear-button'));
      clearButton.triggerEventHandler('click', null);
      expect(component.clear.emit).toHaveBeenCalled();
    });
    it('should show apply with the right config', () => {
      component.listActions = {
        apply: true
      };
      fixture.detectChanges();
      const applyButton = fixture.debugElement.queryAll(
        By.css('.apply-button')
      )[0];
      expect(applyButton.componentInstance.type).toEqual(ButtonType.primary);
      expect(applyButton.componentInstance.size).toEqual(ButtonSize.small);
      expect(applyButton.nativeElement.innerText).toEqual('Apply');
    });
    it('should emit apply on apply click', () => {
      component.listActions = {
        apply: true
      };
      fixture.detectChanges();
      const applyButton = fixture.debugElement.queryAll(
        By.css('.apply-button')
      )[0];
      applyButton.triggerEventHandler('click', null);
      expect(component.apply.emit).toHaveBeenCalled();
    });
    it('should show cancel with the right config', () => {
      component.listActions = {
        cancel: true
      };
      fixture.detectChanges();
      const cancelButton = fixture.debugElement.queryAll(
        By.css('.cancel-button')
      )[0];
      expect(cancelButton.componentInstance.type).toEqual(ButtonType.secondary);
      expect(cancelButton.componentInstance.size).toEqual(ButtonSize.small);
      expect(cancelButton.nativeElement.innerText).toEqual('Cancel');
    });
    it('should emit cancel on cancel click', () => {
      component.listActions = {
        cancel: true
      };
      fixture.detectChanges();
      const cancelButton = fixture.debugElement.queryAll(
        By.css('.cancel-button')
      )[0];
      cancelButton.triggerEventHandler('click', null);
      expect(component.cancel.emit).toHaveBeenCalled();
    });
    it('should show all buttons if passed in config', () => {
      component.listActions = {
        clear: true,
        apply: true,
        cancel: true
      };
      fixture.detectChanges();
      const footerButtons = fixture.debugElement.queryAll(By.css('b-button'));
      const clearButton = fixture.debugElement.queryAll(By.css('.clear-button'));
      expect(footerButtons.length).toEqual(2);
      expect(clearButton.length).toEqual(1);
    });
  });
});
