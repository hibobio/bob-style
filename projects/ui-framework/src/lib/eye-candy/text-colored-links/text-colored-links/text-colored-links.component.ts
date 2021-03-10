import { Component, Input, OnChanges } from '@angular/core';
import { Color } from '../../../types';
import {
  ColorTextItem,
  InfoGraphicItem,
  DEFAULT_COLORS,
  DEFAULT_FONT_SIZES,
  DEFAULT_FONT_STYLES,
  DEFAULT_FONT_WEIGHTS,
} from '../text-colored-links.interface';

@Component({
  selector: 'b-text-colored-links',
  templateUrl: './text-colored-links.component.html',
  styleUrls: ['./text-colored-links.component.scss'],
})
export class TextColoredLinksComponent implements OnChanges {
  @Input() colorTextItems: ColorTextItem[] = [];
  @Input() colors: Color[] = DEFAULT_COLORS;
  @Input() isClickable = true;

  sizes = DEFAULT_FONT_SIZES;
  fontWeight = DEFAULT_FONT_WEIGHTS;
  fontStyle = DEFAULT_FONT_STYLES;

  infoGraphicItems: InfoGraphicItem[];

  ngOnChanges(): void {
    this.infoGraphicItems = this.colorTextItems.map(
      (colorTextItem: ColorTextItem, idx) => {
        const infoGraphicItem: InfoGraphicItem = {
          styles: {
            color: this.colors[idx % this.colors.length],
            fontSize: colorTextItem.label
              ? this.getSizeRandomAccordingToLengthOfText(colorTextItem.label)
              : this.sizes[0],
            fontStyle: this.randomFromList(this.fontStyle),
            fontWeight: `${this.randomFromList(this.fontWeight)}`,
          },
          ...colorTextItem,
        };
        return infoGraphicItem;
      }
    );
  }

  onItemClick(infoGraphicItem: InfoGraphicItem): void {
    if (this.isClickable && infoGraphicItem.action) {
      infoGraphicItem.action(infoGraphicItem);
    }
  }

  trackByText(index: number, item: InfoGraphicItem): string {
    return item.label;
  }

  private getSizeRandomAccordingToLengthOfText(text) {
    let textSizeClass: string;
    if (text.length > 25 && text.length < 35) {
      textSizeClass = this.randomFromList(this.sizes.slice(0, 2));
    } else if (text.length >= 35) {
      textSizeClass = this.randomFromList(this.sizes.slice(0, 1));
    } else {
      textSizeClass = this.randomFromList(this.sizes);
    }
    return textSizeClass;
  }

  private randomFromList<T = any>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }
}
