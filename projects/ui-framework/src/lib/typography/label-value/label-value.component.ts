import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  Output,
  HostListener,
  EventEmitter,
  NgZone
} from '@angular/core';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-label-value',
  templateUrl: './label-value.component.html',
  styleUrls: ['./label-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelValueComponent {
  constructor(private zone: NgZone) {}

  readonly iconPositions = IconPosition;
  readonly iconSizes = IconSize;

  @Input() label: string | number;
  @Input() value: string | number;
  @Input() icon: Icons;
  @Input() iconPosition: IconPosition = IconPosition.left;
  @Input() iconSize: IconSize;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() valueClicked: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();
  @Output() labelClicked: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();

  @HostBinding('attr.data-type') @Input() type: LabelValueType =
    LabelValueType.one;
  @HostBinding('attr.data-text-align') @Input() textAlign: TextAlign =
    TextAlign.left;

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
    }
    if (this.clicked.observers.length > 0) {
      this.zone.run(() => {
        this.clicked.emit($event);
      });
    }
  }
}
