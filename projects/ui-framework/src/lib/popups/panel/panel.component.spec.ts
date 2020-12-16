import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PanelComponent } from './panel.component';
import { CdkOverlayOrigin, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { PanelPositionService } from './panel-position-service/panel-position.service';
import { ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from './panel.module';
import { PanelDefaultPosVer } from './panel.enum';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let panelPositionService: SpyObj<PanelPositionService>;
  let overlay: SpyObj<Overlay>;
  let positionStrategyMock;
  let scrollStrategyMock;
  let overlayRefMock;

  beforeEach(async(() => {
    positionStrategyMock = {
      positionChanges: of(null),
    };
    scrollStrategyMock = {};
    overlayRefMock = {
      attach: () => {},
      updatePosition: () => {},
      backdropClick: () => {
        return of(null);
      },
    };

    overlay = createSpyObj('overlay', ['create']);
    overlay.create.and.returnValue(overlayRefMock);

    panelPositionService = createSpyObj('panelPositionService', [
      'getPanelPositionStrategy',
      'getScrollStrategy',
      'getPositionClassList',
    ]);
    panelPositionService.getPanelPositionStrategy.and.returnValue(
      positionStrategyMock
    );
    panelPositionService.getScrollStrategy.and.returnValue(scrollStrategyMock);
    panelPositionService.getPositionClassList.and.returnValue({
      'panel-below': true,
      'panel-above': false,
      'panel-after': true,
      'panel-before': false,
    });

    TestBed.configureTestingModule({
      declarations: [],
      imports: [NoopAnimationsModule, CommonModule, OverlayModule, PanelModule],
      providers: [
        { provide: PanelPositionService, useValue: panelPositionService },
        { provide: Overlay, useValue: overlay },
        ViewContainerRef,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('openPanel', () => {
    it('should request position strategy from positionService with above by default', () => {
      component.openPanel();
      expect(
        panelPositionService.getPanelPositionStrategy
      ).toHaveBeenCalledWith(
        jasmine.any(CdkOverlayOrigin),
        PanelDefaultPosVer.above
      );
    });
    it('should request position strategy from positionService with below from input', () => {
      component.defaultPosVer = PanelDefaultPosVer.below;
      component.openPanel();
      expect(
        panelPositionService.getPanelPositionStrategy
      ).toHaveBeenCalledWith(
        jasmine.any(CdkOverlayOrigin),
        PanelDefaultPosVer.below
      );
    });
    it('should request scrollStrategy from positionService', () => {
      component.openPanel();
      expect(panelPositionService.getScrollStrategy).toHaveBeenCalledTimes(1);
    });
    it('should invoke overlay.create with config', () => {
      component.openPanel();
      expect(overlay.create).toHaveBeenCalled();
    });
  });
});
