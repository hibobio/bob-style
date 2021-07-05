import { IconColor, Icons, ListChange, SelectGroupOption } from 'bob-style';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TopActionBarTypesEnum } from './top-action-bar.consts';

@Component({
  selector: 'b-top-action-bar',
  templateUrl: './top-action-bar.component.html',
  styleUrls: ['./top-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopActionBarComponent {
  readonly icons = Icons;
  readonly iconColor = IconColor;

  @Input() actionType: TopActionBarTypesEnum;
  @Input() readOnly = false;
  @HostBinding('class')
  get hostClasses(): string {
    return this.actionType;
  }
  @Input() text: string;
  @Input() actionText: string;
  @Input() options: SelectGroupOption[];
  @Output() action = new EventEmitter<MouseEvent | ListChange>();

  constructor() {}

  applyAction(event: MouseEvent | ListChange) {
    this.action.emit(event);
  }
}
