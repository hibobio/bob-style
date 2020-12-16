import { CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { race } from 'rxjs';
import { filter, map, tap, throttleTime } from 'rxjs/operators';
import {
  asArray,
  getEventPath,
  invoke,
  isElementRef,
  joinArrays,
} from '../../services/utils/functional-utils';
import { onlyDistinct } from '../../services/utils/rxjs.operators';
import { UtilsService } from '../../services/utils/utils.service';
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
    private utilsService: UtilsService
  ) {}

  createPanel(config: CreatePanelConfig): Panel {
    const panel: Panel = {
      ...config,

      overlayOrigin: this.getOverlayOrigin(config.origin),

      positionStrategy: this.panelPositionService.getPanelPositionStrategy(
        this.getOverlayOrigin(config.origin),
        config.position || PanelDefaultPosVer.above
      ),
      scrollStrategy: this.panelPositionService.getScrollStrategy(),

      disposeOnNavigation: true,
      hasBackdrop: config.hasBackdrop !== false && !config.openOnHover,

      panelClass: joinArrays(['b-panel'], asArray(config.panelClass)),
      backdropClass: joinArrays(
        [
          'b-panel-backdrop',
          config.showBackdrop === false && 'b-panel-backdrop-invisible',
        ].filter(Boolean),
        asArray(config.backdropClass)
      ),
    } as Panel;

    panel.overlayRef = this.overlay.create(panel);

    if (panel.viewContainerRef && panel.templateRef) {
      panel.portal = this.getTemplatePortal(
        panel.templateRef,
        panel.viewContainerRef
      );
      panel.componentRef = this.attachPanel(panel);
    }

    panel.positionClasses$ = panel.positionStrategy.positionChanges.pipe(
      throttleTime(200, undefined, {
        leading: true,
        trailing: true,
      }),
      onlyDistinct(),
      map((change) => this.panelPositionService.getPositionClassList(change)),
      tap((positionClassList) => {
        if (!panel.overlayRef) {
          return;
        }
        const elem = panel.overlayRef.overlayElement.children[0];
        elem.classList.remove('panel-above', 'panel-below');

        if (positionClassList['panel-above']) {
          elem.classList.add('panel-above');
        } else {
          elem.classList.add('panel-below');
        }
      })
    );

    panel.backdropClick$ = race(
      panel.overlayRef.backdropClick(),
      this.utilsService.getWindowClickEvent(true).pipe(
        filter((event: MouseEvent) => {
          return (
            document.contains(panel.overlayRef.overlayElement) &&
            !getEventPath(event).includes(panel.overlayRef.overlayElement) &&
            !getEventPath(event).includes(
              this.getOriginElement(panel.overlayOrigin)
            )
          );
        })
      )
    );

    return panel;
  }

  attachPanel<C = unknown>(
    panel: Panel,
    portal?: ComponentPortal<C> | TemplatePortal<C>
  ): ComponentRef<C> {
    const componetRef = panel.overlayRef.attach(portal || panel.portal);
    panel.overlayRef.updatePosition();
    return componetRef;
  }

  destroyPanel(panel: Panel): void {
    panel.componentRef?.destroy();
    panel.portal?.isAttached && panel.portal.detach();
    invoke(panel.overlayRef, 'dispose');
  }

  getTemplatePortal<C = unknown>(
    template: TemplateRef<C>,
    viewContainerRef: ViewContainerRef,
    context?: C
  ): TemplatePortal<C> {
    return new TemplatePortal(template, viewContainerRef, context);
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
