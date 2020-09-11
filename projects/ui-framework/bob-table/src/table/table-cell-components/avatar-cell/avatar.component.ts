import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

// both this and the parent component could be folded into one component as they're both simple,
// but it illustrates how a fuller example could work
@Component({
  selector: 'b-avatar-cell',
  template: `
    <b-table-actions-wrapper [menuItems]="params && params['menuItems']">
      <b-avatar-image
        [imageSource]="params.value"
        [isClickable]="true"
        (clicked)="clicked($event)"
      >
      </b-avatar-image>
    </b-table-actions-wrapper>
  `,
  styles: [':host {display: block}'],
})
export class AvatarCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
    /* this.params.menuItems = [
      {
        label: 'save',
        action: $event => console.log('save clicked', $event)
      },
    ];*/
  }

  refresh(): boolean {
    return false;
  }

  clicked($event): void {}
}
