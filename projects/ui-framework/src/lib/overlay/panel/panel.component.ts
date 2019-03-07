import { Component, Input, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import invoke from 'lodash/invoke';
import { PanelPositionService } from './panel-position.service';
import { Subscription } from 'rxjs';
import { PanelSize } from './panel.enum';
import concat from 'lodash/concat';
import compact from 'lodash/compact';
import get from 'lodash/get';

@Component({
  selector: 'b-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.scss'],
})

export class PanelComponent implements OnDestroy {

  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;

  @Input() panelClass: string;
  @Input() panelSize = PanelSize.medium;
  @Input() showBackdrop = true;

  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;
  positionClassList: { [key: string]: boolean } = {};

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  openPanel(): void {
    this.panelConfig = this.getConfig();
    this.overlayRef = this.overlay.create(this.panelConfig);
    this.templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.overlayRef.attach(this.templatePortal);

    this.overlayRef.updatePosition();

    this.backdropClickSubscriber = this.overlayRef.backdropClick()
      .subscribe(() => {
        this.destroyPanel();
      });
  }

  closePanel(): void {
    this.destroyPanel();
  }

  private destroyPanel(): void {
    invoke(this.overlayRef, 'dispose');
    invoke(this.backdropClickSubscriber, 'unsubscribe');
    invoke(this.positionChangeSubscriber, 'unsubscribe');
    this.panelConfig = {};
    this.templatePortal = null;
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getDefaultPanelPositionStrategy(this.overlayOrigin);

    this.subscribeToPositions(positionStrategy as FlexibleConnectedPositionStrategy);
    const panelClass = compact(concat(['b-panel'], [get(this, 'panelClass', null)]));
    const backdropClass = this.showBackdrop ? 'b-panel-backdrop' : 'b-panel-backdrop-invisible';

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass,
      panelClass,
      positionStrategy,
      scrollStrategy: this.panelPositionService.getScrollStrategy(),
    };
  }

  private subscribeToPositions(positionStrategy: FlexibleConnectedPositionStrategy): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges
      .subscribe(change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(change);
      });
  }
}
