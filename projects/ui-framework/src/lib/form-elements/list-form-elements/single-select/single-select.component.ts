import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import invoke from 'lodash/invoke';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: ['single-select.component.scss'],
})

export class SingleSelectComponent implements OnInit, OnDestroy {
  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;
  positionClassList: { [key: string]: boolean } = {};
  panelOpen = false;
  selectedValue: any;
  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyPanel();
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

  onSelect(optionId) {
    this.selectedValue = optionId;
    this.destroyPanel();
  }

  private destroyPanel(): void {
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
}
