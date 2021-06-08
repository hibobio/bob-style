import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { Icons } from '../../icons/icons.enum';
import { ListChange } from '../../lists/list-change/list-change';
import { SelectGroupOption } from '../../lists/list.interface';
import {
  isArray,
  isNumber,
  numberMinMax,
} from '../../services/utils/functional-utils';
import { DOMMouseEvent } from '../../types';
import { PAGER_CONFIG_DEF } from './pager.const';
import { PagerConfig } from './pager.interface';
import { PagerService } from './pager.service';

@Component({
  selector: 'b-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
  providers: [PagerService],
})
export class PagerComponent<T = any> implements OnInit {
  constructor(
    public cd: ChangeDetectorRef,
    private zone: NgZone,
    private pagerService: PagerService
  ) {}

  @Input('config') set setConfig(config: PagerConfig) {
    this.initSliceConfigAndOptions(config);

    if (this.items) {
      this.initViewModel();
      this.emitChange();
    }
  }
  public config: PagerConfig;

  @Input('items') set setItems(items: number | T[]) {
    if (
      !this.items ||
      (isNumber(items) && items !== this.items) ||
      (isArray(items) &&
        isArray(this.items) &&
        items.length !== this.items.length)
    ) {
      this.items = items;

      if (this.config) {
        this.initViewModel();
        this.emitChange();
      }
    }
  }
  public items: number | T[];

  @Input('currentPage') set setCurrentPage(newPage: number) {
    if (newPage !== this.currentPage) {
      this.changePage(newPage);
    }
  }
  public currentPage: number;

  @HostBinding('attr.data-show-slice-select') get showSliceSelect() {
    return Boolean((this.config || PAGER_CONFIG_DEF).showSliceSizeSelect);
  }

  @Input() hidden: boolean;
  @HostBinding('attr.hidden') get isHidden() {
    return this.hidden || null;
  }

  @Output() sliceChange: EventEmitter<number[] | T[]> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sliceSizeChange: EventEmitter<number> = new EventEmitter();

  public totalItems: number;
  public totalPages: number;
  public currentSlice: number[];
  public sliceOptions: SelectGroupOption[];
  public pagesViewModel: number[];
  public sliceInfoWidth: string = null;

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly formElementSize = FormElementSize;

  ngOnInit(): void {
    if (!this.sliceOptions || !this.config) {
      this.initSliceConfigAndOptions();
    }
    if (!this.pagesViewModel) {
      this.initViewModel();
      this.emitChange();
    }
  }

  public isCurrent(page: number): boolean {
    return this.totalPages > 1 && this.currentPage === page;
  }

  public onPageClick(event: DOMMouseEvent): void {
    const target = event.target;

    if (!target.matches('button.tertiary')) {
      return;
    }

    const newPage =
      target.getAttribute('data-icon-before') === 'chevron-left'
        ? this.currentPage - 1
        : target.getAttribute('data-icon-before') === 'chevron-right'
        ? this.currentPage + 1
        : parseInt(target.innerText.trim(), 10) - 1;

    if (newPage === newPage) {
      this.zone.run(() => {
        this.changePage(newPage);
      });
    }
  }

  public onSliceSizeChange(value: ListChange): void {
    const currentSliceStart = this.currentPage * this.config.sliceSize;

    this.config.sliceSize = value.selectedIDs[0] as number;
    this.totalPages = Math.ceil(this.totalItems / this.config.sliceSize);

    const newPage = Math.floor(currentSliceStart / this.config.sliceSize);

    this.changePage(newPage);
    this.emitChange('slicesize');
  }

  private changePage(newPage: number, emit = true): void {
    this.currentPage = newPage;

    if (!this.items || !this.config) {
      return;
    }

    this.currentSlice = this.pagerService.getSlice(
      this.totalItems,
      this.currentPage,
      this.config
    );

    if (emit) {
      this.emitChange();
    }

    this.setPagesViewModel();
  }

  private setPagesViewModel() {
    this.pagesViewModel = this.pagerService.getPagesViewModel(
      this.totalPages || 1,
      this.currentPage || 0
    );
  }

  private initViewModel(): void {
    this.totalItems = isArray(this.items) ? this.items.length : this.items || 0;
    this.totalPages = Math.ceil(this.totalItems / this.config.sliceSize);
    this.sliceInfoWidth =
      'calc(' +
      (this.totalItems + '').length * 3 +
      'ch + ' +
      (2 + 'of'.length) +
      'em)';

    this.currentPage = numberMinMax(
      this.currentPage || 0,
      0,
      this.totalPages - 1
    );

    this.changePage(this.currentPage, false);
  }

  private initSliceConfigAndOptions(config: PagerConfig = null) {
    this.sliceOptions = this.pagerService.getSliceOptions(
      (this.config = this.pagerService.verifySliceConfig(config))
    );
  }

  private emitChange(
    which: 'slice' | 'slicesize' | 'page' | 'all' = 'all'
  ): void {
    if (which === 'page' || which === 'all') {
      this.pageChange.emit(this.currentPage);
    }
    if (which === 'slice' || which === 'all') {
      this.sliceChange.emit(
        isArray(this.items)
          ? this.items.slice(...this.currentSlice)
          : this.currentSlice
      );
    }
    if (which === 'slicesize') {
      this.sliceSizeChange.emit(this.config.sliceSize);
    }
  }

  public pageButtonsTrackBy(index: number, page: number): number {
    return page;
  }
}
