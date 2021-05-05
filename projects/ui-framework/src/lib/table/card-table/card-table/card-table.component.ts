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
import { isRenderedComponent } from '../../../services/utils/functional-utils';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CellWidthsService],
})
export class CardTableComponent implements OnInit {
  constructor(protected widthsService: CellWidthsService) {}
  @ViewChildren(TableCardComponent, { read: ElementRef })
  public cardsElRefs: QueryList<TableCardComponent>;
  @Input() meta: CardTableCellMeta[];
  @Input() table: CardTableCellData[][];
  @Input() default;
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

  metaTrackBy(index: number, meta: CardTableCellMeta): string {
    return index + '' + (meta.id || meta.name);
  }

  rowTrackBy(index: number, row: CardTableCellData[]): string {
    const rowStringValue = row
      .map(
        (cell, indx) =>
          indx +
          (cell.id ||
            (isRenderedComponent(cell.data)
              ? cell.data.id ||
                cell.data.attributes['id'] ||
                cell.data.attributes['name'] ||
                cell.data.attributes['value'] ||
                cell.data.attributes['title'] ||
                JSON.stringify(
                  Object.values(cell.data.attributes).filter(
                    (v) => typeof v === 'string' || typeof v === 'number'
                  )
                )
              : JSON.stringify(cell.data)))
      )
      .join();

    return rowStringValue;
  }
}
