import { Component, EventEmitter, Output} from '@angular/core';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { MenuItem } from '../../../navigation/menu/menu.interface';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'b-actions-cell',
  templateUrl: './actions-cell.component.html',
})
export class ActionsCellComponent implements ICellRendererAngularComp {
  public menuItems: MenuItem[];
  public openLeft: boolean;
  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly buttonColor: IconColor = IconColor.dark;
  readonly buttonIcon: Icons = Icons.three_dots;

  constructor() { }

  agInit(params: any): void {
    this.menuItems = params.value.menuItems;
    this.openLeft = params.value.openLeft || false;
  }

  refresh(params: any): boolean {
    return false;
  }
}
