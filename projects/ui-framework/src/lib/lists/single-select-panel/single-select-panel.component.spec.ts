import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  resetFakeAsyncZone,
} from '@angular/core/testing';
import { SingleSelectPanelComponent } from './single-select-panel.component';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { SelectGroupOption } from '../list.interface';
import { ListChange } from '../list-change/list-change';
import { UtilsService } from '../../services/utils/utils.service';
import {
  utilsServiceStub,
  mockTranslatePipe,
  mockHighlightPipe,
  MobileServiceProvideMock,
  TranslateServiceProvideMock,
  listKeyboardServiceStub,
} from '../../tests/services.stub.spec';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { SingleListComponent } from '../single-list/single-list.component';

describe('SingleSelectPanelComponent', () => {
  let component: SingleSelectPanelComponent;
  let fixture: ComponentFixture<SingleSelectPanelComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let optionsMock: SelectGroupOption[];

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(async(() => {
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
        SingleSelectPanelComponent,
        SingleListComponent,
        mockTranslatePipe,
        mockHighlightPipe,
      ],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        ScrollingModule,
        OverlayModule,
      ],
      providers: [
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        MobileServiceProvideMock(),
        TranslateServiceProvideMock(),
        PanelPositionService,
        { provide: UtilsService, useValue: utilsServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectPanelComponent);
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
  }));

  beforeEach(fakeAsync(() => {
    component.options = optionsMock;
    fixture.autoDetectChanges();
    component.openPanel();
    tick(500);
  }));

  describe('panel', () => {
    it('should have 2 options', () => {
      const listOptions = overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      );
      expect(listOptions.length).toEqual(2);
      expect((listOptions[0] as HTMLElement).innerText).toContain('Basic info');
      expect((listOptions[1] as HTMLElement).innerText).toContain('Personal');
    });
  });

  describe('onSelect', () => {
    it('should indicate selected option', () => {
      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[1] as HTMLElement).click();
      const listOptions = overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      );
      expect((listOptions[0] as HTMLElement).classList).not.toContain(
        'selected'
      );
      expect((listOptions[1] as HTMLElement).classList).toContain('selected');
    });
    it('should emit listChange on selection', () => {
      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[1] as HTMLElement).click();
      optionsMock[0].options[1].selected = true;
      const listChange = new ListChange(optionsMock);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });
    it('should destroy panel on select', () => {
      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[1] as HTMLElement).click();
      expect(component['destroyPanel']).toHaveBeenCalled();
    });
  });

  describe('onDestroy', () => {
    it('should invoke panel close', () => {
      component.ngOnDestroy();
      expect(component['destroyPanel']).toHaveBeenCalled();
    });
  });
});
