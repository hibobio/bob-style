import { IconComponent } from './icon.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconColor, Icons, IconSize, IconType } from './icons.enum';
import { By } from '@angular/platform-browser';
import { simpleChange } from '../services/utils/test-helpers';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';

describe('IconElementComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;
  let componentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

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
      const iconElement = fixture.debugElement.query(
        By.css('.' + Icons.toDos_link)
      ).nativeElement;

      const expectedClass = Icons.toDos_link + ' b-icon-medium b-icon-primary';

      expect(component.iconClass).toContain(expectedClass);

      expect(iconElement.className).toContain(expectedClass);
    });

    it('Should put tooltip text in attribute', () => {
      expect(componentElement.dataset.tooltip).toEqual('tooltip text');
    });
    it('Should put no-wrap class', () => {
      component.ngOnChanges(
        simpleChange({
           tooltipClass: TooltipClass.NoWrap
         })
      );
      expect(component.iconClass).toContain(TooltipClass.NoWrap);
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
