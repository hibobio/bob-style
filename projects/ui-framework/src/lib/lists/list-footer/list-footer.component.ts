import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import { LIST_ACTIONS_DEF, LIST_ACTIONS_STATE_DEF } from './list-footer.const';
import {
  cloneObject,
  cloneDeepSimpleObject,
} from '../../services/utils/functional-utils';
import { FormElementSize } from '../../form-elements/form-elements.enum';

@Component({
  selector: 'b-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
})
export class ListFooterComponent {
  @Input() listActions: ListFooterActions = cloneObject(LIST_ACTIONS_DEF);
  @Input() listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;

  onApply(): void {
    this.apply.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onClear(): void {
    this.clear.emit();
  }

  onReset(): void {
    this.reset.emit();
  }
}
