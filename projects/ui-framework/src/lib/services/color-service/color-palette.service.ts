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
import { ArrayES } from '../../types';

export interface PaletteColorGenerator {
  colorSet: PalletteColorSet;
  currentIndex: number;
  currentColorName: string;
  currentColor: ColorPalette;

  next(): ColorPalette;
  nextMultiple(count: number): ColorPalette[];
  reset(): void;
}

export interface PaletteColorGeneratorConfig {
  startIndex?: number;
  skipColors?: (ColorPalette | string)[];
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
          setKey === PalletteColorSet.all
            ? joinArrays([], ...Object.values(COLOR_PALETTE_SETS_COLOR_ORDER))
            : setKey === PalletteColorSet.main
            ? COLOR_PALETTE_SETS_COLOR_ORDER[setKey].slice()
            : joinArrays(
                COLOR_PALETTE_SETS_COLOR_ORDER[setKey],
                randomFromArray(
                  arrayDifference(
                    COLOR_PALETTE_SETS_COLOR_ORDER[setKey],
                    COLOR_PALETTE_SETS_COLOR_ORDER[PalletteColorSet.main]
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

  public getPaletteColors(
    count: number | null = null,
    colorSet: PalletteColorSet | number = PalletteColorSet.main
  ): ColorPalette[] {
    colorSet = this.getColorSetName(colorSet);
    return !count || count <= this.colorPaletteSetSize[colorSet]
      ? this.colorPaletteSetColorValues[colorSet].slice(
          0,
          count || this.colorPaletteSetSize[colorSet]
        )
      : (Array(Math.ceil(count / this.mainPaletteSize)) as ArrayES)
          .fill(this.colorPaletteSetColorValues[colorSet])
          .flat()
          .slice(0, count);
  }

  public getRandomPaletteColors(
    count: number | null = null,
    colorSet: PalletteColorSet | number = PalletteColorSet.main
  ): ColorPalette[] {
    colorSet = this.getColorSetName(colorSet);
    return randomFromArray(
      !count || count <= this.colorPaletteSetSize[colorSet]
        ? this.getPaletteColors(count, colorSet)
        : this.colorPaletteSetColorValues[colorSet],
      count
    );
  }

  public getRandomPaletteColor(
    colorSet: PalletteColorSet | number = PalletteColorSet.main
  ): ColorPalette {
    colorSet = this.getColorSetName(colorSet);
    return this.colorPaletteSetColorValues[colorSet][
      randomNumber(0, this.colorPaletteSetSize[colorSet] - 1)
    ];
  }

  public getPaletteColorByIndex(
    index?: number,
    colorSet: PalletteColorSet | number = PalletteColorSet.main
  ): ColorPalette {
    colorSet = this.getColorSetName(colorSet);
    return isNumber(index)
      ? this.colorPaletteSetColorValues[colorSet][index % this.mainPaletteSize]
      : this.getRandomPaletteColor(colorSet);
  }

  public paletteColorGenerator(
    colorSet: PalletteColorSet | number = PalletteColorSet.main,
    config?: PaletteColorGeneratorConfig
  ): PaletteColorGenerator {
    colorSet = this.getColorSetName(colorSet);
    const { startIndex = 0 } = config || {};
    let callIndex = -1;
    const skipColors = asArray(config?.skipColors);

    let skipIndexes: number[] =
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

      reset: () => {
        callIndex = -1;
        skipIndexes = [];
        Object.assign(
          generator,
          this.getGeneratorInitState(colorSet as PalletteColorSet)
        );
      },

      next: () => {
        ++callIndex;

        let currentIndexInSet = ++generator.currentIndex % this.mainPaletteSize;

        while (
          skipIndexes.length &&
          callIndex < this.mainPaletteSize - skipIndexes.length &&
          skipIndexes.includes(currentIndexInSet)
        ) {
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

  private getColorSetName(
    colorSet: PalletteColorSet | number = PalletteColorSet.main
  ): PalletteColorSet {
    return isNumber(colorSet)
      ? colorSet < 1 || colorSet > 6
        ? PalletteColorSet.all
        : (`set${colorSet}` as PalletteColorSet)
      : colorSet;
  }

  private getGeneratorInitState(
    colorSet: PalletteColorSet = PalletteColorSet.main,
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
