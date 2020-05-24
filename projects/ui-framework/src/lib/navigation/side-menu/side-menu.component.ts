import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  HostBinding,
  NgZone,
} from '@angular/core';
import { Icons, IconColor } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { SideMenuOption } from './side-menu.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnChanges {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @HostBinding('attr.role') role = 'navigation';

  @Input() options: SideMenuOption[];
  @Input() selectedId: number | string;
  @Input() headerLabel: string;
  @Input() tooltipType: TruncateTooltipType = TruncateTooltipType.auto;

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;
  readonly avatarSize = AvatarSize;

  public focusedId: number | string;

  @Output() selectOption: EventEmitter<number | string> = new EventEmitter<
    number | string
  >();

  ngOnChanges() {
    this.focusedId = null;
  }

  public onFocus(event: FocusEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const index = this.getOptionIndex(target);

    if (index !== null && !this.options[index].disabled) {
      this.focusedId = this.options[index].id;
    } else {
      this.focusedId = null;
    }

    this.cd.detectChanges();
  }

  public onBlur(event: FocusEvent) {
    event.stopPropagation();
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (
      !relatedTarget ||
      !relatedTarget.matches(
        '.menu-option, .option-actions button, .mat-menu-item'
      )
    ) {
      this.focusedId = null;
      this.cd.detectChanges();
    }
  }

  public onClick(event: MouseEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const index = this.getOptionIndex(target);

    if (
      index !== null &&
      !this.options[index].disabled &&
      !target.matches('.option-actions button') &&
      this.selectedId !== this.options[index].id
    ) {
      this.selectedId = this.options[index].id;
      this.cd.detectChanges();
      this.zone.run(() => {
        this.selectOption.emit(this.selectedId);
      });
    }
  }

  public onKey(event: KeyboardEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;

    if (isKey(event.key, Keys.enter) || isKey(event.key, Keys.space)) {
      event.preventDefault();
      target.click();
    }

    if (isKey(event.key, Keys.arrowup) || isKey(event.key, Keys.arrowleft)) {
      event.preventDefault();
      const prevOption = this.DOM.getPrevSibling(
        target,
        '.menu-option:not(.disabled)'
      );
      if (prevOption) {
        prevOption.focus();
      }
    }

    if (isKey(event.key, Keys.arrowdown) || isKey(event.key, Keys.arrowright)) {
      event.preventDefault();
      const nextOption = this.DOM.getNextSibling(
        target,
        '.menu-option:not(.disabled)'
      );
      if (nextOption) {
        nextOption.focus();
      }
    }
  }

  public onMenuClose(menuItem: HTMLElement) {
    this.focusedId = null;
    this.cd.detectChanges();
    menuItem.focus();
  }

  public trackBy(index: number, item: SideMenuOption): string {
    return (
      (item.id !== undefined && item.id + '') ||
      (item.displayName || '') + index
    );
  }

  private getOptionIndex(element: HTMLElement) {
    return this.DOM.getElementIndex(
      this.DOM.getClosest(element, '.menu-option')
    );
  }

  public getIconData(icon: Icons): string {
    return icon.replace('b-icon-', '');
  }
}
