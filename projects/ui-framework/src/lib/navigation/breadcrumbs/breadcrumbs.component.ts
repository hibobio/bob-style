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
import { Subscription } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';

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

  constructor(public utilsService: UtilsService) {}

  ngAfterViewInit() {
    this.setIsSmallMode();
    this.resizeSubscription = this.utilsService.getResizeEvent().subscribe(() => {
      this.setIsSmallMode();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
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
