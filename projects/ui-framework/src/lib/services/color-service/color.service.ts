import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  constructor() {}

  public hexToRgb(hex: string): [number, number, number] {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.trim().replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : undefined;
  }

  public rgbToHex(rgb: [number, number, number]): string {
    return (
      '#' +
      this.componentToHex(rgb[0]) +
      this.componentToHex(rgb[1]) +
      this.componentToHex(rgb[2])
    );
  }

  public isDark(color: [number, number, number] | string) {
    if (!color) {
      return color;
    }
    if (typeof color === 'string') {
      color = this.parseToRGB(color);
    }
    const brightness = this.getBrightness(color);
    return brightness && brightness < 160; // 128
  }

  public randomColor(): string {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  public parseToRGB(color: string): [number, number, number] {
    const colorArr = color.trim().match(/\d+[,\)]/g);

    return colorArr?.length > 2
      ? [
          parseInt(colorArr[0], 10),
          parseInt(colorArr[1], 10),
          parseInt(colorArr[2], 10),
        ]
      : this.hexToRgb(color);
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  private getBrightness(color: [number, number, number]): number {
    return !color
      ? undefined
      : (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
  }
}
