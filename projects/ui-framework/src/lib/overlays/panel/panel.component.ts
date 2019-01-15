import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'b-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.scss'],
})

export class PanelComponent {

  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  openPanel(): void {
    const panelConfig: OverlayConfig = this.getDefaultConfig();
    const overlayRef: OverlayRef = this.overlay.create(panelConfig);
    const templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    overlayRef.attach(templatePortal);

    overlayRef.backdropClick()
      .subscribe(() => {
        overlayRef.dispose();
      });
  }

  private getDefaultConfig(): OverlayConfig {
    const strategy = this.overlay.position().connectedTo(
        this.overlayOrigin.elementRef,
        {originX: 'start', originY: 'bottom'},
        {overlayX: 'start', overlayY: 'top'} );

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      panelClass: ['b-panel'],
      positionStrategy: strategy,
    };
  }
}
