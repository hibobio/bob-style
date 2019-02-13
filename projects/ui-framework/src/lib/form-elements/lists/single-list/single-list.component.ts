import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent implements OnInit {

  readonly listElHeight = LIST_EL_HEIGHT;

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.listElHeight * 8;
  @Input() value: number | string;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(number | string)> = new EventEmitter<(number | string)>();

  noGroupHeaders: boolean;

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
  }

  headerClick(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders, this.noGroupHeaders);
  }

  optionClick(option: ListOption): void {
    this.value = option.id;
    this.selectChange.emit(this.value);
  }
}
