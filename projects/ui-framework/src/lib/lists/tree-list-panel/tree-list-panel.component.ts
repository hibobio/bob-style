import {
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import {
  Overlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayRef,
  OverlayConfig,
  FlexibleConnectedPositionStrategy,
  ConnectedOverlayPositionChange,
} from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { SelectType } from '../list.enum';
import { Subscription, race } from 'rxjs';
import { OverlayPositionClasses } from '../../types';
import { TemplatePortal } from '@angular/cdk/portal';
import { outsideZone } from '../../services/utils/rxjs.operators';
import {
  throttleTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
} from 'rxjs/operators';
import isEqual from 'lodash/isEqual';
import { UtilsService } from '../../services/utils/utils.service';
import { isKey, hasChanges } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { ScrollEvent } from '../../services/utils/utils.interface';
import { ListFooterActions } from '../list.interface';
import {
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
} from '../tree-list/tree-list.interface';
import { BTL_KEYMAP_DEF } from '../tree-list/tree-list.const';

@Component({
  selector: 'b-tree-list-panel',
  templateUrl: './tree-list-panel.component.html',
  styleUrls: ['./tree-list-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListPanelComponent
  implements TreeListComponentIO, OnChanges, OnDestroy {
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService,
    public DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {}

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = false;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: true,
    cancel: true,
    clear: true,
    reset: false,
  };
  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input() panelClass: string;
  @Input() hasArrow = true;

  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  private panelClassList: string[] = ['b-select-panel', 'b-tree-list-panel'];
  private subscribtions: Subscription[] = [];
  public positionClassList: OverlayPositionClasses = {};
  public overlayRef: OverlayRef;
  private panelConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public panelOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['disabled'])) {
      this.destroyPanel();
    }
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  public openPanel(): void {
    if (!this.overlayRef && !this.disabled && !this.panelOpen) {
      this.panelOpen = true;
      this.panelConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.panelConfig);
      this.templatePortal = new TemplatePortal(
        this.templateRef,
        this.viewContainerRef
      );

      this.overlayRef.attach(this.templatePortal);
      this.overlayRef.updatePosition();

      const inputWidth = this.overlayOrigin.elementRef.nativeElement
        .offsetWidth;
      this.overlayRef.updateSize({
        width: inputWidth,
        height: 360,
      });

      const panelElem = this.overlayRef.overlayElement
        .children[0] as HTMLElement;
      this.DOM.setCssProps(panelElem, {
        '--input-width': inputWidth + 'px',
      });

      if (this.opened.observers.length > 0) {
        this.opened.emit(this.overlayRef);
      }

      this.subscribtions.push(
        (this.panelConfig
          .positionStrategy as FlexibleConnectedPositionStrategy).positionChanges
          .pipe(
            throttleTime(200, undefined, {
              leading: true,
              trailing: true,
            }),
            distinctUntilChanged(isEqual)
          )
          .subscribe((change: ConnectedOverlayPositionChange) => {
            this.positionClassList = this.panelPositionService.getPositionClassList(
              change
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
          })
      );

      this.subscribtions.push(
        race(
          this.overlayRef.backdropClick(),
          this.utilsService.getWindowKeydownEvent().pipe(
            outsideZone(this.zone),
            filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
          ),
          this.utilsService.getResizeEvent().pipe(outsideZone(this.zone)),
          this.utilsService.getScrollEvent().pipe(
            outsideZone(this.zone),
            throttleTime(50, undefined, {
              leading: true,
              trailing: true,
            }),
            map((e: ScrollEvent) => e.scrollY),
            pairwise(),
            filter(
              (scrollArr: number[]) =>
                Math.abs(scrollArr[0] - scrollArr[1]) > 20
            )
          )
        ).subscribe(() => {
          this.zone.run(() => {
            this.onApply();
          });
        })
      );
    }
  }

  public closePanel(): void {
    this.destroyPanel();
  }

  public onApply(): void {
    if (this.apply.observers.length > 0) {
      this.apply.emit();
    }
    this.destroyPanel();
  }

  public onCancel(): void {
    if (this.cancel.observers.length > 0) {
      this.cancel.emit();
    }
    this.destroyPanel();
  }

  public onSelect(value: TreeListValue): void {
    this.changed.emit(value);
  }

  protected destroyPanel(): void {
    this.panelOpen = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.panelConfig = {};
      this.templatePortal = null;
      this.overlayRef = null;

      this.subscribtions.forEach(sub => {
        sub.unsubscribe();
        sub = null;
      });
      this.subscribtions = [];

      if (this.closed.observers.length > 0) {
        this.closed.emit();
      }
    }
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getPanelClass(): string[] {
    return [
      ...this.panelClassList,
      this.hasArrow ? 'b-select-panel-with-arrow' : null,
      this.panelClass,
    ].filter(Boolean);
  }

  private getConfig(): OverlayConfig {
    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: this.getPanelClass(),
      positionStrategy: this.panelPositionService.getPanelPositionStrategy(
        this.overlayOrigin,
        this.panelPosition
      ),
      scrollStrategy: this.panelPositionService.getScrollStrategy(),
    };
  }
}
