import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { invoke, isEmpty } from 'lodash';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { InputEvent } from '../../form-elements/input/input.interface';
import { InputEventType } from '../../form-elements/input/input.enum';
import { AutoCompleteOption } from './auto-complete.interface';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnDestroy {

  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef') templateRef: TemplateRef<any>;

  @Input() label: string;
  @Input() options: AutoCompleteOption[];
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter<AutoCompleteOption>();

  positionClassList: { [key: string]: boolean } = {};
  searchValue: string;

  private panelOpen = false;
  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private positionChangeSubscriber: Subscription;

  readonly blurDestroyDuration = 200;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
  ) {
  }

  onSearchChange(searchVal: string): void {
    this.searchValue = searchVal;
    if (this.searchValue.length > 0) {
      this.invokePanelOpen();
    } else {
      this.invokePanelDestroy();
    }
    this.searchChange.emit(this.searchValue);
  }

  onInputChange(inputEvent: InputEvent): void {
    if (inputEvent.event === InputEventType.onBlur) {
      setTimeout(() => {
        this.invokePanelDestroy();
      }, this.blurDestroyDuration);
    }
    if (inputEvent.event === InputEventType.onFocus && (inputEvent.value as string).length > 0) {
      this.invokePanelOpen();
    }
  }

  onOptionSelect(option: AutoCompleteOption): void {
    this.optionSelect.emit(option);
    this.destroyPanel();
  }

  private invokePanelOpen(): void {
    if (!this.panelOpen && this.options.length > 0) {
      this.openPanel();
    }
  }

  private invokePanelDestroy(): void {
    if (this.panelOpen) {
      this.destroyPanel();
    }
  }

  private openPanel(): void {
    this.panelOpen = true;
    this.panelConfig = this.getConfig();
    this.overlayRef = this.overlay.create(this.panelConfig);
    this.templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.overlayRef.attach(this.templatePortal);

    this.overlayRef.updatePosition();
    this.overlayRef.updateSize({
      width: this.overlayOrigin.elementRef.nativeElement.offsetWidth,
    });
  }

  private destroyPanel(): void {
    this.panelOpen = false;
    invoke(this.overlayRef, 'dispose');
    invoke(this.positionChangeSubscriber, 'unsubscribe');
    this.panelConfig = {};
    this.templatePortal = null;
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getCenterPanelPositionStrategy(this.overlayOrigin);
    this.subscribeToPositions(positionStrategy as FlexibleConnectedPositionStrategy);
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      backdropClass: 'b-select-backdrop',
      panelClass: ['b-auto-complete-panel'],
      positionStrategy,
    };
  }

  private subscribeToPositions(positionStrategy: FlexibleConnectedPositionStrategy): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges
      .subscribe(change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(change);
      });
  }

  ngOnDestroy(): void {
    this.invokePanelDestroy();
  }
}
