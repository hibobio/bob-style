import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ColumnDef, RowSelection } from './table.interface';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @Output() sort: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

  public gridOptions: GridOptions;

  @Input() public rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() allowMultiSelect: Boolean = true;
  @Input() sizeColumnsToFit: Boolean = true;
  @Input() rowHeight: Number = 50;
  @Input() rowSelection: RowSelection = RowSelection.Multiple;



  constructor() {
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        if (this.sizeColumnsToFit) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      }
    };
  }

  ngOnInit() {
  }
}
