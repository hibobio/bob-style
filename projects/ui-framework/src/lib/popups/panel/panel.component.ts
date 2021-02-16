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
  ElementRef,
} from '@angular/core';
import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { PanelDefaultPosVer, PanelSize } from './panel.enum';
import { debounce } from 'lodash';
import { UtilsService } from '../../services/utils/utils.service';
import { unsubscribeArray } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { OverlayPositionClasses } from '../../types';
import { PanelService } from './panel.service';
import { Panel } from './panel.interface';
import { filterKey } from '../../services/utils/rxjs.operators';

const HOVER_DELAY_DURATION = 300;

@Component({
  selector: 'b-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private utilsService: UtilsService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private service: PanelService
  ) {}

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;

  @ViewChild('templateRef', { static: true })
  templateRef: TemplateRef<any>;

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

  public panel: Panel;
  public positionClassList: OverlayPositionClasses = {};
  public mouseEnterDebounce: any;
  public mouseLeaveDebounce: any;
  private subs: Subscription[] = [];

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  @Input('overlayOrigin') set setOverlayOrigin(
    origin: HTMLElement | ElementRef<HTMLElement>
  ) {
    this.overlayOrigin =
      this.service.getOverlayOrigin(origin) || this.overlayOrigin;
  }

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
    this.mouseLeaveDebounce?.cancel();
    if (!this.panel) {
      this.mouseEnterDebounce();
    }
  }

  onMouseLeave(): void {
    this.mouseEnterDebounce?.cancel();
    if (this.panel) {
      this.mouseLeaveDebounce();
    }
  }

  openPanel(): void {
    if (!this.disabled && !this.panel) {
      //
      this.panel = this.service.createPanel({
        origin: this.overlayOrigin,
        viewContainerRef: this.viewContainerRef,
        templateRef: this.templateRef,
        position: this.defaultPosVer,
        openOnHover: this.openOnHover,
        hasBackdrop: true,
        showBackdrop: this.showBackdrop,
        panelClass: ['b-panel', this.panelClass],
        backdropClass: this.backdropClass,
      });

      this.subs.push(
        this.panel?.backdropClick$.subscribe(() => {
          this.destroyPanel();
        }),

        this.utilsService
          .getWindowKeydownEvent(true)
          .pipe(filterKey(Keys.escape))
          .subscribe(() => {
            this.zone.run(() => {
              this.destroyPanel();
            });
          }),

        this.panel?.positionClasses$.subscribe((positionClassList) => {
          this.positionClassList = positionClassList;

          if (!this.cd['destroyed'] && this.panel) {
            this.cd.detectChanges();
          }

          this.positionChanged.emit(this.positionClassList);
        })
      );

      this.opened.emit(this.panel?.overlayRef);
    }
  }

  closePanel(): void {
    this.destroyPanel();
  }

  private destroyPanel(): void {
    this.mouseEnterDebounce?.cancel();
    this.mouseLeaveDebounce?.cancel();

    if (this.panel) {
      this.service.destroyPanel(this.panel);
      unsubscribeArray(this.subs);
      this.panel = undefined;
      this.closed.emit();
    }
  }
}
