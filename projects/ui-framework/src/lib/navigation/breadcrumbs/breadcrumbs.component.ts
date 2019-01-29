import { Component, EventEmitter, Input, Output } from '@angular/core';
import { set } from 'lodash';
import { Breadcrumb } from './breadcrumbs.interface';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {

  @Input() breadcrumbs: Breadcrumb[];
  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  onStepClick($event, stepIndex): void {
    this.stepClick.emit(stepIndex);
  }
}
