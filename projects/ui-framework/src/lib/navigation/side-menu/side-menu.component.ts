import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { Icons, IconColor } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { SideMenuOption } from './side-menu.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnChanges {
  constructor(private DOM: DOMhelpers, private cd: ChangeDetectorRef) {}

  @Input() options: SideMenuOption[];
  @Input() selectedId: number | string;
  @Input() headerLabel: string;

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;

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
      this.selectOption.emit(this.selectedId);
    }
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

  public getIconData(icon: Icons) {
    return icon.replace('b-icon-', '');
  }
}
