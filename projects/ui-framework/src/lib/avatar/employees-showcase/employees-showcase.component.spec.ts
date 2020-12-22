import { ComponentFixture, fakeAsync, TestBed, tick, flush, resetFakeAsyncZone, waitForAsync } from '@angular/core/testing';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { UtilsService } from '../../services/utils/utils.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { EMPLOYEE_SHOWCASE_MOCK } from './employees-showcase.mock';
import { AvatarSize } from '../avatar/avatar.enum';
import { MockComponent } from 'ng-mocks';
import { AvatarComponent } from '../avatar/avatar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { ListChange } from '../../lists/list-change/list-change';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarGap } from './employees-showcase.const';
// tslint:disable-next-line: max-line-length
import { SingleSelectPanelComponent } from '../../lists/single-select-panel/single-select-panel.component';
import { cloneDeep } from 'lodash';
import {
  elementsFromFixture,
  elementFromFixture,
  getCssVariable,
} from '../../services/utils/test-helpers';
import { AvatarImageComponent } from '../avatar/avatar-image/avatar-image.component';
import { EmployeesShowcaseService } from './employees-showcase.service';
import { simpleChange } from '../../services/utils/functional-utils';

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

const testAvatarEls = (
  fixture: ComponentFixture<EmployeesShowcaseComponent>,
  size: AvatarSize,
  expectedCount: number,
  shouldHaveShowMore: boolean = false
): any => {
  fixture.detectChanges();
  const showcaseAvatars = elementsFromFixture(
    fixture,
    '.showcase-avatar:not(.show-more)'
  );
  const moreIndicator = elementFromFixture(
    fixture,
    '.showcase-avatar.show-more'
  );
  const realGap =
    showcaseAvatars.length &&
    Math.abs(parseFloat(getComputedStyle(showcaseAvatars[1]).marginLeft));
  const countVar = parseFloat(
    getCssVariable(fixture.debugElement.nativeElement, 'avatar-count')
  );
  const gapVar = Math.abs(
    parseFloat(getCssVariable(fixture.debugElement.nativeElement, 'avatar-gap'))
  );

  if (
    (shouldHaveShowMore && !moreIndicator) ||
    expectedCount !== showcaseAvatars.length ||
    (shouldHaveShowMore ? countVar - 1 : countVar) !==
      (expectedCount !== 0
        ? expectedCount
        : shouldHaveShowMore
        ? countVar - 1
        : countVar) ||
    gapVar !== AvatarGap[size] ||
    realGap !== (expectedCount !== 0 ? AvatarGap[size] : realGap)
  ) {
    return {
      expectedSize: size,
      expectedCount,
      expectedGap: AvatarGap[size],
      shouldHaveShowMore,
      avatars: showcaseAvatars.length,
      hasShowMore: !!moreIndicator,
      countVar,
      gapVar,
      gap: realGap,
    };
  }

  return true;
};

xdescribe('EmployeesShowcaseComponent', () => {
  let component: EmployeesShowcaseComponent;
  let fixture: ComponentFixture<EmployeesShowcaseComponent>;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeesShowcaseComponent,
        MockComponent(AvatarImageComponent),
        MockComponent(SingleSelectPanelComponent),
      ],
      imports: [NoopAnimationsModule, CommonModule],
      providers: [
        DOMhelpers,
        UtilsService,
        PanelPositionService,
        EmployeesShowcaseService,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployeesShowcaseComponent);
        fixtureWidth(fixture, 800, true);
        component = fixture.componentInstance;
        component.avatarSize = AvatarSize.large;
        component.expandOnClick = false;
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

  describe('ngOnInit', () => {
    it('should set avatarsToShow', fakeAsync(() => {
      fixture.autoDetectChanges();
      tick(1200);

      // expect(component.avatarsToShow).toEqual(
      //   showcaseMock.slice(0, getAvatarsToFit(800, AvatarSize.large))
      // );

      // flush();
      // component.ngOnDestroy();
    }));

    it('should set employeeListOptions', fakeAsync(() => {
      fixture.autoDetectChanges();
      tick(1200);

      updateEmployees(component, [showcaseMock[0], showcaseMock[1]]);

      // expect(component.employeeListOptions[0].options).toEqual(
      //   [showcaseMock[0], showcaseMock[1]].map(
      //     (employee: EmployeeShowcase) => ({
      //       value: employee.displayName,
      //       id: employee.id,
      //       selected: false,
      //       prefixComponent: {
      //         component: AvatarComponent,
      //         attributes: {
      //           imageSource: employee.imageSource,
      //         },
      //       },
      //     })
      //   )
      // );

      // flush();
      // component.ngOnDestroy();
    }));
  });

  describe('onSelectChange', () => {
    it('should emit selectChange with listChange', () => {
      // const listChange = new ListChange(component.employeeListOptions);
      const selectChange = spyOn(component.selectChange, 'emit');
      // component.onSelectChange(listChange);
      // expect(selectChange).toHaveBeenCalledWith(listChange);
    });
  });

  describe('Avatars count', () => {
    it('should display 0 mini avatars', fakeAsync(() => {
      updateEmployees(component, []);
      tick(1200);

      expect(testAvatarEls(fixture, AvatarSize.mini, 0, false)).toEqual(true);
    }));

    it('should display 2 medium avatars and hide show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.medium, 2), true);
      resizeAvatar(component, AvatarSize.medium);

      expect(testAvatarEls(fixture, AvatarSize.medium, 2, false)).toEqual(true);
    }));

    it('should display 2 mini avatars and correct gap + show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.mini, 2), true);
      resizeAvatar(component, AvatarSize.mini);

      expect(testAvatarEls(fixture, AvatarSize.mini, 2, true)).toEqual(true);
    }));

    it('should display 2 large avatars and no show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.large, 2), true);
      updateEmployees(component, [showcaseMock[0], showcaseMock[1]]);

      expect(testAvatarEls(fixture, AvatarSize.large, 2, false)).toEqual(true);
    }));

    it('should display 1 large avatar and no show-more-indicator', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.large, 1), false);

      expect(testAvatarEls(fixture, AvatarSize.large, 1, false)).toEqual(true);
    }));

    it('should display 9 mini avatars', fakeAsync(() => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.mini, 9), true);
      resizeAvatar(component, AvatarSize.mini);

      expect(testAvatarEls(fixture, AvatarSize.mini, 9, false)).toEqual(true);
    }));

    it('should display 9 medium avatars and correct gap', () => {
      fixtureWidth(fixture, getWidthByAvatarCount(AvatarSize.medium, 9), false);
      resizeAvatar(component, AvatarSize.medium);

      expect(testAvatarEls(fixture, AvatarSize.medium, 9, false)).toEqual(true);
    });
  });

  describe('OnDestroy', () => {
    it('should unsubscribe from resize and interval subscribers', fakeAsync(() => {
      resizeAvatar(component, AvatarSize.large);
      fixture.detectChanges();
      tick(1200);

      expect(component['resizeEventSubscriber'].closed).toBe(false);
      expect(component['intervalSubscriber'].closed).toBe(false);

      component.ngOnDestroy();

      expect(component['resizeEventSubscriber']).toBeFalsy();
      expect(component['intervalSubscriber']).toBeFalsy();
    }));
  });
});
