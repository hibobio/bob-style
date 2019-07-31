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
  ChangeDetectorRef
} from '@angular/core';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import {
  ButtonSize,
  ButtonType
} from '../../buttons-indicators/buttons/buttons.enum';
import { has } from 'lodash';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { LinkColor } from '../../buttons-indicators/link/link.enum';
import { BreadcrumbsType } from './breadcrumbs.enum';
import { Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy, OnChanges {
  @HostBinding('attr.data-type')
  @Input()
  type: BreadcrumbsType = BreadcrumbsType.primary;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() buttons: BreadcrumbNavButtons;
  @Input() activeIndex: number;

  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() prevClick: EventEmitter<number> = new EventEmitter<number>();

  isMobile = false;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
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
  }

  onStepClick(stepIndex): void {
    this.stepClick.emit(stepIndex);
  }

  onNextClick(): void {
    this.nextClick.emit(this.activeIndex + 1);
  }

  onPrevClick(): void {
    this.prevClick.emit(this.activeIndex - 1);
  }
}
