import { Injectable } from '@angular/core';
import { ColorPalette, PalletteColorSet } from './color-palette.enum';
import {
  arrayDifference,
  asArray,
  isNumber,
  joinArrays,
  makeArray,
  randomFromArray,
  randomNumber,
} from '../utils/functional-utils';
import { COLOR_PALETTE_SETS_COLOR_ORDER } from './color-palette.const';

export interface PaletteColorGenerator {
  colorSet: PalletteColorSet;
  currentIndex: number;
  currentColorName: string;
  currentColor: ColorPalette;
  skipColors?: (ColorPalette | string)[];

  next(): ColorPalette;
  nextMultiple(count: number): ColorPalette[];
  reset(): void;
}

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteService {
  public readonly colorPaletteSetColorNames: {
    [key in PalletteColorSet]: string[];
  };

  public readonly colorPaletteSetColorValues: {
    [key in PalletteColorSet]: ColorPalette[];
  };

  private readonly colorPaletteSetSize: {
    [key in PalletteColorSet]: number;
  };

  private readonly mainPaletteSize: number;

  constructor() {
    this.colorPaletteSetColorNames = Object.keys(PalletteColorSet).reduce(
      (acc, setKey) => {
        acc[setKey] =
          setKey === PalletteColorSet.main
            ? COLOR_PALETTE_SETS_COLOR_ORDER[PalletteColorSet.main].slice()
            : joinArrays(
                COLOR_PALETTE_SETS_COLOR_ORDER[setKey],
                randomFromArray(
                  arrayDifference(
                    COLOR_PALETTE_SETS_COLOR_ORDER[PalletteColorSet.main],
                    COLOR_PALETTE_SETS_COLOR_ORDER[setKey]
                  ),
                  null
                )
              );

        return acc;
      },
      {} as {
        [key in PalletteColorSet]: string[];
      }
    );

    this.colorPaletteSetColorValues = Object.keys(PalletteColorSet).reduce(
      (acc, setKey) => {
        acc[setKey] = this.colorPaletteSetColorNames[setKey].map(
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

    this.mainPaletteSize = this.colorPaletteSetSize[PalletteColorSet.main];
  }

  public getRandomPaletteColors(
    count = 1,
    colorSet = PalletteColorSet.main
  ): ColorPalette[] {
    return randomFromArray(
      count <= this.colorPaletteSetSize[colorSet]
        ? this.colorPaletteSetColorValues[colorSet].slice(
            0,
            this.colorPaletteSetSize[colorSet]
          )
        : this.colorPaletteSetColorValues[colorSet],
      count
    );
  }

  public getRandomPaletteColor(colorSet = PalletteColorSet.main): ColorPalette {
    return this.colorPaletteSetColorValues[colorSet][
      randomNumber(0, this.colorPaletteSetSize[colorSet] - 1)
    ];
  }

  public getPaletteColorByIndex(
    index?: number,
    colorSet = PalletteColorSet.main
  ): ColorPalette {
    return isNumber(index)
      ? this.colorPaletteSetColorValues[colorSet][index % this.mainPaletteSize]
      : this.getRandomPaletteColor(colorSet);
  }

  public paletteColorGenerator(
    colorSet = PalletteColorSet.main,
    config?: {
      startIndex?: number;
      skipColors?: (ColorPalette | string)[];
    }
  ): PaletteColorGenerator {
    const { startIndex = 0 } = config || {};
    const skipColors = asArray(config?.skipColors);
    const skipIndexes: number[] =
      skipColors.length && skipColors.length < this.mainPaletteSize
        ? skipColors.reduce((indexes: number[], sc) => {
            const skpIndx = sc.startsWith('#')
              ? this.colorPaletteSetColorValues[colorSet].indexOf(
                  sc as ColorPalette
                )
              : this.colorPaletteSetColorNames[colorSet].indexOf(sc as string);
            if (skpIndx !== -1) {
              indexes.push(skpIndx);
            }
            return indexes;
          }, [])
        : [];

    const generator: PaletteColorGenerator = {
      ...this.getGeneratorInitState(colorSet, startIndex),

      skipColors,

      reset: () => {
        Object.assign(generator, this.getGeneratorInitState(colorSet));
      },

      next: () => {
        let currentIndexInSet = ++generator.currentIndex % this.mainPaletteSize;

        while (skipIndexes.includes(currentIndexInSet)) {
          currentIndexInSet = ++generator.currentIndex % this.mainPaletteSize;
        }

        generator.currentColorName = this.colorPaletteSetColorNames[
          generator.colorSet
        ][currentIndexInSet];

        generator.currentColor = this.colorPaletteSetColorValues[
          generator.colorSet
        ][currentIndexInSet];

        return generator.currentColor;
      },

      nextMultiple: (count = 1) => {
        return makeArray(count).map((_) => generator.next());
      },
    };

    return generator;
  }

  private getGeneratorInitState(
    colorSet = PalletteColorSet.main,
    startIndex = 0
  ) {
    return {
      colorSet: colorSet || PalletteColorSet.main,
      currentIndex: startIndex - 1,
      currentColorName: null,
      currentColor: null,
    };
  }
}
