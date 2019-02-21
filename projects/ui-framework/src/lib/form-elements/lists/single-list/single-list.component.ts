import { Component, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import findIndex from 'lodash/findIndex';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent extends BaseListElement implements OnChanges {

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() value: number | string;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(number | string)> = new EventEmitter<(number | string)>();

  noGroupHeaders: boolean;
  searchValue: string;

  private filteredOptions: SelectGroupOption[];

  constructor(
    private listModelService: ListModelService,
    renderer: Renderer2,
  ) {
    super(renderer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filteredOptions && this.options) {
      this.noGroupHeaders = this.options.length === 1 && !this.showSingleGroupHeader;
      this.filteredOptions = this.options;
      this.updateLists();
    }
  }

  headerClick(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
  }

  optionClick(option: ListOption): void {
    this.value = option.id;
    this.selectChange.emit(this.value);
    this.focusIndex = findIndex(this.listOptions, o => o.id === option.id);
    this.focusOption = option;
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
