import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectGroupOption } from '../../select';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';

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
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

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
  }

  headerClick(header): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.options, this.listHeaders);
  }

  optionClick(option): void {
    this.value = option.id;
    this.selectChange.emit(this.value);
  }
}
