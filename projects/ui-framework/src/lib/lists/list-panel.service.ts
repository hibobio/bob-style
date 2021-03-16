import {
  Injectable,
  NgZone,
  ViewContainerRef,
  TemplateRef,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import {
  CdkOverlayOrigin,
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { throttleTime, filter, map, pairwise, tap } from 'rxjs/operators';
import { race, Subscription } from 'rxjs';
import { Keys } from '../enums';
import { ScrollEvent } from '../services/utils/utils.interface';
import { MobileService } from '../services/utils/mobile.service';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { UtilsService } from '../services/utils/utils.service';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { OverlayPositionClasses } from '../types';
import { filterKey } from '../services/utils/rxjs.operators';
import { PanelService } from '../popups/panel/panel.service';
import { CreatePanelConfig, Panel } from '../popups/panel/panel.interface';
import { BackdropClickMode } from './list.enum';
import { unsubscribeArray } from '../services/utils/functional-utils';

export interface OverlayEnabledComponent {
  viewContainerRef: ViewContainerRef;
  overlayOrigin: CdkOverlayOrigin;
  templateRef: TemplateRef<unknown>;
  panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  cd: ChangeDetectorRef;
  subscribtions?: Subscription[];
  subs?: Subscription[];
  panelClassList: string[];
  positionClassList: OverlayPositionClasses;

  backdropClickMode?: BackdropClickMode;

  panel: Panel;
  panelOpen: boolean;

  disabled?: boolean;
  hasArrow?: boolean;
  isMobile?: boolean;
  panelClass?: string;
  opened?: EventEmitter<OverlayRef>;
  closed?: EventEmitter<void>;

  onApply?: () => void;
  onCancel?: () => void;
  closePanel?: () => void;
}

export interface ListOpenPanelConfig extends Partial<CreatePanelConfig> {
  self: OverlayEnabledComponent;
  subs?: Subscription[];
  backdropClickMode?: BackdropClickMode;
}

@Injectable({
  providedIn: 'root',
})
export class ListPanelService {
  constructor(
    private mobileService: MobileService,
    private panelService: PanelService,
    private DOM: DOMhelpers,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  public openPanel(config: ListOpenPanelConfig): Panel {
    const { self } = config;

    if (self.panel || self.disabled || self.panelOpen) {
      return self.panel;
    }

    const {
      subs = self.subscribtions || self.subs || (self.subs = []),
      hasBackdrop,
      backdropClickMode = self.backdropClickMode || BackdropClickMode.apply,
    } = config;

    const panel = this.panelService.createPanel({
      ...config,

      origin: self.overlayOrigin,
      viewContainerRef: self.viewContainerRef,
      templateRef: self.templateRef,
      position: self.panelPosition,

      panelClass: [
        ...self.panelClassList,
        self.hasArrow ? 'b-select-panel-with-arrow' : 'b-select-panel-no-arrow',
        self.panelClass,
      ].filter(Boolean),
      backdropClass: [
        'b-select-backdrop',
        hasBackdrop === true && 'clickable',
      ].filter(Boolean),

      openOnHover: false,
      hasBackdrop: hasBackdrop !== false,
      showBackdrop: true,
    });

    const inputWidth = panel.overlayOrigin.elementRef.nativeElement.offsetWidth;
    panel.overlayRef.updateSize({
      width: inputWidth,
      height: 360,
    });

    const panelElem = panel.overlayRef.overlayElement
      .children[0] as HTMLElement;
    this.DOM.setCssProps(panelElem, {
      '--input-width': inputWidth + 'px',
    });

    subs.push(
      //
      panel.positionClasses$.subscribe((positionClassList) => {
        self.positionClassList = positionClassList;
        if (!self.cd['destroyed']) {
          self.cd.detectChanges();
        }
      }),

      race(
        panel.backdropClick$.pipe(
          filter(() => backdropClickMode !== BackdropClickMode.cancel)
        ),

        this.utilsService.getResizeEvent(true).pipe(
          tap(() => {
            self.isMobile = this.mobileService.isMobile();
          }),
          filter(() => !self.isMobile)
        ),

        this.utilsService.getScrollEvent(true).pipe(
          filter(() => !self.isMobile),
          throttleTime(50, undefined, {
            leading: true,
            trailing: true,
          }),
          map((e: ScrollEvent) => e.scrollY),
          pairwise(),
          filter(
            (scrollArr: number[]) => Math.abs(scrollArr[0] - scrollArr[1]) > 20
          )
        )
        //
      ).subscribe(() => {
        this.zone.run(() => {
          self[
            self.onApply
              ? 'onApply'
              : self.closePanel
              ? 'closePanel'
              : 'destroyPanel'
          ]();
        });
      })
    );

    subs.push(
      //
      race(
        panel.backdropClick$.pipe(
          filter(() => backdropClickMode === BackdropClickMode.cancel)
        ),

        this.utilsService
          .getWindowKeydownEvent(true)
          .pipe(filterKey(Keys.escape))
        //
      ).subscribe(() => {
        self[
          self.onCancel
            ? 'onCancel'
            : self.closePanel
            ? 'closePanel'
            : 'destroyPanel'
        ]();
      })
    );

    self.panelOpen = true;
    self.opened?.emit(panel.overlayRef);

    return panel;
  }

  public destroyPanel({
    self,
    skipEmit = false,
  }: {
    self: OverlayEnabledComponent;
    skipEmit?: boolean;
  }): null {
    self.panelOpen = false;

    if (!self.panel) {
      return null;
    }

    this.panelService.destroyPanel(self.panel);

    self.subscribtions && unsubscribeArray(self.subscribtions);
    self.subs && unsubscribeArray(self.subs);

    if (!self.cd['destroyed']) {
      self.cd.detectChanges();
    }

    if (!skipEmit) {
      self.closed?.emit();
    }

    return null;
  }
}
