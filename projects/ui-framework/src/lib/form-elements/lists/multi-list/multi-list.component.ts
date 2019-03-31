import { Component, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep, flatMap, chain } from 'lodash';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { CheckboxStates } from '../../checkbox/checkbox.component';
import has from 'lodash/has';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: ['multi-list.component.scss'],
})
export class MultiListComponent extends BaseListElement implements OnChanges {

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  noGroupHeaders: boolean;
  shouldDisplaySearch = false;
  searchValue: string;
  filteredOptions: SelectGroupOption[];
  checkboxState = CheckboxStates;

  selectedIdsMap: (string | number)[];

  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService,
  ) {
    super(renderer, listKeyboardService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldResetModel(changes)) {
      this.options = changes.options.currentValue;
      this.selectedIdsMap = this.getSelectedIdsMap();
      this.noGroupHeaders = this.options.length === 1 && !this.showSingleGroupHeader;
      this.filteredOptions = cloneDeep(this.options);
      this.shouldDisplaySearch = flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;
      this.updateLists();
    }
  }

  private shouldResetModel(changes: SimpleChanges): boolean {
    return has(changes, 'options');
  }

  headerClick(header: ListHeader): void {
    this.toggleGroupCollapse(header);
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.selectedIdsMap);
  }

  headerSelect(header: ListHeader): void {
    header.selected = !header.selected;
    const groupOptionsIds = chain(this.options)
      .filter(group => group.groupName === header.groupName)
      .flatMap('options')
      .flatMap('id')
      .value();
    this.selectedIdsMap = header.selected
      ? chain(this.selectedIdsMap).concat(groupOptionsIds).uniq().value()
      : chain(this.selectedIdsMap).difference(groupOptionsIds).value();
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.selectedIdsMap);

    this.emitChange();
  }

  optionClick(selectedOption: ListOption): void {
    selectedOption.selected = !selectedOption.selected;
    this.selectedIdsMap = selectedOption.selected
      ? chain(this.selectedIdsMap).concat(selectedOption.id).uniq().value()
      : chain(this.selectedIdsMap).difference([selectedOption.id]).value();
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.selectedIdsMap);

    this.emitChange();
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(this.options, s);
    this.updateLists();
  }

  getListChange(): ListChange {
    return this.listChangeService.getListChange(this.options, this.selectedIdsMap);
  }

  private updateLists(): void {
    this.listHeaders = this.listModelService
      .getHeadersModel(this.filteredOptions);
    this.listOptions = this.listModelService
      .getOptionsModel(this.filteredOptions, this.listHeaders, this.noGroupHeaders);
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.selectedIdsMap);
  }

  private getSelectedIdsMap(): (string | number)[] {
    return this.listModelService.getSelectedIdsMap(this.options);
  }

  private emitChange(): void {
    const listChange: ListChange = this.listChangeService.getListChange(this.options, this.selectedIdsMap);
    this.selectChange.emit(listChange);
  }
}
