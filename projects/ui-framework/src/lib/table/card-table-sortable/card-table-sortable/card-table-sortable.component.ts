import { Component, Input, OnInit } from '@angular/core';
import { CardTableCellData, CardTableComponent, CellWidthsService } from 'bob-style';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

//     data: {
//       component: SquareButtonComponent,
//       attributes: {
//         type: ButtonType.tertiary,
//         icon: Icons.drag_alt,
//         color: IconColor.dark,
//         size: IconSize.small
//       }
//     }

@Component({
  selector: 'b-card-table-sortable',
  templateUrl: './card-table-sortable.component.html',
  styleUrls: ['./card-table-sortable.component.scss']
})
export class CardTableSortableComponent extends CardTableComponent implements OnInit {
  @Input() useDragHandle = false;

  constructor(protected widthsService: CellWidthsService) {
    super(widthsService);
  }

  ngOnInit(): void {
    if (this.useDragHandle) {
      this.meta.unshift({
        id: 9999,
        name: '',
        width: 5,
        sortable: false,
      });
    }
    this.setCellsStyle();
  }

  onDrop(event: CdkDragDrop<CardTableCellData[][]>) {
    console.log('onDrop');
    moveItemInArray(this.table, event.previousIndex, event.currentIndex);
  }
}
