import { MockComponent } from 'ng-mocks';

import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  resetFakeAsyncZone,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonComponent } from '../../buttons/button/button.component';
import { ChevronButtonComponent } from '../../buttons/chevron-button/chevron-button.component';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { CheckboxComponent } from '../../form-elements/checkbox/checkbox.component';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { PanelService } from '../../popups/panel/panel.service';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { fakeAsyncFlush } from '../../services/utils/test-helpers';
import { UtilsService } from '../../services/utils/utils.service';
import {
  listKeyboardServiceStub,
  MobileServiceProvideMock,
  mockHighlightPipe,
  mockTranslatePipe,
  TranslateServiceProvideMock,
  utilsServiceStub,
} from '../../tests/services.stub.spec';
import { ListChangeService } from '../list-change/list-change.service';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { ListPanelService } from '../list-panel.service';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
import { compareListChange, mockListChange } from '../lists-test-helpers.spec';
import { MultiListComponent } from '../multi-list/multi-list.component';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { MultiSelectPanelComponent } from './multi-select-panel.component';

describe('MultiSelectPanelComponent', () => {
  let component: MultiSelectPanelComponent;
  let fixture: ComponentFixture<MultiSelectPanelComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let optionsMock: SelectGroupOption[];

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(
    waitForAsync(() => {
      optionsMock = [
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
          MultiSelectPanelComponent,
          MockComponent(ChevronButtonComponent),
          MultiSelectComponent,
          MultiListComponent,
          ListFooterComponent,
          mockTranslatePipe,
          mockHighlightPipe,
          MockComponent(CheckboxComponent),
          ButtonComponent,
          TextButtonComponent,
        ],
        imports: [
          CommonModule,
          NoopAnimationsModule,
          ScrollingModule,
          OverlayModule,
          TrackByPropModule,
        ],
        providers: [
          ListPanelService,
          PanelService,
          PanelPositionService,
          ListModelService,
          ListChangeService,
          { provide: UtilsService, useValue: utilsServiceStub },
          { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
          MobileServiceProvideMock(),
          TranslateServiceProvideMock(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(MultiSelectPanelComponent);
          component = fixture.componentInstance;
          component.ngAfterViewInit = () => {};

          spyOn(component as any, 'destroyPanel');
          spyOn(component.selectChange, 'emit');
          component.chevronButtonText = 'Click';
        });

      inject(
        [OverlayContainer, Platform],
        (oc: OverlayContainer, p: Platform) => {
          overlayContainer = oc;
          overlayContainerElement = oc.getContainerElement();
          platform = p;
        }
      )();
    })
  );

  beforeEach(fakeAsync(() => {
    component.options = optionsMock;
    fixture.autoDetectChanges();
    component.openPanel();
    fakeAsyncFlush();
  }));

  describe('panel', () => {
    it('should have 2 options', () => {
      const listOptions = overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      );
      expect(listOptions.length).toEqual(2);
      expect((listOptions[0] as HTMLElement).innerText).toContain('Basic info');
      expect((listOptions[1] as HTMLElement).innerText).toContain('Personal');
    });
  });

  describe('onSelect', () => {
    it('should save listChange on component state', fakeAsync(() => {
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[1] as HTMLElement).click();

      tick();

      compareListChange(
        component['listChange'],
        mockListChange(optionsMock, [optionsMock[0].options[1].id])
      );
    }));
  });

  describe('onApply 1', () => {
    it('should emit listChange on selection', fakeAsync(() => {
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[1] as HTMLElement).click();
      tick();

      compareListChange(
        component['listChange'],
        mockListChange(optionsMock, [optionsMock[0].options[1].id])
      );
    }));
  });

  describe('onApply 2', () => {
    beforeEach(() => {
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[1] as HTMLElement).click();
      (overlayContainerElement.querySelector(
        '.apply-button button'
      ) as HTMLElement).click();
    });

    it('should indicate selected option', () => {
      const listOptionsCb = overlayContainerElement.querySelectorAll(
        'b-multi-list .option .checkbox'
      );
      expect(listOptionsCb[0].classList).not.toContain('selected');
      expect(listOptionsCb[1].classList).toContain('selected');
    });

    it('should invoke panel close', () => {
      expect(component['destroyPanel']).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should invoke panel close', () => {
      component.ngOnDestroy();
      expect(component['destroyPanel']).toHaveBeenCalled();
    });
  });
});
