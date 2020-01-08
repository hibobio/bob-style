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
import { Subscription } from 'rxjs';
import { LinkColor } from '../../indicators/link/link.enum';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { BreadcrumbsType, BreadcrumbsStepState } from './breadcrumbs.enum';
import {
  Breadcrumb,
  BreadcrumbsConfig,
  BreadcrumbNavButtons,
} from './breadcrumbs.interface';
import {
  notFirstChanges,
  cloneDeepSimpleObject,
} from '../../services/utils/functional-utils';
import merge from 'lodash/merge';
import {
  BREADCRUMBS_CONFIG_DEF,
  BREADCRUMBS_BUTTONS_DEF,
} from './breadcrumbs.const';

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

  @Input() steps: Breadcrumb[];

  public buttons: BreadcrumbNavButtons = cloneDeepSimpleObject(
    BREADCRUMBS_BUTTONS_DEF
  );
  @Input('buttons') set setButtons(buttons: BreadcrumbNavButtons | boolean) {
    this.buttons =
      buttons === true
        ? cloneDeepSimpleObject(BREADCRUMBS_BUTTONS_DEF)
        : (buttons as BreadcrumbNavButtons) || null;
  }

  public config: BreadcrumbsConfig = cloneDeepSimpleObject(
    BREADCRUMBS_CONFIG_DEF
  );
  @Input('config') set setConfig(config: BreadcrumbsConfig) {
    this.config = merge(BREADCRUMBS_CONFIG_DEF, config);
  }

  public activeStep = 0;
  @Input('activeStep') set setActiveStep(activeStep: number) {
    this.activeStep = activeStep;
  }

  @Output() stepChange: EventEmitter<number> = new EventEmitter<number>();

  public isMobile = false;

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;

  readonly linkColor = LinkColor;
  readonly breadcrumbsType = BreadcrumbsType;
  readonly stepStates = BreadcrumbsStepState;
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
    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }

    console.log(changes);
  }

  public stepState(step: Breadcrumb, index: number): BreadcrumbsStepState {
    return (this.config.isOpen &&
      step.state !== BreadcrumbsStepState.active &&
      index !== this.activeStep) ||
      step.state === BreadcrumbsStepState.open
      ? BreadcrumbsStepState.open
      : step.state === BreadcrumbsStepState.active || index === this.activeStep
      ? BreadcrumbsStepState.active
      : BreadcrumbsStepState.closed;
  }

  public showTitle(step: Breadcrumb, index: number): boolean {
    return (
      this.config.alwaysShowTitle ||
      this.type === BreadcrumbsType.vertical ||
      (this.type === BreadcrumbsType.primary &&
        (step.state === BreadcrumbsStepState.active ||
          index === this.activeStep))
    );
  }

  public buttonDisabled(disableIndex = 0): boolean {
    return this.config.autoDisableButtons && this.activeStep === disableIndex;
  }

  public buttonHidden(hideIndex = 0): boolean {
    console.log(this.config.autoHideButtons, hideIndex, this.activeStep);
    return this.config.autoHideButtons && this.activeStep === hideIndex;
  }

  public goToStep(index: number): void {
    index = Math.max(0, Math.min(this.steps.length - 1, index));

    console.log(index);

    if (index !== this.activeStep) {
      this.zone.run(() => {
        this.stepChange.emit(index);
      });

      if (this.config.autoChangeSteps) {
        this.activeStep = index;

        this.cd.detectChanges();
      }
    }
  }

  private setStepsModel(): void {
    this.steps = this.steps.map(step => ({
      title: step.title,
      state: null,
    }));
  }

  public stepsTrackBy(index: number, step: Breadcrumb): string {
    return index + step.title;
  }
}
