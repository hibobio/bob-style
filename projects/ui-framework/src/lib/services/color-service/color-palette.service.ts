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

export const COLOR_PALETTE_MAIN_COLOR_ORDER: string[] = [
  'color1_base',
  'color2_base',
  'color3_base',
  'color4_base',
  'color5_base',
  'color6_base',
  'color7_base',
  'color8_base',
  'color9_base',

  'color1_dark',
  'color2_lighter',
  'color3_dark',
  'color4_lighter',
  'color5_dark',
  'color6_lighter',
  'color7_dark',
  'color8_lighter',
  'color9_dark',

  'color1_light',
  'color2_darker',
  'color3_light',
  'color4_darker',
  'color5_light',
  'color6_darker',
  'color7_light',
  'color8_darker',
  'color9_light',

  'color1_darker',
  'color2_light',
  'color3_darker',
  'color4_light',
  'color5_darker',
  'color6_light',
  'color7_darker',
  'color8_light',
  'color9_darker',

  'color1_lighter',
  'color2_dark',
  'color3_lighter',
  'color4_dark',
  'color5_lighter',
  'color6_dark',
  'color7_lighter',
  'color8_dark',
  'color9_lighter',
];

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteService {
  constructor() {
    this.colorPalette = this.colorPaletteKeys.map((key) => ColorPalette[key]);
    this.paletteSize = this.colorPalette.length;
  }

  public readonly colorPaletteKeys: string[] = COLOR_PALETTE_MAIN_COLOR_ORDER;
  public readonly colorPalette: ColorPalette[];
  public readonly paletteSize: number;

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
