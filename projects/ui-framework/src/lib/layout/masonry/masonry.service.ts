import { Injectable } from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import {
  isNumber,
  batchProcessWithAnimationFrame,
} from '../../services/utils/functional-utils';
import {
  MASONRY_CONFIG_DEF,
  MASONRY_GAP_DEF,
  MASONRY_COLS_DEF,
  MASONRY_ROW_DIVISION_DEF,
} from './masonry.const';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Injectable()
export class MasonryService {
  constructor(private DOM: DOMhelpers) {}

  public initMasonry(
    host: HTMLElement,
    config: MasonryConfig,
    state: MasonryState,
    debug = false
  ): void {
    if (state) {
      state.hostWidth = host.offsetWidth;
      state.childrenCount = host.children.length;
      state.config = config;
      state.singleColumn = false;
    }

    if (!host) {
      return;
    }

    if (
      host.children[0]?.tagName !== 'B-MASONRY-ITEM' ||
      host.children[0]?.children.length !== 1
    ) {
      console.error(
        `[MasonryLayoutComponent]: ${
          host.children[0]?.tagName !== 'B-MASONRY-ITEM'
            ? '<b-masonry-layout> should use <b-masonry-item> for children (you have ' +
              host.children[0]?.tagName +
              ')'
            : ''
        } ${
          host.children[0]?.children.length !== 1
            ? ' and <b-masonry-item> should have a single child (you have ' +
              host.children[0]?.children.length +
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

    this.updateElementsRowSpan(
      Array.from(host.children) as HTMLElement[],
      config,
      debug
    );

    host.classList.remove('single-column');
  }

  public updateElementsRowSpan(
    elements: HTMLElement[],
    config: MasonryConfig,
    debug = false
  ): void {
    if (debug) {
      console.log(
        `updateElementsRowSpan: will process in ${Math.ceil(
          elements.length / Math.min(elements.length, 15)
        )} batches of ${Math.min(elements.length, 15)} items`
      );
    }

    batchProcessWithAnimationFrame(elements, {
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
}
