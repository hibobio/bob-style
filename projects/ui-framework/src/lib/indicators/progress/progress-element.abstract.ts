import {
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
  NgZone,
  Input,
  HostBinding,
  Directive,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  applyChanges,
  numberMinMax,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { valueAsNumber } from '../../services/utils/transformers';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { filter, take } from 'rxjs/operators';
import { ProgressData, ProgressConfig } from './progress.interface';
import { ProgressSize, ProgressType } from './progress.enum';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseProgressElement implements OnChanges, OnInit {
  constructor(
    protected host: ElementRef,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService
  ) {}

  @Input() data: ProgressData = {} as ProgressData;
  @Input() config: ProgressConfig = {};
  @Output() clicked: EventEmitter<ProgressData> = new EventEmitter<
    ProgressData
  >();

  readonly id: string;
  readonly progressType = ProgressType;
  protected wasInView = false;

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

  protected onNgChanges(changes: SimpleChanges): void {}
  protected setCssProps(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.data) {
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
      this.mutationObservableService
        .getElementInViewEvent(this.host.nativeElement)
        .pipe(outsideZone(this.zone), filter(Boolean), take(1))
        .subscribe(() => {
          this.wasInView = true;
          this.setCssProps();
        });
    } else {
      this.setCssProps();
    }
  }

  public onClick(): void {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit(this.data);
    }
  }
}
