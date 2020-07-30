import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Icons } from 'bob-style';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CircleIconAndLabelParams } from './circle-icon-and-label.interface';

@Component({
  selector: 'b-circle-icon-and-lable',
  template: `
    <b-table-actions-wrapper [menuItems]="params?.value?.menuItems" [buttonType]="params?.value?.buttonType">
      <div class="circle-icon-wrapper"
      *ngIf="params && params.value">
        <b-avatar-image *ngIf="params.value.icon !== null"
          [isClickable]="false"
          [icon]="params.value.icon">
        </b-avatar-image>
        <span class="circle-icon-label"
              *ngIf="params.value.label"
              innerHTML="{{params.value.label}}">
        </span>
    </div>
  </b-table-actions-wrapper>`,
  styleUrls: ['./circle-icon-and-label.component.scss'],
})
export class CircleIconAndLabelComponent implements ICellRendererAngularComp {
  @Input() icon: Icons = null;
  params: CircleIconAndLabelParams;

  constructor(private cdr: ChangeDetectorRef) {}

  agInit(params: CircleIconAndLabelParams): void {
    this.params = params;
    this.cdr.detectChanges();
  }

  refresh(params: any): boolean {
    return false;
  }
}
