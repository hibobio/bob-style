import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { Icons } from '../../icons/icons.enum';
import {
  cloneDeepSimpleObject,
  cloneObject,
} from '../../services/utils/functional-utils';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import { LIST_ACTIONS_DEF, LIST_ACTIONS_STATE_DEF } from './list-footer.const';

@Component({
  selector: 'b-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
})
export class ListFooterComponent {
  //
  @Input() id: string;
  @Input() listActions: ListFooterActions = cloneObject(LIST_ACTIONS_DEF);
  @Input() listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Output() apply: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() reset: EventEmitter<void> = new EventEmitter();

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
