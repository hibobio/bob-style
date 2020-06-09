import {
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
  Output,
  NgZone,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { PanelPositionService } from './panel-position-service/panel-position.service';
import { Subscription } from 'rxjs';
import { PanelDefaultPosVer, PanelSize } from './panel.enum';
import { concat, compact, get, invoke, debounce, isEqual } from 'lodash';
import { UtilsService } from '../../services/utils/utils.service';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { OverlayPositionClasses } from '../../types';
import { outsideZone } from '../../services/utils/rxjs.operators';

const HOVER_DELAY_DURATION = 300;

@Component({
  selector: 'b-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  @ViewChild(CdkOverlayOrigin, { static: true })
  @Input()
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @Input() panelClass: string;
  @Input() backdropClass: string;
  @Input() size = PanelSize.medium;
  @Input() showBackdrop = true;
  @Input() defaultPosVer = PanelDefaultPosVer.above;
  @Input() openOnHover = false;
  @Input() disabled = false;
  @Input() hoverTriggerDelay: number;

  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() positionChanged: EventEmitter<
    OverlayPositionClasses
  > = new EventEmitter<OverlayPositionClasses>();

  private panelConfig: OverlayConfig;
  public overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;
  private windowKeydownSubscriber: Subscription;
  public positionClassList: OverlayPositionClasses = {};
  public mouseEnterDebounce: any;
  public mouseLeaveDebounce: any;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mouseEnterDebounce = debounce(
      this.openPanel,
      this.hoverTriggerDelay || HOVER_DELAY_DURATION
    );
    this.mouseLeaveDebounce = debounce(this.destroyPanel, HOVER_DELAY_DURATION);
  }

  ngOnDestroy(): void {
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
    if (!this.disabled && !this.overlayRef) {
      this.panelConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.panelConfig);
      this.templatePortal = new TemplatePortal(
        this.templateRef,
        this.viewContainerRef
      );

      this.overlayRef.attach(this.templatePortal);
      this.overlayRef.updatePosition();

      this.opened.emit(this.overlayRef);

      this.backdropClickSubscriber = this.overlayRef
        .backdropClick()
        .subscribe(() => {
          this.destroyPanel();
        });

      this.windowKeydownSubscriber = this.utilsService
        .getWindowKeydownEvent()
        .pipe(
          outsideZone(this.zone),
          filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
        )
        .subscribe(() => {
          this.zone.run(() => {
            this.destroyPanel();
          });
        });
    }
  }

  closePanel(): void {
    this.destroyPanel();
  }

  private destroyPanel(): void {
    this.mouseEnterDebounce.cancel();
    this.mouseLeaveDebounce.cancel();
    if (this.overlayRef) {
      invoke(this.overlayRef, 'dispose');
      invoke(this.backdropClickSubscriber, 'unsubscribe');
      invoke(this.positionChangeSubscriber, 'unsubscribe');
      invoke(this.windowKeydownSubscriber, 'unsubscribe');
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
    const backdropClass =
      this.backdropClass ||
      (this.openOnHover
        ? 'b-panel-backdrop-disabled'
        : this.showBackdrop
        ? 'b-panel-backdrop'
        : 'b-panel-backdrop-invisible');

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass,
      panelClass,
      positionStrategy,
      scrollStrategy: this.panelPositionService.getScrollStrategy(),
    };
  }

  private subscribeToPositions(
    positionStrategy: FlexibleConnectedPositionStrategy
  ): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges
      .pipe(distinctUntilChanged(isEqual))
      .subscribe((change) => {
        this.positionClassList = this.panelPositionService.getPositionClassList(
          change
        );

        if (!this.cd['destroyed'] && this.overlayRef) {
          this.cd.detectChanges();
          const elem = this.overlayRef.overlayElement.children[0];
          elem.classList.remove('panel-above', 'panel-below');

          if (this.positionClassList['panel-above']) {
            elem.classList.add('panel-above');
          } else {
            elem.classList.add('panel-below');
          }
        }

        this.positionChanged.emit(this.positionClassList);
      });
  }
}
