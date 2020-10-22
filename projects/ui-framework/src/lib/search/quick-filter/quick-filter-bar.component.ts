import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone, HostBinding,
} from '@angular/core';
import {
  QuickFilterBarChangeEvent,
  QuickFilterChangeEvent,
  QuickFilterConfig,
} from './quick-filter.interface';
import { chain, has } from 'lodash';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { animate, style, transition, trigger } from '@angular/animations';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { FormElementSize } from '../../form-elements/form-elements.enum';

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
  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;
  @Input() quickFilters: QuickFilterConfig[];
  @Input() showResetFilter = false;
  @Output() filtersChange: EventEmitter<
    QuickFilterBarChangeEvent
  > = new EventEmitter<QuickFilterBarChangeEvent>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  quickFiltersChanges: QuickFilterBarChangeEvent = {};

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;
  public hasPrefix = true;
  public hasSuffix = true;

  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilters')) {
      this.quickFilters = changes.quickFilters.currentValue;
      this.quickFiltersChanges = chain(this.quickFilters)
        .map((qf) => ({
          key: qf.key,
          listChange: this.listChangeService.getListChange(
            qf.options,
            this.listModelService.getSelectedIDs(qf.options)
          ),
        }))
        .keyBy('key')
        .value();
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
