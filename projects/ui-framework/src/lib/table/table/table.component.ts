import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ColumnConfig } from './column-config';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import get from 'lodash/get';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: ColumnConfig[] = [];
  @Input() stickyHeader: Boolean = false;
  @Input() stickyColumns: Number = -1;

  @Output() sort: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowRightClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() set data (data: any[]) {
    this.dataSource.data = data;
  }

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  public activeSort: ColumnConfig = null;
  public selection: SelectionModel<any>;
  public cols = [];


  constructor() {
  }

  ngOnInit() {
    this.cols = this.columns.map((column: ColumnConfig) => column.name);
    this.cols.unshift('select');
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<any>(allowMultiSelect, initialSelection);

    this.activeSort = this.columns.find((x) => x.sortActive !== null);
  }

  public getColumnName (row: object, name: string): string {
    return get(row, name);
  }

  public sorted(event): void {
    this.sort.emit(event);
  }

  public onSelectRow(event, row): void {
    if (event) {
      this.selection.toggle(row);
    }
    this.select.emit(this.selection.selected);
  }

  public onSelectMaster(event): void {
    if (event) {
      this.masterToggle();
    }
    this.select.emit(this.selection.selected);
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public rowClicked (row): void {
    this.rowClick.emit(row);
  }


  public rightClicked (row) {
    this.rowRightClick.emit(row);
  }

  public removeColumnClicked(column): void {
    this.cols = this.cols.filter((x) => x !== column.name);
  }

  public drop(event: CdkDragDrop<ColumnConfig>): void {
    moveItemInArray(this.cols, event.previousIndex, event.currentIndex);
  }

}
