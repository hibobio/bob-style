import { Component, OnInit } from '@angular/core';
import { ListChange, makeArray, SelectGroupOption } from 'bob-style';
import { TestTableService } from './test-table.service';
import { ColumnDef, ColumnDefConfig } from '../../../../ui-framework/bob-table/src/table/table/table.interface';
import { ColumnOrderStrategy } from '../../../../ui-framework/bob-table/src/table/table/table.enum';

const FIELDS: string[] = makeArray(20)
  .map((_, index) => `field_${ index }`);

@Component({
  selector: 'app-test-table',
  templateUrl: './test-table.component.html',
  styleUrls: ['./test-table.component.scss']
})
export class TestTableComponent implements OnInit {

  private fields: string[];
  private defaultFields: string[] = [FIELDS[2], FIELDS[4], FIELDS[12]];

  columnDefs: ColumnDef[];
  rowData: any;
  selectOptions: SelectGroupOption[];
  selectValues: string[];
  columnDefConfig: ColumnDefConfig;

  constructor(
    private testTableService: TestTableService
  ) {
  }

  ngOnInit(): void {
    this.fields = this.defaultFields;
    this.selectOptions = [
      {
        groupName: 'Fields',
        options: FIELDS.map(field => {
          return {
            id: field,
            value: field
          };
        })
      }
    ];
    this.selectValues = this.fields;
    this.columnDefConfig = {
      columnDef: this.testTableService.getColumnDef(this.fields),
      orderStrategy: ColumnOrderStrategy.AppendNew,
    };
    this.updateTable();
  }

  onReset() {
    this.fields = this.defaultFields;
    this.columnDefConfig = {
      columnDef: this.testTableService.getColumnDef(this.fields),
      orderStrategy: ColumnOrderStrategy.Reorder,
    };
    this.updateTable();
  }

  onSelectChanged(listChange: ListChange) {
    this.fields = listChange.getSelectedIds() as string[];
    this.columnDefConfig = {
      columnDef: this.testTableService.getColumnDef(this.fields),
      orderStrategy: ColumnOrderStrategy.AppendNew,
    };
    this.updateTable();
  }

  private updateTable(): void {
    this.columnDefs = this.testTableService.getColumnDef(this.fields);
    this.rowData = this.testTableService.getRowData(this.fields);
  }

}
