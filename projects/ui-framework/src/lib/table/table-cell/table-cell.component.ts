import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ColumnConfig } from '../table/column-config';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

@Component({
  selector: 'b-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef}) cellHost: ViewContainerRef;

  @Input() row: object;
  @Input() column: ColumnConfig;
  @Input() data: any;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.initComponentCell();
  }

  private initComponentCell() {
    const cellComponent = this.column.component.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cellComponent);
    const viewContainerRef = this.cellHost;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const cell = componentRef.instance as any;
    cell.row = this.row;
    cell.column = this.column;
    const attr =  this.column.component.attributes;

    forEach(attr, (v, k) => {
      if (v instanceof Function) {
        // subscribe to output
        cell[k].subscribe($event => v.apply(null, [$event, cell, this.row, this.column]));
      } else {
        // set component attribute
        cell[k] = get(this.row, v);
      }
    });
  }

}
