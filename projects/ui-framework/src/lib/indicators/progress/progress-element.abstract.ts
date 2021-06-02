import { Subscription } from 'rxjs';

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  applyChanges,
  isObject,
  notFirstChanges,
  numberMinMax,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { valueAsNumber } from '../../services/utils/transformers';
import { ProgressSize, ProgressType } from './progress.enum';
import { ProgressConfig, ProgressData } from './progress.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseProgressElement
  implements OnChanges, OnInit, OnDestroy {
  constructor(
    protected host: ElementRef,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService
  ) {
    this.data = this.dataDef;
  }

  @Input() data: ProgressData | ProgressData[];
  @Input() config: ProgressConfig = {};
  @Output() clicked: EventEmitter<
    ProgressData | ProgressData[]
  > = new EventEmitter<ProgressData | ProgressData[]>();

  readonly id: string;
  readonly progressType = ProgressType;
  protected wasInView = false;
  protected dataDef: ProgressData | ProgressData[] = {} as ProgressData;
  protected subs: Subscription[] = [];

  @HostBinding('attr.data-size') @Input() size: ProgressSize =
    ProgressSize.medium;
  @HostBinding('attr.data-type') @Input() type: ProgressType =
    ProgressType.primary;
  @HostBinding('attr.data-clickable') get isClickable(): boolean {
    return (
      Boolean(
        this.config?.clickable ||
          (this.config.clickable !== false && this.clicked.observers.length > 0)
      ) || null
    );
  }
  @HostBinding('attr.data-reverse-locations') get isTextLocReversed() {
    return Boolean(this.config?.reverseTextLocation) || null;
  }

  protected onNgChanges(changes: SimpleChanges): void {}
  protected abstract setCssProps(): void;
  protected abstract removeCssProps(): void;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        data: this.dataDef,
        config: {},
        size: ProgressSize.medium,
        type: ProgressType.primary,
      },
      [],
      true
    );

    if (changes.data && isObject<ProgressData>(this.data)) {
      this.data.value = numberMinMax(
        valueAsNumber(true, this.data.value, 0),
        0,
        100
      );
    }

    this.onNgChanges(changes);

    if (notFirstChanges(changes)) {
      this.setCssProps();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    if (!this.config.disableAnimation) {
      this.subs.push(
        this.mutationObservableService[
          this.config.animateOnEveryInView
            ? 'getElementInViewEvent'
            : 'getElementFirstInViewEvent'
        ](this.host.nativeElement, {
          outsideZone: true,
        }).subscribe((inView) => {
          if (inView || !this.config.animateOnEveryInView) {
            this.wasInView = true;
            this.setCssProps();
          }
          if (!inView && this.config.animateOnEveryInView) {
            this.wasInView = false;
            this.removeCssProps();
          }
        })
      );
    } else {
      this.setCssProps();
    }
  }

  ngOnDestroy() {
    unsubscribeArray(this.subs);
  }

  public onClick(): void {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit(this.data);
    }
  }
}
