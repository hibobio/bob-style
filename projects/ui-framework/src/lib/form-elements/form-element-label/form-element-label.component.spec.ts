import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormElementLabelComponent } from './form-element-label.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { IconsModule } from '../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

describe('FormElementLabelComponent', () => {
  let component: FormElementLabelComponent;
  let fixture: ComponentFixture<FormElementLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormElementLabelComponent],
      imports: [MatTooltipModule, TruncateTooltipModule, IconsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormElementLabelComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('label', () => {
    it('should show label', () => {
      component.label = 'Hello';
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.innerText).toContain('Hello');
    });
    it('should have truncate tooltip options on label with maxLines=1', () => {
      component.label = 'Hello';
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('label'));
      expect(label.componentInstance.maxLines).toEqual(1);
    });
  });

  describe('description', () => {
    it('should not show icon if none is provided', () => {
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.b-icon'));
      expect(icon).toBeFalsy();
    });
    it('should show icon if description is provided', () => {
      component.description = 'Hello';
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.b-icon'));
      expect(icon).toBeTruthy();
    });
    it('should pass params to icon', () => {
      component.description = 'Hello';
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.b-icon'));
      expect(icon.nativeElement.dataset.iconBeforeSize).toEqual(IconSize.small);
      expect(icon.nativeElement.dataset.iconBeforeColor).toEqual(
        IconColor.normal
      );
      expect(icon.nativeElement.dataset.iconBefore).toEqual(
        Icons.info_outline.replace('b-icon-', '')
      );
    });
  });
});
