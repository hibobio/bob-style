import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  cloneDeepSimpleObject,
  hasChanges,
} from '../../services/utils/functional-utils';
import {
  QuickFilterBarChangeEvent,
  QuickFilterChangeEvent,
  QuickFilterConfig,
} from './quick-filter.interface';

@Component({
  selector: 'b-quick-filter-bar',
  templateUrl: './quick-filter-bar.component.html',
  styleUrls: ['./quick-filter-bar.component.scss'],
  animations: [
    trigger('reset', [
      transition(':enter', [
        style({ transform: 'scale(0.4)' }),
        animate(
          '350ms cubic-bezier(0.3,1.55,0.85,1.45)',
          style({ transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)' }),
        animate(
          '350ms cubic-bezier(0.8,-0.9,0.95,0.4)',
          style({ transform: 'scale(0.4)' })
        ),
      ]),
    ]),
  ],
})
export class QuickFilterBarComponent implements OnChanges, AfterViewInit {
  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;
  @Input() quickFilters: QuickFilterConfig[];
  @Input() showResetFilter = false;
  @Output()
  filtersChange: EventEmitter<QuickFilterBarChangeEvent> = new EventEmitter<QuickFilterBarChangeEvent>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  quickFiltersChanges: QuickFilterBarChangeEvent = {};

  readonly refreshIcn: Icon = ICON_CONFIG.refresh;
  readonly buttonType = ButtonType;
  public hasPrefix = true;
  public hasSuffix = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, ['quickFilters'], true, {
        checkEquality: true,
        equalCheck: <T = QuickFilterConfig[]>(a: T, b: T) => a === b,
      })
    ) {
      this.quickFilters = changes.quickFilters.currentValue.map(
        (qf: QuickFilterConfig) => {
          if (qf.value) {
            qf.value = cloneDeepSimpleObject(qf.value);
          }
          return { ...qf };
        }
      );

      this.quickFiltersChanges =
        this.quickFilters?.reduce(
          (qfbChanges: QuickFilterBarChangeEvent, qf: QuickFilterConfig) => {
            qfbChanges[qf.key] = {
              key: qf.key,
              listChange: this.listChangeService.getListChange(
                qf.options,
                qf.value || this.listModelService.getSelectedIDs(qf.options)
              ),
            };

            return qfbChanges;
          },
          {}
        ) || {};
    }
  }

  onFilterChange(quickFilterChange: QuickFilterChangeEvent): void {
    this.quickFiltersChanges[quickFilterChange.key] = quickFilterChange;
    this.filtersChange.emit(this.quickFiltersChanges);
  }

  onReset(): void {
    this.resetFilters.emit();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasPrefix = !this.DOM.isEmpty(this.prefix.nativeElement);
        this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  trackBy(index: number, quickFilter: QuickFilterConfig): string {
    return index + quickFilter.key;
  }
}
