import {
  Injectable,
  NgZone,
  ViewContainerRef,
  TemplateRef,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  FlexibleConnectedPositionStrategy,
  ConnectedOverlayPositionChange,
  OverlayConfig,
  Overlay,
  CdkOverlayOrigin,
  OverlayRef,
} from '@angular/cdk/overlay';
import { throttleTime, filter, map, pairwise, tap } from 'rxjs/operators';
import { race, Subscription } from 'rxjs';
import { hasProp } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { ScrollEvent } from '../services/utils/utils.interface';
import { MobileService } from '../services/utils/mobile.service';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { UtilsService } from '../services/utils/utils.service';
import { PanelPositionService } from '../popups/panel/panel-position-service/panel-position.service';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { OverlayPositionClasses } from '../types';
import { filterKey, onlyDistinct } from '../services/utils/rxjs.operators';

export interface OverlayEnabledComponent {
  zone: NgZone;
  DOM: DOMhelpers;
  utilsService: UtilsService;
  overlay: Overlay;
  viewContainerRef: ViewContainerRef;
  panelPositionService: PanelPositionService;
  overlayOrigin: CdkOverlayOrigin;
  templateRef: TemplateRef<any>;
  panelPosition: PanelDefaultPosVer;
  subscribtions: Subscription[];
  panelClassList: string[];
  positionClassList: OverlayPositionClasses;
  overlayRef: OverlayRef;
  panelConfig: OverlayConfig;
  templatePortal: TemplatePortal;
  panelOpen: boolean;
  cd: ChangeDetectorRef;

  disabled?: boolean;
  hasArrow?: boolean;
  isMobile?: boolean;
  panelClass?: string;
  opened?: EventEmitter<OverlayRef>;
  closed?: EventEmitter<void>;
  onApply?: () => void;

  [key: string]: any;
}

type OEC = OverlayEnabledComponent;

export interface PanelOptions {
  hasBackdrop: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ListPanelService {
  constructor(private mobileService: MobileService) {}

  public openPanel(self: any, options: PanelOptions = null): void {
    if (
      !(self as OEC).overlayRef &&
      !(self as OEC).disabled &&
      !(self as OEC).panelOpen
    ) {
      (self as OEC).panelOpen = true;
      (self as OEC).panelConfig = this.getConfig(self, options);
      (self as OEC).overlayRef = (self as OEC).overlay.create(
        (self as OEC).panelConfig
      );
      (self as OEC).templatePortal = new TemplatePortal(
        (self as OEC).templateRef,
        (self as OEC).viewContainerRef
      );

      (self as OEC).overlayRef.attach((self as OEC).templatePortal);
      (self as OEC).overlayRef.updatePosition();

      const inputWidth = (self as OEC).overlayOrigin.elementRef.nativeElement
        .offsetWidth;
      (self as OEC).overlayRef.updateSize({
        width: inputWidth,
        height: 360,
      });

      const panelElem = (self as OEC).overlayRef.overlayElement
        .children[0] as HTMLElement;
      (self as OEC).DOM.setCssProps(panelElem, {
        '--input-width': inputWidth + 'px',
      });

      if ((self as OEC).opened?.observers.length) {
        (self as OEC).opened.emit((self as OEC).overlayRef);
      }

      (self as OEC).subscribtions.push(
        ((self as OEC).panelConfig
          .positionStrategy as FlexibleConnectedPositionStrategy).positionChanges
          .pipe(
            throttleTime(200, undefined, {
              leading: true,
              trailing: true,
            }),
            onlyDistinct()
          )
          .subscribe((change: ConnectedOverlayPositionChange) => {
            (self as OEC).positionClassList = (self as OEC).panelPositionService.getPositionClassList(
              change
            );
            if (!(self as OEC).cd['destroyed']) {
              (self as OEC).cd.detectChanges();
            }
          })
      );

      (self as OEC).subscribtions.push(
        race(
          (self as OEC).overlayRef
            .backdropClick()
            .pipe(
              filter(() => (self as OEC)['backdropClickMode'] !== 'cancel')
            ),

          (self as OEC).utilsService.getResizeEvent(true).pipe(
            tap(() => {
              (self as OEC).isMobile = this.mobileService.isMobile();
            }),
            filter(() => !(self as OEC).isMobile)
          ),

          (self as OEC).utilsService.getScrollEvent(true).pipe(
            filter(() => !(self as OEC).isMobile),
            throttleTime(50, undefined, {
              leading: true,
              trailing: true,
            }),
            map((e: ScrollEvent) => e.scrollY),
            pairwise(),
            filter(
              (scrollArr: number[]) =>
                Math.abs(scrollArr[0] - scrollArr[1]) > 20
            )
          )
        ).subscribe(() => {
          (self as OEC).zone.run(() => {
            self[
              (self as OEC).onApply
                ? 'onApply'
                : (self as OEC).closePanel
                ? 'closePanel'
                : 'destroyPanel'
            ]();
          });
        })
      );

      (self as OEC).subscribtions.push(
        race(
          (self as OEC).overlayRef
            .backdropClick()
            .pipe(
              filter(() => (self as OEC)['backdropClickMode'] === 'cancel')
            ),

          (self as OEC).utilsService
            .getWindowKeydownEvent(true)
            .pipe(filterKey(Keys.escape))
        ).subscribe(() => {
          (self as OEC)[
            (self as OEC).onCancel
              ? 'onCancel'
              : (self as OEC).closePanel
              ? 'closePanel'
              : 'destroyPanel'
          ]();
        })
      );
    }
  }

  public destroyPanel(self: any, skipEmit = false): void {
    (self as OEC).panelOpen = false;
    if ((self as OEC).overlayRef) {
      (self as OEC).overlayRef.dispose();
      (self as OEC).panelConfig = {};
      (self as OEC).templatePortal = null;
      (self as OEC).overlayRef = null;

      (self as OEC).subscribtions.forEach((sub) => {
        sub.unsubscribe();
        sub = null;
      });
      (self as OEC).subscribtions = [];

      if ((self as OEC).closed?.observers.length && !skipEmit) {
        (self as OEC).closed.emit();
      }
    }
  }

  private getPanelClass(self: any): string[] {
    return [
      ...(self as OEC).panelClassList,
      (self as OEC).hasArrow
        ? 'b-select-panel-with-arrow'
        : 'b-select-panel-no-arrow',
      (self as OEC).panelClass,
    ].filter(Boolean);
  }

  private getConfig(self: any, options: PanelOptions = null): OverlayConfig {
    return {
      disposeOnNavigation: true,
      hasBackdrop: hasProp(options, 'hasBackdrop') ? options.hasBackdrop : true,
      backdropClass: 'b-select-backdrop',
      panelClass: this.getPanelClass(self),
      positionStrategy: (self as OEC).panelPositionService.getPanelPositionStrategy(
        (self as OEC).overlayOrigin,
        (self as OEC).panelPosition
      ),
      scrollStrategy: (self as OEC).panelPositionService.getScrollStrategy(),
    };
  }
}
