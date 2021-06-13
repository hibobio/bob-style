import { fromEvent, merge, Observable, race } from 'rxjs';
import { filter, map, tap, throttleTime } from 'rxjs/operators';

import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  Overlay,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  NgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import {
  asArray,
  getEventPath,
  invoke,
  isElementRef,
  joinArrays,
} from '../../services/utils/functional-utils';
import { onlyDistinct } from '../../services/utils/rxjs.operators';
import { UtilsService } from '../../services/utils/utils.service';
import {
  DOMFocusEvent,
  DOMMouseEvent,
  OverlayPositionClasses,
} from '../../types';
import { PanelPositionService } from './panel-position-service/panel-position.service';
import { PanelDefaultPosVer } from './panel.enum';
import { CreatePanelConfig, Panel } from './panel.interface';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  constructor(
    private overlay: Overlay,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  createPanel<T = unknown>(config: CreatePanelConfig): Panel<T> {
    const panel: Panel<T> = {
      ...config,

      overlayOrigin: this.getOverlayOrigin(config.origin),

      positionStrategy:
        config.positionStrategy ||
        this.panelPositionService.getPanelPositionStrategy(
          this.getOverlayOrigin(config.origin),
          config.position || PanelDefaultPosVer.above
        ),
      scrollStrategy: this.panelPositionService.getScrollStrategy(),

      disposeOnNavigation: true,
      hasBackdrop: config.hasBackdrop !== false && !config.openOnHover,

      panelClass: asArray(config.panelClass),
      backdropClass: joinArrays(
        [
          'b-panel-backdrop',
          config.showBackdrop === false && 'b-panel-backdrop-invisible',
        ].filter(Boolean),
        asArray(config.backdropClass)
      ),
    } as Panel<T>;

    panel.created = new Date().getTime();

    panel.overlayRef = this.overlay.create(panel);

    if (panel.viewContainerRef && panel.templateRef) {
      panel.portal = this.getTemplatePortal<T>(
        panel.templateRef as TemplateRef<T>,
        panel.viewContainerRef
      );
      panel.componentRef = this.attachPanel<T>(panel);
    }

    panel.originElement = this.getOriginElement(panel.overlayOrigin);
    panel.overlayElement = panel.overlayRef.overlayElement;
    panel.panelElement = panel.overlayElement.children[0] as HTMLElement;

    panel.positionClasses$ = panel.positionStrategy['positionChanges']?.pipe(
      throttleTime(200, undefined, {
        leading: true,
        trailing: true,
      }),
      onlyDistinct(),
      map((change: ConnectedOverlayPositionChange) =>
        this.panelPositionService.getPositionClassList(change)
      ),
      tap((positionClassList: OverlayPositionClasses) => {
        if (!panel.overlayRef) {
          return;
        }

        panel.panelElement.classList.remove('panel-above', 'panel-below');

        if (positionClassList['panel-above']) {
          panel.panelElement.classList.add('panel-above');
        } else {
          panel.panelElement.classList.add('panel-below');
        }
      })
    );

    panel.backdropClick$ = race(
      panel.overlayRef.backdropClick() as Observable<DOMMouseEvent>,
      this.utilsService.getWindowClickEvent(true).pipe(
        filter((event: DOMMouseEvent) => {
          return (
            new Date().getTime() - panel.created > 200 &&
            document.contains(panel.overlayElement) &&
            !getEventPath(event).includes(panel.overlayElement) &&
            !getEventPath(event).includes(panel.originElement)
          );
        })
      )
    );

    this.zone.runOutsideAngular(() => {
      panel.focusOut$ = merge(
        fromEvent(panel.originElement, 'focusout'),
        fromEvent(panel.panelElement, 'focusout')
      ).pipe(
        filter((event: DOMFocusEvent) => {
          return (
            event.relatedTarget &&
            !(
              panel.panelElement.contains(event.relatedTarget) ||
              panel.originElement.contains(event.relatedTarget)
            )
          );
        })
      );
    });

    return panel;
  }

  attachPanel<T = unknown>(
    panel: Panel<T>,
    portal?: ComponentPortal<T> | TemplatePortal<T>
  ): ComponentRef<T> {
    const componetRef: ComponentRef<T> = panel.overlayRef.attach(
      portal || panel.portal
    );
    panel.overlayRef.updatePosition();
    return componetRef;
  }

  destroyPanel(panel: Panel): void {
    if (!panel) {
      return;
    }
    panel.componentRef?.destroy();
    panel.portal?.isAttached && panel.portal.detach();
    invoke(panel.overlayRef, 'dispose');
  }

  getTemplatePortal<T = unknown>(
    template: TemplateRef<T>,
    viewContainerRef: ViewContainerRef,
    context?: T
  ): TemplatePortal<T> {
    return new TemplatePortal<T>(template, viewContainerRef, context);
  }

  getOverlayOrigin(origin: CreatePanelConfig['origin']): CdkOverlayOrigin {
    return (
      origin &&
      (isElementRef(origin['elementRef'])
        ? (origin as CdkOverlayOrigin)
        : new CdkOverlayOrigin(
            isElementRef(origin) ? origin : new ElementRef(origin)
          ))
    );
  }

  getOriginElement(origin: CreatePanelConfig['origin']): HTMLElement {
    return (
      origin &&
      (origin['elementRef']?.nativeElement || origin['nativeElement'] || origin)
    );
  }
}
