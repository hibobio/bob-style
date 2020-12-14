import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  Output,
  HostListener,
  EventEmitter,
  NgZone,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  isKey,
  applyChanges,
  notFirstChanges,
  hasChanges,
  isObject,
  objectRemoveEntriesByValue,
  isFunction,
} from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { LabelValue } from './label-value.interface';
import { InfoTooltip } from '../../popups/info-tooltip/info-tooltip.interface';

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
  public iconClass: string;
  public labelClass: string;
  public valueClass: string;

  readonly iconPositions = IconPosition;
  readonly iconSizes = IconSize;

  @Input('labelValue') set setProps(labelValue: LabelValue) {
    if (isObject(labelValue)) {
      Object.assign(this, objectRemoveEntriesByValue(labelValue, [undefined]));
    }
  }

  @Input() label: string | number;
  @Input() value: string | number;
  @Input() labelMaxLines: number;
  @Input() valueMaxLines: number;
  @Input() expectChanges = false;
  @Input() tooltipType = TruncateTooltipType.css;
  @Input() labelDescription: InfoTooltip;

  @Input() icon: Icons;
  @Input() iconPosition: IconPosition = IconPosition.left;
  @Input() iconSize: IconSize;
  @Input() iconColor: IconColor;

  @Output() clicked: EventEmitter<
    MouseEvent | KeyboardEvent
  > = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() valueClicked: EventEmitter<
    MouseEvent | KeyboardEvent
  > = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() labelClicked: EventEmitter<
    MouseEvent | KeyboardEvent
  > = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() iconClicked: EventEmitter<
    MouseEvent | KeyboardEvent
  > = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.data-type') @Input() type: LabelValueType =
    LabelValueType.one;
  @HostBinding('attr.data-text-align') @Input() textAlign: TextAlign =
    TextAlign.left;
  @HostBinding('attr.data-swap') @Input() swap: boolean;

  @HostBinding('attr.data-icon-position') get iconPos() {
    return this.icon &&
      this.iconPosition !== IconPosition.label &&
      this.iconPosition !== IconPosition.value
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

    if (hasChanges(changes, ['icon', 'iconSize', 'iconPosition'])) {
      this.iconAfter =
        this.iconPosition === this.iconPositions.label_after ||
        this.iconPosition === this.iconPositions.value_after;

      this.iconPosition =
        this.iconPosition === this.iconPositions.label_after
          ? this.iconPositions.label
          : this.iconPosition === this.iconPositions.value_after
          ? this.iconPositions.value
          : this.iconPosition;

      this.iconClass =
        this.icon +
        (this.iconSize ? ' b-icon-' + this.iconSize : ' b-icon-large');

      this.labelClass =
        this.icon && this.iconPosition === IconPosition.label
          ? this.icon +
            (this.iconSize ? ' b-icon-' + this.iconSize : ' b-icon-small') +
            (this.labelClicked.observers.length ? ' has-hover' : '') +
            (this.iconAfter ? ' icon-after' : '')
          : null;

      this.valueClass =
        this.icon && this.iconPosition === IconPosition.value
          ? this.icon +
            (this.iconSize ? ' b-icon-' + this.iconSize : ' b-icon-small') +
            (this.valueClicked.observers.length ? ' has-hover' : '') +
            (this.iconAfter ? ' icon-after' : '')
          : null;
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.hostRef.nativeElement.dataset.initialized = 'true';
  }

  onTooltipLinkClick(): void {
    if (isFunction(this.labelDescription.linkClicked)) {
      this.labelDescription.linkClicked();
    }
    if (this.linkClicked.observers.length > 0) {
      this.linkClicked.emit();
    }
  }

  private emitEvents($event: MouseEvent | KeyboardEvent): void {
    if (
      ($event.target as HTMLElement).className.includes('blv-value') &&
      this.valueClicked.observers.length > 0
    ) {
      this.zone.run(() => {
        this.valueClicked.emit($event);
      });
    } else if (
      ($event.target as HTMLElement).className.includes('blv-label') &&
      this.labelClicked.observers.length > 0
    ) {
      this.zone.run(() => {
        this.labelClicked.emit($event);
      });
    } else if (
      ($event.target as HTMLElement).className.includes('blv-icon') &&
      this.iconClicked.observers.length > 0
    ) {
      this.zone.run(() => {
        this.iconClicked.emit($event);
      });
    }
    if (this.clicked.observers.length > 0) {
      this.zone.run(() => {
        this.clicked.emit($event);
      });
    }
  }
}
