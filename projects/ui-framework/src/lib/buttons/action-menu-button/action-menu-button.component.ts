import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { ButtonConfig } from '../buttons.interface';
import { ButtonType } from '../../buttons/buttons.enum';
import { Icons, IconColor } from '../../icons/icons.enum';

@Component({
  selector: 'b-action-menu-button',
  templateUrl: './action-menu-button.component.html',
  styleUrls: ['./action-menu-button.component.scss'],
})
export class ActionMenuButtonComponent implements OnInit {
  @Input() menuItems: MenuItem[];
  @Input() openLeft: boolean;
  @Input() buttonConfig: ButtonConfig;
  @Output() actionClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  public buttonType: ButtonType;
  public buttonColor: IconColor;
  public buttonIcon: Icons;

  constructor() {}

  ngOnInit() {
    this.buttonType = this.buttonConfig ? this.buttonConfig.type : ButtonType.tertiary;
    this.buttonColor = this.buttonConfig ? this.buttonConfig.color : IconColor.normal;
    this.buttonIcon = this.buttonConfig ? this.buttonConfig.icon : Icons.three_dots_vert;
  }

  public onActionClicked($event) {
    this.actionClick.emit($event);
  }
}
