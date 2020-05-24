import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
} from '@angular/core';

import { BreadcrumbsType, BreadcrumbsStepState } from './breadcrumbs.enum';
import { Breadcrumb } from './breadcrumbs.interface';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @HostBinding('attr.data-type')
  @Input()
  type: BreadcrumbsType = BreadcrumbsType.primary;

  @HostBinding('attr.data-always-show-title')
  @Input()
  alwaysShowTitle = false;

  @Input() steps: Breadcrumb[];

  @Input() clickable = true;

  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();

  readonly breadcrumbsType = BreadcrumbsType;
  readonly stepStates = BreadcrumbsStepState;

  constructor() {}

  public stepsTrackBy(index: number, step: Breadcrumb): string {
    return index + step.title;
  }

  public onStepClick(index: number): void {
    this.stepClick.emit(index);
  }

  public isClickable(step: Breadcrumb) {
    return (
      this.clickable !== false &&
      (step.state === BreadcrumbsStepState.open ||
        step.state === BreadcrumbsStepState.success ||
        step.state === BreadcrumbsStepState.warning)
    );
  }
}
