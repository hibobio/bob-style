import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { Breadcrumb } from './breadcrumbs.interface';
import { BreadcrumbsType, BreadcrumbsStepState } from './breadcrumbs.enum';
import {
  elementsFromFixture,
  emitNativeEvent,
} from '../../services/utils/test-helpers';

fdescribe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadCrumbsMock: Breadcrumb[];
  let stepsElements: HTMLElement[];
  let titleElements: HTMLElement[];

  beforeEach(async(() => {
    breadCrumbsMock = [
      { title: 'details', state: BreadcrumbsStepState.success },
      { title: 'avatar', state: BreadcrumbsStepState.active },
      { title: 'to dos', state: BreadcrumbsStepState.closed },
      { title: 'summary', state: BreadcrumbsStepState.closed },
    ];

    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [],
      providers: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        component.type = BreadcrumbsType.primary;
        component.alwaysShowTitle = true;
        component.steps = breadCrumbsMock;
        fixture.detectChanges();

        spyOn(component.stepClick, 'emit');
      });
  }));

  describe('breadcrumbs model', () => {
    beforeEach(() => {
      stepsElements = elementsFromFixture(fixture, '.step');
      titleElements = elementsFromFixture(fixture, '.step-title');
    });

    it('should generate 4 steps', () => {
      expect(stepsElements.length).toBe(4);
    });

    it('should set success state on first element', () => {
      expect(stepsElements[0].getAttribute('data-state')).toEqual('success');
    });

    it('should set active state on second element', () => {
      expect(stepsElements[1].getAttribute('data-state')).toEqual('active');
    });

    it('should show step titles', () => {
      expect(titleElements[0].innerHTML).toContain('details');
      expect(titleElements[2].innerHTML).toContain('to dos');
    });

    it('should make step with status success clickable', () => {
      expect(titleElements[0].getAttribute('role')).toEqual('button');
      expect(titleElements[0].getAttribute('tabindex')).toEqual('0');
    });

    it('should make stepы with status closed not clickable', () => {
      expect(titleElements[2].getAttribute('role')).not.toEqual('button');
      expect(titleElements[2].getAttribute('tabindex')).not.toEqual('0');
    });

    it('should set type attribute to primary', () => {
      expect(
        fixture.debugElement.nativeElement.getAttribute('data-type')
      ).toEqual('primary');
      expect(titleElements[2].getAttribute('tabindex')).not.toEqual('0');
    });

    it('should set data-always-show-title attribute', () => {
      expect(
        fixture.debugElement.nativeElement.getAttribute(
          'data-always-show-title'
        )
      ).toEqual('false');
    });
  });

  describe('onStepClick', () => {
    it('should emit value with index, if step is clickable', () => {
      const step = stepsElements[0].querySelector('.step-wrap');
      emitNativeEvent(step);
      expect(component.stepClick.emit).toHaveBeenCalledWith(0);
    });
    it('should not emit, if step is not clickable', () => {
      const step = stepsElements[2].querySelector('.step-wrap');
      emitNativeEvent(step);
      expect(component.stepClick.emit).not.toHaveBeenCalled();
    });
  });
});
