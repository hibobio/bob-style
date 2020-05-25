import { TestBed } from '@angular/core/testing';
import { CellWidthsService } from './cell-widths.service';

describe('CellWidthsService', () => {
  let cellWidthsService: CellWidthsService;

  const minCellWidth = 5;

  const sumArray = (arr: number[]): number =>
    Math.round(arr.reduce((acc, val) => acc + val, 0));

  const compareArrays = (
    tested: number[],
    expected: number[],
    shouldSumTo = 100
  ) => {
    if (
      !Array.isArray(tested) ||
      tested.length !== expected.length ||
      sumArray(tested) !== shouldSumTo
    ) {
      return false;
    }
    return tested.every(
      (val, index) => Math.round(val) === Math.round(expected[index])
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellWidthsService],
    });

    cellWidthsService = TestBed.inject(CellWidthsService);
  });

  describe('getCellsWidth', () => {
    it('should return [25, 20, 20, 20, 15], when given [25,,,15]', () => {
      const metaMock1 = [
        { name: '1', width: 25 },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5', width: 15 },
      ];
      const expectedWidths = [25, 20, 20, 20, 15];
      const cellWidths = cellWidthsService.getCellsWidth(
        metaMock1,
        minCellWidth
      );
      expect(compareArrays(cellWidths, expectedWidths)).toBeTruthy();
    });

    it(`should return [18, 5, 63, 5, 9], when given [25, -1000, 70, 4, 16]
    (minimum width should be 5, total width should sum to 100,
      extras should be deducted from bigger-than-minimum widths equally)`, () => {
      const metaMock2 = [
        { name: '1', width: 25 },
        { name: '2', width: -1000 },
        { name: '3', width: 70 },
        { name: '4', width: 4 },
        { name: '5', width: 16 },
      ];
      const expectedWidths = [18, 5, 63, 5, 9];
      const cellWidths = cellWidthsService.getCellsWidth(
        metaMock2,
        minCellWidth
      );
      expect(compareArrays(cellWidths, expectedWidths)).toBeTruthy();
    });
  });
});
