import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { chain, invoke, includes } from 'lodash';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { SelectGroupOption } from '../../select';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseFormElement } from '../../base-form-element';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.scss'],
})

export class MultiSelectComponent extends BaseFormElement implements OnInit, OnDestroy {

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number)[] = [];
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;

  positionClassList: { [key: string]: boolean } = {};
  panelOpen = false;
  triggerValue: any;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly listElHeight = LIST_EL_HEIGHT;

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
    super();
  }

  ngOnInit(): void {
    this.triggerValue = this.getTriggerValue(this.value);
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

  onSelect(value): void {
    this.value = value;
    this.triggerValue = this.getTriggerValue(this.value);
    this.selectChange.emit(this.value);
  }

  cancelSelection(): void {
    console.log('cancel');
  }

  notifySelectionIds(): void {
    console.log('notify');
  }

  private getTriggerValue(value: (string | number)[]): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => includes(value, option.id))
      .map('value')
      .join(', ')
      .value();
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
