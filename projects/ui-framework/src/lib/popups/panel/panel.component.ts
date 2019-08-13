import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
  Output,
  NgZone
} from '@angular/core';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { PanelPositionService } from './panel-position-service/panel-position.service';
import { Subscription } from 'rxjs';
import { PanelDefaultPosVer, PanelSize } from './panel.enum';
import { concat, compact, get, invoke, debounce } from 'lodash';
import { UtilsService } from '../../services/utils/utils.service';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';

const HOVER_DELAY_DURATION = 300;

@Component({
  selector: 'b-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {
  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @Input() panelClass: string;
  @Input() size = PanelSize.medium;
  @Input() showBackdrop = true;
  @Input() defaultPosVer = PanelDefaultPosVer.above;
  @Input() openOnHover = false;

  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;
  readonly mouseEnterDebounce: any;
  readonly mouseLeaveDebounce: any;
  positionClassList: { [key: string]: boolean } = {};
  private windowKeydownSubscriber: Subscription;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {
    this.mouseEnterDebounce = debounce(this.openPanel, HOVER_DELAY_DURATION);
    this.mouseLeaveDebounce = debounce(this.closePanel, HOVER_DELAY_DURATION);
  }

  ngOnInit(): void {
    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent()
      .pipe(
        outsideZone(this.zone),
        filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
      )
      .subscribe(() => {
        this.closePanel();
      });
  }

  ngOnDestroy(): void {
    if (this.windowKeydownSubscriber) {
      this.windowKeydownSubscriber.unsubscribe();
    }
    this.destroyPanel();
  }

  onTriggerClick(): void {
    this.openPanel();
  }

  onMouseEnter(): void {
    this.mouseLeaveDebounce.cancel();
    if (!this.overlayRef) {
      this.mouseEnterDebounce();
    }
  }

  onMouseLeave(): void {
    this.mouseEnterDebounce.cancel();
    if (this.overlayRef) {
      this.mouseLeaveDebounce();
    }
  }

  openPanel(): void {
    this.panelConfig = this.getConfig();
    this.overlayRef = this.overlay.create(this.panelConfig);
    this.templatePortal = new TemplatePortal(
      this.templateRef,
      this.viewContainerRef
    );
    this.overlayRef.attach(this.templatePortal);

    this.overlayRef.updatePosition();

    this.backdropClickSubscriber = this.overlayRef
      .backdropClick()
      .subscribe(() => {
        this.destroyPanel();
      });
  }

  closePanel(): void {
    this.destroyPanel();
  }

  private destroyPanel(): void {
    if (this.overlayRef) {
      invoke(this.overlayRef, 'dispose');
      invoke(this.backdropClickSubscriber, 'unsubscribe');
      invoke(this.positionChangeSubscriber, 'unsubscribe');
      this.panelConfig = {};
      this.templatePortal = null;
      this.overlayRef = null;
      this.closed.emit();
    }
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getPanelPositionStrategy(
      this.overlayOrigin,
      this.defaultPosVer
    );

    this.subscribeToPositions(positionStrategy);

    const panelClass = compact(
      concat(['b-panel'], [get(this, 'panelClass', null)])
    );
    const backdropClass = this.openOnHover
      ? 'b-panel-backdrop-disabled'
      : this.showBackdrop
      ? 'b-panel-backdrop'
      : 'b-panel-backdrop-invisible';

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass,
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
