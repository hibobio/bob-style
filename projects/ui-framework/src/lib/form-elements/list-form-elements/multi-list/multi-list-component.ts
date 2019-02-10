import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectGroupOption } from '../../select';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { CheckboxStates } from '../../checkbox';
import { chain, filter, flatMap } from 'lodash';

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
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  checkboxState = CheckboxStates;
  listOptions: any[];
  listHeaders: any[];

  constructor(
    private listModelService: ListModelService,
  ) {
  }

  ngOnInit(): void {
    this.listHeaders = this.listModelService
      .getHeadersModel(this.options);
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders);
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
  }

  toggleGroupCollapse(header): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders);
  }

  headerSelect(header): void {
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

  optionClick(selectedOption): void {
    selectedOption.selected = !selectedOption.selected;
    this.value = selectedOption.selected
      ? chain(this.value).concat(selectedOption.id).uniq().value()
      : chain(this.value).difference([selectedOption.id]).value();
    this.listModelService.setSelectedOptions(this.listHeaders, this.listOptions, this.value);
    this.selectChange.emit(this.value);
  }
}
