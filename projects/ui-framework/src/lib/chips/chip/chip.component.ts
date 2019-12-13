import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  HostBinding,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { applyChanges } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-chip, [b-chip]',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnChanges {
  constructor(public chip: ElementRef) {}

  @Input() text: string;
  @Input() removable = false;
  @Input() icon: Icons;

  @HostBinding('attr.data-type') @Input() type: ChipType = ChipType.tag;
  @HostBinding('attr.data-disabled') @Input() disabled = false;
  @HostBinding('attr.data-selected') @Input() selected = false;

  @Output() removed: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly chipType = ChipType;
  readonly icons = Icons;
  readonly iconSize = IconSize;

  public removeIconColor: IconColor;

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        type: ChipType.tag,
      },
      [],
      true
    );

    if (changes.type || changes.icon) {
      const chipEl = this.chip.nativeElement as HTMLElement;

      if (this.icon || (changes.icon && changes.icon.previousValue)) {
        chipEl.className = chipEl.className
          .split(' ')
          .filter((c: string) => Boolean(c.trim()) && !c.includes('b-icon'))
          .join(' ');
        if (!chipEl.className) {
          chipEl.removeAttribute('class');
        }
      }
      if (
        this.icon &&
        (this.type === ChipType.icon || this.type === ChipType.tab)
      ) {
        chipEl.classList.add('b-icon-large', this.icon);
      }
    }

    if (changes.type || changes.removable) {
      this.removable = this.type !== ChipType.tab ? this.removable : false;
    }

    if (changes.type || changes.selected) {
      this.removeIconColor =
        ((this.type === ChipType.tag ||
          this.type === ChipType.avatar ||
          this.type === ChipType.icon) &&
          !this.selected) ||
        (this.type === ChipType.icon && this.selected)
          ? IconColor.normal
          : IconColor.white;
    }
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.removed.observers.length > 0) {
      this.removed.emit(event);
    }
  }
}
