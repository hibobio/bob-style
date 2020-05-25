import { TestBed } from '@angular/core/testing';
import { PanelPositionService } from './panel-position.service';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { PanelDefaultPosVer } from '../panel.enum';
import {
  ABOVE_CENTER,
  ABOVE_END,
  ABOVE_START,
  BELOW_CENTER,
  BELOW_END,
  BELOW_START,
} from './panel-position.const';
import createSpyObj = jasmine.createSpyObj;

describe('PanelPositionService', () => {
  let panelPositionService: PanelPositionService;
  let cdkOverlayOriginMock: CdkOverlayOrigin;
  let scrollStrategyOptions: jasmine.SpyObj<ScrollStrategyOptions>;
  let scrollStrategyMock;

  beforeEach(() => {
    cdkOverlayOriginMock = {
      elementRef: {},
    } as CdkOverlayOrigin;

    scrollStrategyMock = 'material scroll strategy';

    scrollStrategyOptions = createSpyObj('scrollStrategyOptions', [
      'reposition',
    ]);
    scrollStrategyOptions.reposition.and.returnValue(scrollStrategyMock);

    TestBed.configureTestingModule({
      providers: [
        PanelPositionService,
        Overlay,
        { provide: ScrollStrategyOptions, useValue: scrollStrategyOptions },
      ],
    });

    panelPositionService = TestBed.inject(PanelPositionService);
  });

  describe('getPanelPositionStrategy', () => {
    it('should return strategy where above has priority', () => {
      const position: PanelDefaultPosVer = PanelDefaultPosVer.above;
      const strategy: PositionStrategy = panelPositionService.getPanelPositionStrategy(
        cdkOverlayOriginMock,
        position
      );
      expect(strategy['positions']).toEqual([
        ABOVE_CENTER,
        ABOVE_START,
        ABOVE_END,
        BELOW_CENTER,
        BELOW_START,
        BELOW_END,
      ]);
    });

    it('should return strategy where below has priority', () => {
      const position: PanelDefaultPosVer = PanelDefaultPosVer.below;
      const strategy: PositionStrategy = panelPositionService.getPanelPositionStrategy(
        cdkOverlayOriginMock,
        position
      );
      expect(strategy['positions']).toEqual([
        BELOW_CENTER,
        BELOW_START,
        BELOW_END,
        ABOVE_CENTER,
        ABOVE_START,
        ABOVE_END,
      ]);
    });

    it('should return particular postion strategy, if ConnectedPosition[] is passed ', () => {
      const position: ConnectedPosition[] = [BELOW_START, BELOW_END];
      const strategy: PositionStrategy = panelPositionService.getPanelPositionStrategy(
        cdkOverlayOriginMock,
        position
      );
      expect(strategy['positions']).toEqual([BELOW_START, BELOW_END]);
    });

    it('should return centered strategy, if no position is passed', () => {
      const strategy: PositionStrategy = panelPositionService.getPanelPositionStrategy(
        cdkOverlayOriginMock
      );
      expect(strategy['positions']).toEqual([BELOW_CENTER, ABOVE_CENTER]);
    });
  });

  describe('getCenterPanelPositionStrategy', () => {
    it('should return strategy with center position bottom, center position top', () => {
      const strategy: PositionStrategy = panelPositionService.getCenterPanelPositionStrategy(
        cdkOverlayOriginMock
      );
      expect(strategy['positions']).toEqual([BELOW_CENTER, ABOVE_CENTER]);
    });
  });

  describe('getPositionClassList', () => {
    it('should return panel-below as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: BELOW_CENTER,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': true,
        'panel-above': false,
        'panel-after': false,
        'panel-before': false,
      });
    });
    it('should return panel-below and panel-after as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: BELOW_START,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': true,
        'panel-above': false,
        'panel-after': true,
        'panel-before': false,
      });
    });
    it('should return panel-below and panel-before as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: BELOW_END,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': true,
        'panel-above': false,
        'panel-after': false,
        'panel-before': true,
      });
    });
    it('should return panel-above as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: ABOVE_CENTER,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': false,
        'panel-above': true,
        'panel-after': false,
        'panel-before': false,
      });
    });
    it('should return panel-above and panel-after as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: ABOVE_START,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': false,
        'panel-above': true,
        'panel-after': true,
        'panel-before': false,
      });
    });
    it('should return panel-above and panel-before as true', () => {
      const change: ConnectedOverlayPositionChange = {
        connectionPair: ABOVE_END,
      } as ConnectedOverlayPositionChange;
      expect(panelPositionService.getPositionClassList(change)).toEqual({
        'panel-below': false,
        'panel-above': true,
        'panel-after': false,
        'panel-before': true,
      });
    });
  });

  describe('getScrollStrategy', () => {
    it('should return reposition strategy', () => {
      const scrollStrategy: ScrollStrategy = panelPositionService.getScrollStrategy();
      expect(scrollStrategyOptions.reposition).toHaveBeenCalledTimes(1);
      expect(scrollStrategy).toEqual(scrollStrategyMock);
    });
  });
});
