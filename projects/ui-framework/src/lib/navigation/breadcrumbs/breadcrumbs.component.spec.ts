import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MobileService } from '../../services/utils/mobile.service';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { Breadcrumb } from './breadcrumbs.interface';
import { mobileServiceStub } from '../../tests/services.stub.spec';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadCrumbsMock: Breadcrumb[];

  beforeEach(async(() => {
    breadCrumbsMock = [
      { title: 'details' },
      { title: 'avatar' },
      { title: 'to dos' },
      { title: 'summary' },
    ];

    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [NoopAnimationsModule, MatTooltipModule],
      providers: [{ provide: MobileService, useValue: mobileServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        component.steps = breadCrumbsMock;

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

  describe('toggleStrategy', () => {
    it('should display all titles', () => {
      component.alwaysShowTitle = true;
      fixture.detectChanges();
      const titles = fixture.debugElement.queryAll(By.css('.title'));
      expect(titles.length).toEqual(4);
    });
    it('should display only active title', () => {
      component.alwaysShowTitle = false;
      fixture.detectChanges();
      const titles = fixture.debugElement.queryAll(By.css('.title'));
      expect(titles.length).toEqual(1);
    });
  });
});
