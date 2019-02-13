import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { CheckboxStates } from '../../checkbox';
import { chain, filter, flatMap } from 'lodash';
import { ListOption, ListHeader, SelectGroupOption } from '../list.interface';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: ['multi-list.component.scss'],
})
export class MultiListComponent implements OnInit {

  readonly listElHeight = LIST_EL_HEIGHT;

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() value: (number | string)[] = [];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  noGroupHeaders: boolean;

  checkboxState = CheckboxStates;
  listOptions: ListOption[];
  listHeaders: ListHeader[];

  constructor(
    private listModelService: ListModelService,
  ) {
  }

  ngOnInit(): void {
    this.noGroupHeaders = this.options.length === 1 && !this.showSingleGroupHeader;
    this.listHeaders = this.listModelService
      .getHeadersModel(this.options);
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders, this.noGroupHeaders);
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders, this.noGroupHeaders);
  }

  headerSelect(header: ListHeader): void {
    header.selected = !header.selected;
    const groupOptionsIds = chain(this.options)
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
}
