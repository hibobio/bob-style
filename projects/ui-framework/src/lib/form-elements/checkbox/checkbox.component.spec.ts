import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatPseudoCheckboxModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        MatPseudoCheckboxModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        spyOn(component.checkboxChange, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('emitInputEvent', () => {
    it('should turn checkbox on and trigger checkboxChange event with true', () => {
      component.value = false;
      fixture.detectChanges();
      const checkboxTriggerEl = fixture.debugElement.query(By.css('.checkbox-wrapper'));
      checkboxTriggerEl.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.value).toBe(true);
      expect(component.checkboxChange.emit).toHaveBeenCalledWith(true);
      const checkboxEl = fixture.debugElement.query(By.css('.checkbox'));
      expect(checkboxEl.nativeElement.classList).toContain('mat-pseudo-checkbox-checked');
    });
    it('should turn checkbox off and trigger checkboxChange event with false', () => {
      component.value = true;
      fixture.detectChanges();
      const checkboxTriggerEl = fixture.debugElement.query(By.css('.checkbox-wrapper'));
      checkboxTriggerEl.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.value).toBe(false);
      expect(component.checkboxChange.emit).toHaveBeenCalledWith(false);
      const checkboxEl = fixture.debugElement.query(By.css('.checkbox'));
      expect(checkboxEl.nativeElement.classList).not.toContain('mat-pseudo-checkbox-checked');
    });
  });
});
