import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { ButtonConfig } from '../../buttons/buttons.interface';
import { ColorTextItem } from '../../eye-candy/text-colored-links/text-colored-links.interface';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Color } from '../../types';

@Component({
  selector: 'b-info-graphic-text',
  templateUrl: './info-graphic-text.component.html',
  styleUrls: ['./info-graphic-text.scss'],
})
export class InfoGraphicTextComponent {
  linkIconConfig: Icon = {
    size: IconSize.large,
    color: IconColor.negative,
    icon: Icons.chevron_right,
  };
  buttonConfig: ButtonConfig = {
    type: ButtonType.negative,
    onClick: () => this.buttonClicked.emit(),
  };
  useCustomColors = false;
  
  @Input() items: ColorTextItem[];
  @Input() title: string;
  @Input() buttonText: string;
  @Input() set customColors(colors: {textColor: Color, bgColor: Color}) {
    this.linkIconConfig.color = IconColor.custom;
    this.buttonConfig.type = ButtonType.tertiary;
    this.useCustomColors = true;
  };

  @Output() buttonClicked: EventEmitter<void> = new EventEmitter();

  constructor() {}
}
