import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Icons } from 'bob-style';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CircleIconAndLabelParams } from './circle-icon-and-label.interface';

@Component({
  selector: 'b-circle-icon-and-lable',
  template: `
    <div class="circle-icon-wrapper" *ngIf="params && params.value && params.value.icon !== null">
      <b-avatar [isClickable]="false">
        <b-icon [icon]="params.value.icon">
        </b-icon>
      </b-avatar>
      <span class="circle-icon-label" *ngIf="params.value.label">{{ params.value.label }}</span>
    </div>
  `,
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
