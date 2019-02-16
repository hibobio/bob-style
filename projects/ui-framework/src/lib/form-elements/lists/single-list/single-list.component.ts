import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { assign, cloneDeep, compact, escapeRegExp, filter, map, some } from 'lodash';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent implements OnChanges {

  readonly listElHeight = LIST_EL_HEIGHT;

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() value: number | string;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(number | string)> = new EventEmitter<(number | string)>();

  noGroupHeaders: boolean;
  searchValue: string;
  listOptions: ListOption[];
  listHeaders: ListHeader[];

  private filteredOptions: SelectGroupOption[];

  constructor(
    private listModelService: ListModelService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.options;
    this.noGroupHeaders = this.options.length === 1 && !this.showSingleGroupHeader;
    this.updateLists();
  }

  headerClick(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
  }

  optionClick(option: ListOption): void {
    this.value = option.id;
    this.selectChange.emit(this.value);
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(this.options, s);
    this.updateLists();
  }

  private updateLists(): void {
    this.listHeaders = this.listModelService
      .getHeadersModel(this.filteredOptions);
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
  }
}
