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
  MASONRY_ROW_DIVISION,
} from './masonry.const';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Injectable()
export class MasonryService {
  constructor(private DOM: DOMhelpers) {}

  public initMasonry(
    host: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
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

    this.DOM.setCssProps(host, {
      '--masonry-row-div': MASONRY_ROW_DIVISION + 'px',
      '--masonry-gap': config.gap + 'px',
      '--masonry-col-width': config.columns
        ? `calc(100% / ${config.columns} - ${config.gap}px * ${
            config.columns - 1
          } / ${config.columns})`
        : config.columnWidth && config.columnWidth + 'px',
    });

    host.classList.remove('single-column');

    this.updateElementsRowSpan(
      Array.from(host.children) as HTMLElement[],
      config
    );
  }

  public updateElementsRowSpan(
    elements: HTMLElement[],
    config: MasonryConfig
  ): void {
    batchProcessWithAnimationFrame(
      elements,
      (el: HTMLElement) => {
        this.setElementRowSpan(el, config);
      },
      (config.columns || 5) * 3
    );
  }

  public setElementRowSpan(
    element: HTMLElement,
    config: MasonryConfig,
    hardcore = false
  ): void {
    if (!element) {
      return;
    }
    element.style.removeProperty('grid-row-end');

    let contentHeight = 0;

    if (hardcore && element.children.length === 1) {
      const elStyle = getComputedStyle(element);
      contentHeight =
        (element.children[0] as HTMLElement).scrollHeight +
        (parseFloat(elStyle.paddingTop) +
          parseFloat(elStyle.paddingBottom) +
          parseFloat(elStyle.borderTopWidth) +
          parseFloat(elStyle.borderBottomWidth));
    }

    let rowSpan =
      (Math.max(element.scrollHeight, element.offsetHeight, contentHeight) +
        config.gap) /
      (MASONRY_ROW_DIVISION + config.gap);
    rowSpan = hardcore ? Math.round(rowSpan) : Math.ceil(rowSpan);

    element.style.gridRowEnd = 'span ' + rowSpan;
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

    this.DOM.setCssProps(host, {
      '--masonry-row-div': null,
      '--masonry-col-width': null,
    });

    host.classList.add('single-column');

    (Array.from(host.children) as HTMLElement[]).forEach((el) => {
      this.DOM.setCssProps(el, {
        'grid-row-end': null,
      });
    });
  }
}
