import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig } from '../../buttons/buttons.interface';
import { ButtonType } from '../../buttons/buttons.enum';
import { Icon } from '../../icons/icon.interface';
import { Icons, IconColor, IconSize } from '../../icons/icons.enum';


@Component({
  selector: 'b-info-graphic-text',
  templateUrl: './info-graphic-text.component.html',
  styleUrls: ['./info-graphic-text.scss']
})
export class InfoGraphicTextComponent {

  @Input() items: string[];
  @Input() title: string;
  @Input() set buttonText(value: string) {
    this.buttonConfig.text = value || '';
  }

  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
  readonly linkIconConfig: Icon = {
    size: IconSize.large,
    color: IconColor.negative,
    icon: Icons.chevron_right
  };
  readonly buttonConfig: ButtonConfig = {
    text: '',
    type: ButtonType.negative,
    onClick: () => this.buttonClicked.emit(),
  };

  constructor() {
  }

}
