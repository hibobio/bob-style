import { Injectable } from '@angular/core';
import { ColorPalette } from '../../colorsPalette.enum';
import {
  isNumber,
  makeArray,
  randomFromArray,
  randomNumber,
} from '../utils/functional-utils';

export interface PaletteColorGenerator {
  next(): ColorPalette;
  nextMultiple(count: number): ColorPalette[];
  currentColorName: string;
  currentColor: ColorPalette;
  currentIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteService {
  constructor() {
    this.colorPaletteKeys = [].concat(
      Object.keys(ColorPalette).filter((key) => key.endsWith('base')),
      Object.keys(ColorPalette).filter((key) => key.endsWith('dark')),
      Object.keys(ColorPalette).filter((key) => key.endsWith('darker')),
      Object.keys(ColorPalette).filter((key) => key.endsWith('light')),
      Object.keys(ColorPalette).filter((key) => key.endsWith('lighter'))
    );

    this.colorPalette = this.colorPaletteKeys.map((key) => ColorPalette[key]);
    this.paletteSize = this.colorPalette.length;
  }

  public colorPaletteKeys: string[];
  public colorPalette: ColorPalette[];
  public paletteSize: number;

  public getPaletteColorByIndex(index?: number): ColorPalette {
    if (!isNumber(index)) {
      index = randomNumber(0, this.colorPalette.length);
    }
    return this.colorPalette[index % this.paletteSize];
  }

  public gerRandomPaletteColors(count = 1): ColorPalette[] {
    return randomFromArray(this.colorPalette, count);
  }

  public gerRandomPaletteColor(): ColorPalette {
    return this.getPaletteColorByIndex();
  }

  public paletteColorGenerator(startIndex?: number): PaletteColorGenerator {
    const generator: PaletteColorGenerator = {
      currentIndex: (startIndex || 0) - 1,
      currentColorName: null,
      currentColor: null,

      next: () => {
        generator.currentIndex = ++generator.currentIndex % this.paletteSize;
        generator.currentColorName = this.colorPaletteKeys[
          generator.currentIndex
        ];
        generator.currentColor = this.colorPalette[generator.currentIndex];
        return generator.currentColor;
      },

      nextMultiple: (count = 1) => {
        return makeArray(count).map((_) => generator.next());
      },
    };

    return generator;
  }
}
