import { Subscription } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { ColorService } from '../../services/color-service/color.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  applyChanges,
  cloneObject,
  hasChanges,
  notFirstChanges,
  simpleUID,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { CollapsibleOptions } from './collapsible-section.interface';

export const COLLAPSIBLE_OPTIONS_DEF: CollapsibleOptions = {
  smallTitle: false,
  titlesAsColumn: true,
  headerTranscludeStopPropagation: false,
};

@Component({
  selector: 'b-collapsible-section',
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleSectionComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private colorService: ColorService
  ) {}

  public hasHeaderContent = true;
  public hasPanelContent = true;
  public hasFooterContent = true;
  public contentLoaded = false;
  public startsExpanded = false;
  public expandedFirst = false;

  private contentHeight = 0;
  private resizeSubscription: Subscription;

  @Input() panelID: string | number = simpleUID('bcp');
  @Input() collapsible = false;

  @Input() expanded = false;
  @Input() disabled = false;
  @Input() divided = true;

  @Input() title: string;
  @Input() description?: string;

  @Input() options: CollapsibleOptions = cloneObject(COLLAPSIBLE_OPTIONS_DEF);
  @Input() disableAnimation = false;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() openedFirst: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('headerContent') headerContent: ElementRef;
  @ViewChild('panelContent') panelContent: ElementRef;
  @ViewChild('footerContent') footerContent: ElementRef;

  @HostBinding('attr.data-animation-disabled') get animationDisabled() {
    return this.options.disableAnimation || this.disableAnimation || null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        options: cloneObject(COLLAPSIBLE_OPTIONS_DEF),
      },
      [],
      true
    );

    if (hasChanges(changes, ['options'])) {
      this.options = {
        ...COLLAPSIBLE_OPTIONS_DEF,
        ...this.options,
      };

      if (this.options.indicatorColor) {
        const colorRGB = this.colorService.parseToRGB(
          this.options.indicatorColor
        );

        if (colorRGB) {
          this.DOM.setCssProps(this.host.nativeElement, {
            '--bcp-color': this.options.indicatorColor,
            '--bcp-color-rgb': this.colorService
              .parseToRGB(this.options.indicatorColor)
              .join(', '),
          });
        }
      }
    }

    if (hasChanges(changes, ['expanded'])) {
      if (!changes.expanded.firstChange) {
        this.togglePanel(this.expanded);
      } else {
        this.startsExpanded = this.expanded;
      }
    }

    if (notFirstChanges(changes, ['panelID'])) {
      this.disableAnimation = true;
      this.cd.detectChanges();

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.disableAnimation = false;
          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }, 0);
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.resizeSubscription = this.utilsService
      .getResizeEvent(true)
      .subscribe(() => {
        if (this.collapsible) {
          this.setCssVars();
        }
      });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      if (this.expanded) {
        this.setCssVars(true);
      }
      setTimeout(() => {
        this.hasHeaderContent = !this.DOM.isEmpty(
          this.headerContent.nativeElement
        );
        if (!this.collapsible) {
          this.hasFooterContent =
            this.footerContent &&
            !this.DOM.isEmpty(this.footerContent.nativeElement);
        }
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  togglePanel(state = null): void {
    if (this.collapsible && !this.disabled) {
      this.startsExpanded = false;

      if (!this.contentLoaded) {
        this.contentLoaded = true;
        this.expandedFirst = true;
        this.cd.detectChanges();

        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.hasFooterContent =
              this.footerContent &&
              !this.DOM.isEmpty(this.footerContent.nativeElement);
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
          }, 0);
        });
      }

      if (!this.contentHeight) {
        this.zone.runOutsideAngular(() => {
          this.setCssVars(true);
        });
      }

      this.expanded = typeof state === 'boolean' ? state : !this.expanded;
      this.cd.detectChanges();

      this.emitEvent();
    }
  }

  private setCssVars(repeat = false): void {
    if (this.panelContent) {
      this.contentHeight =
        this.panelContent.nativeElement.scrollHeight +
        (this.footerContent?.nativeElement.scrollHeight || 0);

      this.contentHeight = this.contentHeight > 100 ? this.contentHeight : 500;

      this.DOM.setCssProps(this.host.nativeElement, {
        '--panel-height': this.contentHeight + 'px',
      });
    }

    if (repeat) {
      // to allow for transcluded component(s) to render
      setTimeout(() => {
        this.setCssVars();
      }, 3000);
    }
  }

  private emitEvent(): void {
    if (this.expanded && this.expandedFirst && this.openedFirst.observers) {
      this.expandedFirst = false;
      this.openedFirst.emit();
    }
    if (this.expanded && !this.expandedFirst && this.opened.observers) {
      this.opened.emit();
    }
    if (!this.expanded && this.closed.observers) {
      this.closed.emit();
    }
  }
}
