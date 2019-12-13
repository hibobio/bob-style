import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';

@Component({
  selector: 'b-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
})
export class ListFooterComponent {
  @Input() listActions: ListFooterActions = {
    clear: true,
    reset: false,
    apply: true,
  };
  @Input() listActionsState: ListFooterActionsState = {
    clear: { disabled: false, hidden: true },
    reset: { disabled: false, hidden: true },
    apply: { disabled: true, hidden: false },
  };

  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;

  onApply(): void {
    this.apply.emit();
  }

  onClear(): void {
    this.clear.emit();
  }

  onReset(): void {
    this.reset.emit();
  }
}
