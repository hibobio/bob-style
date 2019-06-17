import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  public isDark(color: number[] | string): boolean {
    if (typeof color === 'string') {
      color = this.parseRGBcolor(color);
    }
    const brightness = this.getBrightness(color);
    return brightness && brightness < 160; // 128
  }

  public getRandomColor(): string {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  private parseRGBcolor(color: string) {
    const colorArr = color.match(/\d+/g);

    return colorArr && colorArr.length > 2
      ? [
          parseInt(colorArr[0], 10),
          parseInt(colorArr[1], 10),
          parseInt(colorArr[2], 10)
        ]
      : undefined;
  }

  private getBrightness(color: number[]): number {
    return !color
      ? undefined
      : (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
  }
}
