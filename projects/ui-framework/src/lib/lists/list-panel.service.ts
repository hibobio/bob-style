import { Injectable } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  FlexibleConnectedPositionStrategy,
  ConnectedOverlayPositionChange,
  OverlayConfig,
} from '@angular/cdk/overlay';
import {
  throttleTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  tap,
} from 'rxjs/operators';
import { race } from 'rxjs';
import { outsideZone } from '../services/utils/rxjs.operators';
import isEqual from 'lodash/isEqual';
import { isKey } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { ScrollEvent } from '../services/utils/utils.interface';
import { MobileService } from '../services/utils/mobile.service';

@Injectable({
  providedIn: 'root',
})
export class ListPanelService {
  constructor(private mobileService: MobileService) {}

  public openPanel(self: any): void {
    if (!self.overlayRef && !self.disabled && !self.panelOpen) {
      self.panelOpen = true;
      self.panelConfig = this.getConfig(self);
      self.overlayRef = self.overlay.create(self.panelConfig);
      self.templatePortal = new TemplatePortal(
        self.templateRef,
        self.viewContainerRef
      );

      self.overlayRef.attach(self.templatePortal);
      self.overlayRef.updatePosition();

      const inputWidth =
        self.overlayOrigin.elementRef.nativeElement.offsetWidth;
      self.overlayRef.updateSize({
        width: inputWidth,
        height: 360,
      });

      const panelElem = self.overlayRef.overlayElement
        .children[0] as HTMLElement;
      self.DOM.setCssProps(panelElem, {
        '--input-width': inputWidth + 'px',
      });

      if (self.opened.observers.length) {
        self.opened.emit(self.overlayRef);
      }

      self.subscribtions.push(
        (self.panelConfig
          .positionStrategy as FlexibleConnectedPositionStrategy).positionChanges
          .pipe(
            throttleTime(200, undefined, {
              leading: true,
              trailing: true,
            }),
            distinctUntilChanged(isEqual)
          )
          .subscribe((change: ConnectedOverlayPositionChange) => {
            self.positionClassList = self.panelPositionService.getPositionClassList(
              change
            );
            if (!self.cd['destroyed']) {
              self.cd.detectChanges();
            }
          })
      );

      self.subscribtions.push(
        race(
          self.overlayRef.backdropClick(),
          self.utilsService.getWindowKeydownEvent().pipe(
            outsideZone(self.zone),
            filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
          ),
          self.utilsService.getResizeEvent().pipe(
            outsideZone(self.zone),
            tap(() => {
              self.isMobile = this.mobileService.getMediaData().isMobile;
            }),
            filter(() => !self.isMobile)
          ),
          self.utilsService.getScrollEvent().pipe(
            outsideZone(self.zone),
            filter(() => !self.isMobile),
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
          self.zone.run(() => {
            self.onApply();
          });
        })
      );
    }
  }

  public destroyPanel(self: any, skipEmit = false): void {
    self.panelOpen = false;
    if (self.overlayRef) {
      self.overlayRef.dispose();
      self.panelConfig = {};
      self.templatePortal = null;
      self.overlayRef = null;

      self.subscribtions.forEach(sub => {
        sub.unsubscribe();
        sub = null;
      });
      self.subscribtions = [];

      if (self.closed.observers.length && !skipEmit) {
        self.closed.emit();
      }
    }
  }

  private getPanelClass(self: any): string[] {
    return [
      ...self.panelClassList,
      self.hasArrow ? 'b-select-panel-with-arrow' : null,
      self.panelClass,
    ].filter(Boolean);
  }

  private getConfig(self: any): OverlayConfig {
    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: this.getPanelClass(self),
      positionStrategy: self.panelPositionService.getPanelPositionStrategy(
        self.overlayOrigin,
        self.panelPosition
      ),
      scrollStrategy: self.panelPositionService.getScrollStrategy(),
    };
  }
}
