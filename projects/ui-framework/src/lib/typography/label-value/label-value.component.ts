import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Keys } from '../../enums';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InfoTooltip } from '../../popups/info-tooltip/info-tooltip.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { NgClass } from '../../services/html/html-helpers.interface';
import {
  applyChanges,
  isFunction,
  isKey,
  isObject,
  notFirstChanges,
  objectRemoveEntriesByValue,
} from '../../services/utils/functional-utils';
import { GenericObject } from '../../types';
import { IconPosition, LabelValueType, TextAlign } from './label-value.enum';
import { LabelValue } from './label-value.interface';

@Component({
  selector: 'b-label-value',
  templateUrl: './label-value.component.html',
  styleUrls: ['./label-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelValueComponent implements OnChanges, AfterViewInit {
  constructor(
    private hostRef: ElementRef,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  public iconAfter = false;
  public labelClass: string | string[] | NgClass;
  public labelStyle: GenericObject<string>;
  public valueClass: string | string[] | NgClass;
  public valueStyle: GenericObject<string>;
  public expectChanges = false;
  public tooltipType = TruncateTooltipType.css;

  @Input('labelValue') set setProps(labelValue: LabelValue) {
    if (isObject(labelValue)) {
      Object.assign(this, objectRemoveEntriesByValue(labelValue, [undefined]));
    }
  }

  @Input() label: string | number;
  @Input() value: string | number;
  @Input() labelMaxLines: number;
  @Input() valueMaxLines: number;

  @Input() labelDescription: InfoTooltip;
  @Input() valueDescription: InfoTooltip;

  @Input() icon: Icons;
  @Input() iconPosition: IconPosition = IconPosition.left;
  @Input() iconSize: IconSize;
  @Input() iconColor: IconColor;

  public get mainIcon(): string {
    return this.icon &&
      !this.iconPosition?.includes('label') &&
      !this.iconPosition?.includes('value')
      ? this.icon.replace('b-icon-', '')
      : null;
  }
  public get labelIcon(): string {
    return this.icon && this.iconPosition?.includes('label')
      ? this.icon.replace('b-icon-', '')
      : null;
  }
  public get valueIcon(): string {
    return this.icon && this.iconPosition?.includes('value')
      ? this.icon.replace('b-icon-', '')
      : null;
  }

  @Output() clicked: EventEmitter<
    MouseEvent | KeyboardEvent
  > = new EventEmitter<MouseEvent | KeyboardEvent>();

  public valueClicked: (e: MouseEvent | KeyboardEvent) => void;
  public labelClicked: (e: MouseEvent | KeyboardEvent) => void;
  public iconClicked: (e: MouseEvent | KeyboardEvent) => void;

  @HostBinding('attr.data-type') @Input() type: LabelValueType =
    LabelValueType.one;
  @HostBinding('attr.data-text-align') @Input() textAlign: TextAlign =
    TextAlign.left;
  @HostBinding('attr.data-swap') @Input() swap: boolean;

  @HostBinding('attr.data-icon-position') get iconPos() {
    return this.icon &&
      !this.iconPosition?.includes('label') &&
      !this.iconPosition?.includes('value')
      ? this.iconPosition
      : null;
  }

  @HostBinding('attr.tabindex') get tabInd() {
    return this.clicked.observers.length > 0 ? 0 : null;
  }

  @HostListener('click.outside-zone', ['$event'])
  onClick($event: MouseEvent) {
    this.emitEvents($event);
  }

  @HostListener('keydown.outside-zone', ['$event'])
  onKey($event: KeyboardEvent) {
    if (isKey($event.key, Keys.enter) || isKey($event.key, Keys.space)) {
      this.emitEvents($event);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    this.iconAfter =
      this.iconPosition === IconPosition.label_after ||
      this.iconPosition === IconPosition.value_after;

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.hostRef.nativeElement.dataset.initialized = 'true';
  }

  private emitEvents($event: MouseEvent | KeyboardEvent): void {
    if (
      ($event.target as HTMLElement).className.includes('blv-value') &&
      isFunction(this.valueClicked)
    ) {
      $event.stopPropagation();
      this.zone.run(() => {
        this.valueClicked($event);
      });
    } else if (
      ($event.target as HTMLElement).className.includes('blv-label') &&
      isFunction(this.labelClicked)
    ) {
      $event.stopPropagation();
      this.zone.run(() => {
        this.labelClicked($event);
      });
    } else if (
      ($event.target as HTMLElement).className.includes('blv-icon') &&
      isFunction(this.iconClicked)
    ) {
      $event.stopPropagation();
      this.zone.run(() => {
        this.iconClicked($event);
      });
    }
    if (this.clicked.observers.length > 0) {
      $event.stopPropagation();
      this.zone.run(() => {
        this.clicked.emit($event);
      });
    }
  }
}
