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
import {
  applyChanges,
  hasChanges,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-chip, [b-chip]',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnChanges {
  constructor(public elRef: ElementRef, private DOM: DOMhelpers) {
    this.chip = this.elRef.nativeElement;
  }

  public chip: HTMLElement;

  @Input() text: string;
  @Input() textStrong: string;
  @Input() icon: Icons;
  @Input() class: string;

  @HostBinding('attr.data-type') @Input() type: ChipType = ChipType.tag;
  @HostBinding('attr.data-removable') @Input() removable = false;
  @HostBinding('attr.data-selected') @Input() selected = false;
  @HostBinding('attr.data-disabled') @Input() disabled = false;

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
      this.DOM.setAttributes(this.chip, {
        'data-icon-before': this.iconAllowed()
          ? this.icon.replace('b-icon-', '')
          : null,
        'data-icon-before-size': this.iconAllowed() ? IconSize.large : null,
      });
    }

    if (hasChanges(changes, ['class'], true)) {
      this.DOM.bindClasses(this.chip, this.class);
    }

    if (changes.type || changes.removable) {
      this.removable = this.removableAllowed() ? this.removable : false;
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

  private iconAllowed(): boolean {
    return (
      this.icon &&
      (this.type === ChipType.icon ||
        this.type === ChipType.tab ||
        this.type === ChipType.button)
    );
  }

  private removableAllowed(): boolean {
    return this.type !== ChipType.tab && this.type !== ChipType.button;
  }
}
