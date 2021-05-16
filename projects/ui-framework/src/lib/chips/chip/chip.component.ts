import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ColorsGrey } from '../../services/color-service/color-palette.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { NgClass } from '../../services/html/html-helpers.interface';
import {
  applyChanges,
  hasChanges,
  isDark,
} from '../../services/utils/functional-utils';
import { Color } from '../../types';
import { ChipType } from '../chips.enum';

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
  @Input() icon: Icons | Icon;
  @Input() class: string | string[] | NgClass;
  @Input() color: Color;

  @HostBinding('attr.data-type') @Input() type: ChipType = ChipType.tag;
  @HostBinding('attr.data-removable') @Input() removable = false;
  @HostBinding('attr.data-selected') @Input() selected = false;
  @HostBinding('attr.data-disabled') @Input() disabled = false;

  @Output() removed: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly chipType = ChipType;

  public removeIconColor: IconColor;

  readonly removeIcn: Icon = ICON_CONFIG.reset;

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        type: ChipType.tag,
      },
      [],
      true,
      {
        truthyCheck: (v) => v !== undefined,
      }
    );

    if (changes.type || changes.icon) {
      this.DOM.setAttributes(this.chip, {
        'data-icon-before': this.iconAllowed()
          ? ((this.icon as Icon).icon || (this.icon as Icons)).replace(
              'b-icon-',
              ''
            )
          : null,
        'data-icon-before-size': this.iconAllowed() ? IconSize.large : null,
      });
    }

    if (hasChanges(changes, ['class'], true)) {
      this.DOM.bindClasses(this.chip, this.class);
    }

    if (
      hasChanges(changes, ['color'], true, {
        truthyCheck: (v) => v !== undefined,
      })
    ) {
      this.DOM.setCssProps(this.chip, {
        'background-color': this.color || null,
        'border-color': this.color || null,
        color: !this.color
          ? null
          : isDark(this.color, 200)
          ? 'white'
          : ColorsGrey.grey_800,
      });
    }

    if (changes.type || changes.removable) {
      this.removable = this.removableAllowed() ? this.removable : false;
    }

    if (changes.type || changes.selected) {
      this.removeIconColor =
        this.type === ChipType.avatar ||
        this.type === ChipType.icon ||
        (this.type === ChipType.tag && !this.selected)
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
