import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectGroupOption } from '../../select';
import { ListModelService } from '../list-service/list-model.service';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent implements OnInit {

  readonly LIST_EL_HEIGHT = 44;

  @Input() options: SelectGroupOption[];
  @Input() maxHeight = this.LIST_EL_HEIGHT * 8;
  @Input() value: number | string = 2;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  listOptions: any[];
  listHeaders: any[];
  private optionsMock: SelectGroupOption[] = [];

  constructor(
    private listModelService: ListModelService,
  ) {
  }

  ngOnInit(): void {
    for (let i = 0; i < 4; i++) {
      this.optionsMock.push({
        groupName: `Basic Info G${ i }`,
        options: [
          { value: `Basic Info G${ i }_E1`, id: i * 2 + 1 },
          { value: `Basic Info G${ i }_E2`, id: i * 2 + 2 },
        ],
      });
    }
    this.listHeaders = this.listModelService
      .getHeadersModel(this.optionsMock);
    this.listOptions = this.listModelService
      .getOptionsModel(this.optionsMock, this.listHeaders);
  }

  headerClick(header): void {
    header.isCollapsed = !header.isCollapsed;
    this.listOptions = this.listModelService
      .getOptionsModel(this.optionsMock, this.listHeaders);
  }

  optionClick(option): void {
    this.value = option.id;
    console.log('this.value', this.value);
    this.onSelect.emit(this.value);
  }
}
