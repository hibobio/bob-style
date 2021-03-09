import { IconComponent } from './icon.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconColor, Icons, IconSize, IconType } from './icons.enum';
import { By } from '@angular/platform-browser';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { simpleChange } from '../services/utils/functional-utils';

describe('IconElementComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;
  let componentElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IconComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement;

    component.ngOnChanges(
      simpleChange({
        icon: Icons.toDos_link,
        color: IconColor.primary,
        size: IconSize.medium,
        toolTipSummary: 'tooltip text',
      })
    );

    fixture.detectChanges();
  });

  describe('getClassNames', () => {
    it('Should set correct icon class', () => {
      const iconElement = fixture.debugElement.query(By.css('.b-icon'))
        .nativeElement;

      expect(iconElement.className).toContain(Icons.toDos_link);
      expect(iconElement.dataset('data-icon-before-size')).toContain('medium');
      expect(iconElement.dataset('data-icon-before-color')).toContain(
        'primary'
      );
    });

    it('Should put tooltip text in attribute', () => {
      expect(componentElement.dataset.tooltip).toEqual('tooltip text');
    });
    it('Should put no-wrap class', () => {
      component.ngOnChanges(
        simpleChange({
          tooltipClass: TooltipClass.NoWrap,
        })
      );
      expect(componentElement.className).toContain(TooltipClass.NoWrap);
    });
  });

  describe('attributes', () => {
    it('should set type attribute', () => {
      expect(componentElement.getAttribute('data-type')).toEqual('regular');
      component.type = IconType.circular;
      fixture.detectChanges();
      expect(componentElement.getAttribute('data-type')).toEqual('circular');
    });

    it('should set size attribute', () => {
      expect(componentElement.getAttribute('data-size')).toEqual('medium');
      component.size = IconSize.large;
      fixture.detectChanges();
      expect(componentElement.getAttribute('data-size')).toEqual('large');
    });
  });
});
