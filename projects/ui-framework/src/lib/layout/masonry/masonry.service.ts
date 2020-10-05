import { EventEmitter, Injectable } from '@angular/core';
import {
  MasonryConfig,
  MasonryItemsChangedEvent,
  MasonryState,
} from './masonry.interface';
import {
  isNumber,
  batchProcess,
  makeArray,
} from '../../services/utils/functional-utils';
import {
  MASONRY_CONFIG_DEF,
  MASONRY_GAP_DEF,
  MASONRY_COLS_DEF,
  MASONRY_ROW_DIVISION_DEF,
} from './masonry.const';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

export interface MasonryUpdateConfig {
  emitter?: EventEmitter<MasonryItemsChangedEvent>;
  debug?: boolean;
}

@Injectable()
export class MasonryService {
  constructor(private DOM: DOMhelpers) {}

  public initMasonry(
    host: HTMLElement,
    config: MasonryConfig,
    state: MasonryState,
    { emitter = null, debug = false }: MasonryUpdateConfig
  ): void {
    const elements: HTMLElement[] = Array.from(
      host?.children || []
    ) as HTMLElement[];

    if (state) {
      state.hostWidth = state.hostWidth || host.offsetWidth;
      state.config = config;
      state.singleColumn = false;
      state.childrenCount = elements.length;
      state.columns = this.getColumsCount(config, state, host);
    }

    if (!host) {
      return;
    }

    if (
      elements[0]?.tagName !== 'B-MASONRY-ITEM' ||
      elements[0]?.children.length !== 1
    ) {
      console.error(
        `[MasonryLayoutComponent]: ${
          elements[0]?.tagName !== 'B-MASONRY-ITEM'
            ? '<b-masonry-layout> should use <b-masonry-item> for children (you have ' +
              elements[0]?.tagName +
              ')'
            : ''
        } ${
          elements[0]?.children.length !== 1
            ? ' and <b-masonry-item> should have a single child (you have ' +
              elements[0]?.children.length +
              ')'
            : ''
        }.`
      );
    }

    this.DOM.setCssProps(host, {
      '--masonry-row-div':
        (config.rowDivision || MASONRY_ROW_DIVISION_DEF) + 'px',
      '--masonry-gap': config.gap + 'px',
      '--masonry-col-width': config.columns
        ? `calc(100% / ${config.columns} - ${config.gap}px * ${
            config.columns - 1
          } / ${config.columns})`
        : config.columnWidth && config.columnWidth + 'px',
    });

    this.updateElementsRowSpan(elements, host, config, { emitter, debug });

    host.classList.remove('single-column');
  }

  public updateElementsRowSpan(
    elements: HTMLElement[],
    host: HTMLElement,
    config: MasonryConfig,
    { emitter = null, debug = false }: MasonryUpdateConfig
  ): void {
    if (debug) {
      console.log(
        `updateElementsRowSpan: will process ${
          elements.length
        } elements - in ${Math.ceil(
          elements.length / Math.min(elements.length, 15)
        )} batches of ${Math.min(elements.length, 15)} items`
      );
    }

    batchProcess(elements, {
      processBatch: (elbatch: HTMLElement[]) => {
        elbatch
          .map((el) => {
            el.classList.add('recalc');
            return {
              offsetHeight: ((el.children[0] as HTMLElement) || el)
                .offsetHeight,
              scrollHeight: ((el.children[0] as HTMLElement) || el)
                .scrollHeight,
            };
          })
          .forEach((elHeight, i) => {
            const el = elbatch[i];

            const rowSpan = Math.ceil(
              (Math.max(elHeight.scrollHeight, elHeight.offsetHeight) +
                config.gap) /
                ((config.rowDivision || MASONRY_ROW_DIVISION_DEF) + config.gap)
            );
            el.classList.remove('recalc');
            el.style.gridRowEnd = 'span ' + rowSpan;
          });
      },

      afterAll: () => {
        emitter?.emit({
          totalItems: elements[0]?.parentElement?.children.length,
          updatedItems: elements,
        });
      },
    });
  }

  public processConfig(config: MasonryConfig): MasonryConfig {
    if (!config) {
      return { ...MASONRY_CONFIG_DEF };
    }

    config.gap = isNumber(config.gap) ? config.gap : MASONRY_GAP_DEF;

    config.columnWidth =
      (isNumber(config.columnWidth) && config.columnWidth) || null;

    config.columns =
      (isNumber(config.columns) && config.columns) ||
      (!config.columnWidth && MASONRY_COLS_DEF) ||
      null;

    return config;
  }

  public cleanupMasonry(host: HTMLElement, state: MasonryState = null): void {
    if (!host) {
      return;
    }
    if (state) {
      delete state.hostWidth;
      delete state.childrenCount;
      delete state.config;
      delete state.singleColumn;
    }

    host.classList.add('single-column');

    this.DOM.setCssProps(host, {
      '--masonry-row-div': null,
      '--masonry-col-width': null,
    });

    (Array.from(host.children) as HTMLElement[]).forEach((el) => {
      this.DOM.setCssProps(el, {
        'grid-row-end': null,
      });
    });
  }

  public getColumsCount(
    config: MasonryConfig = null,
    state: MasonryState = null,
    host: HTMLElement = null
  ): number {
    return state.singleColumn
      ? 1
      : state?.columns ||
          state?.config?.columns ||
          config?.columns ||
          (() => {
            const hostWidth = state?.hostWidth || host?.offsetWidth || 0;
            const colWidth =
              state?.config?.columnWidth || config?.columnWidth || 0;
            const tempColCount = Math.floor(hostWidth / colWidth);
            const gap =
              ((state?.config?.gap || config?.gap || 0) * (tempColCount - 1)) /
              tempColCount;

            return Math.floor(hostWidth / (colWidth + gap));
          })();
  }

  public getItemsInSameRow(
    element: HTMLElement,
    hostEl: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
  ): HTMLElement[] {
    state.columns = this.getColumsCount(config, state, hostEl);

    const index =
      parseInt(element.getAttribute('data-index'), 10) ||
      this.DOM.getElementIndex(element, hostEl);

    const firstItemInSameRowIndex = Math.max(
      0,
      Math.floor((index + 1) / state.columns - 1)
    );

    return makeArray(state.columns).map(
      (_, i) => hostEl.children[firstItemInSameRowIndex + i] as HTMLElement
    );
  }
}