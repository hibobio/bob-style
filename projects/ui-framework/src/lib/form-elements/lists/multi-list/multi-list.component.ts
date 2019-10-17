import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep, flatMap, chain } from 'lodash';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import has from 'lodash/has';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';
import { ListFooterActions } from '../list.interface';
import { hasChanges } from '../../../services/utils/functional-utils';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: [
    '../single-list/single-list.component.scss',
    'multi-list.component.scss'
  ]
})
export class MultiListComponent extends BaseListElement implements OnChanges {
  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() showSingleGroupHeader = false;
  @Input() listActions: ListFooterActions = {
    clear: true
  };
  @Output() apply: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() cancel: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  displayHeaderChevron = true;
  shouldDisplaySearch = false;
  searchValue: string;
  filteredOptions: SelectGroupOption[];
  selectedIdsMap: (string | number)[];

  private optionsDraft: SelectGroupOption[];

  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService
  ) {
    super(renderer, listKeyboardService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldResetModel(changes)) {
      this.options = changes.options.currentValue;
      this.optionsDraft = this.options;
      this.selectedIdsMap = this.getSelectedIdsMap();
      this.filteredOptions = cloneDeep(this.options);
      this.shouldDisplaySearch =
        this.options &&
        flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;

      this.noGroupHeaders =
        !this.options ||
        (this.options.length < 2 && !this.showSingleGroupHeader);

      this.updateLists();
    }
  }

  private shouldResetModel(changes: SimpleChanges): boolean {
    return hasChanges(changes, ['options', 'showSingleGroupHeader']);
  }

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      this.toggleGroupCollapse(header);
    } else {
      this.headerSelect(header);
    }
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService.getOptionsModel(
      this.filteredOptions,
      this.listHeaders,
      this.noGroupHeaders
    );
    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  headerSelect(header: ListHeader): void {
    header.selected = this.getHeaderSelect(header);
    const groupOptionsIds = chain(this.options)
      .filter(group => group.groupName === header.groupName)
      .flatMap('options')
      .filter(option => !option.disabled)
      .flatMap('id')
      .value();
    this.selectedIdsMap = header.selected
      ? chain(this.selectedIdsMap)
          .concat(groupOptionsIds)
          .concat(this.getSelectedDisabledMap())
          .uniq()
          .value()
      : chain(this.selectedIdsMap)
          .difference(groupOptionsIds)
          .concat(this.getSelectedDisabledMap())
          .uniq()
          .value();

    this.emitChange();

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  optionClick(selectedOption: ListOption): void {
    selectedOption.selected = !selectedOption.selected;
    this.selectedIdsMap = selectedOption.selected
      ? chain(this.selectedIdsMap)
          .concat(selectedOption.id)
          .uniq()
          .value()
      : chain(this.selectedIdsMap)
          .difference([selectedOption.id])
          .value();

    this.emitChange();

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  onClear(): void {
    this.selectedIdsMap = this.getSelectedDisabledMap();

    this.emitChange();

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(
      this.options,
      s
    );
    this.updateLists();
  }

  getListChange(): ListChange {
    return this.listChangeService.getListChange(
      this.options,
      this.selectedIdsMap
    );
  }

  private updateLists(): void {
    this.listHeaders = this.listModelService.getHeadersModel(
      this.filteredOptions
    );
    this.listOptions = this.listModelService.getOptionsModel(
      this.filteredOptions,
      this.listHeaders,
      this.noGroupHeaders
    );
    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  private getSelectedIdsMap(): (string | number)[] {
    return this.listModelService.getSelectedIdsMap(this.options);
  }

  private emitChange(): void {
    const listChange: ListChange = this.listChangeService.getListChange(
      this.options,
      this.selectedIdsMap
    );
    this.optionsDraft = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
  }

  private getSelectedDisabledMap(): (string | number)[] {
    return chain(this.options)
      .flatMap('options')
      .filter(o => o.selected && o.disabled)
      .flatMap('id')
      .value();
  }

  private getHeaderSelect(header: ListHeader): boolean {
    const options = chain(this.optionsDraft)
      .filter(group => group.groupName === header.groupName)
      .flatMap('options')
      .filter(o => !(o.disabled && !o.selected))
      .value();
    return !options.every(o => o.selected);
  }
}
