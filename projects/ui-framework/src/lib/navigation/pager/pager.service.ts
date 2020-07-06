import { Injectable } from '@angular/core';
import { SelectGroupOption } from '../../lists/list.interface';
import {
  makeArray,
  isInteger,
  arrayOfNumbers,
  dedupeArray,
} from '../../services/utils/functional-utils';
import { PagerConfig } from './pager.interface';
import { PAGER_CONFIG_DEF } from './pager.const';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PagerService {
  constructor(private translate: TranslateService) {}

  verifySliceConfig(config: PagerConfig = null): PagerConfig {
    config = { ...PAGER_CONFIG_DEF, ...(config || {}) };

    if (config.sliceMax / config.sliceStep > 10) {
      config.sliceStep = Math.round(config.sliceMax / 10);
    }

    if (!isInteger(config.sliceMax / config.sliceStep)) {
      config.sliceMax =
        config.sliceStep * Math.ceil(config.sliceMax / config.sliceStep);
    }

    if (!isInteger(config.sliceSize / config.sliceStep)) {
      config.sliceSize =
        config.sliceStep * Math.round(config.sliceSize / config.sliceStep);
    }

    return config;
  }

  getSliceOptions(config: PagerConfig = null): SelectGroupOption[] {
    config = config || this.verifySliceConfig(config);

    return [
      {
        groupName: 'page slice',
        options: makeArray(config.sliceMax / config.sliceStep).map(
          (_, index) => {
            const sliceSize = (index + 1) * config.sliceStep;
            return {
              id: sliceSize,
              value:
                sliceSize +
                ' ' +
                this.translate.instant('bob-style.pager.items_per_page'),
              selected: sliceSize === config.sliceSize,
            };
          }
        ),
      },
    ];
  }

  getSlice(
    totalItems: number,
    currentPage: number,
    config: PagerConfig
  ): [number, number] {
    return [
      currentPage * config.sliceSize,
      Math.min(totalItems, currentPage * config.sliceSize + config.sliceSize),
    ];
  }

  getPagesViewModel(totalPages: number, currentPage: number): number[] {
    let pagesModel: number[];

    if (totalPages > 10) {
      pagesModel = [currentPage];

      let index = 0;
      while (pagesModel.length < 11) {
        index++;
        pagesModel.unshift(Math.max(0, currentPage - index));
        pagesModel.push(Math.min(totalPages - 1, currentPage + index));
        pagesModel = dedupeArray(pagesModel);
      }

      pagesModel[0] = 0;
      if (pagesModel[1] !== 1) {
        pagesModel[1] = NaN;
      }

      if (pagesModel[10] !== totalPages - 1) {
        pagesModel[10] = totalPages - 1;
        pagesModel[10 - 1] = NaN;
      }
    }

    return pagesModel || (arrayOfNumbers(totalPages) as number[]);
  }
}
