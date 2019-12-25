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
} from '@angular/core';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { Icons, IconSize } from '../../icons/icons.enum';
import {
  isKey,
  applyChanges,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-label-value',
  templateUrl: './label-value.component.html',
  styleUrls: ['./label-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelValueComponent implements OnChanges {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  public iconAfter = false;

  readonly iconPositions = IconPosition;
  readonly iconSizes = IconSize;
  readonly tooltipType = TruncateTooltipType;

  @Input() label: string | number;
  @Input() value: string | number;
  @Input() labelMaxLines: number;
  @Input() valueMaxLines: number;
  @Input() expectChanges = false;

  @Input() icon: Icons;
  @Input() iconPosition: IconPosition = IconPosition.left;
  @Input() iconSize: IconSize;

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

  @HostBinding('attr.data-type') @Input() type: LabelValueType =
    LabelValueType.one;
  @HostBinding('attr.data-text-align') @Input() textAlign: TextAlign =
    TextAlign.left;
  @HostBinding('attr.data-swap') @Input() swap: boolean;

  @HostBinding('attr.data-icon-position') get iconPos() {
    return this.icon &&
      this.iconPosition !== this.iconPositions.label &&
      this.iconPosition !== this.iconPositions.value
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

    if (changes.iconPosition) {
      this.iconAfter =
        this.iconPosition === this.iconPositions.label_after ||
        this.iconPosition === this.iconPositions.value_after;

      this.iconPosition =
        this.iconPosition === this.iconPositions.label_after
          ? this.iconPositions.label
          : this.iconPosition === this.iconPositions.value_after
          ? this.iconPositions.value
          : this.iconPosition;
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
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
