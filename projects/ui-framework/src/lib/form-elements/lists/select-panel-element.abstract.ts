import { TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import invoke from 'lodash/invoke';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';
import { BaseFormElement } from '../base-form-element';

export abstract class BaseSelectPanelElement extends BaseFormElement {

  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;
  @ViewChild('triggerInput') triggerInput;

  positionClassList: { [key: string]: boolean } = {};
  panelOpen = false;
  triggerValue: any;
  showTriggerTooltip: boolean;

  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;

  protected constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
  ) {
    super();
  }

  openPanel(): void {
    this.panelOpen = true;
    this.panelConfig = this.getDefaultConfig();
    this.overlayRef = this.overlay.create(this.panelConfig);
    this.templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.overlayRef.attach(this.templatePortal);

    this.overlayRef.updatePosition();
    this.overlayRef.updateSize({
      width: this.overlayOrigin.elementRef.nativeElement.offsetWidth,
    });

    this.backdropClickSubscriber = this.overlayRef.backdropClick()
      .subscribe(() => {
        this.destroyPanel();
      });
  }

  destroyPanel(): void {
    this.panelOpen = false;
    invoke(this.overlayRef, 'dispose');
    invoke(this.backdropClickSubscriber, 'unsubscribe');
    invoke(this.positionChangeSubscriber, 'unsubscribe');
    this.panelConfig = {};
    this.templatePortal = null;
  }

  private getDefaultConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getPanelPositionStrategy(this.overlayOrigin);

    this.subscribeToPositions(positionStrategy as FlexibleConnectedPositionStrategy);

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: ['b-select-panel'],
      positionStrategy,
    };
  }

  private subscribeToPositions(positionStrategy: FlexibleConnectedPositionStrategy): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges
      .subscribe(change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(change);
      });
  }

  updateTriggerTooltip(): void {
    setTimeout(() => {
      this.showTriggerTooltip = this.triggerInput.bInput.nativeElement.scrollWidth > this.triggerInput.bInput.nativeElement.offsetWidth;
    });
  }
}
