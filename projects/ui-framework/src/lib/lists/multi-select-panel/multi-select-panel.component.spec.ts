import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MultiSelectPanelComponent } from './multi-select-panel.component';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { SelectGroupOption } from '../list.interface';
import { MockComponent } from 'ng-mocks';
import { ChevronButtonComponent } from '../../buttons/chevron-button/chevron-button.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { MultiListModule } from '../multi-list/multi-list.module';
import { ListChange } from '../list-change/list-change';
import { UtilsService } from '../../services/utils/utils.service';
import { utilsServiceStub } from '../../tests/services.stub';

describe('MultiSelectPanelComponent', () => {
  let component: MultiSelectPanelComponent;
  let fixture: ComponentFixture<MultiSelectPanelComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let optionsMock: SelectGroupOption[];

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
        MultiSelectPanelComponent,
        MockComponent(ChevronButtonComponent),
      ],
      imports: [
        MultiListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
      ],
      providers: [
        PanelPositionService,
        { provide: UtilsService, useValue: utilsServiceStub },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectPanelComponent);
        component = fixture.componentInstance;
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
        'b-multi-list .option'
      );
      expect(listOptions.length).toEqual(2);
      expect((listOptions[0] as HTMLElement).innerText).toContain('Basic info');
      expect((listOptions[1] as HTMLElement).innerText).toContain('Personal');
    });
  });

  describe('onSelect', () => {
    it('should save listChange on component state', () => {
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[1] as HTMLElement).click();
      optionsMock[0].options[1].selected = true;
      const listChange = new ListChange(optionsMock);
      expect(component['listChange']).toEqual(listChange);
    });
  });

  describe('onApply', () => {
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
    it('should emit listChange on selection', () => {
      optionsMock[0].options[1].selected = true;
      const listChange = new ListChange(optionsMock);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
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
