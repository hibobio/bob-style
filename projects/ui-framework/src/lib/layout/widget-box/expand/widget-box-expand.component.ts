import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';

@Component({
  selector: 'b-widget-box-expand',
  templateUrl: 'widget-box-expand.component.html',
  styleUrls: ['./widget-box-expand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetBoxExpandComponent {
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  showAll = false;
  @Output() clicked: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onClick(): void {
    this.showAll = !this.showAll;
    this.clicked.emit(this.showAll);
  }
}
