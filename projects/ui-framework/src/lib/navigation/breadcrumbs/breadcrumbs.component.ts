import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  HostBinding,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { has } from 'lodash';
import { Subscription } from 'rxjs';
import { LinkColor } from '../../indicators/link/link.enum';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { BreadcrumbsType, BreadcrumbsToggleStrategy } from './breadcrumbs.enum';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import { notFirstChanges } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit, OnDestroy, OnChanges {
  @HostBinding('attr.data-type')
  @Input()
  type: BreadcrumbsType = BreadcrumbsType.primary;
  @Input()
  toggleStrategy: BreadcrumbsToggleStrategy = BreadcrumbsToggleStrategy.auto;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() buttons: BreadcrumbNavButtons;
  @Input() activeIndex: number;

  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() prevClick: EventEmitter<number> = new EventEmitter<number>();

  isMobile = false;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;

  readonly linkColor = LinkColor;
  readonly breadcrumbsType = BreadcrumbsType;
  private mediaEventSubscriber: Subscription;

  constructor(
    private mobileService: MobileService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mediaEventSubscriber = this.mobileService
      .getMediaEvent()
      .pipe(outsideZone(this.zone))
      .subscribe((media: MediaEvent) => {
        this.isMobile = media.matchMobile;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.mediaEventSubscriber && this.mediaEventSubscriber.unsubscribe) {
      this.mediaEventSubscriber.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'buttons')) {
      this.buttons = changes.buttons.currentValue;
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  showTitle(i: number): boolean {
    return (
      this.type !== BreadcrumbsType.secondary &&
      (this.type === BreadcrumbsType.vertical ||
        this.toggleStrategy === BreadcrumbsToggleStrategy.alwaysOpen ||
        i === this.activeIndex)
    );
  }

  onStepClick(stepIndex: number): void {
    if (stepIndex < this.activeIndex) {
      this.stepClick.emit(stepIndex);
    }
  }

  onNextClick(): void {
    this.nextClick.emit(this.activeIndex + 1);
  }

  onPrevClick(): void {
    this.prevClick.emit(this.activeIndex - 1);
  }
}
