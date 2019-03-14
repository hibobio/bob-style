import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../services/utils/utils.service';
import { ButtonSize, ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { has } from 'lodash';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('breadcrumbsWrapper') breadcrumbsWrapper;
  public isSmallMode = false;
  public resizeSubscription: Subscription;
  public buttonSize = ButtonSize;
  public buttonType = ButtonType;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() buttons: BreadcrumbNavButtons;
  @Input() activeIndex: number;
  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() prevClick: EventEmitter<number> = new EventEmitter<number>();
  breadcrumbsFullWidth: number;

  constructor(public utilsService: UtilsService) {}

  ngAfterViewInit() {
    this.breadcrumbsFullWidth = this.breadcrumbsWrapper.nativeElement.scrollWidth;
    this.setIsSmallMode();
    this.resizeSubscription = this.utilsService.getResizeEvent().subscribe(() => {
      this.setIsSmallMode();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'buttons')) {
      this.buttons = changes.buttons.currentValue;
    }
  }

  private setIsSmallMode() {
    this.isSmallMode =
      this.breadcrumbsWrapper.nativeElement.offsetWidth < this.breadcrumbsFullWidth;
  }

  onStepClick($event, stepIndex): void {
    this.stepClick.emit(stepIndex);
  }

  onNextClick(): void {
    this.nextClick.emit(this.activeIndex + 1);
  }

  onPrevClick(): void {
    this.prevClick.emit(this.activeIndex - 1);
  }
}
