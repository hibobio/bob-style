import { Injectable } from '@angular/core';
import { ColorPalette, PalletteColorSet } from './color-palette.enum';
import {
  isNumber,
  makeArray,
  randomFromArray,
  randomNumber,
} from '../utils/functional-utils';
import { COLOR_PALETTE_SETS_COLOR_ORDER } from './color-palette.const';

export interface PaletteColorGenerator {
  next(): ColorPalette;
  nextMultiple(count: number): ColorPalette[];
  currentSet: PalletteColorSet;
  currentColorName: string;
  currentColor: ColorPalette;
  currentIndex: number;
  currentIndexInSet: number;
}

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteService {
  constructor() {
    this.colorPaletteSet = Object.keys(PalletteColorSet).reduce(
      (acc, setKey) => {
        acc[setKey] = COLOR_PALETTE_SETS_COLOR_ORDER[setKey].map(
          (colorKey: string) => ColorPalette[colorKey]
        );
        return acc;
      },
      {} as {
        [key in PalletteColorSet]: ColorPalette[];
      }
    );

    this.colorPaletteSetSize = Object.keys(PalletteColorSet).reduce(
      (acc, key) => {
        acc[key] = COLOR_PALETTE_SETS_COLOR_ORDER[key].length;
        return acc;
      },
      {} as {
        [key in PalletteColorSet]: number;
      }
    );
  }

  public readonly colorPaletteSet: {
    [key in PalletteColorSet]: ColorPalette[];
  };

  private readonly colorPaletteSetSize: {
    [key in PalletteColorSet]: number;
  };

  public gerRandomPaletteColors(
    count = 1,
    set = PalletteColorSet.main
  ): ColorPalette[] {
    return randomFromArray(this.colorPaletteSet[set], count);
  }

  public gerRandomPaletteColor(set = PalletteColorSet.main): ColorPalette {
    return this.colorPaletteSet[set][
      randomNumber(0, this.colorPaletteSetSize[set] - 1)
    ];
  }

  public getPaletteColorByIndex(
    index?: number,
    set = PalletteColorSet.main
  ): ColorPalette {
    return isNumber(index)
      ? this.colorPaletteSet[set][index % this.colorPaletteSetSize[set]]
      : this.gerRandomPaletteColor(set);
  }

  public paletteColorGenerator(
    set = PalletteColorSet.main,
    startIndex = 0
  ): PaletteColorGenerator {
    const generator: PaletteColorGenerator = {
      currentSet: set || PalletteColorSet.main,
      currentIndex: startIndex - 1,
      currentIndexInSet: startIndex - 1,
      currentColorName: null,
      currentColor: null,

      next: () => {
        ++generator.currentIndex;
        ++generator.currentIndexInSet;

        const shouldSwitchToMainSet =
          generator.currentSet !== PalletteColorSet.main &&
          generator.currentIndex >=
            this.colorPaletteSetSize[generator.currentSet];

        shouldSwitchToMainSet &&
          (generator.currentIndexInSet =
            generator.currentIndex -
            this.colorPaletteSetSize[generator.currentSet]);

        shouldSwitchToMainSet && (generator.currentSet = PalletteColorSet.main);

        generator.currentIndexInSet =
          generator.currentIndexInSet %
          this.colorPaletteSetSize[generator.currentSet];

        generator.currentColorName =
          COLOR_PALETTE_SETS_COLOR_ORDER[generator.currentSet][
            generator.currentIndexInSet
          ];

        generator.currentColor = this.colorPaletteSet[generator.currentSet][
          generator.currentIndexInSet
        ];

        return generator.currentColor;
      },

      nextMultiple: (count = 1) => {
        return makeArray(count).map((_) => generator.next());
      },
    };

    return generator;
  }
}
