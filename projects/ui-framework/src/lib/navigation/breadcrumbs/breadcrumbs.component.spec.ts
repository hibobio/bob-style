import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { Breadcrumb } from './breadcrumbs.interface';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MobileService } from '../../services/utils/mobile.service';
import createSpyObj = jasmine.createSpyObj;

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadCrumbsMock: Breadcrumb[];
  let mobileServiceStub: jasmine.SpyObj<MobileService>;

  beforeEach(async(() => {
    mobileServiceStub = createSpyObj('MobileService', ['getMediaEvent']);
    mobileServiceStub.getMediaEvent.and.returnValue({
      pipe: () => ({
        subscribe: () => ({
          matchMobile: false
        })
      })
    });

    breadCrumbsMock = [
      { title: 'details', disabled: false },
      { title: 'avatar', disabled: false },
      { title: 'to dos', disabled: false },
      { title: 'summary', disabled: true }
    ];

    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [NoopAnimationsModule, MatTooltipModule],
      providers: [{ provide: MobileService, useValue: mobileServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        component.breadcrumbs = breadCrumbsMock;
        component.activeIndex = 2;
        component.isMobile = false;
        component.buttons = {
          nextBtn: {
            label: 'Next',
            isVisible: true
          },
          backBtn: {
            label: 'Back',
            isVisible: true
          }
        };
        spyOn(component.stepClick, 'emit');
      });
  }));

  describe('breadcrumbs model', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should generate 4 steps', () => {
      const stepsElements = fixture.debugElement.queryAll(By.css('.step'));
      expect(stepsElements.length).toBe(4);
    });
    it('should set disabled class on the last element', () => {
      const stepsElements = fixture.debugElement.queryAll(By.css('.step'));
      for (let i = 0; i < stepsElements.length; i++) {
        if (i === 3) {
          expect(stepsElements[i].nativeElement.classList).toContain(
            'disabled'
          );
        } else {
          expect(stepsElements[i].nativeElement.classList).not.toContain(
            'disabled'
          );
        }
      }
    });
    it('should show step title on active state', () => {
      const titleElement = fixture.debugElement.queryAll(By.css('.title'));
      expect(titleElement.length).toEqual(1);
      expect(titleElement[0].nativeElement.innerText).toEqual('to dos');
    });
  });

  describe('onStepClick', () => {
    it('show emit value with index', () => {
      fixture.detectChanges();
      const step = fixture.debugElement.queryAll(By.css('.step'))[1];
      step.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.stepClick.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      component.isMobile = true;
      fixture.detectChanges();
    });
    it('should show text buttons and not regular buttons', () => {
      const regularButtons = fixture.debugElement.queryAll(By.css('b-button'));
      const textButtons = fixture.debugElement.queryAll(
        By.css('b-text-button')
      );
      expect(regularButtons.length).toEqual(0);
      expect(textButtons.length).toEqual(2);
    });
    it('should add active class to active step', () => {
      const stepsElements = fixture.debugElement.queryAll(By.css('.step'));
      for (let i = 0; i < stepsElements.length; i++) {
        if (i === 2) {
          expect(stepsElements[i].nativeElement.classList).toContain('active');
        } else {
          expect(stepsElements[i].nativeElement.classList).not.toContain(
            'active'
          );
        }
      }
    });
  });
});
