import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { DebugElement, SimpleChanges } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { EMPLOYEE_SHOWCASE_MOCK } from './employees-showcase.mock';
import { AvatarSize } from '../avatar/avatar.enum';
import { MockComponent } from 'ng-mocks';
import { AvatarComponent } from '../avatar/avatar.component';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { IconComponent } from '../../icons/icon.component';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { By } from '@angular/platform-browser';
import { SingleListModule } from '../../form-elements/lists/single-list/single-list.module';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarGap } from './employees-showcase.const';
import createSpyObj = jasmine.createSpyObj;

describe('EmployeesShowcaseComponent', () => {
  let component: EmployeesShowcaseComponent;
  let fixture: ComponentFixture<EmployeesShowcaseComponent>;
  let utilsServiceStub: jasmine.SpyObj<UtilsService>;

  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  beforeEach(async(() => {
    utilsServiceStub = createSpyObj('UtilsService', ['getResizeEvent']);
    utilsServiceStub.getResizeEvent.and.returnValue(cold('-x-', { x: {} }));

    TestBed.configureTestingModule({
      declarations: [
        EmployeesShowcaseComponent,
        MockComponent(AvatarComponent),
        MockComponent(IconComponent),
      ],
      imports: [
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        SingleListModule,
      ],
      providers: [
        DOMhelpers,
        { provide: UtilsService, useValue: utilsServiceStub },
        PanelPositionService,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployeesShowcaseComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style.width = '800px';
        spyOn(component.cd, 'detectChanges');
      });

    inject(
      [OverlayContainer, Platform],
      (oc: OverlayContainer, p: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        platform = p;
      }
    )();
  }));

  describe('ngOnInit', () => {
    it('should subscribe to resize event an recalculate', () => {
      utilsServiceStub.getResizeEvent.and.returnValue(cold('-x-y-', { x: {}, y: {} }));
      component.employees = EMPLOYEE_SHOWCASE_MOCK;
      fixture.detectChanges();
      getTestScheduler().flush();
      expect(component.cd.detectChanges).toHaveBeenCalledTimes(2);
    });
    it('should invoke detect changes on every rezise event', () => {
      utilsServiceStub.getResizeEvent.and.returnValue(cold('-x-y-', { x: {}, y: {} }));
      spyOn(component.DOM, 'getClosest');
      component.employees = EMPLOYEE_SHOWCASE_MOCK;
      fixture.detectChanges();
      getTestScheduler().flush();
      expect(component.DOM.getClosest).toHaveBeenCalledTimes(2);
    });
    it('should set panelListOptions', () => {
      component.employees = [
        EMPLOYEE_SHOWCASE_MOCK[0],
        EMPLOYEE_SHOWCASE_MOCK[1],
      ];
      fixture.detectChanges();
      expect(component.panelListOptions).toEqual([
          {
            groupName: '',
            options: [
              {
                value: 'Ben Baler',
                id: '1',
                selected: false,
                prefixComponent: {
                  component: AvatarComponent,
                  attributes: {
                    imageSource: 'https://randomuser.me/api/portraits/men/1.jpg',
                  },
                },
              },
              {
                value: 'Omri Hecht',
                id: '2',
                selected: false,
                prefixComponent: {
                  component: AvatarComponent,
                  attributes: {
                    imageSource: 'https://randomuser.me/api/portraits/men/2.jpg',
                  },
                },
              },
            ],
          },
        ],
      );
    });
  });

  describe('ngOnChanges', () => {
    const createComponent = (avatarSize: AvatarSize, expandOnClick: boolean) => {
      component.employees = [
        EMPLOYEE_SHOWCASE_MOCK[0],
        EMPLOYEE_SHOWCASE_MOCK[1],
        EMPLOYEE_SHOWCASE_MOCK[2],
      ];
      component.avatarSize = avatarSize;
      component.expandOnClick = expandOnClick;
      const changes: SimpleChanges = {
        avatarSize: {
          currentValue: avatarSize,
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      };
      fixture.detectChanges();
      component.ngOnChanges(changes);
      fixture.detectChanges();
    };
    it('should open panel on showcase click',
      fakeAsync(() => {
        createComponent(AvatarSize.medium, true);
        // remove avatar from list for testing purposes
        component.panelListOptions[0].options =
          component.panelListOptions[0].options.map((o) => {
            return {
              value: o.value,
              id: o.id,
              selected: false,
            };
          });

        component.openPanel();
        fixture.autoDetectChanges();
        tick();
        const listOptions = (overlayContainerElement.querySelectorAll(
          'b-single-list .option'
        ));
        expect(listOptions.length).toEqual(3);
        expect(listOptions[0].innerHTML).toContain('Ben Baler');
        expect(listOptions[1].innerHTML).toContain('Omri Hecht');
        expect(listOptions[2].innerHTML).toContain('Guy Katz');
      }));
    it('should not open panel if expandOnClick input is false (hijack openPanel method)',
      fakeAsync(() => {
        createComponent(AvatarSize.medium, false);
        component.openPanel();
        fixture.autoDetectChanges();
        tick();
        const listOptions = (overlayContainerElement.querySelector('b-single-list'));
        expect(listOptions).toBeFalsy();
      }));
    it('should shuffle avatars if avatarSize > medium and width cannot contain all',
      fakeAsync(() => {
        const startAvatarOrder = [
          EMPLOYEE_SHOWCASE_MOCK[0],
          EMPLOYEE_SHOWCASE_MOCK[1],
          EMPLOYEE_SHOWCASE_MOCK[2],
        ];
        fixture.nativeElement.style.width = '200px';
        createComponent(AvatarSize.large, false);
        expect(component.employees).toEqual(startAvatarOrder);
        tick(3000);
        expect(component.employees).not.toEqual(startAvatarOrder);
        fixture.destroy();
      }));
    it('should not shuffle avatars if avatarSize > medium but width can contain all',
      fakeAsync(() => {
        const startAvatarOrder = [
          EMPLOYEE_SHOWCASE_MOCK[0],
          EMPLOYEE_SHOWCASE_MOCK[1],
          EMPLOYEE_SHOWCASE_MOCK[2],
        ];
        createComponent(AvatarSize.large, false);
        expect(component.employees).toEqual(startAvatarOrder);
        tick(3000);
        expect(component.employees).toEqual(startAvatarOrder);
        fixture.destroy();
      }));
    it('should not shuffle avatars if avatarSize !> medium',
      fakeAsync(() => {
        const startAvatarOrder = [
          EMPLOYEE_SHOWCASE_MOCK[0],
          EMPLOYEE_SHOWCASE_MOCK[1],
          EMPLOYEE_SHOWCASE_MOCK[2],
        ];
        createComponent(AvatarSize.small, false);
        expect(component.employees).toEqual(startAvatarOrder);
        tick(3000);
        expect(component.employees).toEqual(startAvatarOrder);
        fixture.destroy();
      }));
  });

  describe('onSelectChange', () => {
    it('should emit selectChange with listChange', () => {
      component.employees = EMPLOYEE_SHOWCASE_MOCK;
      fixture.detectChanges();
      const listChange = new ListChange(component.panelListOptions);
      const selectChange = spyOn(component.selectChange, 'emit');
      component.onSelectChange(listChange);
      expect(selectChange).toHaveBeenCalledWith(listChange);
    });
    it('should destroyPanel on select', () => {
      spyOn(component, 'destroyPanel');
      component.employees = EMPLOYEE_SHOWCASE_MOCK;
      fixture.detectChanges();
      const listChange = new ListChange(component.panelListOptions);
      component.onSelectChange(listChange);
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    let showcaseAvatars: DebugElement[];
    let moreIndicator: DebugElement;

    const createComponent = (employees: EmployeeShowcase[], avatarSize: AvatarSize, hostSize: number) => {
      fixture.nativeElement.style.width = `${ hostSize }px`;
      component.employees = employees;
      component.avatarSize = avatarSize;
      const changes: SimpleChanges = {
        avatarSize: {
          currentValue: avatarSize,
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      };
      fixture.detectChanges();
      component.ngOnChanges(changes);
      fixture.detectChanges();
    };

    it('should display 0 mini avatars', () => {
      createComponent([], AvatarSize.mini, 800);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(0);
      expect(moreIndicator).toBeFalsy();
    });
    it('should display 1 mini avatar', () => {
      const ees = [EMPLOYEE_SHOWCASE_MOCK[0]];
      createComponent(ees, AvatarSize.mini, 800);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(1);
      expect(moreIndicator).toBeFalsy();
    });
    it('should display 2 mini avatars and correct gap', () => {
      const ees = [
        EMPLOYEE_SHOWCASE_MOCK[0],
        EMPLOYEE_SHOWCASE_MOCK[1],
      ];
      createComponent(ees, AvatarSize.mini, 50);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(2);
      expect(moreIndicator).toBeFalsy();
      expect(getComputedStyle(showcaseAvatars[1].nativeElement).marginLeft).toEqual(
        '-' + AvatarGap[AvatarSize.mini] + 'px'
      );
    });
    it('should display 1 avatar one is the show-more-indicator', () => {
      const ees = [
        EMPLOYEE_SHOWCASE_MOCK[0],
        EMPLOYEE_SHOWCASE_MOCK[1],
        EMPLOYEE_SHOWCASE_MOCK[2]
      ];
      createComponent(ees, AvatarSize.mini, 50);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(1);
      expect(moreIndicator).toBeTruthy();
    });
    it('should display 9 mini avatars', () => {
      createComponent(EMPLOYEE_SHOWCASE_MOCK, AvatarSize.mini, 800);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(9);
      expect(moreIndicator).toBeFalsy();
    });
    it('should display 1 medium avatars and show-more-indicator', () => {
      createComponent(EMPLOYEE_SHOWCASE_MOCK, AvatarSize.medium, 180);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(1);
      expect(moreIndicator).toBeTruthy();
    });
    it('should display 9 medium avatars and correct gap', () => {
      createComponent(EMPLOYEE_SHOWCASE_MOCK, AvatarSize.medium, 1000);
      showcaseAvatars = fixture.debugElement.queryAll(By.css('.showcase-avatar'));
      moreIndicator = fixture.debugElement.query(By.css('.show-more-indicator'));
      expect(showcaseAvatars.length).toBe(9);
      expect(moreIndicator).toBeFalsy();
      expect(getComputedStyle(showcaseAvatars[1].nativeElement).marginLeft).toEqual(
        '-' + AvatarGap[AvatarSize.medium] + 'px'
      );
    });
  });

  describe('OnDestroy', () => {
    it('should unsubscribe from resize and interval subscribers and destroyPanel',
      fakeAsync(() => {
        spyOn(component, 'destroyPanel');
        fixture.nativeElement.style.width = '260px';
        component.avatarSize = AvatarSize.large;
        component.employees = [
          EMPLOYEE_SHOWCASE_MOCK[0],
          EMPLOYEE_SHOWCASE_MOCK[1],
          EMPLOYEE_SHOWCASE_MOCK[2],
        ];
        fixture.detectChanges();
        tick();

        expect(component['resizeEventSubscriber'].closed).toBe(false);
        expect(component['intervalSubscriber'].closed).toBe(false);

        component.ngOnDestroy();

        expect(component['resizeEventSubscriber'].closed).toBe(true);
        expect(component['intervalSubscriber'].closed).toBe(true);
        expect(component.destroyPanel).toHaveBeenCalled();
      }));
  });
});
