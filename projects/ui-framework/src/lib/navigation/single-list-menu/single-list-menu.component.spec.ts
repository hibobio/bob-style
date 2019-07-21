import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { SingleListMenuComponent } from './single-list-menu.component';
import { MockComponent } from 'ng-mocks';
import { ChevronButtonComponent } from '../../buttons-indicators/buttons/chevron-button/chevron-button.component';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { SingleListModule } from '../../form-elements/lists/single-list/single-list.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { SingleListMenuItem } from './single-list-menu.interface';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';

describe('SingleListMenuComponent', () => {
  let component: SingleListMenuComponent;
  let fixture: ComponentFixture<SingleListMenuComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let menuMock: SingleListMenuItem[];
  let singleSelectOptionsMock: SelectGroupOption[];

  beforeEach(async(() => {
    menuMock = [
      {
        label: 'Basic info',
        key: '1',
        action: () => console.log('scroll to Basic info'),
      },
      {
        label: 'Personal',
        key: '2',
        action: () => console.log('scroll to Personal'),
      },
    ];

    singleSelectOptionsMock = [
      {
        groupName: '',
        options: [
          {
            value: 'Basic info',
            id: '1',
            selected: false,
          },
          {
            value: 'Personal',
            id: '2',
            selected: false,
          },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleListMenuComponent,
        MockComponent(ChevronButtonComponent),
      ],
      imports: [
        SingleListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
      ],
      providers: [
        PanelPositionService
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleListMenuComponent);
        component = fixture.componentInstance;
        spyOn(component, 'destroyPanel');
        component.chevronText = 'Click';
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

  describe('OnChanges', () => {
    it('should map SingleListMenuItem interface to SelectGroupOptions interface', () => {
      const changes: SimpleChanges = {
        menu: {
          currentValue: menuMock,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
      };
      component.ngOnChanges(changes);
      expect(component.singleSelectOptions).toEqual(singleSelectOptionsMock);
    });
    it('should map value if no key is provided in SingleListMenuItem', () => {
      const menuMockTest = [
        {
          label: 'Basic info',
          action: () => console.log('scroll to Basic info'),
        },
      ];
      const singleSelectOptionsMockTest = [
        {
          groupName: '',
          options: [
            {
              value: 'Basic info',
              id: 'Basic info',
              selected: false,
            },
          ],
        },
      ];
      const changes: SimpleChanges = {
        menu: {
          currentValue: menuMockTest,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
      };
      component.ngOnChanges(changes);
      expect(component.singleSelectOptions).toEqual(singleSelectOptionsMockTest);
    });
  });

  describe('onSelect', () => {
    beforeEach(fakeAsync(() => {
      const changes: SimpleChanges = {
        menu: {
          currentValue: menuMock,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
      };
      component.ngOnChanges(changes);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
    }));
    it('should have 2 options', () => {
      const listOptions = (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      ));
      expect(listOptions.length).toEqual(2);
      expect((listOptions[0] as HTMLElement).innerText).toContain('Basic info');
      expect((listOptions[1] as HTMLElement).innerText).toContain('Personal');
    });
    it('should invoke menu item action', () => {
      spyOn(menuMock[1], 'action');
      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[1] as HTMLElement).click();
      expect(menuMock[1].action).toHaveBeenCalledWith(menuMock[1]);
    });
    it('should destroy panel on select', () => {
      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[1] as HTMLElement).click();
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

  describe('onDestroy', () => {
    it('should invoke panel close', () => {
      component.ngOnDestroy();
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

});
