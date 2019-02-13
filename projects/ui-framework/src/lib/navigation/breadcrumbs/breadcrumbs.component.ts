import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Breadcrumb } from './breadcrumbs.interface';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { invoke } from 'lodash/invoke';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('breadcrumbsWrapper') breadcrumbsWrapper;
  public isSmallMode = false;
  public resizeSubscription: Subscription;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() activeIndex: number;
  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngAfterViewInit() {
    this.setIsSmallMode();
    // this.resizeSubscription = fromEvent(window, 'resize')
    //   .pipe(debounceTime(500))
    //   .subscribe(() => {
    //     this.setIsSmallMode();
    //   });
  }

  ngOnDestroy() {
    // invoke(this.resizeSubscription, 'unsubscribe');
  }

  private setIsSmallMode() {
    this.isSmallMode =
      this.breadcrumbsWrapper.nativeElement.offsetWidth <
      this.breadcrumbsWrapper.nativeElement.scrollWidth;
  }

  onStepClick($event, stepIndex): void {
    this.stepClick.emit(stepIndex);
  }
}
