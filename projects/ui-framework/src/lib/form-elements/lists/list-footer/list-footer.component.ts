import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../../icons/icons.enum';
import { ListFooterActions } from '../list.interface';

@Component({
  selector: 'b-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss']
})
export class ListFooterComponent {

  @Input() listActions: ListFooterActions = {
    clear: true,
    cancel: true,
    apply: true,
  };
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
}
