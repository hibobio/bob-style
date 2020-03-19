import {
  Component,
  Input,
  HostBinding,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';

import {
  CardTableCellMeta,
  cardTableAllowedCellStyles,
  CardTableCellData,
  CardTableRowClickEvent,
  CardTableCellClickEvent,
} from '../card-table.interface';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';
import { TableCardComponent } from './../table-card/table-card.component';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableComponent implements OnInit {
  constructor(protected widthsService: CellWidthsService) {}
  @ViewChildren(TableCardComponent, { read: ElementRef })
  public cardsElRefs: QueryList<TableCardComponent>;
  @Input() meta: CardTableCellMeta[];
  @Input() table: CardTableCellData[][];
  @Input() default = 'No data to display';
  @Input() minCellWidth = 5;

  @HostBinding('attr.role') string = 'table';

  @Output() rowClicked: EventEmitter<CardTableRowClickEvent> = new EventEmitter<
    CardTableRowClickEvent
  >();
  @Output() cellClicked: EventEmitter<
    CardTableCellClickEvent
  > = new EventEmitter<CardTableCellClickEvent>();

  cellsStyle: cardTableAllowedCellStyles[];

  protected setCellsStyle(): void {
    const cellsWidths = this.widthsService.getCellsWidth(
      this.meta,
      this.minCellWidth
    );

    this.cellsStyle = this.meta.map((cell, index) => ({
      maxWidth: cellsWidths[index] + '%',
      alignItems: cell.align === 'right' ? 'flex-end' : null,
      ...cell.textStyle,
    }));
  }

  ngOnInit(): void {
    this.setCellsStyle();
  }

  onRowClicked(row: CardTableCellData[], index: number): void {
    this.rowClicked.emit({ row: row, rowIndex: index });
  }

  onCellClicked($event: CardTableCellClickEvent): void {
    this.cellClicked.emit($event);
  }
}
