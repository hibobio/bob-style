import { Component, Input, OnInit } from '@angular/core';
import { ButtonConfig, ButtonType, Icon, IconColor, Icons, IconSize } from 'bob-style';


@Component({
  selector: 'b-info-graphic-text',
  templateUrl: './info-graphic-text.component.html',
  styleUrls: ['./info-graphic-text.scss']
})
export class InfoGraphicTextComponent implements OnInit {

  @Input() items: string[];
  @Input() title: string;
  @Input() buttonConfig: ButtonConfig = {
    text: '',
    type: ButtonType.negative,
    onClick: () => console.log('button clicked !')
  };
  @Input() linkIconConfig: Icon = {
    size: IconSize.large,
    color: IconColor.negative,
    icon: Icons.chevron_right
  };

  constructor() {
  }


  ngOnInit() {
  }
}
