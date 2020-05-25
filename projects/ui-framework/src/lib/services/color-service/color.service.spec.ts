import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ColorService', () => {
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorService],
      schemas: [NO_ERRORS_SCHEMA],
    });

    colorService = TestBed.inject(ColorService);
  });

  describe('parseToRGB', () => {
    it('should convert "rgba(66,66,66,0)"', () => {
      expect(colorService.parseToRGB('rgba(66,66,66,0)')).toEqual([66, 66, 66]);
    });

    it('should convert "rgb(33,33,33)"', () => {
      expect(colorService.parseToRGB('rgba(33,33,33)')).toEqual([33, 33, 33]);
    });

    it('should convert "#0000FF"', () => {
      expect(colorService.parseToRGB('#0000FF')).toEqual([0, 0, 255]);
    });

    it('should convert "0000FF"', () => {
      expect(colorService.parseToRGB('0000FF')).toEqual([0, 0, 255]);
    });

    it('should convert "#f00"', () => {
      expect(colorService.parseToRGB('#f00')).toEqual([255, 0, 0]);
    });
  });

  describe('isDark', () => {
    it('given RGB color as string, should decide if its dark or not', () => {
      expect(colorService.isDark('rgb(255,0,0)')).toBeTruthy();
      expect(colorService.isDark('rgb(200,200,200)')).toBeFalsy();
    });
  });
});
