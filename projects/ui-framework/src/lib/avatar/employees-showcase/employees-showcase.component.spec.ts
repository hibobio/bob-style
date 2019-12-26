import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  flush,
} from '@angular/core/testing';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { UtilsService } from '../../services/utils/utils.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EMPLOYEE_SHOWCASE_MOCK } from './employees-showcase.mock';
import { AvatarSize } from '../avatar/avatar.enum';
import { MockComponent } from 'ng-mocks';
import { AvatarComponent } from '../avatar/avatar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icons/icon.component';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { ListChange } from '../../lists/list-change/list-change';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarGap } from './employees-showcase.const';
// tslint:disable-next-line: max-line-length
import { SingleSelectPanelComponent } from '../../lists/single-select-panel/single-select-panel.component';
import { cloneDeep } from 'lodash';
import {
  simpleChange,
  elementsFromFixture,
  elementFromFixture,
} from '../../services/utils/test-helpers';
import { cold, getTestScheduler } from 'jasmine-marbles';

const showcaseMock = cloneDeep(EMPLOYEE_SHOWCASE_MOCK).slice(0, 25);

const fixtureWidth = (
  fixture: ComponentFixture<EmployeesShowcaseComponent>,
  size: number,
  skipEvent = false
) => {
  fixture.nativeElement.style.width = size + 'px';
  fixture.nativeElement.style.minWidth = size + 'px';
  if (!skipEvent) {
    window.dispatchEvent(new Event('resize'));
  }
};

const resizeAvatar = (
  component: EmployeesShowcaseComponent,
  size: number
): void => {
  component.ngOnChanges(
    simpleChange({
      avatarSize: size,
    })
  );
};

const updateEmployees = (
  component: EmployeesShowcaseComponent,
  employees: EmployeeShowcase[]
): void => {
  component.ngOnChanges(
    simpleChange({
      employees: [...employees],
    })
  );
};

const getAvatarsToFit = (width: number, size: AvatarSize) => {
  return Math.floor((width - size) / (size - AvatarGap[size]) + 1);
};

const getWidthByAvatarCount = (size: AvatarSize, count: number) =>
  size * count - AvatarGap[size] * (count - 1) + 20;

fdescribe('EmployeesShowcaseComponent', () => {
  let component: EmployeesShowcaseComponent;
  let fixture: ComponentFixture<EmployeesShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeesShowcaseComponent,
        MockComponent(AvatarComponent),
        MockComponent(IconComponent),
        MockComponent(SingleSelectPanelComponent),
      ],
      imports: [NoopAnimationsModule, CommonModule],
      providers: [DOMhelpers, UtilsService, PanelPositionService],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployeesShowcaseComponent);
        fixtureWidth(fixture, 800, true);
        component = fixture.componentInstance;
        component.avatarSize = AvatarSize.large;
        component.expandOnClick = false;
        component.doShuffle = false;
        // updateEmployees(component, showcaseMock);
        // component.employees = showcaseMock;
      });
  }));

  beforeEach(() => {
    updateEmployees(component, showcaseMock);
    // flush();
  });

  // afterEach(fakeAsync(() => {
  //   flush();
  // }));

  // xdescribe('ngOnInit', () => {
  //   it('should set avatarsToShow', fakeAsync(() => {
  //     fixture.autoDetectChanges();
  //     tick(1200);

  //     expect(component.avatarsToShow).toEqual(
  //       showcaseMock.slice(0, getAvatarsToFit(800, AvatarSize.large))
  //     );

  //     flush();
  //     component.ngOnDestroy();
  //   }));

  //   it('should set panelListOptions', fakeAsync(() => {
  //     fixture.autoDetectChanges();
  //     tick(1200);

  //     updateEmployees(component, [showcaseMock[0], showcaseMock[1]]);

  //     expect(component.panelListOptions[0].options).toEqual(
  //       [showcaseMock[0], showcaseMock[1]].map(
  //         (employee: EmployeeShowcase) => ({
  //           value: employee.displayName,
  //           id: employee.id,
  //           selected: false,
  //           prefixComponent: {
  //             component: AvatarComponent,
  //             attributes: {
  //               imageSource: employee.imageSource,
  //             },
  //           },
  //         })
  //       )
  //     );

  //     flush();
  //     component.ngOnDestroy();
  //   }));
  // });

  // xdescribe('ngOnChanges', () => {
  //   const startAvatarOrder = showcaseMock.slice(0, 5);

  //   beforeEach(fakeAsync(() => {
  //     console.log('beforeEach');
  //     fixture.autoDetectChanges();
  //     updateEmployees(component, startAvatarOrder);
  //     tick(1200);
  //   }));

  //   it('should not shuffle avatars if avatarSize > medium but width can contain all', fakeAsync(() => {
  //     expect(component.avatarsToShow).toEqual(startAvatarOrder);
  //     tick(3200);
  //     expect(component.avatarsToShow).toEqual(startAvatarOrder);
  //     flush();
  //   }));

  //   it('should shuffle avatars if avatarSize > medium and width cannot contain all', fakeAsync(() => {
  //     console.log('medium and width cannot contain all');

  //     fixtureWidth(fixture, 300);
  //     expect(component.avatarsToShow).toEqual(startAvatarOrder.slice(0, 2));
  //     tick(3000);

  //     expect(component.avatarsToShow).not.toEqual(startAvatarOrder.slice(0, 2));
  //     component.ngOnDestroy();
  //     tick();
  //   }));

  //   it('should not shuffle avatars if avatarSize !> medium', fakeAsync(() => {
  //     resizeAvatar(component, AvatarSize.small);
  //     expect(component.avatarsToShow).toEqual(startAvatarOrder);
  //     tick(3000);
  //     expect(component.avatarsToShow).toEqual(startAvatarOrder);
  //     flush();
  //   }));
  // });

  // xdescribe('onSelectChange', () => {
  //   it('should emit selectChange with listChange', () => {
  //     const listChange = new ListChange(component.panelListOptions);
  //     const selectChange = spyOn(component.selectChange, 'emit');
  //     component.onSelectChange(listChange);
  //     expect(selectChange).toHaveBeenCalledWith(listChange);
  //   });
  // });

  fdescribe('template', () => {
    let showcaseAvatars: HTMLElement[];
    let moreIndicator: HTMLElement;

    // it('should display 0 mini avatars', () => {
    //   updateEmployees(component, []);

    //   showcaseAvatars = elementsFromFixture(
    //     fixture,
    //     '.showcase-avatar:not(.show-more)'
    //   );
    //   moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

    //   expect(showcaseAvatars.length).toBe(0);
    //   expect(moreIndicator).toBeFalsy();
    // });

    // it('should display 2 medium avatars and hide show-more-indicator', () => {
    //   fixtureWidth(fixture, 180);
    //   resizeAvatar(component, AvatarSize.medium);

    //   showcaseAvatars = elementsFromFixture(
    //     fixture,
    //     '.showcase-avatar:not(.show-more)'
    //   );
    //   moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

    //   expect(showcaseAvatars.length).toBe(2);
    //   expect(moreIndicator).toBeFalsy();
    // });

    it('should display 2 mini avatars and correct gap  + show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.mini, 2), true);
      resizeAvatar(component, AvatarSize.mini);

      showcaseAvatars = elementsFromFixture(
        fixture,
        '.showcase-avatar:not(.show-more)'
      );
      moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

      expect(showcaseAvatars.length).toBe(2);
      expect(moreIndicator).toBeTruthy();

      expect(getComputedStyle(showcaseAvatars[1]).marginLeft).toEqual(
        '-' + AvatarGap[AvatarSize.mini] + 'px'
      );
    }));

    it('should display 2 large avatars  and no show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.large, 2), true);
      updateEmployees(component, [showcaseMock[0], showcaseMock[1]]);

      showcaseAvatars = elementsFromFixture(
        fixture,
        '.showcase-avatar:not(.show-more)'
      );
      moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

      expect(showcaseAvatars.length).toBe(2);
      expect(moreIndicator).toBeFalsy();
    }));

    it('should display 1 large avatar + show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.large, 1), false);

      // fixture.detectChanges();
      // tick(1000);

      showcaseAvatars = elementsFromFixture(
        fixture,
        '.showcase-avatar:not(.show-more)'
      );
      moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

      expect(showcaseAvatars.length).toBe(1);
      expect(moreIndicator).toBeTruthy();

      // flush();
    }));

    // >>>>>>>>
    // it('should display 9 mini avatars', () => {
    //   showcaseAvatars = elementsFromFixture(
    //     fixture,
    //     '.showcase-avatar:not(.show-more)'
    //   );
    //   moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

    //   expect(showcaseAvatars.length).toBe(9);
    //   expect(moreIndicator).toBeFalsy();
    // });

    // // >>>>>>>>
    // it('should display 9 medium avatars and correct gap', () => {
    //   fixtureWidth(fixture, 1000);
    //   resizeAvatar(component, AvatarSize.medium);

    //   showcaseAvatars = elementsFromFixture(
    //     fixture,
    //     '.showcase-avatar:not(.show-more)'
    //   );
    //   moreIndicator = elementFromFixture(fixture, '.showcase-avatar.show-more');

    //   expect(showcaseAvatars.length).toBe(9);
    //   expect(moreIndicator).toBeFalsy();
    //   expect(getComputedStyle(showcaseAvatars[1]).marginLeft).toEqual(
    //     '-' + AvatarGap[AvatarSize.medium] + 'px'
    //   );
    // });
  });

  // describe('OnDestroy', () => {
  //   it('should unsubscribe from resize and interval subscribers', fakeAsync(() => {
  //     fixture.autoDetectChanges();
  //     resizeAvatar(component, AvatarSize.large);
  //     tick(1200);

  //     expect(component['resizeEventSubscriber'].closed).toBe(false);
  //     expect(component['intervalSubscriber'].closed).toBe(false);

  //     component.ngOnDestroy();

  //     expect(component['resizeEventSubscriber']).toBeFalsy();
  //     expect(component['intervalSubscriber']).toBeFalsy();

  //     flush();
  //   }));
  // });
});
