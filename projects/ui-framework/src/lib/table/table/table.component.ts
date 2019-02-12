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
  @Input() data: any;
  @Input() columns: ColumnConfig[] = [];
  @Input() multiSelect = false;
  @Input() sortInit = {};
  @Input() selectedRowInit = {};

  @Output() sort: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnFiltered: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowRightClicked: EventEmitter<any> = new EventEmitter<any>();

  activeSort: ColumnConfig = null;
  selection: SelectionModel<any>;
  cols = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.cols = this.columns.map((column: ColumnConfig) => column.name);
    this.cols.unshift('select');

    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<any>(allowMultiSelect, initialSelection);

    this.activeSort = this.columns.find((x) => x.sortActive !== null);
  }

  public getColumnName (row: object, name: string): any {
    return get(row, name);
  }

  public sortData(event): void {
    this.sort.emit(event);
  }

  public onSelectRow(event, row): void {
    if (event) {
      this.selection.toggle(row);
    }
    this.selected.emit(this.selection.selected);
  }

  public onSelectMaster(event): void {
    if (event) {
      this.masterToggle();
    }
    this.selected.emit(this.selection.selected);
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

  public rowClick(row): void {
    this.rowClicked.emit(row);
  }


  public rightClick(row) {
    this.rowRightClicked.emit(row);
  }

  public removeColumnClicked(column): void {
    this.cols = this.cols.filter((x) => x !== column.name);
  }

  public drop(event: CdkDragDrop<ColumnConfig>): void {
    moveItemInArray(this.cols, event.previousIndex, event.currentIndex);
  }

}
