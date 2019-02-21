import { Component, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { chain, filter, flatMap } from 'lodash';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { CheckboxStates } from '../../checkbox/checkbox.component';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: ['multi-list.component.scss'],
})
export class MultiListComponent extends BaseListElement implements OnChanges {

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() value: (number | string)[] = [];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  noGroupHeaders: boolean;
  searchValue: string;
  filteredOptions: SelectGroupOption[];

  checkboxState = CheckboxStates;

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
    this.toggleGroupCollapse(header);
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
  }

  headerSelect(header: ListHeader): void {
    header.selected = !header.selected;
    const groupOptionsIds = chain(this.filteredOptions)
      .filter(group => group.groupName === header.groupName)
      .flatMap('options')
      .flatMap('id')
      .value();
    this.value = header.selected
      ? chain(this.value).concat(groupOptionsIds).uniq().value()
      : chain(this.value).difference(groupOptionsIds).value();
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
    this.selectChange.emit(this.value);
  }

  optionClick(selectedOption: ListOption): void {
    selectedOption.selected = !selectedOption.selected;
    this.value = selectedOption.selected
      ? chain(this.value).concat(selectedOption.id).uniq().value()
      : chain(this.value).difference([selectedOption.id]).value();
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
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
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
  }
}
