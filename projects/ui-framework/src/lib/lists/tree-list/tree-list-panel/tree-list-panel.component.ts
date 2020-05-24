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
} from '@angular/cdk/overlay';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { PanelDefaultPosVer } from '../../../popups/panel/panel.enum';
import { Subscription } from 'rxjs';
import { OverlayPositionClasses } from '../../../types';
import { TemplatePortal } from '@angular/cdk/portal';
import { UtilsService } from '../../../services/utils/utils.service';
import {
  hasChanges,
  notFirstChanges,
  isValuevy,
} from '../../../services/utils/functional-utils';
import { TreeListValue } from '../tree-list.interface';
import { TreeListInputOutput } from '../tree-list-IO.abstract';
import { ListPanelService } from '../../list-panel.service';
import { TreeListPanelIO } from './tree-list-panel.interface';
import { LIST_ACTIONS_DEF } from '../../list-footer/list-footer.const';

@Component({
  selector: 'b-tree-list-panel',
  templateUrl: './tree-list-panel.component.html',
  styleUrls: ['./tree-list-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListPanelComponent extends TreeListInputOutput
  implements TreeListPanelIO, OnChanges, OnDestroy {
  constructor(
    public DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    private listPanelSrvc: ListPanelService,
    // Used by ListPanelService:
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService
  ) {
    super();
    this.focusOnInit = true;
    this.listActions = { ...LIST_ACTIONS_DEF };
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input() panelClass: string;
  @Input() hasArrow = true;

  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  public treeListValue: TreeListValue;

  // Used by ListPanelService:
  private subscribtions: Subscription[] = [];
  private panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};
  public overlayRef: OverlayRef;
  private panelConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public panelOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['disabled'])) {
      this.destroyPanel();
    }

    if (
      notFirstChanges(changes, null, true, {
        falseyCheck: isValuevy,
      }) &&
      !this.cd['destroyed']
    ) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.destroyPanel(true);
  }

  public onSelectChange(value: TreeListValue): void {
    this.treeListValue = value;
    if (this.changed.observers.length > 0) {
      this.changed.emit(value);
    }
  }

  public onApply(): void {
    if (this.treeListValue) {
      this.value = this.treeListValue.selectedIDs || [];
      this.treeListValue = undefined;
      if (this.apply.observers.length > 0) {
        this.apply.emit();
      }
    }
    this.destroyPanel();
  }

  public onCancel(): void {
    if (this.treeListValue) {
      this.treeListValue = undefined;
      if (this.cancel.observers.length > 0) {
        this.cancel.emit();
      }
    }
    this.destroyPanel();
  }

  public openPanel(): void {
    this.listPanelSrvc.openPanel(this);
  }

  public closePanel(): void {
    this.destroyPanel();
  }

  protected destroyPanel(skipEmit = false): void {
    this.listPanelSrvc.destroyPanel(this, skipEmit);

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
