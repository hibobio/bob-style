import { Injectable } from '@angular/core';
import { ColorPalette } from '../../colorsPalette.enum';
import { isNumber, joinArrays, randomNumber } from '../utils/functional-utils';

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteService {
  constructor() {
    this.colorPalette = []
      .concat(
        Object.keys(ColorPalette).filter((key) => key.endsWith('base')),
        Object.keys(ColorPalette).filter((key) => key.endsWith('dark')),
        Object.keys(ColorPalette).filter((key) => key.endsWith('darker')),
        Object.keys(ColorPalette).filter((key) => key.endsWith('light')),
        Object.keys(ColorPalette).filter((key) => key.endsWith('lighter'))
      )
      .map((key) => ColorPalette[key]);
    this.paletteSize = this.colorPalette.length;
  }

  public colorPalette: ColorPalette[];
  public paletteSize: number;

  public getPaletteColorByIndex(index?: number): ColorPalette {
    if (!isNumber(index)) {
      index = randomNumber(0, this.colorPalette.length);
    }
    return this.colorPalette[index % this.paletteSize];
  }

  paletteColorGenerator: () => Generator<ColorPalette> = function* () {
    let currIndex = -1;

    while (true) {
      yield this.getPaletteColorByIndex(++currIndex);
    }
  };
}
