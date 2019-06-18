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
import {
  ListHeader,
  ListOption,
  SelectGroupOption,
  SelectOption
} from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { findIndex, has, flatMap, find } from 'lodash';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss']
})
export class SingleListComponent extends BaseListElement implements OnChanges {
  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() showSingleGroupHeader = false;
  @Input() showNoneOption = false;
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  noGroupHeaders: boolean;
  searchValue: string;
  shouldDisplaySearch = false;

  private filteredOptions: SelectGroupOption[];
  private selectedOption: SelectOption;

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
      this.noGroupHeaders =
        this.options &&
        this.options.length === 1 &&
        !this.showSingleGroupHeader;
      this.filteredOptions = this.options;
      this.shouldDisplaySearch =
        this.options &&
        flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;
      this.updateLists();
    }
  }

  private shouldResetModel(changes: SimpleChanges): boolean {
    return has(changes, 'options');
  }

  headerClick(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService.getOptionsModel(
      this.filteredOptions,
      this.listHeaders,
      this.noGroupHeaders
    );
  }

  optionClick(option: ListOption): void {
    if (this.selectedOption) {
      this.selectedOption.selected = false;
    }
    this.selectedOption = option;
    this.selectedOption.selected = true;
    this.focusIndex = findIndex(this.listOptions, o => o.selected);
    this.focusOption = option;

    this.emitChange();
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(
      this.options,
      s
    );
    this.updateLists();
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
    this.selectedOption = find(this.listOptions, o => o.selected);
  }

  private emitChange(): void {
    const listChange = this.listChangeService.getListChange(this.options, [
      this.selectedOption.id
    ]);
    this.selectChange.emit(listChange);
  }
}
