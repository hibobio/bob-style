import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { ColorService } from '../../services/color-service/color.service';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;
  let chipElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChipComponent],
      imports: [],
      providers: [ColorService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
        chipElement = fixture.nativeElement;
        component.removed.subscribe(() => {});
        spyOn(component.removed, 'emit');
      });
  }));

  afterEach(() => {
    component.removed.complete();
  });

  describe('Text', () => {
    it('should put the right text', () => {
      component.text = 'test';
      fixture.detectChanges();
      expect(chipElement.innerText).toEqual('test');
    });
  });

  describe('Type', () => {
    it('should have the right type attribute', () => {
      component.type = ChipType.info;
      fixture.detectChanges();
      expect(chipElement.dataset.type).toEqual('info');
      component.type = ChipType.success;
      fixture.detectChanges();
      expect(chipElement.dataset.type).toEqual('success');
    });
  });

  describe('Removable', () => {
    it('should have remove button, if removable is true', () => {
      let removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeFalsy();
      component.removable = true;
      fixture.detectChanges();
      removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeTruthy();
    });

    it('should emit Removed event, when remove button is clicked', () => {
      component.removable = true;
      fixture.detectChanges();
      const removeButton = fixture.debugElement.query(By.css('.remove-button'))
        .nativeElement;
      removeButton.click();
      expect(component.removed.emit).toHaveBeenCalled();
    });
  });

  describe('Disabled', () => {
    it('should add disabled attribute when disabled is true', () => {
      component.type = ChipType.info;
      expect(chipElement.dataset.disabled).not.toEqual('true');
      component.disabled = true;
      fixture.detectChanges();
      expect(chipElement.dataset.disabled).toEqual('true');
    });
    it('should not put remove button, when disabled is true, even if removable is true as well', () => {
      component.type = ChipType.info;
      component.removable = true;
      component.disabled = true;
      fixture.detectChanges();
      const removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeFalsy();
    });
  });
});
