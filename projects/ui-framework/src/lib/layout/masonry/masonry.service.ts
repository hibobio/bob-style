import { Injectable } from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import {
  isNumber,
  splitArrayToChunks,
} from '../../services/utils/functional-utils';
import {
  MASONRY_CONFIG_DEF,
  MASONRY_GAP_DEF,
  MASONRY_COLS_DEF,
  MASONRY_ROW_DIVISION,
} from './masonry.const';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { WindowLike, WindowRef } from '../../services/utils/window-ref.service';

@Injectable()
export class MasonryService {
  constructor(private DOM: DOMhelpers, private windowRef: WindowRef) {
    this.nativeWindow = this.windowRef.nativeWindow;
  }
  private nativeWindow: WindowLike;

  public initMasonry(
    host: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
  ): void {
    state.hostWidth = host.offsetWidth;
    state.childrenCount = host.children.length;
    state.config = config;

    this.DOM.setCssProps(host, {
      '--masonry-row-div': MASONRY_ROW_DIVISION + 'px',
      '--masonry-gap': config.gap + 'px',
      '--masonry-col-width': config.columns
        ? `calc(100% / ${config.columns} - ${config.gap}px * ${
            config.columns - 1
          } / ${config.columns})`
        : config.columnWidth && config.columnWidth + 'px',
    });

    this.updateElementsRowSpan(
      Array.from(host.children) as HTMLElement[],
      config
    );
  }

  public updateElementsRowSpan(
    elements: HTMLElement[],
    config: MasonryConfig
  ): void {
    const elementChunks: HTMLElement[][] = splitArrayToChunks(
      elements,
      (config.columns || 5) * 3
    );

    let currentChunkIndex = 0;

    const setElementsRowSpan = () => {
      if (!elementChunks[currentChunkIndex]) {
        return;
      }

      elementChunks[currentChunkIndex].forEach((el: HTMLElement) => {
        this.setElementRowSpan(el, config);
      });

      ++currentChunkIndex;

      this.nativeWindow.requestAnimationFrame(() => {
        setElementsRowSpan();
      });
    };

    this.nativeWindow.requestAnimationFrame(() => {
      setElementsRowSpan();
    });
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
    config.columns = isNumber(config.columns)
      ? config.columns || null
      : MASONRY_COLS_DEF;
    config.columnWidth = isNumber(config.columnWidth)
      ? config.columnWidth || null
      : null;

    return config;
  }
}
