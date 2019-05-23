import { Injectable } from '@angular/core';
import { CardTableCellMeta } from '../card-table.interface';

@Injectable()
export class CellWidthsService {
  constructor() {}

  public getCellsWidth(
    meta: CardTableCellMeta[],
    minCellWidth: number
  ): number[] {
    let cellWidths: number[] = [];

    const maxCellWidth = 100 - minCellWidth * (meta.length - 1);
    const autoWidthCellsNumber = meta.reduce(
      (acc, cell) => (cell.width > 0 ? acc : acc + 1),
      0
    );
    const totalProvidedWidth = meta.reduce(
      (acc, cell) => (cell.width > 0 ? acc + cell.width : acc),
      0
    );

    cellWidths = meta.map(cell => {
      const autoWidth = (100 - totalProvidedWidth) / autoWidthCellsNumber;

      return cell.width > 0
        ? cell.width > minCellWidth
          ? cell.width > maxCellWidth
            ? maxCellWidth
            : cell.width
          : minCellWidth
        : autoWidth > minCellWidth
        ? autoWidth
        : minCellWidth;
    });

    const totalWidth = (): number =>
      Math.round(cellWidths.reduce((acc, width) => acc + width, 0));

    const cellsBiggerThanMinimum = (): number =>
      cellWidths.reduce(
        (acc, width) => (width > minCellWidth ? acc + 1 : acc),
        0
      );

    while (totalWidth() > 100) {
      cellWidths = cellWidths.map(width => {
        const target = width - (totalWidth() - 100) / cellsBiggerThanMinimum();
        return target > minCellWidth ? target : width;
      });
    }

    if (totalWidth() < 100) {
      cellWidths = cellWidths.map(
        width => width + (100 - totalWidth()) / cellWidths.length
      );
    }

    return cellWidths;
  }
}
