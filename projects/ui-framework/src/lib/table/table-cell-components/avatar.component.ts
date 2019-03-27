import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

// both this and the parent component could be folded into one component as they're both simple,
// but it illustrates how a fuller example could work
@Component({
  selector: 'b-avatar-cell',
  template: `
        <b-avatar [imageSource]='params.value.imageSource'
                  [isClickable]="true"
                  (clicked)='clicked($event)'>
        </b-avatar>
    `,
})
export class AvatarCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  clicked($event: void) {
  }
}
