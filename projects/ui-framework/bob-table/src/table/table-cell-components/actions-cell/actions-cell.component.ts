import { Component } from '@angular/core';
import { IconColor, Icons, ButtonType, MenuItem } from 'bob-style';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { assign, map, get } from 'lodash';

@Component({
  selector: 'b-actions-cell',
  templateUrl: './actions-cell.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 -5px;
        width: calc(100% + 10px);
      }
    `,
  ],
})
export class ActionsCellComponent implements ICellRendererAngularComp {
  public menuItems: MenuItem[];
  public openLeft: boolean;
  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() {}

  agInit(params: any): void {
    this.openLeft = get(params, 'value.openLeft', false);
    this.menuItems = map(
      get(params, 'value.menuItems', []),
      (item: MenuItem) => {
        return assign({}, item, {
          action: () => {
            item.action(params.data);
          },
        });
      }
    );
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
