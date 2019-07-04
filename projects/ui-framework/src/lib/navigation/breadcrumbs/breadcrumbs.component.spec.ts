import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { Breadcrumb } from './breadcrumbs.interface';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadCrumbsMock: Breadcrumb[];

  beforeEach(async(() => {
    breadCrumbsMock = [
      { title: 'details', disabled: false },
      { title: 'avatar', disabled: false },
      { title: 'to dos', disabled: false },
      { title: 'summary', disabled: true }
    ];

    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatTooltipModule,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        component.breadcrumbs = breadCrumbsMock;
        component.activeIndex = 2;
        spyOn(component.stepClick, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('breadcrumbs model', () => {
    it('should generate 4 steps', () => {
      const stepsElements = fixture.debugElement.queryAll(By.css('.step'));
      expect(stepsElements.length).toBe(4);
    });
    it('should set disabled class on the last element', () => {
      const stepsElements = fixture.debugElement.queryAll(By.css('.step'));
      for (let i = 0; i < stepsElements.length; i++) {
        if (i === 3) {
          expect(stepsElements[i].nativeElement.classList).toContain('disabled');
        } else {
          expect(stepsElements[i].nativeElement.classList).not.toContain('disabled');
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
      const step = fixture.debugElement.queryAll(By.css('.step'))[1];
      step.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.stepClick.emit).toHaveBeenCalledWith(1);
    });
  });
});
