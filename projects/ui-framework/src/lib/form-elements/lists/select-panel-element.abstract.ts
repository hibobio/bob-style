import {
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import invoke from 'lodash/invoke';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseFormElement } from '../base-form-element';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

export abstract class BaseSelectPanelElement extends BaseFormElement
  implements AfterViewInit {
  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild('prefix', { static: false }) prefix: ElementRef;

  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;

  showPrefix = true;
  positionClassList: { [key: string]: boolean } = {};
  panelOpen = false;
  triggerValue: any;
  panelClassList: string[] = [];

  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;

  protected constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.showPrefix = this.prefix && !this.DOM.isEmpty(this.prefix.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  openPanel(): void {
    this.panelOpen = true;
    this.panelConfig = this.getDefaultConfig();
    this.overlayRef = this.overlay.create(this.panelConfig);
    this.templatePortal = new TemplatePortal(
      this.templateRef,
      this.viewContainerRef
    );
    this.overlayRef.attach(this.templatePortal);

    this.overlayRef.updatePosition();
    this.overlayRef.updateSize({
      width: this.overlayOrigin.elementRef.nativeElement.offsetWidth
    });

    const searchInput = this.overlayRef.overlayElement.querySelector(
      'b-search .bfe-input'
    ) as HTMLElement;
    if (searchInput) {
      searchInput.focus();
    }

    this.backdropClickSubscriber = this.overlayRef
      .backdropClick()
      .subscribe(() => {
        this.onCancel();
      });
  }

  onCancel(): void {
    this.destroyPanel();
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
    const positionStrategy = this.panelPositionService.getCenterPanelPositionStrategy(
      this.overlayOrigin
    );

    this.subscribeToPositions(
      positionStrategy as FlexibleConnectedPositionStrategy
    );

    const panelClass = [
      ...this.panelClassList,
      'b-select-panel',
      this.isQuickFilter ? 'b-quick-filter-panel' : null,
    ]
      .filter(Boolean);

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass,
      positionStrategy,
      scrollStrategy: this.panelPositionService.getScrollStrategy()
    };
  }

  private subscribeToPositions(
    positionStrategy: FlexibleConnectedPositionStrategy
  ): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges.subscribe(
      change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(
          change
        );
      }
    );
  }
}
