import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { SelectGroupOption } from '../../lists/list.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { isArray, isNumber } from '../../services/utils/functional-utils';
import { PagerConfig } from './pager.interface';
import { PagerService } from './pager.service';

@Component({
  selector: 'b-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent<T = any> implements OnInit {
  constructor(private zone: NgZone, private pagerService: PagerService) {}

  @Input('config') set setConfig(config: PagerConfig) {
    this.initSliceConfigAndOptions(config);

    if (this.pagesViewModel) {
      this.initViewModel();
      this.emitChange();
    }
  }
  private config: PagerConfig;

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
  private items: number | T[];

  @Input('currentPage') set setCurrentPage(newPage: number) {
    if (newPage !== this.currentPage) {
      this.changePage(newPage);
    }
  }
  public currentPage: number;

  @Output() sliceChange: EventEmitter<number[] | T[]> = new EventEmitter<
    number[] | T[]
  >();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sliceSizeChange: EventEmitter<number> = new EventEmitter<number>();

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

  public onPageClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.matches('button.tertiary')) {
      return;
    }

    const newPage = target.classList.contains('b-icon-chevron-left')
      ? this.currentPage - 1
      : target.classList.contains('b-icon-chevron-right')
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

  private changePage(newPage: number): void {
    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.emitChange('page');
      this.setPagesViewModel();
    }

    this.currentSlice = this.pagerService.getSlice(
      this.totalItems,
      this.currentPage,
      this.config
    );
    this.emitChange('slice');
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
    this.currentSlice = [0, this.config.sliceSize];
    this.currentPage = 0;

    this.sliceInfoWidth =
      'calc(' +
      (this.totalItems + '').length * 3 +
      'ch + ' +
      (2 + 'of'.length) +
      'em)';

    this.setPagesViewModel();
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
